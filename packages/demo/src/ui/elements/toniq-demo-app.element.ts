import {css, defineElementNoInputs, html} from 'element-vir';
import {allExamplePaths} from '../../data/all-example-paths';
import {childFrameUrl} from '../../data/child-frame-url';
import {ToniqDemoCard} from './toniq-demo-card.element';

export const ToniqDemoApp = defineElementNoInputs({
    tagName: 'toniq-demo-app',
    styles: css`
        :host {
            display: flex;
            flex-direction: column;
            font-family: sans-serif;
            padding: 32px;
        }

        h1 {
            margin: 0;
        }

        .nfts {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
        }
    `,
    renderCallback() {
        const cardTemplates = allExamplePaths.map(
            (examplePath) => html`
                <${ToniqDemoCard.assign({
                    nftUrl: examplePath,
                    nftOrigin: childFrameUrl,
                })}></${ToniqDemoCard}>
            `,
        );

        return html`
            <h1>toniq-nft-frame demo</h1>
            <ul>
                <li>
                    <a href="https://github.com/Toniq-Labs/toniq-nft-frame">
                        source code and documentation
                    </a>
                </li>
                <li>
                    The iframe for this demo is hosted at
                    <a href=${childFrameUrl}>${childFrameUrl}.</a>
                </li>
                <li>
                    All NFT URLs in this demo are thus relative to
                    <a href=${childFrameUrl}>${childFrameUrl}.</a>
                </li>
            </ul>
            <section class="nfts">${cardTemplates}</section>
        `;
    },
});
