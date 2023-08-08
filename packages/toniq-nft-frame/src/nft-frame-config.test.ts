import {NftFrameConfig} from './nft-frame-config';

describe('NftFrameConfig', () => {
    it('has proper optional properties', () => {
        const onlyUrl: NftFrameConfig = {
            nftUrl: 'hello there',
            childFrameUrl: 'general',
        };
    });
});
