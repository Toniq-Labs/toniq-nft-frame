import {assertLengthAtLeast} from '@augment-vir/common';
import {readJson} from '@augment-vir/node-js';
import {join} from 'path';
import {createBitgenExampleFileName} from '../common/bitgen-file-name';
import {toniqNftFrameContentDirPath, toniqNftFrameContentPaths} from '../repo-paths';
import {GeneratedFile} from './generated-file';

export async function defineBitGenExampleGenerations(): Promise<GeneratedFile[]> {
    const parsedCollectionJson = await readJson<{layers: {traits: unknown[]}[]}>(
        toniqNftFrameContentPaths.collectionJson,
    );

    if (!parsedCollectionJson) {
        throw new Error(
            `Failed to parse collection json from '${toniqNftFrameContentPaths.collectionJson}'`,
        );
    }

    const layerTraitLengths = parsedCollectionJson.layers.map((layer) => layer.traits.length);

    return generateBitgenFiles({lengths: layerTraitLengths});
}

export function generateBitgenFiles({
    lengths,
    currentIndexes,
    indexToModify = 0,
}: {
    lengths: ReadonlyArray<number>;
    currentIndexes?: ReadonlyArray<number>;
    indexToModify?: number;
}): GeneratedFile[] {
    if (!currentIndexes) {
        currentIndexes = lengths.map(() => 0);
    }

    const generatedFiles: GeneratedFile[] = [];

    let modifyingIndexes = [...currentIndexes];

    assertLengthAtLeast(modifyingIndexes, indexToModify + 1, 'modifyingIndexes');
    assertLengthAtLeast(lengths, indexToModify + 1, 'lengths');

    while (modifyingIndexes[indexToModify]! < lengths[indexToModify]!) {
        const newFile: GeneratedFile = {
            filePath: join(
                toniqNftFrameContentDirPath,
                createBitgenExampleFileName(modifyingIndexes),
            ),
            fileContents: `<script t="${modifyingIndexes.join(
                ',',
            )}" src="/content/collection-js-inscription-id.js"></script>\n`,
        };
        generatedFiles.push(newFile);

        /** Start at the end and go backwards so the output array is easier to read by humans. */
        let modifyingIndex = lengths.length - 1;
        while (modifyingIndex > indexToModify) {
            const innerModifyingIndexes = [...modifyingIndexes];
            innerModifyingIndexes[modifyingIndex]++;

            generatedFiles.push(
                ...generateBitgenFiles({
                    lengths,
                    currentIndexes: innerModifyingIndexes,
                    indexToModify: modifyingIndex,
                }).flat(),
            );
            modifyingIndex--;
        }

        modifyingIndexes[indexToModify]++;
    }

    return generatedFiles;
}
