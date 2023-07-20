import {awaitedForEach} from '@augment-vir/common';
import {log, logColors} from '@augment-vir/node-js';
import {assert} from 'chai';
import {allScripts} from '../all-scripts';

describe('all scripts', () => {
    it('pass', async () => {
        try {
            await awaitedForEach(allScripts, async (script) => {
                assert.isTrue(await script.test());
            });
        } catch (error) {
            log.info(
                `\n\n${logColors.bold}Some scripts failed. Run "npm run scripts" in the mono-repo root to fix them where possible.\n\n`,
            );
            throw error;
        }
    });
});
