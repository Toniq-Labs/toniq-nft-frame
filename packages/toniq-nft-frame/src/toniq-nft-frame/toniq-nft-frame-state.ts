import {createDeferredPromiseWrapper, ensureError, wrapPromiseInTimeout} from '@augment-vir/common';
import {asyncProp} from 'element-vir';
import {
    NftAllData,
    NftIframeMessageTypeEnum,
    nftFrameIframeMessenger,
} from '../iframe/iframe-messenger';
import {doesNftNeedMoreTimeToLoadMaybe} from '../iframe/nft-data';
import {InternalDefaultedNftFrameConfig, toChildNftConfig} from '../nft-frame-config';
import {extractOrigin} from '../util/url';

async function waitForFrameLoad(iframeElement: HTMLIFrameElement) {
    const iframeLoadPromise = createDeferredPromiseWrapper();
    iframeElement.onload = () => {
        iframeLoadPromise.resolve();
    };
    await iframeLoadPromise.promise;
}

export const defaultToniqNtState = {
    iframeElement: undefined as undefined | HTMLIFrameElement,
    latestChildIframeData: undefined as NftAllData | undefined,
    clearIframe: false,
    childIframeLoading: asyncProp({
        async updateCallback(
            triggers: {
                isIframeReady: boolean;
            } & InternalDefaultedNftFrameConfig,
            extraInputs: {
                iframeElement: HTMLIFrameElement | undefined;
                initIframe: (iframe: HTMLIFrameElement) => void;
                onNftLoaded: (dimensions: NftAllData) => void;
                onError: (error: Error) => void;
                hostElement: HTMLElement;
            },
        ): Promise<void> {
            if (!triggers.nftUrl || !triggers.childFrameUrl) {
                /** Don't resolve this promise because we're still waiting on an NFT url. */
                return new Promise(() => {});
            }

            try {
                if (!triggers.isIframeReady || !extraInputs.iframeElement) {
                    /**
                     * Don't resolve this promise because we're still waiting on the iframe to show
                     * up.
                     */
                    return new Promise(() => {});
                }

                const childOrigin = extractOrigin(triggers.childFrameUrl);

                const waiting = waitForFrameLoad(extraInputs.iframeElement);

                extraInputs.initIframe(extraInputs.iframeElement);
                await waiting;

                await wrapPromiseInTimeout(
                    triggers.timeoutDuration.milliseconds,
                    handleChildIframe(
                        triggers,
                        {
                            ...extraInputs,
                            /** This property is split out for type guarding purposes. */
                            iframeElement: extraInputs.iframeElement,
                        },
                        childOrigin,
                        triggers.timeoutDuration.milliseconds,
                    ),
                );
            } catch (error) {
                extraInputs.onError(ensureError(error));
                throw error;
            }
        },
    }),
};

async function handleChildIframe(
    inputs: InternalDefaultedNftFrameConfig,
    extraInputs: {
        initIframe: (iframe: HTMLIFrameElement) => void;
        onNftLoaded: (dimensions: NftAllData) => void;
        onError: (error: Error) => void;
        iframeElement: HTMLIFrameElement;
        hostElement: HTMLElement;
    },
    childOrigin: string,
    timeoutMs: number,
): Promise<void> {
    const nftConfigForIframe = toChildNftConfig(inputs);
    let latestNftData: NftAllData | undefined | Error;

    async function getNftDataFromChild() {
        try {
            /** Send config to child and wait for child to process the NFT. */
            const newNftData = (
                await nftFrameIframeMessenger.sendMessageToChild({
                    childOrigin,
                    iframeElement: extraInputs.iframeElement,
                    message: {
                        type: NftIframeMessageTypeEnum.LoadNft,
                        data: nftConfigForIframe,
                    },
                    verifyChildData(data) {
                        return !!(
                            data &&
                            data.dimensions.width &&
                            data.dimensions.height &&
                            data.nftType &&
                            data.nftUrl
                        );
                    },
                    timeoutMs,
                })
            ).data;

            if (latestNftData instanceof Error) {
                return;
            }

            if (
                newNftData.dimensions.height !== latestNftData?.dimensions.height ||
                newNftData.dimensions.width !== latestNftData?.dimensions.width
            ) {
                latestNftData = newNftData;

                extraInputs.onNftLoaded(latestNftData);
            }

            if (!doesNftNeedMoreTimeToLoadMaybe(latestNftData.nftType)) {
                return;
            }
        } catch (error) {
            latestNftData = ensureError(error);
            throw error;
        }
    }

    await getNftDataFromChild();
}

export type ToniqNftState = typeof defaultToniqNtState;
