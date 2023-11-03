import {css, html, unsafeCSS} from 'element-vir';
import {defineCssVars} from 'lit-css-vars';
import {NftTypeEnum} from '../../iframe/nft-data';

const extraHtmlColorVars = defineCssVars({
    'nft-text-color': 'black',
    'nft-background-color': 'white',
});

export const bioniqFrameHtmlForText = html`
    <div class="text-overflow-overlay"></div>
    <style>
        ${css`
            html.nft-type-${unsafeCSS(NftTypeEnum.Text)} {
                ${extraHtmlColorVars['nft-text-color'].name}: black;
                ${extraHtmlColorVars['nft-background-color'].name}: #fffef4;
            }
            html.nft-type-${unsafeCSS(NftTypeEnum.Json)} {
                ${extraHtmlColorVars['nft-text-color'].name}: #c475fa;
                ${extraHtmlColorVars['nft-background-color'].name}: black;
            }

            html.nft-type-${unsafeCSS(NftTypeEnum.Text)} body,
            html.nft-type-${unsafeCSS(NftTypeEnum.Json)} body {
                font-family: 'Inconsolata', monospace;
                font-size: 1.2em;
            }

            html.nft-type-${unsafeCSS(NftTypeEnum.Text)} .text-overflow-overlay,
            html.nft-type-${unsafeCSS(NftTypeEnum.Json)} .text-overflow-overlay {
                display: block;
            }

            html.nft-type-${unsafeCSS(NftTypeEnum.Text)} .text,
            html.nft-type-${unsafeCSS(NftTypeEnum.Json)} .text {
                padding: 20px;
                padding-bottom: 30px;
            }

            html.nft-type-${unsafeCSS(NftTypeEnum.Text)},
                html.nft-type-${unsafeCSS(NftTypeEnum.Json)} {
                background-color: ${extraHtmlColorVars['nft-background-color'].value};
                color: ${extraHtmlColorVars['nft-text-color'].value};
            }

            .text-overflow-overlay {
                display: none;
                position: fixed;
                bottom: 0;
                z-index: 99999;
                height: 40px;
                width: 100%;
                background: linear-gradient(
                    0deg,
                    color-mix(
                            in srgb,
                            ${extraHtmlColorVars['nft-background-color'].value},
                            transparent 0%
                        )
                        0%,
                    color-mix(
                            in srgb,
                            ${extraHtmlColorVars['nft-background-color'].value},
                            transparent 20%
                        )
                        40%,
                    color-mix(
                            in srgb,
                            ${extraHtmlColorVars['nft-background-color'].value},
                            transparent 100%
                        )
                        100%
                );
            }

            /*
                Scrollbar styles
            */
            /* Firefox */
            * {
                scrollbar-width: auto;
                scrollbar-color: #8a2be2 ${extraHtmlColorVars['nft-background-color'].value};
            }

            /* Chrome, Edge, and Safari */
            *::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }

            *::-webkit-scrollbar-track {
                background: ${extraHtmlColorVars['nft-background-color'].value};
                border-radius: 8px;
            }

            *::-webkit-scrollbar-thumb {
                background-color: #8a2be2;
                border-radius: 8px;
            }
        `}
    </style>
`;
