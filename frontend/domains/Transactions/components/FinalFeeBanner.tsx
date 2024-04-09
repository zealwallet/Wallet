import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { BannerOutline } from '@zeal/uikit/BannerOutline'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { uuid } from '@zeal/toolkit/Crypto'

import { CryptoMoney, FiatMoney } from '@zeal/domains/Money'
import { FormattedFeeInDefaultCurrency2 } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrency'
import { TruncatedFeeInNativeTokenCurrency2 } from '@zeal/domains/Money/components/TruncatedFeeInNativeTokenCurrency'

type Props = {
    fee: CryptoMoney
    priceInDefaultCurrency: FiatMoney | null
}

export const FinalFeeBanner = ({ fee, priceInDefaultCurrency }: Props) => {
    const [id] = useState(uuid())

    return (
        <BannerOutline icon={null}>
            <Row
                spacing={0}
                alignX="stretch"
                aria-labelledby={`final-fee-label-${id}`}
                aria-describedby={`final-fee-desc-${id}`}
            >
                <Text
                    variant="paragraph"
                    color="textPrimary"
                    weight="regular"
                    id={`final-fee-label-${id}`}
                >
                    <FormattedMessage
                        id="confirmTransaction.networkFee"
                        defaultMessage="Final network fee"
                    />
                </Text>

                <Text
                    variant="paragraph"
                    color="textPrimary"
                    weight="regular"
                    id={`final-fee-desc-${id}`}
                >
                    {priceInDefaultCurrency ? (
                        <FormattedFeeInDefaultCurrency2
                            money={priceInDefaultCurrency}
                        />
                    ) : (
                        <TruncatedFeeInNativeTokenCurrency2 money={fee} />
                    )}
                </Text>
            </Row>
        </BannerOutline>
    )
}
