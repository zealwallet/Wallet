import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Screen } from '@zeal/uikit/Screen'

import { FiatCurrency } from '@zeal/domains/Currency'
import { Avatar } from '@zeal/domains/Currency/components/Avatar'

type Props = {
    selected: FiatCurrency | null
    fiatCurrencies: FiatCurrency[]
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_currency_selected'; currency: FiatCurrency }

export const FiatCurrencySelector = ({
    selected,
    onMsg,
    fiatCurrencies,
}: Props) => (
    <Screen
        background="light"
        padding="form"
        aria-labelledby="choose-currency-id"
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

        <Column spacing={24}>
            <Header
                titleId="choose-currency-id"
                title={
                    <FormattedMessage
                        id="currencySelector.title"
                        defaultMessage="Choose currency"
                    />
                }
            />
            <Column spacing={12}>
                <Group variant="default">
                    {fiatCurrencies.map((currency: FiatCurrency) => (
                        <ListItem
                            key={currency.id}
                            size="regular"
                            aria-current={selected?.id === currency.id}
                            avatar={({ size }) => (
                                <Avatar size={size} currency={currency} />
                            )}
                            primaryText={currency.code}
                            shortText={currency.name}
                            onClick={() =>
                                onMsg({
                                    type: 'on_currency_selected',
                                    currency,
                                })
                            }
                        />
                    ))}
                </Group>
            </Column>
        </Column>
    </Screen>
)
