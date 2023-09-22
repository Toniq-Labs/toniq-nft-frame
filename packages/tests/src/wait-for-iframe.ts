import {waitForCondition} from '@augment-vir/common';
import {testIframeUrl} from './test-cases';

export async function waitForIframe(): Promise<boolean> {
    await waitForCondition({
        async conditionCallback() {
            const result = await fetch(testIframeUrl);

            return result.ok;
        },
        intervalMs: 100,
        timeoutMs: 10_000,
        timeoutMessage: `Child iframe URL ('${testIframeUrl}') never became responsive.`,
    });

    return true;
}
