import {convertTemplateToString, html} from 'element-vir';
import {bioniqFrameHtmlForAudio} from './bioniq/bioniq-audio-html';
import {bioniqFrameHtmlForText} from './bioniq/bioniq-text-html';

/**
 * A collection of built in and officially supported styles for Text based (plain text, JSON, etc.)
 * and Audio file NFTs. Pick one and assign it to ToniqNftFrame's extraHtml input.
 */
export const defaultFrameStylesExtraHtml = {
    bioniq: convertTemplateToString(html`
        ${bioniqFrameHtmlForText} ${bioniqFrameHtmlForAudio}
    `),
} as const satisfies Record<string, string>;
