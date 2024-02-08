import {waitUntilTruthy} from '@augment-vir/common';
import {testIframeUrl} from './test-cases';

export async function waitForIframe(): Promise<boolean> {
    await waitUntilTruthy(
        async () => {
            const result = await fetch(testIframeUrl);

            return result.ok;
        },
        `Child iframe URL ('${testIframeUrl}') never became responsive.`,
        {
            interval: {
                milliseconds: 100,
            },
            timeout: {
                milliseconds: 10_000,
            },
        },
    );

    return true;
}
