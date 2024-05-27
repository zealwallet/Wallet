import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Clickable } from '@zeal/uikit/Clickable'
import { Column } from '@zeal/uikit/Column'
import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { Group, GroupHeader, Section } from '@zeal/uikit/Group'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { Connections } from '@zeal/uikit/Icon/Empty/Connections'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { ScrollContainer } from '@zeal/uikit/ScrollContainer'
import { Spacer } from '@zeal/uikit/Spacer'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { values } from '@zeal/toolkit/Object'

import {
    Connected,
    ConnectionMap,
} from '@zeal/domains/DApp/domains/ConnectionState'
import { ConnectedListItem } from '@zeal/domains/DApp/domains/ConnectionState/components/ConnectedListItem'

type Props = {
    connections: ConnectionMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_disconnect_all_click' }
    | { type: 'on_disconnect_dapps_click'; dAppHostNames: string[] }

export const Layout = ({ connections, onMsg }: Props) => {
    const [dAppHostNames, setDAppHostNames] = useState<Set<string>>(new Set())
    const activeConnections = values(connections).filter(
        (connection): connection is Connected => {
            switch (connection.type) {
                case 'not_interacted':
                case 'disconnected':
                case 'connected_to_meta_mask':
                    return false
                case 'connected':
                    return true
                /* istanbul ignore next */
                default:
                    return notReachable(connection)
            }
        }
    )

    return (
        <Screen
            background="light"
            padding="form"
            aria-labelledby="connections-layout-label"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <Column spacing={12} fill shrink>
                <Column spacing={16} shrink>
                    <Column spacing={8}>
                        <ActionBar
                            left={
                                <Clickable
                                    onClick={() => onMsg({ type: 'close' })}
                                >
                                    <Row spacing={4}>
                                        <BackIcon
                                            size={24}
                                            color="iconDefault"
                                        />

                                        <ActionBar.Header>
                                            <FormattedMessage
                                                id="dapp.connection.manage.connection_list.title"
                                                defaultMessage="Connections"
                                            />
                                        </ActionBar.Header>
                                    </Row>
                                </Clickable>
                            }
                        />
                    </Column>

                    <Section>
                        <GroupHeader
                            left={({ color, textVariant, textWeight }) => (
                                <Text
                                    color={color}
                                    variant={textVariant}
                                    weight={textWeight}
                                >
                                    <FormattedMessage
                                        id="dapp.connection.manage.connection_list.section.title"
                                        defaultMessage="Active"
                                    />
                                </Text>
                            )}
                            right={
                                !activeConnections.length
                                    ? null
                                    : () => (
                                          <Tertiary
                                              color="on_light"
                                              size="small"
                                              onClick={() =>
                                                  onMsg({
                                                      type: 'on_disconnect_all_click',
                                                  })
                                              }
                                          >
                                              {({
                                                  color,
                                                  textVariant,
                                                  textWeight,
                                              }) => (
                                                  <Text
                                                      color={color}
                                                      variant={textVariant}
                                                      weight={textWeight}
                                                  >
                                                      <FormattedMessage
                                                          id="dapp.connection.manage.connection_list.section.button.title"
                                                          defaultMessage="Disconnect all"
                                                      />
                                                  </Text>
                                              )}
                                          </Tertiary>
                                      )
                            }
                        />
                        <Group variant="default">
                            <ScrollContainer>
                                {!!activeConnections.length ? (
                                    activeConnections.map((connection) => {
                                        const selected = dAppHostNames.has(
                                            connection.dApp.hostname
                                        )
                                        return (
                                            <ConnectedListItem
                                                key={connection.dApp.hostname}
                                                connection={connection}
                                                isSelected={selected}
                                                onClick={() => {
                                                    selected
                                                        ? dAppHostNames.delete(
                                                              connection.dApp
                                                                  .hostname
                                                          )
                                                        : dAppHostNames.add(
                                                              connection.dApp
                                                                  .hostname
                                                          )
                                                    setDAppHostNames(
                                                        new Set(dAppHostNames)
                                                    )
                                                }}
                                            />
                                        )
                                    })
                                ) : (
                                    <EmptyStateWidget
                                        icon={({ size }) => (
                                            <Connections
                                                size={size}
                                                color="iconDefault"
                                            />
                                        )}
                                        size="regular"
                                        title={
                                            <FormattedMessage
                                                id="dapp.connection.manage.connection_list.no_connections"
                                                defaultMessage="You have no connected apps"
                                            />
                                        }
                                    />
                                )}
                            </ScrollContainer>
                        </Group>
                    </Section>
                </Column>
                <Spacer />
                <Actions>
                    <Button
                        size="regular"
                        variant="primary"
                        disabled={!dAppHostNames.size}
                        onClick={() => {
                            onMsg({
                                type: 'on_disconnect_dapps_click',
                                dAppHostNames: Array.from(dAppHostNames),
                            })
                        }}
                    >
                        <FormattedMessage
                            id="dapp.connection.manage.connection_list.main.button.title"
                            defaultMessage="Disconnect"
                        />
                    </Button>
                </Actions>
            </Column>
        </Screen>
    )
}
