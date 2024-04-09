import { ComponentPropsWithoutRef } from 'react'

import { Avatar } from '@zeal/uikit/Avatar'
import { validateImage } from '@zeal/uikit/helpers/validateImage'
import { BoldImage } from '@zeal/uikit/Icon/BoldImage'
import { Img } from '@zeal/uikit/Img'

import { notReachable } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'

import { Nft, PortfolioNFT } from '@zeal/domains/NFTCollection'
import { getArtworkSource } from '@zeal/domains/NFTCollection/helpers/getArtworkSource'

const fetchImage = ({ src }: { src: string }) => validateImage(src)

export const NftAvatar = ({
    nft,
    rightBadge,
    size,
    variant = 'rounded',
}: {
    nft: Nft | PortfolioNFT
    size: ComponentPropsWithoutRef<typeof Avatar>['size']
    rightBadge?: ComponentPropsWithoutRef<typeof Avatar>['rightBadge']
    variant?: ComponentPropsWithoutRef<typeof Avatar>['variant']
}) => {
    const source = getArtworkSource(nft)

    const [loadable] = useLazyLoadableData(
        fetchImage,
        source
            ? { type: 'loading', params: { src: source } }
            : { type: 'not_asked' }
    )

    switch (loadable.type) {
        case 'not_asked':
        case 'error':
        case 'loading':
            return (
                <Avatar size={size} variant={variant} rightBadge={rightBadge}>
                    <BoldImage size={size} color="iconDefault" />
                </Avatar>
            )

        case 'loaded':
            return (
                <Avatar size={size} variant={variant} rightBadge={rightBadge}>
                    <Img size={size} src={loadable.data} />
                </Avatar>
            )

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
