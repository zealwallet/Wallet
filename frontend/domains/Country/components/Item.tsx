import React from 'react'

import { ListItem } from '@zeal/uikit/ListItem'
import { Text } from '@zeal/uikit/Text'

import { COUNTRIES_MAP, CountryISOCode } from '@zeal/domains/Country'

import { Avatar } from './Avatar'

type Props = {
    selected: boolean
    country: CountryISOCode
    onClick: () => void
}

export const Item = ({ country, selected, onClick }: Props) => {
    return (
        <ListItem
            size="regular"
            aria-current={selected}
            avatar={({ size }) => <Avatar countryCode={country} size={size} />}
            primaryText={<Text ellipsis>{COUNTRIES_MAP[country].name}</Text>}
            onClick={onClick}
        />
    )
}
