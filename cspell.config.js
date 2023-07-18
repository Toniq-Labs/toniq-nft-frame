const {baseConfig} = require('virmator/base-configs/base-cspell.js');

module.exports = {
    ...baseConfig,
    ignorePaths: [
        ...baseConfig.ignorePaths,
        'packages/toniq-nft/iframe-dist',
    ],
    words: [
        ...baseConfig.words,
        'toniq',
    ],
};
