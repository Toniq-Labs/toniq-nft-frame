import {basePlugins, defineConfig} from 'virmator/dist/compiled-base-configs/base-vite';
import {alwaysReloadPlugin} from 'virmator/dist/compiled-base-configs/vite-always-reload-plugin';

const extraDevServerConfig = {
    /**
     * This must be using a different host than the toniq-nft-frame vite server for the split-domain
     * aspect of toniq-nft-frame to be tested.
     */
    host: '127.0.0.1',
    port: 5283,
    headers: {
        'Content-Security-Policy': "default-src 'unsafe-inline' localhost:5284 'self' blob: data:",
    },
} as const;

export default defineConfig({forGitHubPages: false}, (baseConfig) => {
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
