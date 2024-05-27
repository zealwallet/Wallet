import { FormattedMessage } from 'react-intl'

import { Chain } from '@zeal/uikit/Chain'
import { GroupHeader } from '@zeal/uikit/Group'
import { ForwardIcon } from '@zeal/uikit/Icon/ForwardIcon'
import { Text } from '@zeal/uikit/Text'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { sumTokensInDefaultCurrency } from '@zeal/domains/Portfolio/helpers/sum'
import { Token } from '@zeal/domains/Token'

type Props = {
    tokens: Token[]
    labelId: string
    knownCurrencies: KnownCurrencies
    onClick?: null | (() => void)
}

export const TokensGroupHeader = ({
    tokens,
    knownCurrencies,
    labelId,
    onClick,
}: Props) => {
    const sum = sumTokensInDefaultCurrency(tokens)
    const _onClick = onClick ?? undefined

    return (
        <GroupHeader
            onClick={_onClick}
            left={({ color, textVariant, textWeight }) => (
                <Text color={color} variant={textVariant} weight={textWeight}>
                    <Chain>
                        <Text id={labelId}>
                            <FormattedMessage
                                id="token.TokensGroupHeader.text"
                                defaultMessage="Tokens"
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
                tokens.length === 0
                    ? null
                    : ({ color, textVariant, textWeight }) => (
                          <>
                              <Text
                                  color={color}
                                  variant={textVariant}
                                  weight={textWeight}
                              >
                                  <Chain>
                                      <Text>{tokens.length}</Text>
                                  </Chain>
                              </Text>

                              <ForwardIcon size={16} color="iconDefault" />
                          </>
                      )
            }
        />
    )
}
