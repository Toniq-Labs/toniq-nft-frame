import {MaybePromise, areJsonEqual} from '@augment-vir/common';
import {Writable} from 'type-fest';
import {NftConfigForChildIframe} from '../nft-config';
import {loadNftDimensions, setTemplateHtml, thisScript} from './iframe-html';
import {NftAllData, NftIframeMessageTypeEnum, nftFrameIframeMessenger} from './iframe-messenger';
import {isFrameContentLoaded} from './is-content-loaded';
import {NftMetadata, getNftMetadata} from './nft-data';

const initFrameState = {
    nftConfig: undefined as NftConfigForChildIframe | undefined,
    nftData: undefined as MaybePromise<NftMetadata> | undefined,
    readyHtmlElement: undefined as HTMLHtmlElement | undefined,
} as const;

function isStateAllResolved(
    input: Writable<typeof initFrameState>,
): input is {[Prop in keyof typeof input]: Awaited<(typeof input)[Prop]>} {
    return Object.values(input).every((value) => !(value instanceof Promise));
}

function startFrame() {
    let state = {...initFrameState};

    nftFrameIframeMessenger.listenForParentMessages({
        /** Intentionally allow any origin so other websites can use our iframe. */
        parentOrigin: '*',
        _options: {
            _DANGER_ignoreAnyOriginWarning: true,
        },
        async listener(message): Promise<undefined | NftAllData> {
            const awaitedState = state;

            /** For debugging. */
            // console.log('child got message', message.type);

            /**
             * If the parent tries to get a response again but we're still loading, wait and allow
             * the original response to finish.
             */
            if (!isStateAllResolved(awaitedState)) {
                /** The original listener call is still waiting on async values. */
                return undefined;
            }

            /**
             * These if statements are in the order that the iframe is expected to receive each
             * message type.
             */
            if (message.type !== NftIframeMessageTypeEnum.LoadNft) {
                throw new Error(`Child iframe got unexpected message type: '${message.type}'`);
            }

            if (!state.nftConfig || !areJsonEqual(state.nftConfig, message.data)) {
                awaitedState.readyHtmlElement!.classList.remove('finished');
                state.nftConfig = message.data;
                state.nftData = undefined;
            }
            try {
                if (!state.nftData) {
                    state.nftData = getNftMetadata(state.nftConfig);
                    state.nftData = await state.nftData;
                }
                state.nftData = await state.nftData;
            } catch (error) {
                state.nftData = undefined;
                throw error;
            }

            if (!state.readyHtmlElement) {
                state.readyHtmlElement = setTemplateHtml(state.nftData, state.nftConfig);
            }

            /** Wait for the content to load before determining its dimensions */
            if (!isFrameContentLoaded(state.nftData.nftType)) {
                return undefined;
            }

            await ((window as any).executeBeforeSize as (() => MaybePromise<void>) | undefined)?.();
            const dimensions = loadNftDimensions(
                state.nftData,
                state.nftConfig,
                state.readyHtmlElement,
            );

            if (!dimensions) {
                return undefined;
            }

            state.readyHtmlElement.classList.add('finished');

            const fullResults: NftAllData = {
                ...state.nftData,
                dimensions,
            };

            return fullResults;
        },
    });

    thisScript!.remove();
}

startFrame();
