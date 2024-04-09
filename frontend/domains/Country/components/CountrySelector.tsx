import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { SectionListData } from 'react-native'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { Header } from '@zeal/uikit/Header'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { OutlineSearch } from '@zeal/uikit/Icon/OutlineSearch'
import { QuestionCircle } from '@zeal/uikit/Icon/QuestionCircle'
import { IconButton } from '@zeal/uikit/IconButton'
import { Input } from '@zeal/uikit/Input'
import { Screen } from '@zeal/uikit/Screen'
import { SectionList } from '@zeal/uikit/SectionList'

import { noop } from '@zeal/toolkit'

import { Country, CountryISOCode } from '@zeal/domains/Country'

import { Item } from './Item'

const PRIORITY_COUNTRIES = new Set<CountryISOCode>([
    'GB',
    'US',
    'DE',
    'JP',
    'NG',
]) // TODO: Does it make sense for this to be on a domain level?

type Props = {
    selectedCountry: CountryISOCode | null
    countries: Country[]
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_country_selected'; countryCode: CountryISOCode }

export const CountrySelector = ({
    selectedCountry,
    countries,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const [search, setSearch] = useState<string>('')

    const priorityCountriesList = countries
        .filter((country) => PRIORITY_COUNTRIES.has(country.code))
        .filter((country) => {
            return (
                !search ||
                country.name.toLowerCase().includes(search.toLowerCase())
            )
        })

    const countryList = countries.filter((country) => {
        const passesSearch =
            !search || country.name.toLowerCase().includes(search.toLowerCase())

        return passesSearch && !PRIORITY_COUNTRIES.has(country.code)
    })

    const sections: SectionListData<Country>[] = [
        { data: priorityCountriesList },
        { data: countryList },
    ]

    return (
        <Screen background="light" padding="form">
            <ActionBar
                right={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <CloseCross size={24} color={color} />}
                    </IconButton>
                }
            />

            <Column spacing={24} fill shrink>
                <Header
                    title={
                        <FormattedMessage
                            id="countrySelector.title"
                            defaultMessage="Choose country"
                        />
                    }
                />
                <Column spacing={12} fill shrink>
                    <Input
                        keyboardType="default"
                        onSubmitEditing={noop}
                        autoFocus
                        placeholder={formatMessage({
                            id: 'countrySelector.searchPlaceholder',
                            defaultMessage: 'Search',
                        })}
                        leftIcon={
                            <OutlineSearch size={24} color="iconDefault" />
                        }
                        state="normal"
                        variant="regular"
                        onChange={(e) => setSearch(e.nativeEvent.text)}
                        value={search}
                    />

                    {priorityCountriesList.length === 0 &&
                        countryList.length === 0 && (
                            <EmptyStateWidget
                                size="regular"
                                title={
                                    <FormattedMessage
                                        id="countrySelector.noCountryFound"
                                        defaultMessage="No country found"
                                    />
                                }
                                icon={({ size }) => (
                                    <QuestionCircle
                                        size={size}
                                        color="iconDefault"
                                    />
                                )}
                            />
                        )}

                    <SectionList
                        variant="grouped"
                        itemSpacing={8}
                        sectionSpacing={8}
                        sections={sections}
                        renderItem={({ item: country }) => (
                            <Item
                                key={country.code}
                                selected={selectedCountry === country.code}
                                country={country.code}
                                onClick={() =>
                                    onMsg({
                                        type: 'on_country_selected',
                                        countryCode: country.code,
                                    })
                                }
                            />
                        )}
                    />
                </Column>
            </Column>
        </Screen>
    )
}
