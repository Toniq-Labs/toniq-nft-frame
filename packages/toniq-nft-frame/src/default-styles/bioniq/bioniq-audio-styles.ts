import {noNativeFormStyles, noUserSelect} from '@toniq-labs/design-system';
import {css, unsafeCSS} from 'element-vir';
import {NftTypeEnum} from '../../iframe/nft-type';

export const soundWaveCount = 84;
export const soundWaveDefaultScale = 1;
export const animatedSoundWaveScale = {
    min: 0,
    max: 8,
};

export const bioniqAudioStyles = css`
    @import url('./index.css');

    html.nft-type-${unsafeCSS(NftTypeEnum.Audio)} body {
        background: rgba(138, 43, 226, 0.04);
    }

    html.nft-type-${unsafeCSS(NftTypeEnum.Audio)} body audio {
        visibility: hidden;
        z-index: -1;
    }

    html.nft-type-${unsafeCSS(NftTypeEnum.Audio)} body .audio-overlay-wrapper {
        display: block;
    }

    .audio-overlay-wrapper {
        display: none;
    }

    .audio-overlay {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }

    .audio-overlay.playing .play-toggle-button .play-toggle-icon {
        height: 80px;
        width: 80px;
    }

    .audio-overlay .play-toggle-button .play-toggle-icon {
        height: 100px;
        width: 100px;
    }

    .play-toggle-button {
        max-height: 100px;
        max-width: 100px;
        ${noNativeFormStyles}
        ${noUserSelect}
        cursor: pointer;
    }

    .play-toggle-button:hover .play-toggle-icon {
        opacity: 0.9;
    }

    .play-toggle-icon {
        height: 50%;
        width: 50%;
        pointer-events: none;
    }

    .audio-overlay.playing .seek-bar {
        width: 100%;
    }

    .audio-overlay.playing .seek-bar-wrapper {
        opacity: 1;
    }

    .audio-overlay.playing .input-range {
        opacity: 1;
    }

    .audio-overlay.playing .volume-control {
        width: 30px;
        visibility: visible;
        opacity: 1;
    }

    .audio-overlay.playing .media-control-divider {
        display: block;
    }

    .control-bar {
        width: calc(100% - 64px);
        height: 30px;
        position: absolute;
        bottom: 8px;
        display: flex;
        gap: 14px;
        justify-content: center;
        align-items: center;
    }

    .media-control-divider {
        flex-shrink: 0;
        display: none;
        width: 1px;
        height: 16px;
        opacity: 0.16;
        background: #8a2be2;
    }

    .volume-control {
        flex-shrink: 0;
        visibility: hidden;
        opacity: 0;
        width: 0px;
        transition: opacity 0.5s ease 0.2s;
    }

    .volume-toggle-button {
        width: 30px;
        height: 30px;
        ${noNativeFormStyles}
        cursor: pointer;
    }

    .volume-toggle-button:hover + .volume-bar-overlay,
    .volume-bar-overlay:hover {
        opacity: 1;
        visibility: visible;
    }

    .volume-toggle-icon {
        height: 30px;
        width: 30px;
    }

    .timestamp {
        color: #8a2be2;
        font-family: 'Inconsolata', monospace;
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 24px;
        flex-shrink: 0;
    }

    .volume-bar-overlay {
        width: 30px;
        height: 150px;

        position: absolute;
        bottom: 30px;
        right: 0;

        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s;
    }
    .volume-bar-overlay-content {
        width: 30px;
        height: 140px;
        background: #8a2be2;
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.12);
        border-radius: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .volume-bar {
        width: 8px;
        height: 140px;
        margin-left: auto;
        margin-right: auto;
    }

    .audio-overlay.playing .play-animation .sound-wave {
        opacity: 1;
    }

    .audio-overlay.playing .play-animation {
        height: 156px;
    }

    .play-animation {
        position: absolute;
        height: 140px;
        transform: rotate(90deg);
        transition: height 0.5s ease-in-out;
    }

    .sound-wave-wrapper {
        transform: rotate(calc(${360 / soundWaveCount}deg * var(--wave-index, 1)));
    }

    .play-animation .sound-wave-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .play-animation .sound-wave {
        position: absolute;
        top: 0;
        left: 0;
        width: 3px;
        height: 10px;
        padding-bottom: 100%;
        background: #8a2be2;
        opacity: 0.2;
        transition:
            transform 0.5s,
            opacity 1s;
    }

    .audio-overlay.static {
        display: none;
    }

    .seek-bar {
        width: 0px;
        height: 8px;
        border-radius: 20px;
        background: #f1e2ff;
        transition: width 0.25s;
    }

    .seek-bar-wrapper {
        position: relative;
        display: flex;
        width: 100%;
        height: 8px;
        opacity: 0;
        transition: opacity 0.2s ease 0.3s;
    }

    .volume-bar-wrapper {
        position: relative;
        display: flex;
        width: 8px;
        height: 124px;
        justify-content: center;
        align-items: center;
        margin: 8px auto;
        border-radius: 20px;
        background: rgba(241, 226, 255, 0.42);
    }

    .play-progress-bar {
        height: 8px;
        position: absolute;
        left: 0;
        z-index: 1;
        pointer-events: none;
        border-radius: 4px;
    }

    .play-progress-bar {
        background: #8a2be2;
    }

    .volume-progress-bar {
        width: 8px;
        position: absolute;
        bottom: 0;
        z-index: 1;
        pointer-events: none;
        border-radius: 4px;
        background: #ffffff;
    }

    input[type='range'] {
        appearance: none;
        height: 8px;
        width: 100%;
        background-color: transparent;
        margin: 0;
        position: relative;
        outline: none;
        opacity: 0;
        transition: opacity 0.2s;
    }

    input[type='range']::-moz-range-thumb {
        -webkit-appearance: none;
        appearance: none;
        position: relative;
        border: none;
        height: 16px;
        width: 16px;
        z-index: 10;
        cursor: pointer;
        pointer-events: all;
        border-radius: 10px;
        transition: 84ms;
        background: #8a2be2;
    }

    input[type='range'].volume-range::-moz-range-thumb {
        background: #ffffff;
    }

    input[type='range'].volume-range {
        appearance: none;
        width: 124px;
        height: 8px;
        background-color: transparent;
        margin: 0;
        position: relative;
        outline: none;
        opacity: 1;
        transform: rotate(270deg);
    }

    input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        position: relative;
        border: none;
        height: 16px;
        width: 16px;
        z-index: 10;
        cursor: pointer;
        pointer-events: all;
        border-radius: 10px;
        transition: 84ms;
        background: #8a2be2;
    }

    input[type='range'].volume-range::-webkit-slider-thumb {
        background: #ffffff;
    }

    input[type='range']::-webkit-slider-thumb:hover {
        transform: scale(1.2);
    }

    input[type='range']::-moz-range-thumb:hover {
        transform: scale(1.2);
    }

    @media (max-width: 156px) {
        .audio-overlay.static {
            display: flex;
        }

        .audio-overlay {
            display: none;
        }
    }
`;
