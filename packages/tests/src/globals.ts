declare global {
    var VITE_NFT_BASE_URL: string;
}

export const nftURlBase = typeof VITE_NFT_BASE_URL === 'undefined' ? '' : VITE_NFT_BASE_URL || '';
