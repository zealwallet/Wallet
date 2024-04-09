import { KnownCurrencies } from '@zeal/domains/Currency'
import { FormattedFeeInDefaultCurrency } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrency'
import { TruncatedFeeInNativeTokenCurrency } from '@zeal/domains/Money/components/TruncatedFeeInNativeTokenCurrency'
import { EstimatedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction'

type Props = {
    fee: EstimatedFee
    knownCurrencies: KnownCurrencies
}

export const FormattedFee = ({ fee, knownCurrencies }: Props) => {
    return fee.priceInDefaultCurrency ? (
        <FormattedFeeInDefaultCurrency
            knownCurrencies={knownCurrencies}
            money={fee.priceInDefaultCurrency}
        />
    ) : (
        <TruncatedFeeInNativeTokenCurrency
            knownCurrencies={knownCurrencies}
            money={fee.priceInNativeCurrency}
        />
    )
}
