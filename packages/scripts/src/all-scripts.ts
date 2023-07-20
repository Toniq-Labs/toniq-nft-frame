import {generateAllExamplesTypescriptFile} from './generate-files/generate-all-examples-typescript-file';
import {defineBitGenExampleGenerations} from './generate-files/generate-bitgen-examples';
import {createGenerateFilesScript} from './script/generate-file-script';
import {Script} from './script/script';

/** Order here matters! The first script is executed first, then the second, and so on. */
export const allScripts: Script[] = [
    createGenerateFilesScript(defineBitGenExampleGenerations),
    createGenerateFilesScript(generateAllExamplesTypescriptFile),
];
