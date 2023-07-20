import {MaybePromise} from '@augment-vir/common';
import {log, readFileIfExists} from '@augment-vir/node-js';
import {writeFile} from 'fs/promises';
import {relative} from 'path';
import {GeneratedFile} from '../generate-files/generated-file';
import {monoRepoRootDirPath} from '../repo-paths';
import {Script} from './script';

export function createGenerateFilesScript(
    generateFilesCallback: () => MaybePromise<GeneratedFile[]>,
): Script {
    return {
        async execute() {
            const allFiles = await generateFilesCallback();
            await Promise.all(
                allFiles.map(async (file) => {
                    const currentContents = await readFileIfExists(file.filePath);

                    if (currentContents !== file.fileContents) {
                        await writeFile(file.filePath, file.fileContents);
                        log.mutate(`Wrote file: ${relative(monoRepoRootDirPath, file.filePath)}`);
                    }
                }),
            );
        },
        async test() {
            const allFiles = await generateFilesCallback();

            const results: boolean[] = await Promise.all(
                allFiles.map(async (file) => {
                    const currentContents = await readFileIfExists(file.filePath);

                    const contentsEqual = currentContents === file.fileContents;

                    if (!contentsEqual) {
                        log.error(
                            `Generated file out of date: ${relative(
                                monoRepoRootDirPath,
                                file.filePath,
                            )}`,
                        );
                    }

                    return contentsEqual;
                }),
            );

            const allPassed = results.every((result) => result);

            return allPassed;
        },
    };
}
