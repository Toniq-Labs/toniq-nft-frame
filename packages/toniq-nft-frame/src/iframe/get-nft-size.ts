import {isTruthy, removeCommasFromNumberString, removePx} from '@augment-vir/common';
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
    const width = removePx(svgElement.getAttribute('width') || '') || viewBoxWidth;
    const height = removePx(svgElement.getAttribute('height') || '') || viewBoxHeight;
    if (isNaN(width) || isNaN(height)) {
        return undefined;
    } else {
        return {width, height};
    }
}

function extractHtmlSizeFromTopLevelElements(
    nftUrl: string,
    elements: ReadonlyArray<Element>,
    recurse: boolean,
) {
    if (!elements.length) {
        return undefined;
    }

    const positions = elements.map((element) => {
        const rect = element.getBoundingClientRect();

        return rect;
    });

    const combinedMaxes = positions.reduce(
        (current, position) => {
            return {
                highestX: position.right > current.highestX ? position.right : current.highestX,
                lowestX: position.left < current.lowestX ? position.left : current.lowestX,
                highestY: position.right > current.highestY ? position.right : current.highestY,
                lowestY: position.left < current.lowestY ? position.left : current.lowestY,
            };
        },
        {lowestX: 0, highestX: 0, lowestY: 0, highestY: 0},
    );
    const size: Dimensions = {
        width: combinedMaxes.highestX - combinedMaxes.lowestX,
        height: combinedMaxes.highestY - combinedMaxes.lowestY,
    };

    if (size.width && size.height) {
        return size;
    } else if (recurse) {
        return extractHtmlSizeFromTopLevelElements(
            nftUrl,
            Array.from(elements[0]?.querySelectorAll('> *') ?? []),
            true,
        );
    } else {
        return undefined;
    }
}

function extractHtmlSizeFromAnything(nftUrl: string) {
    const allElements = [
        document.querySelector('html'),
        ...Array.from(document.body.querySelectorAll('*')),
    ].filter(isTruthy);
    let biggestSize = {
        height: 0,
        width: 0,
    };
    allElements.forEach((child) => {
        const childSize = extractHtmlSizeFromTopLevelElements(nftUrl, [child], false);
        if (childSize) {
            if (childSize.width > biggestSize.width) {
                biggestSize.width = childSize.width;
            }
            if (childSize.height > biggestSize.height) {
                biggestSize.height = childSize.height;
            }
        }
    });

    return {
        width: biggestSize.width || 250,
        height: biggestSize.height || 250,
    };
}

function getHtmlSize({
    htmlSizeQuerySelector,
    nftUrl,
}: Pick<NftConfigForChildIframe, 'nftUrl' | 'htmlSizeQuerySelector'>) {
    const query = htmlSizeQuerySelector ?? ('' || 'body > *');
    const extractSizeFromHere = document.querySelectorAll(query);

    const size =
        extractHtmlSizeFromTopLevelElements(nftUrl, Array.from(extractSizeFromHere), true) ??
        extractHtmlSizeFromAnything(nftUrl);

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
    ) => Dimensions
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
): Dimensions {
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
