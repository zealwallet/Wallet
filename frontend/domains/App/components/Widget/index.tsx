import { FormattedMessage } from 'react-intl'

import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { Group, Section } from '@zeal/uikit/Group'
import { Apps } from '@zeal/uikit/Icon/Empty/Apps'

import { MsgOf } from '@zeal/toolkit/MsgOf'

import { App } from '@zeal/domains/App'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { NetworkMap } from '@zeal/domains/Network'

import { AppsGroupHeader } from '../AppsGroupHeader'
import { ListItem } from '../ListItem'

type Props = {
    apps: App[]
    currencies: KnownCurrencies
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'show_all_apps_click' } | MsgOf<typeof ListItem>

const NUM_OF_ELEMENTS = 3

export const Widget = ({ apps, currencies, networkMap, onMsg }: Props) => {
    return (
        <Section>
            <AppsGroupHeader
                knownCurrencies={currencies}
                apps={apps}
                onClick={
                    apps.length
                        ? () => {
                              onMsg({ type: 'show_all_apps_click' })
                          }
                        : null
                }
            />
            <Group variant="default">
                {apps.length ? (
                    apps
                        .slice(0, NUM_OF_ELEMENTS)
                        .map((app) => (
                            <ListItem
                                networkMap={networkMap}
                                key={`${app.networkHexId}${app.name}`}
                                knownCurrencies={currencies}
                                app={app}
                                onMsg={onMsg}
                            />
                        ))
                ) : (
                    <AppsEmptyState />
                )}
            </Group>
        </Section>
    )
}

const AppsEmptyState = () => {
    return (
        <EmptyStateWidget
            icon={({ size }) => <Apps size={size} color="backgroundLight" />}
            size="regular"
            title={
                <FormattedMessage
                    id="app.widget.emptystate"
                    defaultMessage="We found no assets in DeFi apps"
                />
            }
        />
    )
}
