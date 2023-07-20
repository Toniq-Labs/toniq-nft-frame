import {dirname, join} from 'path';
import {defineConfig} from 'virmator/dist/compiled-base-configs/base-vite';

const extraDevServerConfig = {
    /**
     * This must be using a different host than the demo vite server for the split-domain aspect of
     * toniq-nft-frame to be tested.
     */
    host: 'localhost',
    port: 5284,
    headers: {
        'Content-Security-Policy': "default-src 'unsafe-inline' 'self' blob: data:",
    },
} as const;

export default defineConfig({forGitHubPages: false}, (baseConfig) => {
    return {
        ...baseConfig,
        build: {
            ...baseConfig.build,
            outDir: join(dirname(__dirname), 'iframe-dist'),
        },
        server: {
            ...baseConfig.server,
            ...extraDevServerConfig,
        },
        preview: {
            ...baseConfig.preview,
            ...extraDevServerConfig,
        },
    };
});
