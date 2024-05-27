import { Address } from '@zeal/domains/Address'
import { FiatMoney } from '@zeal/domains/Money'

export type CardConfig =
    | { type: 'card_owner_address_is_not_selected' }
    | {
          type: 'card_owner_address_is_selected'
          owner: Address
      }

export type GnosisPayLoginSignature = {
    type: 'gnosis_pay_login_info'
    address: Address
    message: string
    signature: string
}

export type GnosisPayLoginInfo = {
    type: 'gnosis_pay_login_info'
    token: string // only token so far
}

export type MerchantInfo = {
    name: string
    mcc: number
}

export type Reversal = {
    kind: 'Reversal'
    createdAt: number
    transactionAmount: FiatMoney | null
    billingAmount: FiatMoney
    merchant: MerchantInfo
}

export type CardPayment = {
    kind: 'Payment'
    status: 'Approved' | 'InsufficientFunds' | 'Declined' | 'Reversal'
    createdAt: number
    transactionAmount: FiatMoney | null
    billingAmount: FiatMoney
    merchant: MerchantInfo
}

export type Refund = {
    kind: 'Refund'
    createdAt: number
    transactionAmount: FiatMoney | null
    billingAmount: FiatMoney
    /*
    TODO @resetko-zeal there is also refundAmount and refund currency we may want to understand what we want to do with that
                       This may be related to the FX rates changed between the time of the payment and the refund
    refundCurrency: {
        symbol: 'EUR',
        code: '978',
        decimals: 2,
        name: 'Euro',
    },
    refundAmount: '1234',
    */
    merchant: MerchantInfo
}

export type CardTransaction = CardPayment | Reversal | Refund

export type GnosisPayAccountNotOnboardedState = {
    type: 'not_onboarded'
    state:
        | 'kyc_not_started'
        | 'kyc_submitted'
        | 'kyc_approved'
        | 'card_ready_to_be_shipped'
        | 'card_shipped'
}

export type Card = {
    id: string
    safeAddress: Address
    balance: FiatMoney
    details: CardDetails | null
}

export type GnosisPayAccountOnboardedState = {
    type: 'onboarded'
    card: Card
    gnosisPayLoginInfo: GnosisPayLoginInfo
    transactions: CardTransaction[]
}

export type CardDetails = {
    cvv: string
    pan: string
    expiryYear: string
    expiryMonth: string
    pin: string | null
}

export type GnosisPayAccountState =
    | GnosisPayAccountNotOnboardedState
    | GnosisPayAccountOnboardedState
