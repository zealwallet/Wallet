import { ReactNode, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { SectionListData } from 'react-native'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { OutlineSearch } from '@zeal/uikit/Icon/OutlineSearch'
import { QuestionCircle } from '@zeal/uikit/Icon/QuestionCircle'
import { IconButton } from '@zeal/uikit/IconButton'
import { Input } from '@zeal/uikit/Input'
import { Screen } from '@zeal/uikit/Screen'
import { SectionList } from '@zeal/uikit/SectionList'

import { noop } from '@zeal/toolkit'

import { Country, CountryISOCode } from '@zeal/domains/Country'

import { Item } from './Item'

export const PRIORITY_COUNTRIES = new Set<CountryISOCode>([
    'GB',
    'US',
    'DE',
    'JP',
    'NG',
])

type Props = {
    selectedCountry: CountryISOCode | null
    title: ReactNode
    countries: Country[]
    priorityCountries: Set<CountryISOCode>
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_country_selected'; countryCode: CountryISOCode }

export const Title = () => (
    <FormattedMessage
        id="countrySelector.title"
        defaultMessage="Choose country"
    />
)

export const CountrySelector = ({
    selectedCountry,
    priorityCountries,
    title,
    countries,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const [search, setSearch] = useState<string>('')

    const priorityCountriesList = countries
        .filter((country) => priorityCountries.has(country.code))
        .filter((country) => {
            return (
                !search ||
                country.name.toLowerCase().includes(search.toLowerCase())
            )
        })

    const countryList = countries.filter((country) => {
        const passesSearch =
            !search || country.name.toLowerCase().includes(search.toLowerCase())

        return passesSearch && !priorityCountries.has(country.code)
    })

    const sections: SectionListData<Country>[] = [
        { data: priorityCountriesList },
        { data: countryList },
    ]

    return (
        <Screen
            background="light"
            padding="form"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <ActionBar
                left={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />

            <Column spacing={24} fill shrink>
                <Header title={title} />
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
                        keyboardShouldPersistTaps="handled"
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
