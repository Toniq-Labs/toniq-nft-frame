import {html} from 'element-vir';
import {ToniqNftFrame} from '..';

export function createTemplate() {
    return html`
        <${ToniqNftFrame.assign({
            nftUrl: 'https://example.com/my-nft-url',
            childFrameUrl: 'https://example.com/iframe',
        })}>
            <div slot="loading">My custom loading</div>
        </${ToniqNftFrame}>
    `;
}
