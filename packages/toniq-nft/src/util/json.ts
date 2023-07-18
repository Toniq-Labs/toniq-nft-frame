import {
    collapseWhiteSpace,
    isRuntimeTypeOf,
    JsonCompatibleValue,
    parseJson,
} from '@augment-vir/common';

export function isJson(text: string): boolean {
    const parsedJson = tryToParseJson(text);
    return isRuntimeTypeOf(parsedJson, 'object') || isRuntimeTypeOf(parsedJson, 'array');
}

export function tryToParseJson(text: string): JsonCompatibleValue {
    const defaultParseResult = parseJson({jsonString: text, errorHandler: () => undefined});

    if (defaultParseResult) {
        return defaultParseResult;
    }

    const fixed = fixJsonText(text);

    const fixedParseResult = parseJson({jsonString: fixed, errorHandler: () => undefined});
    return fixedParseResult;
}

function fixJsonText(text: string): string {
    const collapsed = collapseWhiteSpace(text);
    return (
        collapsed
            // fox trailing commas
            .replace(/,\s*([}\]])/, '$1')
    );
}
