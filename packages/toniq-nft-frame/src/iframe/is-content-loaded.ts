import {typedHasProperty} from '@augment-vir/common';
import {NftTypeEnum} from './nft-type';

function isImageLoaded() {
    const image = document.querySelector('img');

    return !!image?.complete;
}

function isVideoLoaded() {
    const video = document.querySelector('video');

    if (video) {
        return video.readyState >= 3;
    } else {
        return false;
    }
}

function isAudioLoaded() {
    const audioElement = document.querySelector('audio');

    /** The audio element never loads past readyState 1 in Safari */
    return (audioElement?.readyState ?? 0) >= 1;
}

const isLoadedCheckers: Partial<Record<NftTypeEnum, () => boolean>> = {
    [NftTypeEnum.Image]: isImageLoaded,
    [NftTypeEnum.Video]: isVideoLoaded,
    [NftTypeEnum.Audio]: isAudioLoaded,
};

export function isFrameContentLoaded(nftType: NftTypeEnum): boolean {
    if (typedHasProperty(isLoadedCheckers, nftType)) {
        return isLoadedCheckers[nftType]();
    } else {
        return true;
    }
}
