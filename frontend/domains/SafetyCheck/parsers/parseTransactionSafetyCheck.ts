import { components } from '@zeal/api/portfolio'

import {
    failure,
    match,
    nullableOf,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import {
    ApprovalSpenderTypeCheck,
    NftCollectionCheck,
    P2pReceiverTypeCheck,
    SmartContractBlacklistCheck,
    TokenVerificationCheck,
    TransactionSafetyCheck,
    TransactionSimulationCheck,
} from '@zeal/domains/SafetyCheck'

const severity: Record<TransactionSafetyCheck['severity'], true> = {
    Caution: true,
    Danger: true,
}

const state: Record<TransactionSafetyCheck['state'], true> = {
    Failed: true,
    Passed: true,
}

const parseSeverity = (input: unknown) =>
    string(input).andThen((dto) =>
        severity[dto as TransactionSafetyCheck['severity']]
            ? success(dto as TransactionSafetyCheck['severity'])
            : failure({ type: 'unknown_severity' })
    )

const parseState = (
    input: unknown
): Result<unknown, TransactionSafetyCheck['state']> =>
    string(input).andThen((dto) =>
        state[dto as TransactionSafetyCheck['state']]
            ? success(dto as TransactionSafetyCheck['state'])
            : failure({ type: 'unknown_state' })
    )

const parseCheckSource = (
    input: unknown
): Result<unknown, components['schemas']['SafetyCheckSource']> =>
    object(input).andThen((obj) =>
        oneOf(obj, [
            shape({
                source: match(obj.source, 'BlockAid'),
                url: nullableOf(obj.url, string),
            }),
            shape({
                source: match(obj.source, 'Tenderly'),
                url: nullableOf(obj.url, string),
            }),
            shape({
                source: match(obj.source, 'Alchemy'),
                url: nullableOf(obj.url, string),
            }),
            shape({
                source: match(obj.source, 'DappRadar'),
                url: nullableOf(obj.url, string),
            }),
            shape({
                source: match(obj.source, 'DefiLlama'),
                url: nullableOf(obj.url, string),
            }),
            shape({
                source: match(obj.source, 'Zeal'),
                url: nullableOf(obj.url, string),
            }),
            shape({
                source: match(obj.source, 'Rarible'),
                url: nullableOf(obj.url, string),
            }),
            shape({
                source: match(obj.source, 'CoinGecko'),
                url: nullableOf(obj.url, string),
            }),
        ])
    )

const parseTransactionSimulationCheck = (
    input: unknown
): Result<unknown, TransactionSimulationCheck> =>
    oneOf(input, [
        object(input).andThen((dto) =>
            shape({
                type: match(dto.type, 'TransactionSimulationCheck'),
                state: match(dto.state, 'Failed'),
                severity: parseSeverity(dto.severity),
                message: string(dto.message),
                checkSource: parseCheckSource(dto.checkSource),
            })
        ),
        object(input).andThen((dto) =>
            shape({
                type: match(dto.type, 'TransactionSimulationCheck'),
                state: match(dto.state, 'Passed'),
                severity: parseSeverity(dto.severity),
                simulationUrl: string(dto.simulationUrl),
                checkSource: parseCheckSource(dto.checkSource),
            })
        ),
    ])

const parseTokenVerificationCheck = (
    input: unknown
): Result<unknown, TokenVerificationCheck> =>
    object(input).andThen((dto) =>
        shape({
            type: match(dto.type, 'TokenVerificationCheck'),
            state: parseState(dto.state),
            severity: parseSeverity(dto.severity),
            currencyId: string(dto.currencyId),
            checkSource: parseCheckSource(dto.checkSource),
        })
    )

const parseSmartContractBlacklistCheck = (
    input: unknown
): Result<unknown, SmartContractBlacklistCheck> =>
    object(input).andThen((dto) =>
        shape({
            type: match(dto.type, 'SmartContractBlacklistCheck'),
            state: parseState(dto.state),
            severity: parseSeverity(dto.severity),
            checkSource: parseCheckSource(dto.checkSource),
        })
    )

const parseP2pReceiverTypeCheck = (
    input: unknown
): Result<unknown, P2pReceiverTypeCheck> =>
    object(input).andThen((dto) =>
        shape({
            type: match(dto.type, 'P2pReceiverTypeCheck'),
            state: parseState(dto.state),
            severity: parseSeverity(dto.severity),
        })
    )

const parseApprovalSpenderTypeCheck = (
    input: unknown
): Result<unknown, ApprovalSpenderTypeCheck> =>
    object(input).andThen((dto) =>
        shape({
            type: match(dto.type, 'ApprovalSpenderTypeCheck'),
            state: parseState(dto.state),
            severity: parseSeverity(dto.severity),
        })
    )

const parseNftCollectionCheck = (
    input: unknown
): Result<unknown, NftCollectionCheck> =>
    object(input).andThen((dto) =>
        shape({
            type: match(dto.type, 'NftCollectionCheck'),
            state: parseState(dto.state),
            severity: parseSeverity(dto.severity),
            nftCollectionAddress: parseAddress(dto.nftCollectionAddress),
            source: string(dto.source),
            checkSource: parseCheckSource(dto.checkSource),
        })
    )

export const parseTransactionSafetyCheck = (
    input: unknown
): Result<unknown, TransactionSafetyCheck> =>
    oneOf(input, [
        parseTransactionSimulationCheck(input),
        parseTokenVerificationCheck(input),
        parseSmartContractBlacklistCheck(input),
        parseNftCollectionCheck(input),
        parseP2pReceiverTypeCheck(input),
        parseApprovalSpenderTypeCheck(input),
    ])
