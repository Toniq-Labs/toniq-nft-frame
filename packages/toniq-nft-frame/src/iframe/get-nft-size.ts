import {removeCommasFromNumberString, removePx, wrapInTry} from '@augment-vir/common';
import {NftConfigForChildIframe} from '../nft-frame-config';
import {Dimensions} from '../util/dimensions';
import {NftTypeEnum} from './nft-data';

function extractSvgSize(svgElement: SVGElement) {
    const viewBox = svgElement.getAttribute('viewBox')?.trim();
    const viewBoxDimensions = viewBox?.match(/(?:[\d\.,\s]+\s+|^)([\d\.,]+)\s+([\d\.,]+)/);
    const viewBoxWidth = Number(
        removeCommasFromNumberString(viewBoxDimensions?.[1] ?? '') || undefined,
    );
    const viewBoxHeight = Number(
        removeCommasFromNumberString(viewBoxDimensions?.[2] ?? '') || undefined,
    );
    const width = wrapInTry({
        callback: () => removePx(svgElement.getAttribute('width') || '') || viewBoxWidth,
        fallbackValue: NaN,
    });
    const height = wrapInTry({
        callback: () => removePx(svgElement.getAttribute('height') || '') || viewBoxHeight,
        fallbackValue: NaN,
    });
    if (isNaN(width) || isNaN(height)) {
        return undefined;
    } else {
        return {width, height};
    }
}

function extractHtmlSizeFromTopLevelElements(elements: ReadonlyArray<Element>) {
    if (!elements.length) {
        return undefined;
    }

    const positions = elements.map((element) => {
        const rect = element.getBoundingClientRect();

        return rect;
    });

    const combinedMaxes = positions.reduce(
        (accum, position) => {
            if (position.width) {
                if (accum.highestX == undefined || position.right > accum.highestX) {
                    accum.highestX = position.right;
                }
                if (accum.lowestX == undefined || position.left < accum.lowestX) {
                    accum.lowestX = position.left;
                }
            }
            if (position.height) {
                if (accum.highestY == undefined || position.bottom > accum.highestY) {
                    accum.highestY = position.bottom;
                }
                if (accum.lowestY == undefined || position.top < accum.lowestY) {
                    accum.lowestY = position.top;
                }
            }
            return accum;
        },
        {
            lowestX: undefined as number | undefined,
            highestX: undefined as number | undefined,

            lowestY: undefined as number | undefined,
            highestY: undefined as number | undefined,
        },
    );

    const size: Dimensions = {
        width:
            combinedMaxes.highestX == undefined || combinedMaxes.lowestX == undefined
                ? 0
                : combinedMaxes.highestX - combinedMaxes.lowestX,
        height:
            combinedMaxes.highestY == undefined || combinedMaxes.lowestY == undefined
                ? 0
                : combinedMaxes.highestY - combinedMaxes.lowestY,
    };

    if (size.width && size.height) {
        return size;
    } else {
        return undefined;
    }
}

function getHtmlSize({
    htmlSizeQuerySelector,
}: Pick<NftConfigForChildIframe, 'htmlSizeQuerySelector'>) {
    const query = htmlSizeQuerySelector ?? 'body > *';
    const extractSizeFromHere = document.querySelectorAll(query);

    const size = extractHtmlSizeFromTopLevelElements(Array.from(extractSizeFromHere));

    return size;
}

function getSvgSize({forcedFinalNftSize}: Pick<NftConfigForChildIframe, 'forcedFinalNftSize'>) {
    if (forcedFinalNftSize) {
        const elements = document.body.querySelectorAll('*');
        elements.forEach((element) => element.setAttribute('preserveAspectRatio', 'none'));
    }

    const svgElements = Array.from(document.querySelectorAll('svg'));

    if (!svgElements.length) {
        throw new Error('Failed to find any SVG elements');
    }

    const svgElementWithSize = svgElements.find((svgElement) => !!extractSvgSize(svgElement));

    if (!svgElementWithSize) {
        return {width: 1024, height: 1024};
    }

    const {height, width} = forcedFinalNftSize ??
        extractSvgSize(svgElementWithSize) ?? {width: 0, height: 0};

    if (!svgElementWithSize.getAttribute('viewBox')) {
        svgElementWithSize.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    }
    svgElementWithSize.removeAttribute('width');
    svgElementWithSize.removeAttribute('height');
    svgElementWithSize.style.removeProperty('width');
    svgElementWithSize.style.removeProperty('height');

    const dimensions: Dimensions = {width, height};

    return dimensions;
}

function getVideoSize() {
    const video = document.querySelector('video');

    const size = {
        width: video?.videoWidth || 0,
        height: video?.videoHeight || 0,
    };

    return size;
}

function getImageSize() {
    const imgElement = document.querySelector('img');

    const size = {
        width: imgElement?.naturalWidth || 0,
        height: imgElement?.naturalHeight || 0,
    };

    return size;
}

function getTextSize() {
    const textWrapper = document.querySelector('.text-wrapper');

    const size = {
        width: textWrapper?.clientWidth || 0,
        height: textWrapper?.clientHeight || 0,
    };

    return size;
}

function getAudioSize() {
    const audioElement = document.querySelector('audio');

    const size = {
        width: audioElement?.clientWidth || 0,
        height: audioElement?.clientHeight || 0,
    };

    return size;
}

const sizeGrabbers: Record<
    NftTypeEnum,
    (
        inputs: Pick<
            NftConfigForChildIframe,
            'forcedFinalNftSize' | 'htmlSizeQuerySelector' | 'nftUrl' | 'min' | 'max'
        >,
    ) => Dimensions | undefined
> = {
    [NftTypeEnum.Svg]: getSvgSize,
    [NftTypeEnum.Html]: getHtmlSize,
    [NftTypeEnum.Image]: getImageSize,
    [NftTypeEnum.Video]: getVideoSize,
    [NftTypeEnum.Text]: getTextSize,
    [NftTypeEnum.Json]: getTextSize,
    [NftTypeEnum.Audio]: getAudioSize,
    [NftTypeEnum.Pdf]: (nftConfig) => {
        return nftConfig.max || nftConfig.min || {width: Infinity, height: Infinity};
    },
};

export function getNftDimensions(
    nftConfig: Pick<
        NftConfigForChildIframe,
        'forcedFinalNftSize' | 'htmlSizeQuerySelector' | 'nftUrl' | 'max' | 'min'
    >,
    nftType: NftTypeEnum,
): Dimensions | undefined {
    if (!(nftType in sizeGrabbers)) {
        throw new Error('No size grabber exists for nft type "' + nftType + '"');
    }
    return sizeGrabbers[nftType](nftConfig);
}

export function calculateOneLineHeight() {
    const span = document.createElement('span');
    span.innerHTML = 'hi';
    span.style.width = '200px';
    span.style.position = 'absolute';
    span.style.visibility = 'hidden';
    span.style.top = '0';
    span.style.left = '0';
    span.style.pointerEvents = 'none';
    document.body.appendChild(span);
    const height = span.clientHeight;
    span.remove();

    return height;
}
