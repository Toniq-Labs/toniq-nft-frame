import {joinUrlParts} from '@augment-vir/common';
import {NftFrameConfig} from '@toniq-labs/toniq-nft-frame';

export const testIframeUrl = 'http://localhost:5284/';

export type TestCase = NftFrameConfig;

const rawTestCases: ReadonlyArray<
    Omit<NftFrameConfig, 'childFrameUrl' | 'nftUrl'> & {nftId: string}
> = [
    {
        // cspell:disable
        nftId: '323f84489a431d9bccb8f7d40771b0fe1c914b41418a0981c336811908c63c8bi0',
        // cspell:enable
    },
];

export const testCases: ReadonlyArray<TestCase> = rawTestCases.map((rawTestCase) => {
    return {
        ...rawTestCase,
        nftUrl: joinUrlParts(testIframeUrl, rawTestCase.nftId),
        childFrameUrl: testIframeUrl,
    };
});
