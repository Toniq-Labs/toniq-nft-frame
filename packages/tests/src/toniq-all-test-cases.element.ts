import {extractErrorMessage} from '@augment-vir/common';
import {ToniqNftFrame} from '@toniq-labs/toniq-nft-frame/src/toniq-nft-frame/toniq-nft-frame.element';
import {asyncProp, css, defineElementNoInputs, html, isError, isResolved} from 'element-vir';
import {testCases} from './test-cases';
import {waitForIframe} from './wait-for-iframe';

export const ToniqAllTestCases = defineElementNoInputs({
    tagName: 'toniq-all-test-cases',
    styles: css`
        :host {
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
        }

        ${ToniqNftFrame} {
            border: 1px solid #bbb;
        }
    `,
    stateInitStatic: {
        iframeReady: asyncProp({defaultValue: waitForIframe()}),
    },
    renderCallback({state}) {
        if (!isResolved(state.iframeReady.value)) {
            return 'Waiting for iFrame to load...';
        } else if (isError(state.iframeReady.value)) {
            return extractErrorMessage(state.iframeReady.value);
        }

        return testCases.map((testCase) => {
            return html`
                <${ToniqNftFrame.assign({
                    ...testCase,
                    eagerLoading: true,
                })}></${ToniqNftFrame}>
            `;
        });
    },
});
