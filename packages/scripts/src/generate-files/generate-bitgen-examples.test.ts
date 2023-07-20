import {itCases} from '@augment-vir/chai';
import {relative} from 'path';
import {monoRepoRootDirPath} from '../repo-paths';
import {generateBitgenFiles} from './generate-bitgen-examples';

function sanitizedGenerateBitgenFiles(
    ...args: Parameters<typeof generateBitgenFiles>
): ReturnType<typeof generateBitgenFiles> {
    const results = generateBitgenFiles(...args);
    return results.map((result) => {
        return {
            ...result,
            filePath: relative(monoRepoRootDirPath, result.filePath),
        };
    });
}

describe(generateBitgenFiles.name, () => {
    itCases(sanitizedGenerateBitgenFiles, [
        {
            it: 'generates a single file with only one index to iterate over',
            input: {
                lengths: [1],
            },
            expect: [
                {
                    fileContents:
                        '<script t="0" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-0.html',
                },
            ],
        },
        {
            it: 'generates multiple files with lengths of 2',
            input: {
                lengths: [
                    2,
                    2,
                    2,
                ],
            },
            expect: [
                {
                    fileContents:
                        '<script t="0,0,0" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-0-0-0.html',
                },
                {
                    fileContents:
                        '<script t="0,0,1" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-0-0-1.html',
                },
                {
                    fileContents:
                        '<script t="0,1,0" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-0-1-0.html',
                },
                {
                    fileContents:
                        '<script t="0,1,1" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-0-1-1.html',
                },
                {
                    fileContents:
                        '<script t="1,0,0" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-1-0-0.html',
                },
                {
                    fileContents:
                        '<script t="1,0,1" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-1-0-1.html',
                },
                {
                    fileContents:
                        '<script t="1,1,0" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-1-1-0.html',
                },
                {
                    fileContents:
                        '<script t="1,1,1" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-1-1-1.html',
                },
            ],
        },
        {
            it: 'generates multiple files with multiple lengths',
            input: {
                lengths: [
                    3,
                    2,
                    4,
                ],
            },
            expect: [
                {
                    fileContents:
                        '<script t="0,0,0" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-0-0-0.html',
                },
                {
                    fileContents:
                        '<script t="0,0,1" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-0-0-1.html',
                },
                {
                    fileContents:
                        '<script t="0,0,2" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-0-0-2.html',
                },
                {
                    fileContents:
                        '<script t="0,0,3" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-0-0-3.html',
                },
                {
                    fileContents:
                        '<script t="0,1,0" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-0-1-0.html',
                },
                {
                    fileContents:
                        '<script t="0,1,1" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-0-1-1.html',
                },
                {
                    fileContents:
                        '<script t="0,1,2" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-0-1-2.html',
                },
                {
                    fileContents:
                        '<script t="0,1,3" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-0-1-3.html',
                },
                {
                    fileContents:
                        '<script t="1,0,0" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-1-0-0.html',
                },
                {
                    fileContents:
                        '<script t="1,0,1" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-1-0-1.html',
                },
                {
                    fileContents:
                        '<script t="1,0,2" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-1-0-2.html',
                },
                {
                    fileContents:
                        '<script t="1,0,3" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-1-0-3.html',
                },
                {
                    fileContents:
                        '<script t="1,1,0" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-1-1-0.html',
                },
                {
                    fileContents:
                        '<script t="1,1,1" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-1-1-1.html',
                },
                {
                    fileContents:
                        '<script t="1,1,2" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-1-1-2.html',
                },
                {
                    fileContents:
                        '<script t="1,1,3" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-1-1-3.html',
                },
                {
                    fileContents:
                        '<script t="2,0,0" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-2-0-0.html',
                },
                {
                    fileContents:
                        '<script t="2,0,1" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-2-0-1.html',
                },
                {
                    fileContents:
                        '<script t="2,0,2" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-2-0-2.html',
                },
                {
                    fileContents:
                        '<script t="2,0,3" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-2-0-3.html',
                },
                {
                    fileContents:
                        '<script t="2,1,0" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-2-1-0.html',
                },
                {
                    fileContents:
                        '<script t="2,1,1" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-2-1-1.html',
                },
                {
                    fileContents:
                        '<script t="2,1,2" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-2-1-2.html',
                },
                {
                    fileContents:
                        '<script t="2,1,3" src="/content/collection-js-inscription-id.js"></script>\n',
                    filePath: 'packages/toniq-nft-frame/www-static/content/bitgen-2-1-3.html',
                },
            ],
        },
    ]);
});
