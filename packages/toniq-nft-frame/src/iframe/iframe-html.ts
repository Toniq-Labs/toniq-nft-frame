import {isTruthy} from '@augment-vir/common';
import {html, templateToString} from 'element-vir';
import {NftConfigForChildIframe} from '../nft-config';
import {shouldAllowScrolling} from '../toniq-nft-frame/nft-interactions';
import {Dimensions, calculateRatio, clampDimensions, scaleToConstraints} from '../util/dimensions';
import {calculateOneLineHeight, getNftDimensions} from './get-nft-size';
import {iframeStyleElement} from './iframe-styles';
import {NftMetadata, NftTypeEnum, isNftTypeAudioLike, isNftTypeTextLike} from './nft-data';
import {textNftPadding} from './style-constants';

export const thisScript = document.head.querySelector('script');

function muteEverything() {
    const videoElements = Array.from(document?.body?.querySelectorAll('video') ?? []);
    const audioElements = Array.from(document?.body?.querySelectorAll('audio') ?? []);
    [
        ...videoElements,
        ...audioElements,
    ].forEach((videoElement) => {
        videoElement.setAttribute('muted', 'true');
        videoElement.muted = true;
    });
}

function setScaledNftSize(
    nftConfig: NftConfigForChildIframe,
    nftType: NftTypeEnum,
    originalNftDimensions: Dimensions,
    htmlElement: HTMLHtmlElement,
) {
    const scaleInputs = {
        min: nftConfig.min,
        max: nftConfig.max,
        box: nftConfig.forcedFinalNftSize ?? originalNftDimensions,
    } as const;

    const newNftDimensions: Dimensions =
        isNftTypeTextLike(nftType) || isNftTypeAudioLike(nftType)
            ? clampDimensions(scaleInputs)
            : scaleToConstraints(scaleInputs);

    const ratio = calculateRatio(scaleInputs);

    if (ratio > 3) {
        htmlElement.classList.add('pixelated');
    }

    let dimensionScales: Dimensions | undefined;

    if (nftType === NftTypeEnum.Json || nftType === NftTypeEnum.Text) {
        if (originalNftDimensions.height > newNftDimensions.height) {
            const oneLine = calculateOneLineHeight();
            const totalLines = Math.floor(
                (newNftDimensions.height - 2 * textNftPadding.y) / oneLine,
            );
            const totalHeight = oneLine * totalLines;
            const textElement = document.querySelector('.text');

            if (!(textElement instanceof HTMLElement)) {
                throw new Error('Failed to find text element.');
            }

            if (!nftConfig.allowScrolling) {
                textElement.style.height = totalHeight + 'px';
                textElement.style.setProperty('-webkit-line-clamp', String(totalLines));
            }
        }

        document.documentElement.style.setProperty(
            'justify-content',
            originalNftDimensions.height < newNftDimensions.height ? 'center' : 'flex-start',
        );

        if (originalNftDimensions.height < newNftDimensions.height) {
            const widthRatio = newNftDimensions.width / originalNftDimensions.width;
            const heightRatio = newNftDimensions.height / originalNftDimensions.height;

            const ratio = Math.min(widthRatio, heightRatio);
            dimensionScales = {
                width: ratio,
                height: ratio,
            };
        }
    } else if (nftType === NftTypeEnum.Html) {
        const forcedScales: Dimensions = nftConfig.forcedFinalNftSize
            ? {
                  width: nftConfig.forcedFinalNftSize.width / originalNftDimensions.width,
                  height: nftConfig.forcedFinalNftSize.height / originalNftDimensions.height,
              }
            : {
                  width: 1,
                  height: 1,
              };
        dimensionScales = {
            width: ratio * forcedScales.width,
            height: ratio * forcedScales.height,
        };
    } else if (
        isNftTypeTextLike(nftType) &&
        originalNftDimensions.height < newNftDimensions.height
    ) {
        const widthRatio = newNftDimensions.width / originalNftDimensions.width;
        const heightRatio = newNftDimensions.height / originalNftDimensions.height;

        const ratio = Math.min(widthRatio, heightRatio);

        dimensionScales = {
            height: ratio,
            width: ratio,
        };
    }

    if (dimensionScales) {
        htmlElement.style.setProperty(
            'transform',
            [
                `scaleX(${dimensionScales.width})`,
                `scaleY(${dimensionScales.height})`,
            ].join(' '),
        );
        htmlElement.classList.add('scaled');
    }

    return newNftDimensions;
}

export function setTemplateHtml(nftMetadata: NftMetadata, nftConfig: NftConfigForChildIframe) {
    const htmlElement = document.querySelector('html');

    if (!(htmlElement instanceof HTMLHtmlElement)) {
        throw new Error("Failed to find the frame's html element.");
    }

    // reset all previously added classes
    htmlElement.className = `nft-type-${nftMetadata.nftType}`;

    if (shouldAllowScrolling(nftConfig.allowScrolling, nftMetadata.nftType)) {
        htmlElement.classList.add('allow-scrolling');
    }

    const newHtmlEntries: ReadonlyArray<string> = [
        html`
            <script>
                function doNothing() {}
                function executeBeforeSize() {}
            </script>
        `,
        nftMetadata.templateString,
        nftConfig.extraHtml,
    ]
        .map((entry) => (!entry || typeof entry === 'string' ? entry : templateToString(entry)))
        .filter(isTruthy);

    htmlElement.innerHTML = newHtmlEntries.join('\n');
    document.head.innerHTML += templateToString(iframeStyleElement);

    Array.from(document.querySelectorAll('script')).forEach((oldScript) => {
        if (oldScript === thisScript) {
            return;
        }

        const newScript = document.createElement('script');

        Array.from(oldScript.attributes).forEach((attribute) => {
            newScript.setAttribute(attribute.name, attribute.value);
        });

        newScript.innerHTML = oldScript.innerHTML;

        oldScript.parentElement!.replaceChild(newScript, oldScript);
    });

    if (nftMetadata.nftType !== NftTypeEnum.Audio) {
        try {
            muteEverything();
            const mutationObserver = new MutationObserver(muteEverything);
            mutationObserver.observe(document, {childList: true, subtree: true});
        } catch (error) {
            console.error(error);
        }
    }

    return htmlElement;
}

export function loadNftDimensions(
    nftMetadata: NftMetadata,
    nftConfig: NftConfigForChildIframe,
    htmlElement: HTMLHtmlElement,
): Dimensions | undefined {
    const originalNftDimensions: Dimensions =
        nftConfig.forcedOriginalNftSize ?? getNftDimensions(nftConfig, nftMetadata.nftType);

    if (!originalNftDimensions.height || !originalNftDimensions.height) {
        return undefined;
    }

    const resizedNftDimensions = setScaledNftSize(
        nftConfig,
        nftMetadata.nftType,
        originalNftDimensions,
        htmlElement,
    );

    return resizedNftDimensions;
}
