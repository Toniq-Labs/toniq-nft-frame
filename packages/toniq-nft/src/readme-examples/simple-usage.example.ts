import {html} from 'element-vir';
import {ToniqNft} from '..';

export function createTemplate() {
    return html`
        <${ToniqNft.assign({
            nftUrl: 'https://example.com/my-nft-url',
            childFrameUrl: 'https://example.com/iframe',
            max: {
                height: 300,
                width: 600,
            },
            min: {
                height: 100,
                width: 200,
            },
        })}></${ToniqNft}>
    `;
}
