import { useIntl } from 'react-intl'

import { ActionBar as UIActionBar } from '@zeal/uikit/ActionBar'
import { Clickable } from '@zeal/uikit/Clickable'
import { Column } from '@zeal/uikit/Column'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { CloseCross } from '@zeal/uikit/Icon/CloseCross'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { ActionBarAccountIndicator } from '@zeal/domains/Account/components/ActionBarAccountIndicator'
import { ActionSource } from '@zeal/domains/Main'
import { Network } from '@zeal/domains/Network'
import { Avatar } from '@zeal/domains/Network/components/Avatar'

type Props = {
    title: React.ReactNode | null
    account: Account
    actionSource: ActionSource
    network: Network | null
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_minimize_click' }

export const ActionBar = ({
    account,
    actionSource,
    title,
    network,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    return (
        <Column spacing={0}>
            <UIActionBar
                left={<ActionBarAccountIndicator account={account} />}
                size="small"
                right={(() => {
                    switch (actionSource) {
                        case 'extension':
                            return null
                        case 'zwidget':
                            return (
                                <IconButton
                                    variant="on_light"
                                    onClick={() => {
                                        onMsg({
                                            type: 'on_minimize_click',
                                        })
                                    }}
                                    aria-label={formatMessage({
                                        id: 'actions.minimize',
                                        defaultMessage: 'Minimize',
                                    })}
                                >
                                    {({ color }) => (
                                        <CloseCross size={24} color={color} />
                                    )}
                                </IconButton>
                            )
                        default:
                            return notReachable(actionSource)
                    }
                })()}
            />

            {title === null && network === null ? null : (
                <UIActionBar
                    left={
                        title === null
                            ? null
                            : (() => {
                                  switch (actionSource) {
                                      case 'extension':
                                          return (
                                              <Clickable
                                                  onClick={() =>
                                                      onMsg({
                                                          type: 'on_minimize_click',
                                                      })
                                                  }
                                              >
                                                  <Row spacing={4} shrink>
                                                      <BackIcon
                                                          size={24}
                                                          color="iconDefault"
                                                      />

                                                      <Text
                                                          variant="title3"
                                                          weight="medium"
                                                          color="textPrimary"
                                                      >
                                                          {title}
                                                      </Text>
                                                  </Row>
                                              </Clickable>
                                          )
                                      case 'zwidget':
                                          return (
                                              <Text
                                                  variant="title3"
                                                  weight="medium"
                                                  color="textPrimary"
                                              >
                                                  {title}
                                              </Text>
                                          )
                                      default:
                                          return notReachable(actionSource)
                                  }
                              })()
                    }
                    right={
                        network === null ? null : (
                            <Avatar
                                currentNetwork={{
                                    type: 'specific_network',
                                    network,
                                }}
                                size={24}
                            />
                        )
                    }
                />
            )}
        </Column>
    )
}
