import {convertTemplateToString, css, html} from 'element-vir';
import {NftTypeEnum} from '../../iframe/nft-data';
import {
    animatedSoundWaveScale,
    bioniqAudioStyles,
    soundWaveCount,
    soundWaveDefaultScale,
} from './bioniq-audio-styles';

function createPlayAnimation(count: number) {
    if (count <= 0) {
        return html``;
    }

    return Array(count)
        .fill(0)
        .map((zero, index) => {
            return html`
                <div
                    class="sound-wave-wrapper"
                    style=${css`
                        --wave-index: ${index};
                    `}
                >
                    <div class="sound-wave"></div>
                </div>
            `;
        });
}

function createLocationBasedSoundWaveMaximums() {
    const range = animatedSoundWaveScale.max - animatedSoundWaveScale.min;
    const step = range / (soundWaveCount - 1);
    let maxValue = animatedSoundWaveScale.min;

    return new Array(soundWaveCount).fill(0).map((value, index) => {
        if (index + 1 < soundWaveCount / 2) {
            maxValue += step;
        } else {
            maxValue -= step;
        }

        return maxValue.toFixed(1);
    });
}

const audioHtml = html`
    <style>
        ${bioniqAudioStyles}
    </style>
    <div class="audio-overlay-wrapper">
        <div class="audio-overlay">
            <button class="play-toggle-button">
                <img class="play-toggle-icon" src="./images/audio/bioniq-play.svg" />
            </button>
            <div class="play-animation">${createPlayAnimation(soundWaveCount)}</div>
            <div class="control-bar">
                <div class="seek-bar">
                    <div class="seek-bar-wrapper">
                        <div class="play-progress-bar"></div>
                        <input type="range" min="0" max="100" value="0" class="input-range" />
                    </div>
                </div>
                <span class="timestamp"></span>
                <div class="media-control-divider"></div>
                <div class="volume-control">
                    <button class="volume-toggle-button">
                        <img class="volume-toggle-icon" src="./images/audio/bioniq-volume.svg" />
                    </button>
                    <div class="volume-bar-overlay">
                        <div class="volume-bar-overlay-content">
                            <div class="volume-bar">
                                <div class="volume-bar-wrapper">
                                    <div class="volume-progress-bar"></div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value="100"
                                        class="volume-range"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="static audio-overlay">
            <img class="play-toggle-icon" src="./images/audio/bioniq-play.svg" />
        </div>
    </div>
`;

