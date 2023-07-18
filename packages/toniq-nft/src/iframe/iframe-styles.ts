import {html} from 'element-vir';
import {NftTypeEnum} from './nft-data';
import {textNftPadding} from './style-constants';

export const iframeStyleElement = html`
    <style>
        body,
        html {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        }

        html.nft-type-${NftTypeEnum.Image} img,
        html.nft-type-${NftTypeEnum.Svg} svg,
        html.nft-type-${NftTypeEnum.Video} video {
            max-width: 100vw;
            max-height: 100vh;
            width: 100vw;
            height: 100vh;
            display: block;
        }

        html.nft-type-${NftTypeEnum.Pdf} body,
        html.nft-type-${NftTypeEnum.Pdf} embed {
            height: 100%;
            width: 100%;
        }

        html.nft-type-${NftTypeEnum.Pdf}:not(.finished) embed {
            display: none;
        }

        .spacer {
            padding: 0 8px;
        }

        .pixelated {
            image-rendering: pixelated;
        }

        html.nft-type-${NftTypeEnum.Text} body,
        html.nft-type-${NftTypeEnum.Json} body {
            max-width: 100%;
            max-height: 100%;
            font-family: sans-serif;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        html.nft-type-${NftTypeEnum.Text},
        html.nft-type-${NftTypeEnum.Json} {
            flex-direction: column;
        }

        html.nft-type-${NftTypeEnum.Text} .text-wrapper,
        html.nft-type-${NftTypeEnum.Json} .text-wrapper {
            max-width: 100%;
            overflow: hidden;
        }

        html.nft-type-${NftTypeEnum.Text} .text,
        html.nft-type-${NftTypeEnum.Json} .text {
            word-break: break-all;
            padding: ${textNftPadding.y}px ${textNftPadding.x}px 0;
            max-width: 100%;
            margin: 0;
            display: -webkit-box;
            /* -webkit-line-clamp will be set later by JavaScript */
            -webkit-line-clamp: unset;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        html.nft-type-${NftTypeEnum.Text} .text-wrapper,
        html.nft-type-${NftTypeEnum.Json} .text-wrapper {
            /*
                This can't be on the .text element because of it using -webkit-line-clamp. Padding will expose subsequent lines that
                should be hidden.
            */
            padding-bottom: ${textNftPadding.y}px;
        }

        /*
            If the html body has been scaled then we don't want to allow scrolling.
        */
        html.allow-scrolling:not(.scaled) {
            overflow-y: auto;
        }

        /*
            If the html body has been scaled then we don't want to allow scrolling.
        */
        html.allow-scrolling:not(.scaled) body {
            max-height: unset;
            overflow: unset;
        }
    </style>
`;
