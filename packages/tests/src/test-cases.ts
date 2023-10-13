import {joinUrlParts} from '@augment-vir/common';
import {NftFrameConfig} from '@toniq-labs/toniq-nft-frame';

export const testIframeUrl = 'http://localhost:5284/';

export type TestCase = NftFrameConfig;

const rawTestCases: ReadonlyArray<
    Omit<NftFrameConfig, 'childFrameUrl' | 'nftUrl'> & {nftId: string}
> = [
    // cspell:disable
    {
        nftId: '323f84489a431d9bccb8f7d40771b0fe1c914b41418a0981c336811908c63c8bi0',
    },
    {
        nftId: '447e0b82e6ed13801cd31bc363f9dc79169d0cac7a5d0434ae6f5a668f2f720ei0',
    },
    {
        nftId: '3de612fc334b4dcf70e1fd6bb4c26bd754e3b432bedf1b82433e75a99c094027i0',
    },
    {
        nftId: '3ab3d8dcd31cc8db0f0feaf2373c444697aae275a108ba72615c93de5ebcc4f8i0',
    },
    {
        nftId: 'f2fe86f6b0fd73a4f17cfb55a126fc22eb1c6c216cbe0df3f49e82acd27f7404i0',
    },
    // cspell:enable
];

export const testCases: ReadonlyArray<TestCase> = rawTestCases.map((rawTestCase) => {
    return {
        ...rawTestCase,
        min: {
            width: 200,
            height: 200,
        },
        max: {
            width: 600,
            height: 600,
        },
        nftUrl: joinUrlParts(testIframeUrl, rawTestCase.nftId),
        childFrameUrl: testIframeUrl,
    };
});
