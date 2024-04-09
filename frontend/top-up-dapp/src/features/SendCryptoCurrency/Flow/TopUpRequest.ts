import { Account } from '@zeal/domains/Account'
import { Money } from '@zeal/domains/Money'
import { PredefinedNetwork } from '@zeal/domains/Network'

export type TopUpRequest = {
    amount: Money
    amountInDefaultCurrency: Money | null
    fromAccount: Account
    zealAccount: Account
    network: PredefinedNetwork
}
