import React from 'react'
import { FlatList } from 'react-native'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { Group } from '../Group'

type FlatListProps<T> = React.ComponentProps<typeof FlatList<T>>

type Props<T> = {
    'aria-labelledby'?: string
    'aria-label'?: string
    fill?: boolean
    renderItem: NonNullable<FlatListProps<T>['renderItem']>
    data: NonNullable<FlatListProps<T>['data']>
}

export function GroupList<T>({
    'aria-labelledby': ariaLabelledby,
    'aria-label': ariaLabel,
    fill,
    renderItem,
    data,
}: Props<T>) {
    return (
        <Group
            variant="default"
            fill={fill}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
        >
            <FlatList
                renderItem={renderItem}
                data={data}
                showsVerticalScrollIndicator={(() => {
                    switch (ZealPlatform.OS) {
                        case 'ios':
                        case 'android':
                            return true
                        case 'web':
                            return false

                        default:
                            return notReachable(ZealPlatform.OS)
                    }
                })()}
            />
        </Group>
    )
}
