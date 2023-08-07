import {PropertyValueType} from '@augment-vir/common';
import {
    MessageDataBase,
    MessageDirectionEnum,
    createIframeMessenger,
} from 'interlocking-iframe-messenger';
import {NftConfigForChildIframe} from '../nft-frame-config';
import {Dimensions} from '../util/dimensions';
import {NftMetadata} from './nft-data';

/**
 * These ping and pong messages are used to prevent race conditions between loading the iframe,
 * listening to its messages, and posting messages, both inside of the iframe and outside of it.
 */
export enum NftIframeMessageTypeEnum {
    LoadNft = 'load-nft',
}

export type NftAllData = NftMetadata & {
    dimensions: Dimensions;
};

type CreateMessageData<
    MessageData extends Record<NftIframeMessageTypeEnum, PropertyValueType<MessageDataBase>>,
> = MessageData;

export type MessageData = CreateMessageData<{
    [NftIframeMessageTypeEnum.LoadNft]: {
        [MessageDirectionEnum.FromParent]: NftConfigForChildIframe;
        [MessageDirectionEnum.FromChild]: NftAllData;
    };
}>;

export const nftFrameIframeMessenger = createIframeMessenger<MessageData>({});
