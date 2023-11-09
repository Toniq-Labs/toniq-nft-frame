import {html} from 'element-vir';
import {ToniqNftFrame, ToniqNftFrameSlotName} from '..';

export function createTemplate() {
    return html`
        <${ToniqNftFrame.assign({
            nftUrl: 'https://example.com/my-nft-url',
            childFrameUrl: 'https://example.com/iframe',
        })}>
            <div slot=${ToniqNftFrameSlotName.Loading}>My custom loading</div>
        </${ToniqNftFrame}>
    `;
}
