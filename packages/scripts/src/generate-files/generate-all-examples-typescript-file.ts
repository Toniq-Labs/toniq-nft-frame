import {joinUrlParts} from '@augment-vir/common';
import {readdir} from 'fs/promises';
import {join} from 'path';
import {isBitgenExampleFilename} from '../common/bitgen-file-name';
import {demoPackagePath, toniqNftFrameContentDirPath} from '../repo-paths';
import {GeneratedFile, generatedFileTsComment} from './generated-file';

export async function generateAllExamplesTypescriptFile(): Promise<GeneratedFile[]> {
    const allBitgenExamples = await findAllBitgenExampleFiles();

    const allExamplePaths: ReadonlyArray<string> = [
        allBitgenExamples,
    ].flat();

    const allExamplesTsFileContents = `${generatedFileTsComment}
export const allExamplePaths: ReadonlyArray<string> = [
${allExamplePaths.map((path) => `    '${path}',`).join('\n')}
];
`;

    return [
        {
            fileContents: allExamplesTsFileContents,
            filePath: join(demoPackagePath, 'src', 'data', 'all-example-paths.ts'),
        },
    ];
}

async function findAllBitgenExampleFiles(): Promise<string[]> {
    const contentsDirContents = await readdir(toniqNftFrameContentDirPath);

    return contentsDirContents
        .filter((fileName) => isBitgenExampleFilename(fileName))
        .map((fileName) => joinUrlParts('/', 'content', fileName));
}
