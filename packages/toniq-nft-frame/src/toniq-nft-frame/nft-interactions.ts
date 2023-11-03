import {NftTypeEnum} from '../iframe/nft-type';

export const nftTypesThatAllowInteraction: ReadonlyArray<NftTypeEnum> = [
    NftTypeEnum.Html,
    NftTypeEnum.Video,
    NftTypeEnum.Audio,
    NftTypeEnum.Pdf,
] as const;

export const nftTypesThatAllowScrolling: ReadonlyArray<NftTypeEnum> = [
    NftTypeEnum.Html,
    NftTypeEnum.Text,
    NftTypeEnum.Json,
] as const;

export function shouldAllowScrolling(
    allowScrolling: boolean | undefined,
    nftType: NftTypeEnum,
): boolean {
    return !!allowScrolling && nftTypesThatAllowScrolling.includes(nftType);
}

export function shouldAllowInteraction({
    blockInteraction,
    nftType,
    allowScrolling,
}: {
    blockInteraction: boolean | undefined;
    nftType: NftTypeEnum | undefined;
    allowScrolling: boolean | undefined;
}): boolean {
    /** Allow respect explicitly set boolean values for the block interaction input. */
    if (typeof blockInteraction === 'boolean') {
        return !blockInteraction;
    }

    if (nftType == undefined) {
        return false;
    }

    /**
     * If the block interaction input is not explicitly set to a boolean, the default behavior is as
     * follows:
     */
    if (nftTypesThatAllowInteraction.includes(nftType)) {
        return true;
    } else if (shouldAllowScrolling(allowScrolling, nftType)) {
        return true;
    } else {
        return false;
    }
}
