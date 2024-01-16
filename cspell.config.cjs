const {baseConfig} = require('virmator/base-configs/base-cspell.js');

module.exports = {
    ...baseConfig,
    ignorePaths: [
        ...baseConfig.ignorePaths,
        'packages/toniq-nft-frame/iframe-dist',
        'packages/demo/www-static/',
        'packages/toniq-nft-frame/www-static/',
    ],
    words: [
        ...baseConfig.words,
        'toniq',
        'bioniq',
        'bitgen',
    ],
};
