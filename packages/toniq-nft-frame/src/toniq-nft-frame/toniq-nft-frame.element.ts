import {Dimensions, addPx} from '@augment-vir/common';
import {
    css,
    defineElement,
    defineElementEvent,
    html,
    onDomCreated,
    renderIf,
    unsafeCSS,
} from 'element-vir';
import {ToniqBioniqFrameError} from '../default-styles/bioniq/toniq-bioniq-frame-error.element';
import {NftAllData} from '../iframe/iframe-messenger';
import {
    InternalDefaultedNftFrameConfig,
    NftFrameConfig,
    defaultNftConfig,
} from '../nft-frame-config';
import {toniqNftFrameTagName} from '../toniq-nft-frame-tag-name';
import {clampDimensions, scaleToConstraints} from '../util/dimensions';
import {MutatedClassesEnum} from './mutated-classes';
import {shouldAllowInteraction} from './nft-interactions';
import {defaultToniqNtState} from './toniq-nft-frame-state';

export enum ToniqNftFrameSlotName {
    Error = 'error',
    Loading = 'loading',
}

export const ToniqNftFrame = defineElement<NftFrameConfig>()({
    tagName: toniqNftFrameTagName,
    stateInitStatic: defaultToniqNtState,
    events: {
        /**
         * Indicates the loaded state of the NFT frame. Emits as false when loading starts, and true
         * when loading finishes. If there is an error, the error event will fire instead of this
         * settle event.
         */
        settle: defineElementEvent<boolean>(),
        /** Emits the NFT data once it has loaded. */
        nftDataLoad: defineElementEvent<NftAllData>(),
        /** Emits when / if an error is encountered while loading the NFT. */
        error: defineElementEvent<Error>(),
    },
    styles: css`
        :host {
            position: relative;
            box-sizing: content-box;
            display: flex;
            justify-content: center;
            background-color: white;
            overflow: hidden;
        }

        :host(.${unsafeCSS(MutatedClassesEnum.VerticallyCenter)}) {
            align-items: center;
        }

        .click-cover {
            position: absolute;
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            z-index: 100;
        }

        * {
            flex-shrink: 0;
        }

        .frame-constraint {
            /*
                Make the frame constraint initially fit to the .min-size wrapper.
            */
            width: 100%;
            height: 100%;

            position: relative;
            z-index: 100;
        }

        .error-wrapper,
        .loading-wrapper {
            min-width: calc(100% + 2px);
            min-height: calc(100% + 2px);
            max-width: calc(100% + 2px);
            max-height: calc(100% + 2px);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            word-break: break-word;
        }

        .loading-wrapper {
            position: absolute;
            z-index: 200;
            background-color: inherit;
            opacity: 1;
            pointer-events: none;
        }

        :host(.${unsafeCSS(MutatedClassesEnum.HideLoading)}) .loading-wrapper,
        :host(.${unsafeCSS(MutatedClassesEnum.HideLoading)}) iframe {
            /**
             * Only place the transition on the hide class so that when the loading wrapper should
             * show up, it shows up instantly.
             */
            transition:
                opacity 100ms,
                visibility 0s 200ms;
        }

        :host(.${unsafeCSS(MutatedClassesEnum.HideLoading)}) .loading-wrapper {
            /**
             * Hide the loading wrapper.
             */
            opacity: 0;
            visibility: hidden;
        }

        :host(.${unsafeCSS(MutatedClassesEnum.HideLoading)}) iframe {
            /**
             * Once loading is done, display the iframe (which contains the loaded NFT).
             */
            opacity: 1;
        }

        iframe {
            opacity: 0;
            display: block;
            border: none;
            max-width: 100%;
            max-height: 100%;
            width: 100%;
            height: 100%;
        }

        .min-size {
            display: flex;
            justify-content: center;
        }
    `,
    cleanupCallback({updateState}) {
        /**
         * When an iframe is detached from the DOM, it completely loses all browsing context and
         * thus we need to completely reload it if this element is ever re-attached to the DOM.
         */
        updateState({
            clearIframe: true,
            iframeElement: undefined,
        });
    },
    renderCallback({state, inputs: rawInputs, updateState, host, dispatch, events}) {
        const inputs: InternalDefaultedNftFrameConfig = {...defaultNftConfig, ...rawInputs};

        state.childIframeLoading.updateTrigger(
            {
                ...inputs,
                isIframeReady: !!state.iframeElement,
            },
            {
                initIframe(iframe: HTMLIFrameElement) {
                    dispatch(new events.settle(false));
                    host.classList.remove(MutatedClassesEnum.HideLoading);
                    host.classList.remove(MutatedClassesEnum.VerticallyCenter);
                    if (!inputs.childFrameUrl) {
                        return;
                    }
                    iframe.src = inputs.childFrameUrl;
                },
                iframeElement: state.iframeElement,
                onNftLoaded(nftData) {
                    const frameConstraintDiv = host.shadowRoot!.querySelector('.frame-constraint');
                    if (!(frameConstraintDiv instanceof HTMLElement)) {
                        throw new Error(`Could not find frame constraint div.`);
                    }

                    frameConstraintDiv.style.width = addPx(Math.floor(nftData.dimensions.width));
                    frameConstraintDiv.style.height = addPx(Math.floor(nftData.dimensions.height));

                    const hostSize: Dimensions = clampDimensions({
                        min: inputs.min,
                        max: inputs.max,
                        box: nftData.dimensions,
                    });

                    if (nftData.dimensions.height < hostSize.height) {
                        host.classList.add(MutatedClassesEnum.VerticallyCenter);
                    } else {
                        host.classList.remove(MutatedClassesEnum.VerticallyCenter);
                    }

                    host.style.width = addPx(hostSize.width);
                    host.style.height = addPx(hostSize.height);

                    dispatch(new events.settle(true));
                    dispatch(new events.nftDataLoad(nftData));
                    host.classList.add(MutatedClassesEnum.HideLoading);

                    updateState({
                        latestChildIframeData: nftData,
                    });

                    (host as any).debugData = nftData;
                },
                onError(error: Error) {
                    console.error(error);
                    dispatch(new events.error(error));
                },
                hostElement: host,
            },
        );

        if (state.clearIframe) {
            requestAnimationFrame(() => {
                updateState({clearIframe: false});
            });
            /** Wipe out the iframe so a new one can be generated. */
            return html``;
        }

        const minConstraint =
            inputs.min && inputs.max
                ? clampDimensions({box: inputs.min, max: inputs.max})
                : inputs.min;
        const maxConstraint = inputs.max;

        const clampedForcedOriginalNftSize: Dimensions | undefined = inputs.forcedOriginalNftSize
            ? scaleToConstraints({
                  min: minConstraint,
                  max: maxConstraint,
                  box: inputs.forcedOriginalNftSize,
              })
            : undefined;
        const isInteractionAllowed = shouldAllowInteraction({
            allowScrolling: inputs.allowScrolling,
            blockInteraction: inputs.blockInteraction,
            nftType: state.latestChildIframeData?.nftType,
        });

        const error: Error | undefined =
            !inputs.hideError && state.childIframeLoading.value instanceof Error
                ? state.childIframeLoading.value
                : undefined;

        const clickCoverTemplate = isInteractionAllowed || error ? '' : defaultClickCover;

        const frameConstraintStyles = error
            ? css`
                  max-width: 100%;
                  max-height: 100%;
              `
            : clampedForcedOriginalNftSize
              ? css`
                    width: ${clampedForcedOriginalNftSize.width}px;
                    height: ${clampedForcedOriginalNftSize.height}px;
                `
              : '';

        const minSizeStyles = css`
            width: ${minConstraint?.width ?? 250}px;
            height: ${minConstraint?.height ?? 250}px;
        `;

        const iframeWithConstraintTemplate = html`
            <div class="frame-constraint" style=${frameConstraintStyles}>
                <iframe
                    ${onDomCreated((element) => {
                        if (!(element instanceof HTMLIFrameElement)) {
                            throw new Error(
                                'iframe was created but did not give us back an iframe element',
                            );
                        }

                        if (!state.iframeElement) {
                            (window as any).lastFrame = element;
                            updateState({iframeElement: element});
                        }
                    })}
                    loading=${inputs.eagerLoading ? 'eager' : 'lazy'}
                ></iframe>
            </div>
        `;

        return html`
            ${renderIf(
                !error,
                html`
                    <div class="loading-wrapper">
                        <slot name=${ToniqNftFrameSlotName.Loading}>Loading...</slot>
                    </div>
                `,
            )}
            <div class="min-size" style=${minSizeStyles}>
                ${renderIf(
                    !!error,
                    html`
                        <div class="error-wrapper">
                            <slot name=${ToniqNftFrameSlotName.Error}>
                                <${ToniqBioniqFrameError}></${ToniqBioniqFrameError}>
                            </slot>
                        </div>
                    `,
                    iframeWithConstraintTemplate,
                )}
            </div>
            ${clickCoverTemplate}
        `;
    },
});

const defaultClickCover = html`
    <div class="click-cover"></div>
`;
