import { Address } from '@zeal/domains/Address'
import { FiatCurrency, KnownCurrencies } from '@zeal/domains/Currency'
import { Money } from '@zeal/domains/Money'

export type KycStatus =
    | { type: 'not_started' }
    | { type: 'approved' }
    | { type: 'paused' }
    | { type: 'failed' }
    | { type: 'in_progress' }

export type UnblockUser = {
    firstName: string
    lastName: string
    bankVerificationNumber: string | null
    kycStatus: KycStatus
}

export type OnRampAccount = {
    type: 'on_ramp_account'
    uuid: string
    currency: FiatCurrency
    bankDetails: BankAccountDetails
}

export type OffRampAccount = {
    type: 'off_ramp_account'
    uuid: string
    mainBeneficiary: boolean
    currency: FiatCurrency
    bankDetails: BankAccountDetails
}

export type BankAccountDetails =
    | {
          type: 'uk'
          accountNumber: string
          sortCode: string
      }
    | { type: 'iban'; iban: string }
    | {
          type: 'ngn'
          accountNumber: string
          bankCode: string
      }

export type UserInputForBankDetails =
    | {
          type: 'uk'
          accountNumber: string
          sortCode: string
      }
    | { type: 'iban'; iban: string }
    | {
          type: 'ngn'
          accountNumber: string
          bankCode: string
          bankVerificationNumber: string
      }

export type UnblockTransferFee = {
    amount: Money
    percentageFee: number
}

// // TODO :: clarify all status with UNBLOCK to understand
export type UnblockTransactionStatus =
    | 'AML_CHECKS_COMPLETED'
    | 'AML_CHECKS_FAILED'
    | 'AML_CHECKS_IN_PROGRESS'
    | 'CRYPTO_TRANSFER_COMPLETED'
    | 'CRYPTO_TRANSFER_FAILED'
    | 'CRYPTO_TRANSFER_IN_PROGRESS'
    | 'CRYPTO_TRANSFER_ISSUED' //  amountCrypto: number
    | 'FIAT_TRANSFER_ISSUED'
    | 'FINALITY_REACHED'
    | 'FINALIZE_PROCESS_FAILED'
    | 'IBAN_TRANSFER_COMPLETED'
    | 'IBAN_TRANSFER_FAILED'
    | 'IBAN_TRANSFER_IN_PROGRESS'
    | 'IBAN_TRANSFER_ISSUED'
    | 'INTERLEDGER_TRANSFER_COMPLETED'
    | 'INTERLEDGER_TRANSFER_FAILED'
    | 'INTERLEDGER_TRANSFER_IN_PROGRESS'
    | 'INTERLEDGER_TRANSFER_ISSUED'
    | 'ON_HOLD_KYC'
    | 'OUTSIDE_TRANSFER_APPROVED' // on ramp?
    | 'OUTSIDE_TRANSFER_IN_REVIEW'
    | 'OUTSIDE_TRANSFER_RECEIVED' // on ramp?
    | 'OUTSIDE_TRANSFER_REJECTED' // on ramp?
    | 'PROCESS_BLOCKED'
    | 'PROCESS_COMPLETED'
    | 'PROCESS_INITIATION_FAILED'

export type OffRampTransactionEvent =
    | OffRampInProgressEvent
    | OffRampOnHoldEvent
    | OffRampFiatTransferIssuedEvent
    | OffRampSuccessEvent
    | OffRampFailedEvent

type OffRampEventData = {
    transactionUuid: string
    transactionHash: string
    createdAt: number
    updatedAt: number
}

export type OffRampInProgressEvent = {
    type: 'unblock_offramp_in_progress'
    crypto: Money
} & OffRampEventData

export type OffRampFiatTransferIssuedEvent = {
    type: 'unblock_offramp_fiat_transfer_issued'
    crypto: Money
    fiat: Money
} & OffRampEventData

export type OffRampSuccessEvent = {
    type: 'unblock_offramp_success'
    crypto: Money
    fiat: Money
} & OffRampEventData

export type OffRampOnHoldEvent = {
    type: 'unblock_offramp_on_hold'
    crypto: Money
} & OffRampEventData

export type OffRampFailedEvent = {
    type: 'unblock_offramp_failed'
} & OffRampEventData

export type OffRampTransaction = {
    type: 'off_ramp_transaction'
    id: string
    status: UnblockTransactionStatus
}

export type OnRampTransaction = {
    type: 'on_ramp_transaction'
    id: string
    status: UnblockTransactionStatus
}

export type UnblockLoginSignature = {
    message: string
    signature: string
}

export type WithdrawalRequest =
    | {
          type: 'full_withdrawal_request'
          knownCurrencies: KnownCurrencies
          fromAmount: Money
          toAmount: Money
          fee: UnblockTransferFee | null
      }
    | {
          type: 'incomplete_withdrawal_request'
          knownCurrencies: KnownCurrencies
          fromAmount: Money
          currencyId: string
      }

export type UnblockEvent =
    | KYCStatusChangedEvent
    | OffRampTransactionEvent
    | OnRampTransactionEvent

export type OnRampTransactionEvent =
    | OnRampTransactionTransferReceivedEvent
    | OnRampTransactionOutsideTransferInReviewEvent
    | OnRampTransactionCryptoTransferIssuedEvent
    | OnRampTransactionProcessCompletedEvent
    | OnRampTransactionTransferApprovedEvent

export type OnRampTransactionTransferReceivedEvent = {
    type: 'unblock_onramp_transfer_received'
    address: Address
    fiat: Money
    transactionUuid: string
    createdAt: number
    updatedAt: number
}

export type OnRampTransactionTransferApprovedEvent = {
    type: 'unblock_onramp_transfer_approved'
    address: Address
    fiat: Money
    transactionUuid: string
    createdAt: number
    updatedAt: number
}

export type OnRampTransactionOutsideTransferInReviewEvent = {
    type: 'unblock_onramp_transfer_in_review'
    address: Address
    fiat: Money
    transactionUuid: string
    createdAt: number
    updatedAt: number
}

export type OnRampTransactionCryptoTransferIssuedEvent = {
    type: 'unblock_onramp_crypto_transfer_issued'
    address: Address
    fiat: Money
    crypto: Money
    transactionHash: string
    transactionUuid: string
    createdAt: number
    updatedAt: number
}

export type OnRampTransactionProcessCompletedEvent = {
    type: 'unblock_onramp_process_completed'
    address: Address
    fiat: Money
    crypto: Money
    transactionHash: string
    transactionUuid: string
    createdAt: number
    updatedAt: number
}

export type KYCStatusChangedEvent = {
    type: 'kyc_event_status_changed'
    status: KycStatus
    createdAt: number
    updatedAt: number
}

export type SubmittedOfframpTransaction = {
    transactionHash: string
    withdrawalRequest: WithdrawalRequest
}
