import { KnownCurrencies } from '@zeal/domains/Currency'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'

import { SimulatedTransaction } from './SimulatedTransaction'

export type SimulateTransactionResponse = {
    transaction: SimulatedTransaction
    currencies: KnownCurrencies
    checks: TransactionSafetyCheck[]
}
