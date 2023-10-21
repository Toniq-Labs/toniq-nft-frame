import {readJson} from '@augment-vir/node-js';
import {dirname, join, resolve} from 'path';
import {defineConfig} from 'virmator/dist/compiled-base-configs/base-vite';

export default defineConfig({forGitHubPages: false}, async (baseConfig) => {
    const baseUrl: string =
        (
            await readJson(
                resolve(__dirname, '..', '..', '..', '.not-committed', 'base-url.json'),
                {
                    throwErrors: false,
                },
            )
        )?.['base-url'] || '';

    const extraDevServerConfig = {
        /**
         * This must be using a different host than the demo vite server for the split-domain aspect
         * of toniq-nft-frame to be tested.
         */
        host: 'localhost',
        port: 5284,
        ...(baseUrl
            ? {
                  proxy: {
                      '/content': {
                          target: baseUrl,
                          changeOrigin: true,
                          autoRewrite: true,
                          prependPath: true,
                      },
                  },
              }
            : {
                  headers: {
                      'Content-Security-Policy': "default-src 'unsafe-inline' 'self' blob: data:",
                  },
              }),
    } as const;

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
