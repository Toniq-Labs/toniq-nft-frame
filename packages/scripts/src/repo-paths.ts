import {join, resolve} from 'path';

export const monoRepoRootDirPath = resolve(__dirname, '..', '..', '..');
const packagesDirPath = join(monoRepoRootDirPath, 'packages');

export const demoPackagePath = join(packagesDirPath, 'demo');

export const toniqNftFramePackagePath = join(packagesDirPath, 'toniq-nft-frame');
export const toniqNftFrameContentDirPath = join(toniqNftFramePackagePath, 'www-static', 'content');

export const toniqNftFrameContentPaths = {
    collectionJson: join(toniqNftFrameContentDirPath, 'collection-json-inscription-id.json'),
};
