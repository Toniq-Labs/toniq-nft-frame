import {awaitedForEach, combineErrors, ensureError} from '@augment-vir/common';
import {log} from '@augment-vir/node-js';
import {allScripts} from '../all-scripts';

async function executeAllScripts() {
    const errors: Error[] = [];

    await awaitedForEach(allScripts, async (script) => {
        try {
            await script.execute();
        } catch (error) {
            errors.push(ensureError(error));
        }
    });

    if (errors.length) {
        throw combineErrors(errors);
    }
}

executeAllScripts().catch((error) => {
    log.error('Scripts execution failed.', error);
    process.exit(1);
});
