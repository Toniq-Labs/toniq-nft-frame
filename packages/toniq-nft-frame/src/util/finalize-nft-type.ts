import {NftTypeEnum, textBasedNftTypes} from '../iframe/nft-type';

function isText(input: string): boolean {
    for (let index = 0; index < input.length; index++) {
        const charCode = input.charCodeAt(index);
        /** Detects binary characters. */
        if (charCode === 65533 || charCode <= 8) {
            return false;
        }
    }

    return true;
}

function isHtml(input: string): boolean {
    const trimmed = input.trim().toLowerCase();
    return trimmed.startsWith('<html') || trimmed.startsWith('<!doctype html>');
}

function isSvg(input: string): boolean {
    const trimmed = input.trim().toLowerCase();
    return trimmed.startsWith('<svg');
}

function isJson(input: string): boolean {
    try {
        JSON.parse(input);
        return true;
    } catch (error) {
        return false;
    }
}

const orderedChecks: ReadonlyArray<{type: NftTypeEnum; checker: (text: string) => boolean}> = [
    {type: NftTypeEnum.Svg, checker: isSvg},
    {type: NftTypeEnum.Html, checker: isHtml},
    {type: NftTypeEnum.Json, checker: isJson},
];

/**
 * Some NFTs are encoded with incorrect mime types. Meaning, when we read the NFT data from the
 * blockchain, the NFT data might say "I'm an image" but the NFT data is not actually encoded as an
 * image and it's not an image at all. This function compensates for that.
 */
export function guessNftType(rawNftText: string): NftTypeEnum | undefined {
    if (!isText(rawNftText)) {
        return undefined;
    }
    const specificType = orderedChecks.find((check) => check.checker(rawNftText));

    if (specificType) {
        return specificType.type;
    } else {
        return NftTypeEnum.Text;
    }
}

export function finalizeNftType(typeFromHeaders: NftTypeEnum, rawNftText: string): NftTypeEnum {
    if (textBasedNftTypes.includes(typeFromHeaders)) {
        return typeFromHeaders;
    }

    return guessNftType(rawNftText) || typeFromHeaders;
}
