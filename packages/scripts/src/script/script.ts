import {MaybePromise} from '@augment-vir/common';

export type Script = {
    test: () => MaybePromise<boolean>;
    execute: () => MaybePromise<void>;
};
