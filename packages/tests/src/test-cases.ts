import {joinUrlParts} from '@augment-vir/common';
import {NftFrameConfig} from '@toniq-labs/toniq-nft-frame';
import {nftURlBase} from './globals';

export const testIframeUrl = 'http://localhost:5284/';

export type TestCase = NftFrameConfig;

const rawTestCases: ReadonlyArray<
    Omit<NftFrameConfig, 'childFrameUrl' | 'nftUrl'> & {nftId: string}
> = [
    // cspell:disable
    {nftId: '23e5f31f04be66db5d418228c31bcbaa81eb966b25a70b48836d95a5471a7b57i0'},
    {nftId: '07161c97c861032968771e9df1a77afa8827bede9281da90d333403a0dcaff4di0'},
    {nftId: '3ac649c161aaa06c7344ea1d3192745cfb5346da7407b3f295c4d53db2fab42ai0'},
    {nftId: '39f20323669452fbc67239409a40f97a741f26c4484fe5bf4a6f9b3ec031c191i0'},
    {nftId: '175568db4e494ff92b53e3ef202a66bd1e1242025983ecd152a50ecf490bf725i0'},
    {nftId: 'da4c84d2e4a8e99a32e95a44e3a5a95ee195ba5a59860fd30aa2c768c78db002i0'},
    {nftId: '9e050828c7e3db394ab7c16a7b3343b8852c0e6683fa364afd4d69d026b19c1bi0'},
    {nftId: '193da7f1aca7a67a87d15e8178f9409633c60a379d1444f5cbb79e1275ab937bi0'},
    {nftId: '1eac4c0b7ae89e497617e5a79d757d561d2d09f43c5517e5ed1da32d1e48262fi0'},
    {nftId: '2e785256005b2aee00fd22038d99891e0026d2620e3c4180c9c2d9706fe4b364i0'},
    {nftId: '323f84489a431d9bccb8f7d40771b0fe1c914b41418a0981c336811908c63c8bi0'},
    {nftId: '3ab3d8dcd31cc8db0f0feaf2373c444697aae275a108ba72615c93de5ebcc4f8i0'},
    {nftId: '3de612fc334b4dcf70e1fd6bb4c26bd754e3b432bedf1b82433e75a99c094027i0'},
    {nftId: '447e0b82e6ed13801cd31bc363f9dc79169d0cac7a5d0434ae6f5a668f2f720ei0'},
    {nftId: '4e0ad05cbbe3cfdbedec9edb37683a8284bc60ec4ced62272703f182d67e5d70i0'},
    {nftId: '57d954b95985b13101d9ca6ae576230c968eef49ea308db9faf6f03e179b7284i0'},
    {nftId: '59af44dd1c62650783e88cf44581f11526688d16878fbf5605114c225bce6c1fi0'},
    {nftId: '8e3848e783bbc29ef7b459f398e28c258bda7f01bfa36ec9f4100ba1abc582cai0'},
    {nftId: '94c7df559af3ce875ed49375d8f199b30735d580ad102b920f70b74baad17801i0'},
    {nftId: 'bb4e05f2696144a2441457d080bc80b477454fde9f5b5404c3be5a2628b6d588i0'},
    {nftId: 'c2fe83b53f4eb0b8ba2b4748884727887f840332ef02f3f79b455fcf3a3d11ebi0'},
    {nftId: 'd4addab1fe2d349aa61d8e7e658a002fb7cc1dc1bac78bf3222f1291c395e8d1i0'},
    {nftId: 'f2fe86f6b0fd73a4f17cfb55a126fc22eb1c6c216cbe0df3f49e82acd27f7404i0'},
    {nftId: '5880fde73f67425e330c130e2103b510b1b22280d32420ff1676de84926b71a2i0'},
    {nftId: '323d4aabc64c2e9311d517c90b22ce5df64147373e9cad6d87056ac549b90a06i0'},
    {nftId: '3ce065e417390448ab5cfbfe77d04c33c5d2f3b3129b7826b221402c4f4e5323i0'},
    {nftId: '8ffe0eee5d4cde6d127daf6ebfdc6d59e651c5947b3c713144a2675fb2c2bfc3i0'},
    {nftId: '16d72b768c5b7e0ea225195d9a8b7380accf5a95a655d9a7ec504426fad7dcfei0'},
    {nftId: 'invalid'},
    // cspell:enable
];

const largeSize = {
    min: {
        width: 600,
        height: 300,
    },
    max: {
        width: 600,
        height: 1200,
    },
};
const mediumSize = {
    min: {
        width: 300,
        height: 300,
    },
    max: {
        width: 300,
        height: 600,
    },
};

export const testCases: ReadonlyArray<TestCase> = rawTestCases
    .map((rawTestCase) => {
        return [
            {
                ...mediumSize,
                nftUrl: joinUrlParts(nftURlBase || testIframeUrl, rawTestCase.nftId),
                childFrameUrl: testIframeUrl,
            },
            {
                ...largeSize,
                nftUrl: joinUrlParts(nftURlBase || testIframeUrl, rawTestCase.nftId),
                childFrameUrl: testIframeUrl,
            },
        ];
    })
    .flat();
