import {html} from 'element-vir';
import {ToniqNft} from '..';

export function createTemplate() {
    return html`
        <${ToniqNft.assign({
            nftUrl: 'https://example.com/my-nft-url',
            childFrameUrl: 'https://example.com/iframe',
        })}>
            <div slot="loading">My custom loading</div>
        </${ToniqNft}>
    `;
}
