import {ToniqNftFrame} from '@toniq-labs/toniq-nft-frame/src/toniq-nft-frame/toniq-nft-frame.element';
import {asyncProp, css, defineElementNoInputs, html, isRenderReady} from 'element-vir';
import {testCases} from './test-cases';
import {waitForIframe} from './wait-for-iframe';

export const ToniqAllTestCases = defineElementNoInputs({
    tagName: 'toniq-all-test-cases',
    styles: css`
        :host {
            display: flex;
            flex-wrap: wrap;
        }

        ${ToniqNftFrame} {
            border: 1px solid #bbb;
        }
    `,
    stateInitStatic: {
        iframeReady: asyncProp({defaultValue: waitForIframe()}),
    },
    renderCallback({state}) {
        if (!isRenderReady(state.iframeReady.value)) {
            return 'Waiting for iFrame to load...';
        }

        return testCases.map((testCase) => {
            return html`
                <${ToniqNftFrame.assign({
                    ...testCase,
                    hideError: true,
                    eagerLoading: true,
                })}></${ToniqNftFrame}>
            `;
        });
    },
});
