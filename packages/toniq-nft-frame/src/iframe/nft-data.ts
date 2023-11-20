import {TemplateResult, convertTemplateToString, html} from 'element-vir';
import {InternalDefaultedNftFrameConfig} from '../nft-frame-config';
import {finalizeNftType} from '../util/finalize-nft-type';
import {isJson} from '../util/json';
import {LoadedNftData, loadNftData} from './nft-data-cache';
import {NftTypeEnum} from './nft-type';

const nftTypesThatNeedTimeToLoad: ReadonlyArray<NftTypeEnum> = [
    NftTypeEnum.Html,
    NftTypeEnum.Svg,
];

export function doesNftNeedMoreTimeToLoadMaybe(nftType: NftTypeEnum): boolean {
    return nftTypesThatNeedTimeToLoad.includes(nftType);
}

async function determineNftTypeFromHeaders(
    contentType: string,
    nftText: string,
): Promise<NftTypeEnum> {
    if (contentType.includes('video')) {
        return NftTypeEnum.Video;
    } else if (contentType.includes('svg') || nftText.includes('<svg')) {
        return NftTypeEnum.Svg;
    } else if (contentType.includes('html') || nftText.includes('<html')) {
        return NftTypeEnum.Html;
    } else if (isJson(nftText)) {
        return NftTypeEnum.Json;
    } else if (
        contentType.includes('json') ||
        contentType.includes('yaml') ||
        contentType.includes('yml') ||
        contentType.includes('pgp-signature') ||
        contentType.includes('text') ||
        contentType.includes('txt')
    ) {
        return NftTypeEnum.Text;
    } else if (contentType.includes('audio')) {
        return NftTypeEnum.Audio;
    } else if (contentType.includes('pdf')) {
        return NftTypeEnum.Pdf;
    } else {
        return NftTypeEnum.Image;
    }
}

function generateTemplateString({
    nftType,
    nftText,
    nftUrl,
    blockAutoPlay,
}: {
    nftType: NftTypeEnum;
    nftText: string;
    nftUrl: string;
    blockAutoPlay: boolean;
}): string | TemplateResult {
    if (nftType === NftTypeEnum.Image) {
        return html`
            <img src=${nftUrl} />
        `;
    } else if (nftType === NftTypeEnum.Video) {
        return html`
            <video
                ${blockAutoPlay ? '' : 'autoplay'}
                muted
                loop
                onclick="this.paused ? this.play() : this.pause()"
            >
                <source src=${nftUrl} />
            </video>
        `;
    } else if (nftType === NftTypeEnum.Text || nftType === NftTypeEnum.Json) {
        return html`
            <div class="text-wrapper">
                <p class="text">
                    ${nftText
                        .replace(/\n/g, '<br />')
                        .replace(/    /g, '<span class="spacer"></span>')}
                </p>
            </div>
        `;
    } else if (nftType === NftTypeEnum.Audio) {
        return html`
            <audio controls preload="metadata" src=${nftUrl}></audio>
        `;
    } else if (nftType === NftTypeEnum.Pdf) {
        return html`
            <embed type="application/pdf" src=${nftUrl} />
        `;
    } else {
        return nftText;
    }
}

function formatText(text: string, nftType: NftTypeEnum, removeConsoleLogs: boolean) {
    if (nftType === NftTypeEnum.Json) {
        try {
            return JSON.stringify(JSON.parse(text), null, 4);
        } catch (error) {}
    } else if (nftType === NftTypeEnum.Html && removeConsoleLogs) {
        // strip out console logs
        return text.replaceAll(/console\.\w+/g, 'doNothing');
    }
    return text;
}

export type NftMetadata = {
    templateString: string;
    nftType: NftTypeEnum;
    nftUrl: string;
};

export async function getNftMetadata({
    nftUrl,
    blockAutoPlay,
    blockPersistentCache,
    allowConsoleLogs,
}: Pick<
    InternalDefaultedNftFrameConfig,
    'nftUrl' | 'blockAutoPlay' | 'blockPersistentCache' | 'allowConsoleLogs'
>): Promise<NftMetadata> {
    const loadedNftData: LoadedNftData = await loadNftData(nftUrl, !blockPersistentCache);

    if (!loadedNftData.ok) {
        throw new Error(`Failed to load '${nftUrl}'`);
    }

    const headerNftType = await determineNftTypeFromHeaders(
        loadedNftData.contentType,
        loadedNftData.text,
    );

    const finalizedNftType = finalizeNftType(headerNftType, loadedNftData.text);

    if (finalizedNftType !== headerNftType) {
        console.warn(
            `Headers say '${nftUrl}' is of type '${headerNftType}' but it looks like it's actually of type '${finalizedNftType}'. Using '${finalizedNftType}'.`,
        );
    }

    const nftText = formatText(loadedNftData.text, finalizedNftType, !allowConsoleLogs);

    const template = generateTemplateString({
        nftText,
        nftType: finalizedNftType,
        nftUrl: loadedNftData.blobUrl,
        blockAutoPlay: !!blockAutoPlay,
    });

    const nftMetadata: NftMetadata = {
        templateString: typeof template === 'string' ? template : convertTemplateToString(template),
        nftUrl: loadedNftData.blobUrl,
        nftType: finalizedNftType,
    };

    return nftMetadata;
}
