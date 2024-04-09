import { FormattedMessage } from 'react-intl'

import { Chain } from '@zeal/uikit/Chain'
import { GroupHeader as UIGroupHeader } from '@zeal/uikit/Group'
import { ForwardIcon } from '@zeal/uikit/Icon/ForwardIcon'
import { Text } from '@zeal/uikit/Text'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { PortfolioNFTCollection } from '@zeal/domains/NFTCollection'
import { sumNFTSInDefaultCurrency } from '@zeal/domains/Portfolio/helpers/sum'

type Props = {
    nftCollections: PortfolioNFTCollection[]
    knownCurrencies: KnownCurrencies
    onClick: null | (() => void)
}

export const GroupHeader = ({
    nftCollections,
    knownCurrencies,
    onClick,
}: Props) => {
    const sum = sumNFTSInDefaultCurrency(nftCollections)
    const _onClick = onClick ?? undefined
    const count = nftCollections.reduce(
        (count, currentValue) => count + currentValue.nfts.length,
        0
    )

    return (
        <UIGroupHeader
            onClick={_onClick}
            left={({ color, textVariant, textWeight }) => (
                <Text color={color} variant={textVariant} weight={textWeight}>
                    <Chain>
                        <Text>
                            <FormattedMessage
                                id="ntft.groupHeader.text"
                                defaultMessage="NFTs"
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
                !count
                    ? null
                    : ({ color, textVariant, textWeight }) => (
                          <>
                              <Text
                                  color={color}
                                  variant={textVariant}
                                  weight={textWeight}
                              >
                                  <Chain>
                                      <Text>{count}</Text>
                                      <Text>
                                          <FormattedMessage
                                              id="ntft.groupHeader.seeAll"
                                              defaultMessage="See all"
                                          />
                                      </Text>
                                  </Chain>
                              </Text>

                              <ForwardIcon size={16} color="iconDefault" />
                          </>
                      )
            }
        />
    )
}
