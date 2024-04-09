import { get } from '@zeal/api/request'

import { notReachable } from '@zeal/toolkit'
import { parse as parseJSON } from '@zeal/toolkit/JSON'
import { values } from '@zeal/toolkit/Object'
import {
    array,
    failure,
    groupByType,
    match,
    number,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
    UnexpectedResultFailureError,
} from '@zeal/toolkit/Result'

import { parse } from '@zeal/domains/Address/helpers/parse'
import { CryptoCurrency, KnownCurrencies } from '@zeal/domains/Currency'
import {
    KYCStatusChangedEvent,
    OffRampFailedEvent,
    OffRampFiatTransferIssuedEvent,
    OffRampInProgressEvent,
    OffRampOnHoldComplianceEvent,
    OffRampOnHoldKycEvent,
    OffRampSuccessEvent,
    OffRampTransactionEvent,
    OnRampTransactionCryptoTransferIssuedEvent,
    OnRampTransactionEvent,
    OnRampTransactionFailedEvent,
    OnRampTransactionOnHoldComplianceEvent,
    OnRampTransactionOnHoldKycEvent,
    OnRampTransactionOutsideTransferInReviewEvent,
    OnRampTransactionProcessCompletedEvent,
    OnRampTransactionTransferApprovedEvent,
    OnRampTransactionTransferReceivedEvent,
    UnblockEvent,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { parseKycStatus } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUnblockUser'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { NetworkHexId } from '@zeal/domains/Network'
import { POLYGON } from '@zeal/domains/Network/constants'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

// TODO: These parsers are getting huge. Try and extract some of the common parsing logic

type Params = {
    bankTransferInfo: BankTransferUnblockUserCreated
    bankTransferCurrencies: BankTransferCurrencies
    signal?: AbortSignal
}

const parseKYCEvent = (
    input: unknown
): Result<unknown, KYCStatusChangedEvent> =>
    object(input)
        .andThen((obj) =>
            shape({
                data: string(obj.data)
                    .andThen(parseJSON)
                    .andThen(object)
                    .andThen((event) =>
                        shape({
                            type: match('KYC' as const, event.type),
                            subType: string(event.subType),
                            data: object(event.data).andThen((eventDataObj) =>
                                shape({
                                    status: parseKycStatus(eventDataObj.status),
                                })
                            ),
                        })
                    ),
                createdAt: number(obj.createdAt),
                updatedAt: number(obj.updatedAt),
            })
        )
        .map((event) => ({
            type: 'kyc_event_status_changed',
            status: event.data.data.status,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
        }))

const parseUnblockChain = (input: unknown): Result<unknown, NetworkHexId> =>
    string(input).andThen((str) =>
        match(str.toLocaleLowerCase(), 'polygon').map(() => POLYGON.hexChainId)
    )

const parseUnblockOnRampTransactionTransferReceivedEvent = (
    input: unknown,
    knownCurrencies: KnownCurrencies
): Result<unknown, OnRampTransactionTransferReceivedEvent> =>
    object(input)
        .andThen((obj) =>
            shape({
                data: string(obj.data)
                    .andThen(parseJSON)
                    .andThen(object)
                    .andThen((event) =>
                        shape({
                            type: match('fiatToCrypto' as const, event.type),
                            data: object(event.data).andThen((eventDataObj) =>
                                shape({
                                    status: match(
                                        eventDataObj.status,
                                        'OUTSIDE_TRANSFER_RECEIVED' as const
                                    ),
                                    walletAddress: parse(
                                        eventDataObj.walletAddress
                                    ),
                                    currencyFiat: string(
                                        eventDataObj.currencyFiat
                                    ),
                                    amountFiat: number(eventDataObj.amountFiat),
                                    transactionUuid: string(
                                        eventDataObj.transactionUuid
                                    ),
                                })
                            ),
                        })
                    ),
                createdAt: number(obj.createdAt),
                updatedAt: number(obj.updatedAt),
            })
        )
        .andThen((event) => {
            const currency = values(knownCurrencies).find(
                (currency) =>
                    currency.code.toUpperCase() ===
                    event.data.data.currencyFiat.toUpperCase()
            )

            if (!currency) {
                return failure({
                    type: 'failed_to_find_suitable_fiat_currency',
                    currency: event.data.data.currencyFiat,
                })
            }

            const amount = amountToBigint(
                event.data.data.amountFiat.toString(10),
                currency.fraction
            )

            return success({
                type: 'unblock_onramp_transfer_received',
                fiat: {
                    amount,
                    currencyId: currency.id,
                },
                address: event.data.data.walletAddress,
                createdAt: event.createdAt,
                updatedAt: event.updatedAt,
                transactionUuid: event.data.data.transactionUuid,
            })
        })

const parseOnRampTransactionTransferApprovedEvent = (
    input: unknown,
    knownCurrencies: KnownCurrencies
): Result<unknown, OnRampTransactionTransferApprovedEvent> =>
    object(input)
        .andThen((obj) =>
            shape({
                data: string(obj.data)
                    .andThen(parseJSON)
                    .andThen(object)
                    .andThen((event) =>
                        shape({
                            type: match('fiatToCrypto' as const, event.type),
                            data: object(event.data).andThen((eventDataObj) =>
                                shape({
                                    status: match(
                                        eventDataObj.status,
                                        'OUTSIDE_TRANSFER_APPROVED' as const
                                    ),
                                    walletAddress: parse(
                                        eventDataObj.walletAddress
                                    ),
                                    currencyFiat: string(
                                        eventDataObj.currencyFiat
                                    ),
                                    amountFiat: number(eventDataObj.amountFiat),
                                    transactionUuid: string(
                                        eventDataObj.transactionUuid
                                    ),
                                })
                            ),
                        })
                    ),
                createdAt: number(obj.createdAt),
                updatedAt: number(obj.updatedAt),
            })
        )
        .andThen((event) => {
            const currency = values(knownCurrencies).find(
                (currency) =>
                    currency.code.toUpperCase() ===
                    event.data.data.currencyFiat.toUpperCase()
            )

            if (!currency) {
                return failure({
                    type: 'failed_to_find_suitable_fiat_currency',
                    currency: event.data.data.currencyFiat,
                })
            }

            const amount = amountToBigint(
                event.data.data.amountFiat.toString(10),
                currency.fraction
            )

            return success({
                type: 'unblock_onramp_transfer_approved',
                fiat: {
                    amount,
                    currencyId: currency.id,
                },
                address: event.data.data.walletAddress,
                createdAt: event.createdAt,
                updatedAt: event.updatedAt,
                transactionUuid: event.data.data.transactionUuid,
            })
        })

const parseUnblockOnRampTransactionCryptoTransferIssuedEvent = (
    input: unknown,
    knownCurrencies: KnownCurrencies
): Result<unknown, OnRampTransactionCryptoTransferIssuedEvent> =>
    object(input)
        .andThen((obj) =>
            shape({
                data: string(obj.data)
                    .andThen(parseJSON)
                    .andThen(object)
                    .andThen((event) =>
                        shape({
                            type: match('fiatToCrypto' as const, event.type),
                            data: object(event.data).andThen((eventDataObj) =>
                                shape({
                                    status: match(
                                        eventDataObj.status,
                                        'CRYPTO_TRANSFER_ISSUED' as const
                                    ),
                                    walletAddress: parse(
                                        eventDataObj.walletAddress
                                    ),
                                    currencyFiat: string(
                                        eventDataObj.currencyFiat
                                    ),
                                    amountFiat: number(eventDataObj.amountFiat),
                                    currencyCrypto: string(
                                        eventDataObj.currencyCrypto
                                    ),
                                    amountCrypto: number(
                                        eventDataObj.amountCrypto
                                    ),
                                    transactionHash: string(
                                        eventDataObj.transactionHash
                                    ),
                                    chain: parseUnblockChain(
                                        eventDataObj.chain
                                    ),
                                    transactionUuid: string(
                                        eventDataObj.transactionUuid
                                    ),
                                })
                            ),
                        })
                    ),
                createdAt: number(obj.createdAt),
                updatedAt: number(obj.updatedAt),
            })
        )
        .andThen((event) => {
            const fiatCurrency = values(knownCurrencies).find(
                (currency) =>
                    currency.code.toUpperCase() ===
                    event.data.data.currencyFiat.toUpperCase()
            )

            if (!fiatCurrency) {
                return failure({
                    type: 'failed_to_find_suitable_fiat_currency',
                    currency: event.data.data.currencyFiat,
                })
            }

            const cryptoCurrency = values(knownCurrencies)
                .filter((currency): currency is CryptoCurrency => {
                    switch (currency.type) {
                        case 'FiatCurrency':
                            return false
                        case 'CryptoCurrency':
                            return true

                        default:
                            return notReachable(currency)
                    }
                })
                .find(
                    (currency) =>
                        (currency.code.toUpperCase() ===
                            event.data.data.currencyCrypto.toUpperCase() ||
                            (currency.code.toUpperCase() === 'USDC.E' &&
                                /^USDCE?$/.test(
                                    event.data.data.currencyCrypto.toUpperCase()
                                ))) &&
                        currency.networkHexChainId === event.data.data.chain
                )

            if (!cryptoCurrency) {
                return failure({
                    type: 'failed_to_find_suitable_crypto_currency',
                    currency: event.data.data.currencyCrypto,
                    networkHexId: event.data.data.chain,
                })
            }

            const fiatAmount = amountToBigint(
                event.data.data.amountFiat.toString(10),
                fiatCurrency.fraction
            )

            const cryptoAmount = amountToBigint(
                event.data.data.amountCrypto.toString(10),
                cryptoCurrency.fraction
            )

            return success({
                type: 'unblock_onramp_crypto_transfer_issued',
                fiat: {
                    amount: fiatAmount,
                    currencyId: fiatCurrency.id,
                },
                address: event.data.data.walletAddress,
                createdAt: event.createdAt,
                updatedAt: event.updatedAt,
                transactionHash: event.data.data.transactionHash,
                transactionUuid: event.data.data.transactionUuid,
                crypto: {
                    amount: cryptoAmount,
                    currencyId: cryptoCurrency.id,
                },
            })
        })

const parseUnblockOnRampTransactionProcessCompletedEvent = (
    input: unknown,
    knownCurrencies: KnownCurrencies
): Result<unknown, OnRampTransactionProcessCompletedEvent> =>
    object(input)
        .andThen((obj) =>
            shape({
                data: string(obj.data)
                    .andThen(parseJSON)
                    .andThen(object)
                    .andThen((event) =>
                        shape({
                            type: match('fiatToCrypto' as const, event.type),
                            data: object(event.data).andThen((eventDataObj) =>
                                shape({
                                    status: match(
                                        eventDataObj.status,
                                        'PROCESS_COMPLETED' as const
                                    ),
                                    walletAddress: parse(
                                        eventDataObj.walletAddress
                                    ),
                                    currencyFiat: string(
                                        eventDataObj.currencyFiat
                                    ),
                                    amountFiat: number(eventDataObj.amountFiat),
                                    currencyCrypto: string(
                                        eventDataObj.currencyCrypto
                                    ),
                                    amountCrypto: number(
                                        eventDataObj.amountCrypto
                                    ),
                                    transactionHash: string(
                                        eventDataObj.transactionHash
                                    ),
                                    chain: parseUnblockChain(
                                        eventDataObj.chain
                                    ),
                                    transactionUuid: string(
                                        eventDataObj.transactionUuid
                                    ),
                                })
                            ),
                        })
                    ),
                createdAt: number(obj.createdAt),
                updatedAt: number(obj.updatedAt),
            })
        )
        .andThen((event) => {
            const fiatCurrency = values(knownCurrencies).find(
                (currency) =>
                    currency.code.toUpperCase() ===
                    event.data.data.currencyFiat.toUpperCase()
            )

            if (!fiatCurrency) {
                return failure({
                    type: 'failed_to_find_suitable_fiat_currency',
                    currency: event.data.data.currencyFiat,
                })
            }

            const cryptoCurrency = values(knownCurrencies)
                .filter((currency): currency is CryptoCurrency => {
                    switch (currency.type) {
                        case 'FiatCurrency':
                            return false
                        case 'CryptoCurrency':
                            return true

                        default:
                            return notReachable(currency)
                    }
                })
                .find(
                    (currency) =>
                        (currency.code.toUpperCase() ===
                            event.data.data.currencyCrypto.toUpperCase() ||
                            (currency.code.toUpperCase() === 'USDC.E' &&
                                /^USDCE?$/.test(
                                    event.data.data.currencyCrypto.toUpperCase()
                                ))) &&
                        currency.networkHexChainId === event.data.data.chain
                )

            if (!cryptoCurrency) {
                return failure({
                    type: 'failed_to_find_suitable_crypto_currency',
                    currency: event.data.data.currencyCrypto,
                    networkHexId: event.data.data.chain,
                })
            }

            const fiatAmount = amountToBigint(
                event.data.data.amountFiat.toString(10),
                fiatCurrency.fraction
            )

            const cryptoAmount = amountToBigint(
                event.data.data.amountCrypto.toString(10),
                cryptoCurrency.fraction
            )

            return success({
                type: 'unblock_onramp_process_completed',
                fiat: {
                    amount: fiatAmount,
                    currencyId: fiatCurrency.id,
                },
                address: event.data.data.walletAddress,
                createdAt: event.createdAt,
                updatedAt: event.updatedAt,
                transactionHash: event.data.data.transactionHash,
                transactionUuid: event.data.data.transactionUuid,
                crypto: {
                    amount: cryptoAmount,
                    currencyId: cryptoCurrency.id,
                },
            })
        })

export const parseUnblockOnRampTransactionOutsideTransferInReviewEvent = (
    input: unknown,
    knownCurrencies: KnownCurrencies
): Result<unknown, OnRampTransactionOutsideTransferInReviewEvent> =>
    object(input)
        .andThen((obj) =>
            shape({
                data: string(obj.data)
                    .andThen(parseJSON)
                    .andThen(object)
                    .andThen((event) =>
                        shape({
                            type: match('fiatToCrypto' as const, event.type),
                            data: object(event.data).andThen((eventDataObj) =>
                                shape({
                                    status: match(
                                        eventDataObj.status,
                                        'OUTSIDE_TRANSFER_IN_REVIEW' as const
                                    ),
                                    walletAddress: parse(
                                        eventDataObj.walletAddress
                                    ),
                                    transactionUuid: string(
                                        eventDataObj.transactionUuid
                                    ),
                                    currencyFiat: string(
                                        eventDataObj.currencyFiat
                                    ),
                                    amountFiat: number(eventDataObj.amountFiat),
                                })
                            ),
                        })
                    ),
                createdAt: number(obj.createdAt),
                updatedAt: number(obj.updatedAt),
            })
        )
        .andThen((event) => {
            const currency = values(knownCurrencies).find(
                (currency) =>
                    currency.code.toUpperCase() ===
                    event.data.data.currencyFiat.toUpperCase()
            )

            if (!currency) {
                return failure({
                    type: 'failed_to_find_suitable_fiat_currency',
                    currency: event.data.data.currencyFiat,
                })
            }

            const amount = amountToBigint(
                event.data.data.amountFiat.toString(10),
                currency.fraction
            )

            return success({
                type: 'unblock_onramp_transfer_in_review',
                fiat: {
                    amount,
                    currencyId: currency.id,
                },
                address: event.data.data.walletAddress,
                createdAt: event.createdAt,
                updatedAt: event.updatedAt,
                transactionUuid: event.data.data.transactionUuid,
            })
        })

export const parseUnblockOnRampTransactionOnHoldComplianceEvent = (
    input: unknown,
    knownCurrencies: KnownCurrencies
): Result<unknown, OnRampTransactionOnHoldComplianceEvent> =>
    object(input)
        .andThen((obj) =>
            shape({
                data: string(obj.data)
                    .andThen(parseJSON)
                    .andThen(object)
                    .andThen((event) =>
                        shape({
                            type: match('fiatToCrypto' as const, event.type),
                            data: object(event.data).andThen((eventDataObj) =>
                                shape({
                                    status: match(
                                        eventDataObj.status,
                                        'ON_HOLD_PROCESS' as const
                                    ),
                                    walletAddress: parse(
                                        eventDataObj.walletAddress
                                    ),
                                    transactionUuid: string(
                                        eventDataObj.transactionUuid
                                    ),
                                    currencyFiat: string(
                                        eventDataObj.currencyFiat
                                    ),
                                    amountFiat: number(eventDataObj.amountFiat),
                                })
                            ),
                        })
                    ),
                createdAt: number(obj.createdAt),
                updatedAt: number(obj.updatedAt),
            })
        )
        .andThen((event) => {
            const currency = values(knownCurrencies).find(
                (currency) =>
                    currency.code.toUpperCase() ===
                    event.data.data.currencyFiat.toUpperCase()
            )

            if (!currency) {
                return failure({
                    type: 'failed_to_find_suitable_fiat_currency',
                    currency: event.data.data.currencyFiat,
                })
            }

            const amount = amountToBigint(
                event.data.data.amountFiat.toString(10),
                currency.fraction
            )

            return success({
                type: 'unblock_onramp_transfer_on_hold_compliance',
                fiat: {
                    amount,
                    currencyId: currency.id,
                },
                address: event.data.data.walletAddress,
                createdAt: event.createdAt,
                updatedAt: event.updatedAt,
                transactionUuid: event.data.data.transactionUuid,
            })
        })

export const parseUnblockOnRampTransactionOnHoldKycEvent = (
    input: unknown,
    knownCurrencies: KnownCurrencies
): Result<unknown, OnRampTransactionOnHoldKycEvent> =>
    object(input)
        .andThen((obj) =>
            shape({
                data: string(obj.data)
                    .andThen(parseJSON)
                    .andThen(object)
                    .andThen((event) =>
                        shape({
                            type: match('fiatToCrypto' as const, event.type),
                            data: object(event.data).andThen((eventDataObj) =>
                                shape({
                                    status: match(
                                        eventDataObj.status,
                                        'ON_HOLD_KYC' as const
                                    ),
                                    walletAddress: parse(
                                        eventDataObj.walletAddress
                                    ),
                                    transactionUuid: string(
                                        eventDataObj.transactionUuid
                                    ),
                                    currencyFiat: string(
                                        eventDataObj.currencyFiat
                                    ),
                                    amountFiat: number(eventDataObj.amountFiat),
                                })
                            ),
                        })
                    ),
                createdAt: number(obj.createdAt),
                updatedAt: number(obj.updatedAt),
            })
        )
        .andThen((event) => {
            const currency = values(knownCurrencies).find(
                (currency) =>
                    currency.code.toUpperCase() ===
                    event.data.data.currencyFiat.toUpperCase()
            )

            if (!currency) {
                return failure({
                    type: 'failed_to_find_suitable_fiat_currency',
                    currency: event.data.data.currencyFiat,
                })
            }

            const amount = amountToBigint(
                event.data.data.amountFiat.toString(10),
                currency.fraction
            )

            return success({
                type: 'unblock_onramp_transfer_on_hold_kyc',
                fiat: {
                    amount,
                    currencyId: currency.id,
                },
                address: event.data.data.walletAddress,
                createdAt: event.createdAt,
                updatedAt: event.updatedAt,
                transactionUuid: event.data.data.transactionUuid,
            })
        })

const parseUnblockOnrampTransactionFailedEvent = (
    input: unknown,
    knownCurrencies: KnownCurrencies
): Result<unknown, OnRampTransactionFailedEvent> =>
    object(input)
        .andThen((obj) =>
            shape({
                data: string(obj.data)
                    .andThen(parseJSON)
                    .andThen(object)
                    .andThen((event) =>
                        shape({
                            type: match('fiatToCrypto' as const, event.type),
                            subType: match('FAILED' as const, event.subType),
                            data: object(event.data).andThen((eventDataObj) =>
                                shape({
                                    transactionUuid: string(
                                        eventDataObj.transactionUuid
                                    ),
                                    currencyFiat: string(
                                        eventDataObj.currencyFiat
                                    ),
                                    amountFiat: number(eventDataObj.amountFiat),
                                    walletAddress: parse(
                                        eventDataObj.walletAddress
                                    ),
                                })
                            ),
                        })
                    ),
                createdAt: number(obj.createdAt),
                updatedAt: number(obj.updatedAt),
            })
        )
        .andThen((event) => {
            const currency = values(knownCurrencies).find(
                (currency) =>
                    currency.code.toUpperCase() ===
                    event.data.data.currencyFiat.toUpperCase()
            )

            if (!currency) {
                return failure({
                    type: 'failed_to_find_suitable_fiat_currency',
                    currency: event.data.data.currencyFiat,
                })
            }

            const amount = amountToBigint(
                event.data.data.amountFiat.toString(10),
                currency.fraction
            )

            return success({
                type: 'unblock_onramp_failed',
                fiat: {
                    amount,
                    currencyId: currency.id,
                },
                address: event.data.data.walletAddress,
                createdAt: event.createdAt,
                updatedAt: event.updatedAt,
                transactionUuid: event.data.data.transactionUuid,
            })
        })

const parseUnblockOfframpTransactionInProgressEvent = (
    input: unknown,
    knownCurrencies: KnownCurrencies
): Result<unknown, OffRampInProgressEvent> =>
    object(input)
        .andThen((obj) =>
            shape({
                data: string(obj.data)
                    .andThen(parseJSON)
                    .andThen(object)
                    .andThen((event) =>
                        shape({
                            type: match('cryptoToFiat' as const, event.type),
                            subType: match(
                                'IN_PROGRESS' as const,
                                event.subType
                            ),
                            data: object(event.data).andThen((eventDataObj) =>
                                shape({
                                    transactionUuid: string(
                                        eventDataObj.transactionUuid
                                    ),
                                    transactionHash: string(
                                        eventDataObj.transactionHash
                                    ),
                                    currencyCrypto: string(
                                        eventDataObj.currencyCrypto
                                    ),
                                    amountCrypto: number(
                                        eventDataObj.amountCrypto
                                    ),
                                    chain: parseUnblockChain(
                                        eventDataObj.chain
                                    ),
                                })
                            ),
                        })
                    ),
                createdAt: number(obj.createdAt),
                updatedAt: number(obj.updatedAt),
            })
        )
        .andThen((rawObj) => {
            const cryptoCurrency = values(knownCurrencies)
                .filter((currency): currency is CryptoCurrency => {
                    switch (currency.type) {
                        case 'FiatCurrency':
                            return false
                        case 'CryptoCurrency':
                            return true

                        default:
                            return notReachable(currency)
                    }
                })
                .find(
                    (currency) =>
                        (currency.code.toUpperCase() ===
                            rawObj.data.data.currencyCrypto.toUpperCase() ||
                            (currency.code.toUpperCase() === 'USDC.E' &&
                                /^USDCE?$/.test(
                                    rawObj.data.data.currencyCrypto.toUpperCase()
                                ))) &&
                        currency.networkHexChainId === rawObj.data.data.chain
                )
            if (!cryptoCurrency) {
                return failure({
                    type: 'failed_to_find_suitable_crypto_currency',
                    currency: rawObj.data.data.currencyCrypto,
                    networkHexId: rawObj.data.data.chain,
                })
            }
            const cryptoAmount = amountToBigint(
                rawObj.data.data.amountCrypto.toString(10),
                cryptoCurrency.fraction
            )

            return success({
                type: 'unblock_offramp_in_progress',
                transactionUuid: rawObj.data.data.transactionUuid,
                transactionHash: rawObj.data.data.transactionHash,
                createdAt: rawObj.createdAt,
                updatedAt: rawObj.updatedAt,
                crypto: {
                    amount: cryptoAmount,
                    currencyId: cryptoCurrency.id,
                },
            })
        })

const parseUnblockOfframpTransactionOnHoldComplianceEvent = (
    input: unknown,
    knownCurrencies: KnownCurrencies
): Result<unknown, OffRampOnHoldComplianceEvent> =>
    object(input)
        .andThen((obj) =>
            shape({
                data: string(obj.data)
                    .andThen(parseJSON)
                    .andThen(object)
                    .andThen((event) =>
                        shape({
                            type: match('cryptoToFiat' as const, event.type),
                            subType: match('ON_HOLD' as const, event.subType),
                            data: object(event.data).andThen((eventDataObj) =>
                                shape({
                                    status: match(
                                        eventDataObj.status,
                                        'ON_HOLD_PROCESS' as const
                                    ),
                                    transactionUuid: string(
                                        eventDataObj.transactionUuid
                                    ),
                                    transactionHash: string(
                                        eventDataObj.transactionHash
                                    ),
                                    currencyCrypto: string(
                                        eventDataObj.currencyCrypto
                                    ),
                                    amountCrypto: number(
                                        eventDataObj.amountCrypto
                                    ),
                                    chain: parseUnblockChain(
                                        eventDataObj.chain
                                    ),
                                })
                            ),
                        })
                    ),
                createdAt: number(obj.createdAt),
                updatedAt: number(obj.updatedAt),
            })
        )
        .andThen((rawObj) => {
            const cryptoCurrency = values(knownCurrencies)
                .filter((currency): currency is CryptoCurrency => {
                    switch (currency.type) {
                        case 'FiatCurrency':
                            return false
                        case 'CryptoCurrency':
                            return true

                        default:
                            return notReachable(currency)
                    }
                })
                .find(
                    (currency) =>
                        (currency.code.toUpperCase() ===
                            rawObj.data.data.currencyCrypto.toUpperCase() ||
                            (currency.code.toUpperCase() === 'USDC.E' &&
                                /^USDCE?$/.test(
                                    rawObj.data.data.currencyCrypto.toUpperCase()
                                ))) &&
                        currency.networkHexChainId === rawObj.data.data.chain
                )
            if (!cryptoCurrency) {
                return failure({
                    type: 'failed_to_find_suitable_crypto_currency',
                    currency: rawObj.data.data.currencyCrypto,
                    networkHexId: rawObj.data.data.chain,
                })
            }
            const cryptoAmount = amountToBigint(
                rawObj.data.data.amountCrypto.toString(10),
                cryptoCurrency.fraction
            )

            return success({
                type: 'unblock_offramp_on_hold_compliance',
                transactionUuid: rawObj.data.data.transactionUuid,
                transactionHash: rawObj.data.data.transactionHash,
                createdAt: rawObj.createdAt,
                updatedAt: rawObj.updatedAt,
                crypto: {
                    amount: cryptoAmount,
                    currencyId: cryptoCurrency.id,
                },
            })
        })

const parseUnblockOfframpTransactionOnHoldKycEvent = (
    input: unknown,
    knownCurrencies: KnownCurrencies
): Result<unknown, OffRampOnHoldKycEvent> =>
    object(input)
        .andThen((obj) =>
            shape({
                data: string(obj.data)
                    .andThen(parseJSON)
                    .andThen(object)
                    .andThen((event) =>
                        shape({
                            type: match('cryptoToFiat' as const, event.type),
                            subType: match('ON_HOLD' as const, event.subType),
                            data: object(event.data).andThen((eventDataObj) =>
                                shape({
                                    status: match(
                                        eventDataObj.status,
                                        'ON_HOLD_KYC' as const
                                    ),
                                    transactionUuid: string(
                                        eventDataObj.transactionUuid
                                    ),
                                    transactionHash: string(
                                        eventDataObj.transactionHash
                                    ),
                                    currencyCrypto: string(
                                        eventDataObj.currencyCrypto
                                    ),
                                    amountCrypto: number(
                                        eventDataObj.amountCrypto
                                    ),
                                    chain: parseUnblockChain(
                                        eventDataObj.chain
                                    ),
                                })
                            ),
                        })
                    ),
                createdAt: number(obj.createdAt),
                updatedAt: number(obj.updatedAt),
            })
        )
        .andThen((rawObj) => {
            const cryptoCurrency = values(knownCurrencies)
                .filter((currency): currency is CryptoCurrency => {
                    switch (currency.type) {
                        case 'FiatCurrency':
                            return false
                        case 'CryptoCurrency':
                            return true

                        default:
                            return notReachable(currency)
                    }
                })
                .find(
                    (currency) =>
                        (currency.code.toUpperCase() ===
                            rawObj.data.data.currencyCrypto.toUpperCase() ||
                            (currency.code.toUpperCase() === 'USDC.E' &&
                                /^USDCE?$/.test(
                                    rawObj.data.data.currencyCrypto.toUpperCase()
                                ))) &&
                        currency.networkHexChainId === rawObj.data.data.chain
                )
            if (!cryptoCurrency) {
                return failure({
                    type: 'failed_to_find_suitable_crypto_currency',
                    currency: rawObj.data.data.currencyCrypto,
                    networkHexId: rawObj.data.data.chain,
                })
            }
            const cryptoAmount = amountToBigint(
                rawObj.data.data.amountCrypto.toString(10),
                cryptoCurrency.fraction
            )

            return success({
                type: 'unblock_offramp_on_hold_kyc',
                transactionUuid: rawObj.data.data.transactionUuid,
                transactionHash: rawObj.data.data.transactionHash,
                createdAt: rawObj.createdAt,
                updatedAt: rawObj.updatedAt,
                crypto: {
                    amount: cryptoAmount,
                    currencyId: cryptoCurrency.id,
                },
            })
        })

const parseUnblockOfframpTransactionFiatTransferIssuedEvent = (
    input: unknown,
    knownCurrencies: KnownCurrencies
): Result<unknown, OffRampFiatTransferIssuedEvent> =>
    object(input)
        .andThen((obj) =>
            shape({
                data: string(obj.data)
                    .andThen(parseJSON)
                    .andThen(object)
                    .andThen((event) =>
                        shape({
                            type: match('cryptoToFiat' as const, event.type),
                            subType: match(
                                'FIAT_TRANSFER_ISSUED' as const,
                                event.subType
                            ),
                            data: object(event.data).andThen((eventDataObj) =>
                                shape({
                                    transactionUuid: string(
                                        eventDataObj.transactionUuid
                                    ),
                                    transactionHash: string(
                                        eventDataObj.transactionHash
                                    ),
                                    currencyCrypto: string(
                                        eventDataObj.currencyCrypto
                                    ),
                                    amountCrypto: number(
                                        eventDataObj.amountCrypto
                                    ),
                                    chain: parseUnblockChain(
                                        eventDataObj.chain
                                    ),
                                    currencyFiat: string(
                                        eventDataObj.currencyFiat
                                    ),
                                    amountFiat: number(eventDataObj.amountFiat),
                                })
                            ),
                        })
                    ),
                createdAt: number(obj.createdAt),
                updatedAt: number(obj.updatedAt),
            })
        )
        .andThen((rawObj) => {
            const fiatCurrency = values(knownCurrencies).find(
                (currency) =>
                    currency.code.toUpperCase() ===
                    rawObj.data.data.currencyFiat.toUpperCase()
            )

            if (!fiatCurrency) {
                return failure({
                    type: 'failed_to_find_suitable_fiat_currency',
                    currency: rawObj.data.data.currencyFiat,
                })
            }

            const cryptoCurrency = values(knownCurrencies)
                .filter((currency): currency is CryptoCurrency => {
                    switch (currency.type) {
                        case 'FiatCurrency':
                            return false
                        case 'CryptoCurrency':
                            return true

                        default:
                            return notReachable(currency)
                    }
                })
                .find(
                    (currency) =>
                        (currency.code.toUpperCase() ===
                            rawObj.data.data.currencyCrypto.toUpperCase() ||
                            (currency.code.toUpperCase() === 'USDC.E' &&
                                /^USDCE?$/.test(
                                    rawObj.data.data.currencyCrypto.toUpperCase()
                                ))) &&
                        currency.networkHexChainId === rawObj.data.data.chain
                )
            if (!cryptoCurrency) {
                return failure({
                    type: 'failed_to_find_suitable_crypto_currency',
                    currency: rawObj.data.data.currencyCrypto,
                    networkHexId: rawObj.data.data.chain,
                })
            }
            const fiatAmount = amountToBigint(
                rawObj.data.data.amountFiat.toString(10),
                fiatCurrency.fraction
            )

            const cryptoAmount = amountToBigint(
                rawObj.data.data.amountCrypto.toString(10),
                cryptoCurrency.fraction
            )

            return success({
                type: 'unblock_offramp_fiat_transfer_issued',
                transactionUuid: rawObj.data.data.transactionUuid,
                transactionHash: rawObj.data.data.transactionHash,
                createdAt: rawObj.createdAt,
                updatedAt: rawObj.updatedAt,
                crypto: {
                    amount: cryptoAmount,
                    currencyId: cryptoCurrency.id,
                },
                fiat: {
                    amount: fiatAmount,
                    currencyId: fiatCurrency.id,
                },
            })
        })

const parseUnblockOfframpTransactionSuccessEvent = (
    input: unknown,
    knownCurrencies: KnownCurrencies
): Result<unknown, OffRampSuccessEvent> =>
    object(input)
        .andThen((obj) =>
            shape({
                data: string(obj.data)
                    .andThen(parseJSON)
                    .andThen(object)
                    .andThen((event) =>
                        shape({
                            type: match('cryptoToFiat' as const, event.type),
                            subType: match('SUCCESS' as const, event.subType),
                            data: object(event.data).andThen((eventDataObj) =>
                                shape({
                                    transactionUuid: string(
                                        eventDataObj.transactionUuid
                                    ),
                                    transactionHash: string(
                                        eventDataObj.transactionHash
                                    ),
                                    currencyCrypto: string(
                                        eventDataObj.currencyCrypto
                                    ),
                                    amountCrypto: number(
                                        eventDataObj.amountCrypto
                                    ),
                                    chain: parseUnblockChain(
                                        eventDataObj.chain
                                    ),
                                    currencyFiat: string(
                                        eventDataObj.currencyFiat
                                    ),
                                    amountFiat: number(eventDataObj.amountFiat),
                                })
                            ),
                        })
                    ),
                createdAt: number(obj.createdAt),
                updatedAt: number(obj.updatedAt),
            })
        )
        .andThen((rawObj) => {
            const fiatCurrency = values(knownCurrencies).find(
                (currency) =>
                    currency.code.toUpperCase() ===
                    rawObj.data.data.currencyFiat.toUpperCase()
            )

            if (!fiatCurrency) {
                return failure({
                    type: 'failed_to_find_suitable_fiat_currency',
                    currency: rawObj.data.data.currencyFiat,
                })
            }

            const cryptoCurrency = values(knownCurrencies)
                .filter((currency): currency is CryptoCurrency => {
                    switch (currency.type) {
                        case 'FiatCurrency':
                            return false
                        case 'CryptoCurrency':
                            return true

                        default:
                            return notReachable(currency)
                    }
                })
                .find(
                    (currency) =>
                        (currency.code.toUpperCase() ===
                            rawObj.data.data.currencyCrypto.toUpperCase() ||
                            (currency.code.toUpperCase() === 'USDC.E' &&
                                /^USDCE?$/.test(
                                    rawObj.data.data.currencyCrypto.toUpperCase()
                                ))) &&
                        currency.networkHexChainId === rawObj.data.data.chain
                )
            if (!cryptoCurrency) {
                return failure({
                    type: 'failed_to_find_suitable_crypto_currency',
                    currency: rawObj.data.data.currencyCrypto,
                    networkHexId: rawObj.data.data.chain,
                })
            }
            const fiatAmount = amountToBigint(
                rawObj.data.data.amountFiat.toString(10),
                fiatCurrency.fraction
            )

            const cryptoAmount = amountToBigint(
                rawObj.data.data.amountCrypto.toString(10),
                cryptoCurrency.fraction
            )

            return success({
                type: 'unblock_offramp_success',
                transactionUuid: rawObj.data.data.transactionUuid,
                transactionHash: rawObj.data.data.transactionHash,
                createdAt: rawObj.createdAt,
                updatedAt: rawObj.updatedAt,
                crypto: {
                    amount: cryptoAmount,
                    currencyId: cryptoCurrency.id,
                },
                fiat: {
                    amount: fiatAmount,
                    currencyId: fiatCurrency.id,
                },
            })
        })

const parseUnblockOfframpTransactionFailedEvent = (
    input: unknown
): Result<unknown, OffRampFailedEvent> =>
    object(input)
        .andThen((obj) =>
            shape({
                data: string(obj.data)
                    .andThen(parseJSON)
                    .andThen(object)
                    .andThen((event) =>
                        shape({
                            type: match('cryptoToFiat' as const, event.type),
                            subType: match('FAILED' as const, event.subType),
                            data: object(event.data).andThen((eventDataObj) =>
                                shape({
                                    transactionUuid: string(
                                        eventDataObj.transactionUuid
                                    ),
                                    transactionHash: string(
                                        eventDataObj.transactionHash
                                    ),
                                })
                            ),
                        })
                    ),
                createdAt: number(obj.createdAt),
                updatedAt: number(obj.updatedAt),
            })
        )
        .map((rawObj) => ({
            type: 'unblock_offramp_failed',
            transactionUuid: rawObj.data.data.transactionHash,
            transactionHash: rawObj.data.data.transactionHash,
            createdAt: rawObj.createdAt,
            updatedAt: rawObj.updatedAt,
        }))

const parseUnblockOnRampTransactionEvent = (
    input: unknown,
    knownCurrencies: KnownCurrencies
): Result<unknown, OnRampTransactionEvent> =>
    oneOf(input, [
        parseUnblockOnRampTransactionTransferReceivedEvent(
            input,
            knownCurrencies
        ),
        parseUnblockOnRampTransactionCryptoTransferIssuedEvent(
            input,
            knownCurrencies
        ),
        parseUnblockOnRampTransactionOutsideTransferInReviewEvent(
            input,
            knownCurrencies
        ),
        parseOnRampTransactionTransferApprovedEvent(input, knownCurrencies),
        parseUnblockOnRampTransactionOnHoldComplianceEvent(
            input,
            knownCurrencies
        ),
        parseUnblockOnRampTransactionOnHoldKycEvent(input, knownCurrencies),
        parseUnblockOnRampTransactionProcessCompletedEvent(
            input,
            knownCurrencies
        ),
        parseUnblockOnrampTransactionFailedEvent(input, knownCurrencies),
    ])

const parseUnblockOffRampTransactionEvent = (
    input: unknown,
    knownCurrencies: KnownCurrencies
): Result<unknown, OffRampTransactionEvent> =>
    oneOf(input, [
        parseUnblockOfframpTransactionInProgressEvent(input, knownCurrencies),
        parseUnblockOfframpTransactionOnHoldComplianceEvent(
            input,
            knownCurrencies
        ),
        parseUnblockOfframpTransactionOnHoldKycEvent(input, knownCurrencies),
        parseUnblockOfframpTransactionFiatTransferIssuedEvent(
            input,
            knownCurrencies
        ),
        parseUnblockOfframpTransactionSuccessEvent(input, knownCurrencies),
        parseUnblockOfframpTransactionFailedEvent(input),
    ])

export const fetchUnblockEvents = ({
    bankTransferCurrencies,
    bankTransferInfo,
    signal,
}: Params): Promise<UnblockEvent[]> =>
    get(
        '/wallet/smart-wallet/unblock/webhook/',
        {
            query: {
                address: bankTransferInfo.connectedWalletAddress,
            },
        },
        signal
    ).then((response) => {
        const rawEvents = array(response).getSuccessResultOrThrow(
            'Failed to parse array of raw events'
        )

        const [errors, events] = groupByType(
            rawEvents.map((event) =>
                oneOf(event, [
                    parseKYCEvent(event),
                    parseUnblockOffRampTransactionEvent(
                        event,
                        bankTransferCurrencies.knownCurrencies
                    ),
                    parseUnblockOnRampTransactionEvent(
                        event,
                        bankTransferCurrencies.knownCurrencies
                    ),
                ]).mapErrorEntityInfo({
                    id: object(event)
                        .andThen((eventObj) => string(eventObj.id))
                        .getSuccessResult(),
                })
            )
        )

        if (errors.length > 0) {
            captureError(
                new UnexpectedResultFailureError(
                    'Some webhooks events could not be parsed',
                    errors
                )
            )
        }

        return events
    })
