import { ComponentPropsWithoutRef, ReactNode } from 'react'

import { ListItem as UIListItem } from '@zeal/uikit/ListItem'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { Range } from '@zeal/toolkit/Range'

import { DAppSiteInfo } from '@zeal/domains/DApp'

import { Avatar } from './Avatar'

type Props = {
    dApp: DAppSiteInfo
    highlightHostName: Range | null
    variant: 'regular' | 'small'
    avatarBadge?: ComponentPropsWithoutRef<typeof Avatar>['badge']
}

export const ListItem = ({
    dApp,
    highlightHostName,
    variant,
    avatarBadge,
}: Props) => {
    return dApp.title ? (
        <UIListItem
            aria-current={false}
            size="regular"
            avatar={() => (
                <AvatarVariant
                    dApp={dApp}
                    variant={variant}
                    avatarBadge={avatarBadge}
                />
            )}
            primaryText={<Title variant={variant}>{dApp.title}</Title>}
            shortText={
                <Subtitle variant={variant}>
                    <Hostname
                        hostname={dApp.hostname}
                        highlight={highlightHostName}
                    />
                </Subtitle>
            }
        />
    ) : (
        <UIListItem
            aria-current={false}
            size="regular"
            avatar={() => (
                <AvatarVariant
                    dApp={dApp}
                    variant={variant}
                    avatarBadge={avatarBadge}
                />
            )}
            primaryText={
                <Hostname
                    hostname={dApp.hostname}
                    highlight={highlightHostName}
                />
            }
        />
    )
}

// TODO: make variant uniform with ListItem size ("regular" and "large") and drop this component
const Title = ({
    variant,
    children,
}: {
    variant: 'regular' | 'small'
    children: NonNullable<ReactNode>
}) => {
    switch (variant) {
        case 'regular':
            return (
                <Text
                    ellipsis
                    variant="callout"
                    weight="regular"
                    color="textPrimary"
                >
                    {children}
                </Text>
            )

        case 'small':
            return (
                <Text
                    ellipsis
                    variant="paragraph"
                    weight="regular"
                    color="textPrimary"
                >
                    {children}
                </Text>
            )

        /* istanbul ignore next */
        default:
            return notReachable(variant)
    }
}

// TODO: make variant uniform with ListItem size ("regular" and "large") and drop this componet
const Subtitle = ({
    children,
    variant,
}: {
    variant: 'regular' | 'small'
    children: NonNullable<ReactNode>
}) => {
    switch (variant) {
        case 'regular':
            return (
                <Text
                    ellipsis
                    variant="paragraph"
                    weight="regular"
                    color="textSecondary"
                >
                    {children}
                </Text>
            )
        case 'small':
            return (
                <Text
                    ellipsis
                    variant="caption1"
                    weight="regular"
                    color="textSecondary"
                >
                    {children}
                </Text>
            )

        /* istanbul ignore next */
        default:
            return notReachable(variant)
    }
}

const AvatarVariant = ({
    dApp,
    variant,
    avatarBadge,
}: {
    dApp: DAppSiteInfo
    variant: 'regular' | 'small'
    avatarBadge: ComponentPropsWithoutRef<typeof Avatar>['badge']
}) => {
    switch (variant) {
        case 'regular':
            return <Avatar dApp={dApp} size={32} badge={avatarBadge} />
        case 'small':
            return <Avatar dApp={dApp} size={28} badge={avatarBadge} />

        /* istanbul ignore next */
        default:
            return notReachable(variant)
    }
}

type HostnameProps = {
    hostname: DAppSiteInfo['hostname']
    highlight: Range | null
}

const Hostname = ({ hostname, highlight }: HostnameProps) => {
    if (!highlight) {
        return <>{hostname}</>
    }

    const extendedRange: Range = {
        start: highlight.start - 1,
        end: highlight.end + 1,
    }

    const start = hostname.substring(0, extendedRange.start)
    const highlightPart = hostname.substring(
        extendedRange.start,
        extendedRange.end
    )
    const end = hostname.substring(extendedRange.end)

    return (
        <>
            {start}
            <Text color="textError">{highlightPart}</Text>
            {end}
        </>
    )
}
