import {BioniqRobot100Icon, ToniqIcon} from '@toniq-labs/design-system';
import {css, defineElementNoInputs, html} from 'element-vir';

export const ToniqDefaultError = defineElementNoInputs({
    tagName: 'toniq-default-error',
    styles: css`
        :host {
            display: flex;
            background-color: #f9f6fe;
            color: #8a2be2;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            max-width: 100%;
            max-height: 100%;
            width: 100%;
            height: 100%;
            font-family: 'Inconsolata', monospace;
            /**
             * The size at which the image should suddenly take up the full container
             */
            --switch-at: 200px;
        }

        .icon-wrapper {
            aspect-ratio: 1 / 1;
            height: 100%;
            max-width: 100%;
        }

        .wrapper {
            position: relative;
            display: flex;
            justify-content: center;
            width: 100%;
            height: max(min(100%, var(--switch-at)), calc(100% - var(--switch-at)));
        }

        .description {
            margin: 0;
            position: absolute;
            top: 100%;
            width: 100%;
            box-sizing: border-box;
            padding: 0 32px;
        }

        ${ToniqIcon} {
            height: 100%;
            width: 100%;
        }
    `,
    renderCallback() {
        return html`
            <div class="wrapper">
                <div class="icon-wrapper">
                    <${ToniqIcon.assign({
                        icon: BioniqRobot100Icon,
                        fitContainer: true,
                    })}></${ToniqIcon}>
                </div>
                <p class="description">This image shows no signs of life.</p>
            </div>
        `;
    },
});
