import { PortfolioNFT } from '@zeal/domains/NFTCollection'

type ImageSource =
    | { type: 'web'; uri: string }
    | { type: 'ipfs'; uri: string }
    | { type: 'unknown'; uri: unknown }

export const getNFTImageSource = (nft: PortfolioNFT): ImageSource => {
    if (nft.uri?.match(/^http/i)) {
        return { type: 'web', uri: nft.uri }
    } else if (nft.uri?.match(/^ipfs/i)) {
        return { type: 'ipfs', uri: nft.uri }
    } else {
        return { type: 'unknown', uri: nft.uri }
    }
}
