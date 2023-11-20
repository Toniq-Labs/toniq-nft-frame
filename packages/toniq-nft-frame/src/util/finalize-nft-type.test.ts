import {itCases} from '@augment-vir/browser-testing';
import {NftTypeEnum} from '../iframe/nft-type';
import {finalizeNftType, guessNftType} from './finalize-nft-type';

async function guessNftTypeTestWrapper(url: string) {
    const responseText = await (await fetch(url)).text();

    return guessNftType(responseText);
}

describe(finalizeNftType.name, () => {
    itCases(guessNftTypeTestWrapper, [
        {
            it: 'predicts text for incorrect image type',
            input: 'https://cdn-bitcoin.bioniq.io/content/323d4aabc64c2e9311d517c90b22ce5df64147373e9cad6d87056ac549b90a06i0',
            expect: NftTypeEnum.Text,
        },
        {
            it: 'predicts other for an actual image',
            input: 'https://cdn-bitcoin.bioniq.io/content/3ce065e417390448ab5cfbfe77d04c33c5d2f3b3129b7826b221402c4f4e5323i0',
            expect: undefined,
        },
        {
            it: 'predicts json for json',
            input: 'https://cdn-bitcoin.bioniq.io/content/8ffe0eee5d4cde6d127daf6ebfdc6d59e651c5947b3c713144a2675fb2c2bfc3i0',
            expect: NftTypeEnum.Json,
        },
        {
            it: 'predicts html for html',
            input: 'https://cdn-bitcoin.bioniq.io/content/16d72b768c5b7e0ea225195d9a8b7380accf5a95a655d9a7ec504426fad7dcfei0',
            expect: NftTypeEnum.Html,
        },
    ]);
});
