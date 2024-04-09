import { ComponentPropsWithoutRef, useEffect } from 'react'

import { Avatar as UIAvatar, AvatarSize } from '@zeal/uikit/Avatar'
import { validateImage } from '@zeal/uikit/helpers/validateImage'
import { QuestionCircle } from '@zeal/uikit/Icon/QuestionCircle'
import { Img } from '@zeal/uikit/Img'

import { notReachable } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'

import { DAppSiteInfo } from '@zeal/domains/DApp'

type Props = {
    dApp: DAppSiteInfo
    border?: ComponentPropsWithoutRef<typeof UIAvatar>['border']
    backgroundColor?: ComponentPropsWithoutRef<
        typeof UIAvatar
    >['backgroundColor']
    badge?: ComponentPropsWithoutRef<typeof UIAvatar>['rightBadge']
    size: AvatarSize
}

const fetchImage = ({ src }: { src: string }) => validateImage(src)

export const Avatar = ({
    dApp,
    size,
    badge,
    backgroundColor,
    border,
}: Props) => {
    const [loadable, setLoadable] = useLazyLoadableData(fetchImage, {
        type: 'not_asked',
    })

    useEffect(() => {
        setLoadable(
            dApp.avatar
                ? { type: 'loading', params: { src: dApp.avatar } }
                : { type: 'not_asked' }
        )
    }, [dApp.avatar, setLoadable])

    switch (loadable.type) {
        case 'not_asked':
        case 'error':
        case 'loading':
            return (
                <UIAvatar
                    backgroundColor={backgroundColor}
                    border={border}
                    size={size}
                    rightBadge={badge}
                >
                    <QuestionCircle size={size} color="iconDefault" />
                </UIAvatar>
            )

        case 'loaded':
            return (
                <UIAvatar
                    border={border}
                    size={size}
                    backgroundColor={backgroundColor}
                    rightBadge={badge}
                >
                    <Img size={size} src={loadable.params.src} />
                </UIAvatar>
            )

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
