import { FormattedMessage } from 'react-intl'

import { Chain } from '@zeal/uikit/Chain'
import { GroupHeader } from '@zeal/uikit/Group'
import { ForwardIcon } from '@zeal/uikit/Icon/ForwardIcon'
import { Text } from '@zeal/uikit/Text'

import { App } from '@zeal/domains/App'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { sumAppsInDefaultCurrency } from '@zeal/domains/Portfolio/helpers/sum'

type Props = {
    apps: App[]
    knownCurrencies: KnownCurrencies
    onClick: null | (() => void)
}

export const AppsGroupHeader = ({ apps, onClick, knownCurrencies }: Props) => {
    const sum = sumAppsInDefaultCurrency(apps)
    const _onClick = onClick ?? undefined
    return (
        <GroupHeader
            onClick={_onClick}
            left={({ color, textVariant, textWeight }) => (
                <Text color={color} variant={textVariant} weight={textWeight}>
                    <Chain>
                        <Text>
                            <FormattedMessage
                                id="app.appsGroupHeader.text"
                                defaultMessage="DeFi"
                            />
                        </Text>
                        {sum && (
                            <Text>
                                <FormattedTokenBalanceInDefaultCurrency
                                    money={sum}
                                    knownCurrencies={knownCurrencies}
                                />
                            </Text>
                        )}
                    </Chain>
                </Text>
            )}
            right={
                !apps.length
                    ? null
                    : ({ color, textVariant, textWeight }) => (
                          <>
                              <Text
                                  color={color}
                                  variant={textVariant}
                                  weight={textWeight}
                              >
                                  <Chain>
                                      <Text>{apps.length}</Text>
                                      <Text>
                                          <FormattedMessage
                                              id="app.appsGroupHeader.seeAll"
                                              defaultMessage="See all"
                                          />
                                      </Text>
                                  </Chain>
                              </Text>
                              <ForwardIcon size={16} color={color} />
                          </>
                      )
            }
        />
    )
}
