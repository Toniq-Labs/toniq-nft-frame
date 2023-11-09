import {Dimensions} from '@augment-vir/common';
import {ToniqNftFrame} from '@toniq-labs/toniq-nft-frame';
import {css, defineElement, html} from 'element-vir';
import {noNativeFormStyles} from 'vira';
import {childFrameUrl} from '../../data/child-frame-url';

const nftDimensions: Dimensions = {
    width: 200,
    height: 200,
};

export const ToniqDemoCard = defineElement<{
    nftUrl: string;
    nftOrigin: string;
}>()({
    tagName: 'toniq-demo-card',
    styles: css`
        :host {
            display: flex;
            flex-direction: column;
            padding: 8px;
            gap: 4px;
        }

        p {
            ${noNativeFormStyles};
        }

        .url-title {
            opacity: 0.5;
        }
    `,
    renderCallback({inputs}) {
        return html`
            <p>
                <a
                    class="url-title"
                    href=${[
                        inputs.nftOrigin,
                        inputs.nftUrl,
                    ].join('/')}
                >
                    ${inputs.nftUrl || '(empty string)'}
                </a>
            </p>
            <${ToniqNftFrame.assign({
                nftUrl: inputs.nftUrl,
                childFrameUrl,
                blockPersistentCache: true,
                min: nftDimensions,
                max: nftDimensions,
            })}></${ToniqNftFrame}>
        `;
    },
});
