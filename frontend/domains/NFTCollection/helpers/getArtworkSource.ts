import { Nft, PortfolioNFT } from '@zeal/domains/NFTCollection'

export const getArtworkSource = (nft: Nft | PortfolioNFT): string | null => {
    const uri = ('image' in nft && nft.image) || ('uri' in nft && nft.uri)

    if (!uri) {
        return null
    }

    if (uri.match(/^ipfs/i)) {
        return `https://ipfs.io/ipfs/${new URL(uri).pathname.replace(
            /^\/\//,
            ''
        )}`
    }

    return uri
}