const audioHtmlString = convertTemplateToString(audioHtml)
    .replace(/\n+/g, ' ')
    .replace(/'/g, "\\'");

export const bioniqFrameHtmlForAudio = html`
    <script>
        let setupAttemptStart = Date.now();

        function checkIfAudioNft() {
            try {
                const htmlElement = document.querySelector('html');
                if (!htmlElement) {
                    throw new Error('failed to find html element');
                }

                const htmlElementClassList = Array.from(htmlElement.classList);

                const nftTypeClassName = htmlElementClassList.find((className) =>
                    className.startsWith('nft-type-'),
                );

                if (!nftTypeClassName) {
                    throw new Error('Found not html nft-type class.');
                }

                if (nftTypeClassName === 'nft-type-${NftTypeEnum.Audio}') {
                    setupAudioNft();
                }
            } catch (error) {
                if (Date.now() - setupAttemptStart < 10_000) {
                    const delay = Date.now() - setupAttemptStart > 1000 ? 1000 : 200;
                    setTimeout(checkIfAudioNft, delay);
                }
            }
        }

        function setupAudioNft() {
            const body = document.querySelector('body');
            body.innerHTML = body.innerHTML + '${audioHtmlString}';

            let soundWaveInterval;
            let retryCount = 0;
            let volume = 100;
            const locationBasedSoundWaveMaximums = [
                ${createLocationBasedSoundWaveMaximums().join(', ')},
            ];

            tryToAttachListeners();

            function updateSeekProgress(
                audioElement,
                seekBarElement,
                seekBarRangeElement,
                playProgressBarElement,
            ) {
                const rangeWidth = seekBarElement?.clientWidth ?? 0;

                if (rangeWidth) {
                    const progressBarRightPosition =
                        ((rangeWidth - 16) *
                            (seekBarRangeElement.max - seekBarRangeElement.value)) /
                            (seekBarRangeElement.max - seekBarRangeElement.min) +
                        8 +
                        'px';

                    playProgressBarElement.style.right = progressBarRightPosition;
                    seekBarRangeElement.max = getDuration(audioElement);
                }
            }

            function updateVolumeProgress(
                volumeBarWrapperElement,
                volumeBarRangeElement,
                volumeProgressBarElement,
            ) {
                const rangeHeight = volumeBarWrapperElement?.clientHeight ?? 0;

                if (rangeHeight) {
                    const progressBarTopPosition =
                        ((rangeHeight - 16) *
                            (volumeBarRangeElement.max - volumeBarRangeElement.value)) /
                            (volumeBarRangeElement.max - volumeBarRangeElement.min) +
                        8 +
                        'px';

                    volumeProgressBarElement.style.top = progressBarTopPosition;
                }
            }

            function onSeekBarInput(
                event,
                audioElement,
                seekBarElement,
                seekBarRangeElement,
                playProgressBarElement,
            ) {
                event = event || window.event;
                audioElement.currentTime = event.target.value;
                updateSeekProgress(
                    audioElement,
                    seekBarElement,
                    seekBarRangeElement,
                    playProgressBarElement,
                );
            }

            function onVolumeBarInput(
                event,
                audioElement,
                volumeBarWrapperElement,
                volumeBarRangeElement,
                volumeProgressBarElement,
            ) {
                event = event || window.event;
                volume = Number(event.target.value);
                /** AudioElement volume accepts values 0.0 (silent) to 1.0 (loudest) */
                audioElement.volume = volume / 100;
                audioElement.muted = audioElement.volume === 0;
                updateVolumeProgress(
                    volumeBarWrapperElement,
                    volumeBarRangeElement,
                    volumeProgressBarElement,
                );
            }

            function animateSoundWave(soundWaveElements, scale) {
                const min = ${animatedSoundWaveScale.min};
                const max = ${animatedSoundWaveScale.max};

                soundWaveElements.forEach((soundWaveElement, index) => {
                    const locationMax = locationBasedSoundWaveMaximums[index];

                    const randomScale = Math.random() * (locationMax - min) + min;
                    const scaleY = scale || randomScale;
                    soundWaveElement.style.transform = 'scaleY(' + scaleY + ')';
                });
            }

            function updatePlayButton(
                audioElement,
                audioControlIconElement,
                audioOverlayElement,
                isPaused,
            ) {
                if (isPaused) {
                    audioControlIconElement.src = './images/audio/bioniq-play.svg';
                    audioOverlayElement.classList.remove('playing');
                } else {
                    audioControlIconElement.src = './images/audio/bioniq-pause.svg';
                    audioOverlayElement.classList.add('playing');
                }
            }

            function updateVolume(
                audioElement,
                audioVolumeIconElement,
                volumeBarWrapperElement,
                volumeBarRangeElement,
                volumeProgressBarElement,
            ) {
                if (audioElement.muted) {
                    audioVolumeIconElement.src = './images/audio/bioniq-volume-muted.svg';
                    audioElement.volume = 0;
                    volumeBarRangeElement.value = 0;
                } else {
                    audioVolumeIconElement.src =
                        volumeBarRangeElement.value > 50
                            ? './images/audio/bioniq-volume.svg'
                            : './images/audio/bioniq-volume-half.svg';
                    if (audioElement.volume === 0) {
                        audioElement.volume = 1;
                        volumeBarRangeElement.value = volume ? volume : 100;
                    }
                }
                updateVolumeProgress(
                    volumeBarWrapperElement,
                    volumeBarRangeElement,
                    volumeProgressBarElement,
                );
            }

            function formattedTime(time) {
                const hours = Math.floor(time / 3600);
                const minutes = Math.floor(time / 60)
                    .toString()
                    .padStart(2, '0');
                const seconds = Math.floor(time - Number(minutes) * 60)
                    .toString()
                    .padStart(2, '0');

                return {
                    hours,
                    minutes,
                    seconds,
                };
            }

            function isReady(audioElement) {
                return audioElement.readyState >= 1;
            }

            function onPlay(audioElement, audioControlIconElement, audioOverlayElement) {
                if (audioElement.paused) {
                    audioElement.play();
                    updatePlayButton(
                        audioElement,
                        audioControlIconElement,
                        audioOverlayElement,
                        false,
                    );
                } else {
                    audioElement.pause();
                    updatePlayButton(
                        audioElement,
                        audioControlIconElement,
                        audioOverlayElement,
                        true,
                    );
                }
            }

            function onVolume(
                audioElement,
                audioVolumeIconElement,
                volumeBarWrapperElement,
                volumeBarRangeElement,
                volumeProgressBarElement,
            ) {
                audioElement.muted = !audioElement.muted;
                updateVolume(
                    audioElement,
                    audioVolumeIconElement,
                    volumeBarWrapperElement,
                    volumeBarRangeElement,
                    volumeProgressBarElement,
                );
            }

            function updateTimeline(time, audioTimestampElement) {
                if (time != undefined) {
                    const hours = formattedTime(time).hours;
                    const minutes = formattedTime(time).minutes;
                    const seconds = formattedTime(time).seconds;

                    if (audioTimestampElement) {
                        audioTimestampElement.innerText = hours
                            ? hours + ':' + minutes + ':' + seconds
                            : minutes + ':' + seconds;
                    }
                }
            }

            function updateSeekBar(
                audioElement,
                seekBarElement,
                seekBarRangeElement,
                playProgressBarElement,
            ) {
                seekBarRangeElement.value = getCurrentTime(audioElement);
                updateSeekProgress(
                    audioElement,
                    seekBarElement,
                    seekBarRangeElement,
                    playProgressBarElement,
                );
            }

            function getRemainingTime(audioElement) {
                const duration = getDuration(audioElement);
                const currentTime = getCurrentTime(audioElement);

                if (duration == undefined || currentTime == undefined) {
                    return undefined;
                }

                return duration - currentTime;
            }

            function getDuration(audioElement) {
                return audioElement.duration;
            }

            function getCurrentTime(audioElement) {
                return audioElement.currentTime;
            }

            function tryToAttachListeners() {
                const audioElement = document.querySelector('audio');

                if (audioElement && isReady(audioElement)) {
                    const seekBarElement = document.querySelector('.seek-bar');
                    const seekBarInputElement = document.querySelector('.seek-bar input');
                    const audioOverlayElement = document.querySelector('.audio-overlay');
                    const audioTimestampElement = document.querySelector('.timestamp');
                    const soundWaveElements = Array.from(document.querySelectorAll('.sound-wave'));
                    const audioControlIconElement = document.querySelector('.play-toggle-icon');
                    const audioVolumeIconElement = document.querySelector('.volume-toggle-icon');
                    const seekBarRangeElement = document.querySelector('.input-range');
                    const volumeBarRangeElement = document.querySelector('.volume-range');
                    const playToggleElement = document.querySelector('.play-toggle-button');
                    const volumeBarElement = document.querySelector('.volume-bar');
                    const playProgressBarElement = document.querySelector('.play-progress-bar');
                    const volumeProgressBarElement = document.querySelector('.volume-progress-bar');
                    const volumeOverlayBarElement = document.querySelector('.volume-bar-overlay');
                    const volumeBarWrapperElement = document.querySelector('.volume-bar-wrapper');
                    const volumeBarInputElement = document.querySelector('.volume-bar input');
                    const volumeToggleButton = document.querySelector('.volume-toggle-button');

                    updateTimeline(getRemainingTime(audioElement), audioTimestampElement);

                    seekBarInputElement.addEventListener('input', (event) => {
                        onSeekBarInput(
                            event,
                            audioElement,
                            seekBarElement,
                            seekBarRangeElement,
                            playProgressBarElement,
                        );
                    });

                    volumeToggleButton.addEventListener('click', () => {
                        onVolume(
                            audioElement,
                            audioVolumeIconElement,
                            volumeBarWrapperElement,
                            volumeBarRangeElement,
                            volumeProgressBarElement,
                        );
                    });

                    volumeBarInputElement.addEventListener('input', (event) => {
                        onVolumeBarInput(
                            event,
                            audioElement,
                            volumeBarWrapperElement,
                            volumeBarRangeElement,
                            volumeProgressBarElement,
                        );
                    });

                    seekBarElement.addEventListener('transitionstart', () => {
                        updateSeekProgress(
                            audioElement,
                            seekBarElement,
                            seekBarRangeElement,
                            playProgressBarElement,
                        );
                    });

                    volumeOverlayBarElement.addEventListener('transitionstart', () => {
                        updateVolumeProgress(
                            volumeBarWrapperElement,
                            volumeBarRangeElement,
                            volumeProgressBarElement,
                        );
                    });

                    playToggleElement.addEventListener('click', () => {
                        onPlay(audioElement, audioControlIconElement, audioOverlayElement);
                    });

                    audioElement.addEventListener('timeupdate', () => {
                        updateTimeline(getRemainingTime(audioElement), audioTimestampElement);
                        updateSeekBar(
                            audioElement,
                            seekBarElement,
                            seekBarRangeElement,
                            playProgressBarElement,
                        );
                    });

                    audioElement.addEventListener('play', () => {
                        if (soundWaveInterval) {
                            clearInterval(soundWaveInterval);
                        }
                        soundWaveInterval = setInterval(() => {
                            animateSoundWave(soundWaveElements);
                        }, 200);
                    });

                    audioElement.addEventListener('pause', () => {
                        clearInterval(soundWaveInterval);
                        animateSoundWave(soundWaveElements, ${soundWaveDefaultScale});
                    });

                    audioElement.addEventListener('ended', () => {
                        updatePlayButton(
                            audioElement,
                            audioControlIconElement,
                            audioOverlayElement,
                            true,
                        );
                        clearInterval(soundWaveInterval);
                        animateSoundWave(soundWaveElements, ${soundWaveDefaultScale});
                        updateTimeline(getDuration(audioElement), audioTimestampElement);
                    });

                    audioElement.addEventListener('volumechange', () => {
                        if (Math.round(volumeBarRangeElement.value / 100 === 0)) {
                            audioElement.muted = true;
                        }
                        updateVolume(
                            audioElement,
                            audioVolumeIconElement,
                            volumeBarWrapperElement,
                            volumeBarRangeElement,
                            volumeProgressBarElement,
                        );
                    });
                } else if (retryCount < 50) {
                    retryCount++;
                    setTimeout(tryToAttachListeners, 200);
                }
            }
        }

        checkIfAudioNft();
    </script>
`;
