import { Address } from '@zeal/domains/Address'
import { FiatCurrency, KnownCurrencies } from '@zeal/domains/Currency'
import { Money } from '@zeal/domains/Money'

export type KycNotStarted = {
    type: 'not_started'
}

export type KycApproved = {
    type: 'approved'
}

export type KycPaused = {
    type: 'paused'
}

export type KycFailed = {
    type: 'failed'
}

export type KycInProgress = {
    type: 'in_progress'
}

export type KycStatus =
    | KycNotStarted
    | KycApproved
    | KycPaused
    | KycFailed
    | KycInProgress

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
    | OffRampOnHoldComplianceEvent
    | OffRampOnHoldKycEvent
    | OffRampFiatTransferIssuedEvent
    | OffRampSuccessEvent
    | OffRampFailedEvent
    | OffRampPendingEvent

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

export type OffRampOnHoldComplianceEvent = {
    type: 'unblock_offramp_on_hold_compliance'
    crypto: Money
} & OffRampEventData

export type OffRampOnHoldKycEvent = {
    type: 'unblock_offramp_on_hold_kyc'
    crypto: Money
} & OffRampEventData

// TODO: maybe remap? Not a terminal state and is being treated the same as OffRampInProgressEvent
export type OffRampFailedEvent = {
    type: 'unblock_offramp_failed'
} & OffRampEventData

export type OffRampPendingEvent = {
    type: 'unblock_offramp_pending'
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
    | OnRampTransactionTransferReceivedEvent // IN_PROGRESS
    | OnRampTransactionOutsideTransferInReviewEvent // IN_PROGRESS
    | OnRampTransactionTransferApprovedEvent // IN_PROGRESS
    | OnRampTransactionOnHoldComplianceEvent // ON_HOLD
    | OnRampTransactionOnHoldKycEvent // ON_HOLD
    | OnRampTransactionCryptoTransferIssuedEvent // CRYPTO_TRANSFER_ISSUED
    | OnRampTransactionProcessCompletedEvent // SUCCESS
    | OnRampTransactionFailedEvent // FAILED
    | OnRampTransactionPendingEvent // PENDING

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

export type OnRampTransactionOnHoldComplianceEvent = {
    type: 'unblock_onramp_transfer_on_hold_compliance'
    address: Address
    fiat: Money
    transactionUuid: string
    createdAt: number
    updatedAt: number
}

export type OnRampTransactionOnHoldKycEvent = {
    type: 'unblock_onramp_transfer_on_hold_kyc'
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

// TODO: maybe remap? Not a terminal state and is being treated the same as OnRampTransactionOutsideTransferInReviewEvent
export type OnRampTransactionFailedEvent = {
    type: 'unblock_onramp_failed'
    address: Address
    fiat: Money
    transactionUuid: string
    createdAt: number
    updatedAt: number
}

export type OnRampTransactionPendingEvent = {
    type: 'unblock_onramp_pending'
    address: Address
    fiat: Money
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
