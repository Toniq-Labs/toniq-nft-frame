const {baseConfig} = require('virmator/base-configs/base-cspell.js');

module.exports = {
    ...baseConfig,
    ignorePaths: [
        ...baseConfig.ignorePaths,
        'packages/toniq-nft-frame/iframe-dist',
        'packages/demo/www-static/safari-pinned-tab.svg',
    ],
    words: [
        ...baseConfig.words,
        'toniq',
        'bioniq',
        'bitgen',
    ],
};
