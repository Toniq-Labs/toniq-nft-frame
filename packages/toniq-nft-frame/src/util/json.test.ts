import {itCases} from '@augment-vir/browser-testing';
import {isJson, tryToParseJson} from './json';

describe(isJson.name, () => {
    itCases(isJson, [
        {
            it: 'detects valid JSON',
            input: `{"first": "hello"}`,
            expect: true,
        },
        {
            it: 'rejects non-JSON text',
            input: `this isn't even a quoted string, just a string`,
            expect: false,
        },
        {
            it: 'rejects JSON bare numbers',
            input: `12345`,
            expect: false,
        },
        {
            it: 'rejects JSON bare strings',
            input: `"bare string"`,
            expect: false,
        },
    ]);
});

describe(tryToParseJson.name, () => {
    itCases(tryToParseJson, [
        {
            it: 'parses valid JSON object',
            input: `{"first": "hello"}`,
            expect: {first: 'hello'},
        },
        {
            it: 'parses JSON with a trailing comma',
            input: `{"first": "hello",}`,
            expect: {first: 'hello'},
        },
        {
            it: 'parses JSON with a trailing comma and new lines',
            input: `{
                "first": "hello",
            }`,
            expect: {first: 'hello'},
        },
    ]);
});
