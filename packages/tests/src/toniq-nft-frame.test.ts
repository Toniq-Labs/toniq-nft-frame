import {waitForCondition} from '@augment-vir/common';
import {fixture as renderFixture} from '@open-wc/testing';
import {ToniqNftFrame} from '@toniq-labs/toniq-nft-frame/src/toniq-nft-frame/toniq-nft-frame.element';
import {html, listen} from 'element-vir';
import {assertInstanceOf} from 'run-time-assertions';
import {TestCase, testCases} from './test-cases';

describe(ToniqNftFrame.tagName, () => {
    it('renders test cases properly', async () => {
        await Promise.all(testCases.map(runTestCase));
    });
});

async function runTestCase(testCase: TestCase) {
    let loaded = false;
    const fixture = await renderFixture(html`
        <${ToniqNftFrame.assign(testCase)}
            ${listen(ToniqNftFrame.events.settle, (event) => {
                loaded = event.detail;
            })}
        ></${ToniqNftFrame}>
    `);

    assertInstanceOf(fixture, ToniqNftFrame);

    await waitForCondition({
        conditionCallback() {
            return loaded;
        },
    });
}
