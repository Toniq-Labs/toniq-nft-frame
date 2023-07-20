import {createDeferredPromiseWrapper, ensureError, wrapPromiseInTimeout} from '@augment-vir/common';
import {asyncProp} from 'element-vir';
import {
    NftAllData,
    NftIframeMessageTypeEnum,
    nftFrameIframeMessenger,
} from '../iframe/iframe-messenger';
import {doesNftNeedMoreTimeToLoadMaybe} from '../iframe/nft-data';
import {NftConfig, defaultTimeoutMs, toChildNftConfig} from '../nft-config';
import {extractOrigin} from '../util/url';
import {defaultChildFrameUrl} from './default-child-frame-url';

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
            inputs: {
                iframeElement: HTMLIFrameElement | undefined;
                initIframe: (iframe: HTMLIFrameElement) => void;
                onNftLoaded: (dimensions: NftAllData) => void;
                onError: (error: Error) => void;
            } & NftConfig,
        ): Promise<void> {
            if (!inputs.nftUrl) {
                /** Don't resolve this promise because we're still waiting on an NFT url. */
                return new Promise(() => {});
            }

            try {
                if (!inputs.iframeElement) {
                    /**
                     * Don't resolve this promise because we're still waiting on the iframe to show
                     * up.
                     */
                    return new Promise(() => {});
                }

                const childOrigin = extractOrigin(inputs.childFrameUrl || defaultChildFrameUrl);

                const timeoutMs: number = inputs.timeoutMs || defaultTimeoutMs;

                const waiting = waitForFrameLoad(inputs.iframeElement);

                inputs.initIframe(inputs.iframeElement);
                await waiting;

                await wrapPromiseInTimeout(
                    timeoutMs,
                    handleChildIframe(
                        {
                            ...inputs,
                            iframeElement: inputs.iframeElement,
                        },
                        childOrigin,
                        timeoutMs,
                    ),
                );
            } catch (error) {
                inputs.onError(ensureError(error));
                throw error;
            }
        },
    }),
};

const retryDelays: ReadonlyArray<number> = [
    20,
    100,
    100,
    1000,
    5000,
];

async function handleChildIframe(
    inputs: {
        iframeElement: HTMLIFrameElement;
        initIframe: (iframe: HTMLIFrameElement) => void;
        onNftLoaded: (dimensions: NftAllData) => void;
        onError: (error: Error) => void;
    } & NftConfig,
    childOrigin: string,
    timeoutMs: number,
): Promise<void> {
    const nftConfigForIframe = toChildNftConfig(inputs);
    let latestNftData: NftAllData | undefined | Error;

    let currentRetryAttempt = 0;

    async function getNftDataFromChild() {
        try {
            /** Send config to child and wait for child to process the NFT. */
            const newNftData = (
                await nftFrameIframeMessenger.sendMessageToChild({
                    childOrigin,
                    iframeElement: inputs.iframeElement,
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

                inputs.onNftLoaded(latestNftData);
            }

            if (!doesNftNeedMoreTimeToLoadMaybe(latestNftData.nftType)) {
                return;
            }

            const delayTillNextAttempt = retryDelays[currentRetryAttempt];
            currentRetryAttempt++;

            /**
             * The below isConnected checks are required to account for the element potentially
             * being removed from the DOM.
             */
            if (delayTillNextAttempt != undefined && inputs.iframeElement.isConnected) {
                /** Account for the NFT size potentially changing as child JS is loaded and executed. */
                setTimeout(async () => {
                    if (inputs.iframeElement.isConnected) {
                        getNftDataFromChild();
                    }
                }, delayTillNextAttempt);
            }
        } catch (error) {
            latestNftData = ensureError(error);
            throw error;
        }
    }

    await getNftDataFromChild();
}

export type ToniqNftState = typeof defaultToniqNtState;
