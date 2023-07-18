import {dirname, join} from 'path';
import {defineConfig} from 'virmator/dist/compiled-base-configs/base-vite';

const packageDirPath = dirname(__dirname);

export default defineConfig({forGitHubPages: false}, (baseConfig) => {
    return {
        ...baseConfig,
        build: {
            ...baseConfig.build,
            outDir: join(packageDirPath, 'iframe-dist'),
        },
        server: {
            ...baseConfig.server,
            port: 5284,
            headers: {
                'Content-Security-Policy': "default-src 'unsafe-inline' 'self' blob: data:",
            },
        },
        preview: {
            ...baseConfig.preview,
            port: 5284,
        },
    };
});
