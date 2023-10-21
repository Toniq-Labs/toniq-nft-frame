import {readJson} from '@augment-vir/node-js';
import {resolve} from 'path';
import {basePlugins, defineConfig} from 'virmator/dist/compiled-base-configs/base-vite';
import {alwaysReloadPlugin} from 'virmator/dist/compiled-base-configs/vite-always-reload-plugin';

export default defineConfig({forGitHubPages: false}, async (baseConfig) => {
    const baseUrl =
        (
            await readJson(
                resolve(__dirname, '..', '..', '..', '.not-committed', 'base-url.json'),
                {
                    throwErrors: false,
                },
            )
        )?.['content-url'] || '';

    const define = {
        VITE_NFT_BASE_URL: JSON.stringify(baseUrl),
    };

    console.log(define);

    const extraDevServerConfig = {
        /**
         * This must be using a different host than the toniq-nft-frame vite server for the
         * split-domain aspect of toniq-nft-frame to be tested.
         */
        host: '127.0.0.1',
        port: 5283,
        headers: {
            'Content-Security-Policy':
                "default-src 'unsafe-inline' localhost:5284 'self' blob: data:",
        },
    } as const;

    return {
        ...baseConfig,
        plugins: [
            alwaysReloadPlugin({
                inclusions: [
                    '../../node_modules/@toniq-labs/toniq-nft-frame',
                ],
            }),
            ...basePlugins.slice(1),
        ],
        define,
        server: {
            ...baseConfig.server,
            ...extraDevServerConfig,
            open: true,
        },
        preview: {
            ...baseConfig.preview,
            ...extraDevServerConfig,
        },
    };
});
