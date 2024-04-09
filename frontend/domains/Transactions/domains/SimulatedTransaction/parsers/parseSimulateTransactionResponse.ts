import {
    array,
    combine,
    match,
    object,
    oneOf,
    record,
    Result,
    shape,
} from '@zeal/toolkit/Result'

import { parse as parseCurrency } from '@zeal/domains/Currency/helpers/parse'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { parseTransactionSafetyCheck } from '@zeal/domains/SafetyCheck/parsers/parseTransactionSafetyCheck'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'

import { parseSimulatedTransaction } from './parseSimulatedTransaction'

import { SimulationResult } from '../api/fetchSimulation'

const parseSafetyChecks = (
    input: unknown
): Result<unknown, TransactionSafetyCheck[]> =>
    array(input).andThen((checks) =>
        combine(checks.map(parseTransactionSafetyCheck))
    )

export const parseSimulationResult = (
    input: unknown
): Result<unknown, SimulationResult> =>
    object(input).andThen((dto) =>
        oneOf(dto, [
            shape({ type: match(dto.type, 'failed' as const) }),
            shape({ type: match(dto.type, 'not_supported' as const) }),
            shape({
                type: match(dto.type, 'simulated' as const),
                simulation: parseSimulateTransactionResponse(dto.simulation),
            }),
        ])
    )

export const parseSimulateTransactionResponse = (
    input: unknown
): Result<unknown, SimulateTransactionResponse> =>
    object(input).andThen((dto) =>
        shape({
            transaction: parseSimulatedTransaction(
                dto.transaction,
                dto.currencies
            ),
            currencies: object(dto.currencies).andThen((curriencies) =>
                record(curriencies, parseCurrency)
            ),
            checks: parseSafetyChecks(dto.checks),
        })
    )
