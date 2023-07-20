import {createDeferredPromiseWrapper} from '@augment-vir/common';
import localForage from 'localforage-esm';
import {toniqNftFrameTagName} from '../toniq-nft-frame-tag-name';

/** For quick debugging. */
const enableCache = true;

async function openResponseCache() {
    return await caches.open(toniqNftFrameTagName);
}

async function getCachedNftFetchResponse(nftRequest: Request): Promise<Response | undefined> {
    const cache = await openResponseCache();
    const matchedResponse = await cache.match(nftRequest);

    return matchedResponse;
}

const persistentNftDataCache = localForage.createInstance({
    /** IndexedDB database name. */
    name: toniqNftFrameTagName,
});

async function addCachedNftFetchResponse(
    nftRequest: Request,
    nftResponse: Response,
): Promise<void> {
    const cache = await openResponseCache();
    await cache.put(nftRequest, nftResponse);
}

export type PersistentCachedNftData = {
    ok: boolean;
    contentType: string;
    text: string;
};

export type LoadedNftData = {
    blobUrl: string;
} & PersistentCachedNftData;

const volatileNftDataCache = new Map<string, Promise<LoadedNftData>>();

export async function loadNftData(
    nftUrl: string,
    allowPersistentCache: boolean,
): Promise<LoadedNftData> {
    allowPersistentCache = enableCache && allowPersistentCache;

    if (!volatileNftDataCache.has(nftUrl)) {
        const deferredResponsePromise = createDeferredPromiseWrapper<LoadedNftData>();

        /** Do not await anything before this point! This operation must be performed synchronously. */
        volatileNftDataCache.set(nftUrl, deferredResponsePromise.promise);

        try {
            const nftRequest = new Request(nftUrl);

            const cachedResponse = allowPersistentCache
                ? await getCachedNftFetchResponse(nftRequest)
                : undefined;

            const nftResponse = cachedResponse ?? (await fetch(nftRequest));

            const cachedNftData: PersistentCachedNftData | undefined = allowPersistentCache
                ? (await persistentNftDataCache.getItem(nftUrl)) ?? undefined
                : undefined;

            const nftData: PersistentCachedNftData = cachedNftData ?? {
                contentType: nftResponse.headers.get('Content-Type')?.toLowerCase() || '',
                ok: nftResponse.ok,
                text: (await nftResponse.clone().text()) ?? '',
            };

            if (!cachedNftData && allowPersistentCache) {
                try {
                    // don't await this, so that it doesn't block nft loading
                    persistentNftDataCache.setItem(nftUrl, nftData);
                } catch (error) {}
            }

            const loadedNftData: LoadedNftData = {
                blobUrl: URL.createObjectURL(await nftResponse.clone().blob()),
                ...nftData,
            };
            if (!cachedResponse && allowPersistentCache) {
                try {
                    // don't await this, so that it doesn't block nft loading
                    void addCachedNftFetchResponse(nftRequest, nftResponse);
                } catch (error) {}
            }
            deferredResponsePromise.resolve(loadedNftData);
        } catch (error) {
            deferredResponsePromise.reject(error);
            throw error;
        }
    }

    const cachedResponse = await volatileNftDataCache.get(nftUrl);

    if (!cachedResponse) {
        throw new Error("Stored a cached response but couldn't find it afterwards.");
    }

    if (!enableCache) {
        volatileNftDataCache.delete(nftUrl);
    }

    return cachedResponse;
}
