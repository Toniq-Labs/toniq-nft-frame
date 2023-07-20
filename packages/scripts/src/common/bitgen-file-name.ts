const bitgenPrefix = 'bitgen-';
const bitgenSuffix = '.html';

export function isBitgenExampleFilename(fileName: string): boolean {
    return fileName.startsWith(bitgenPrefix) && fileName.endsWith(bitgenSuffix);
}

export function createBitgenExampleFileName(traitIndexes: ReadonlyArray<number>): string {
    return [
        bitgenPrefix,
        traitIndexes.join('-'),
        bitgenSuffix,
    ].join('');
}
