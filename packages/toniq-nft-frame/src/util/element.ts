import {createDeferredPromiseWrapper} from '@augment-vir/common';

export async function waitForScriptToLoad(scriptElement: HTMLScriptElement): Promise<void> {
    const deferredLoadPromise = createDeferredPromiseWrapper<void>();
    scriptElement.onload = () => deferredLoadPromise.resolve();
    scriptElement.onerror = (event) => deferredLoadPromise.reject(event);
    return deferredLoadPromise.promise;
}
