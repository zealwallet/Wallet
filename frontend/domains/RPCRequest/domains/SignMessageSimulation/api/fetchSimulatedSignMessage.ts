import { components } from '@zeal/api/portfolio'
import { post } from '@zeal/api/request'

import { notReachable } from '@zeal/toolkit'
import {
    array,
    bigint,
    combine,
    match,
    number,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { parseKnownCurrencies } from '@zeal/domains/Currency/helpers/parse'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { Network } from '@zeal/domains/Network'
import { SignMessageRequest } from '@zeal/domains/RPCRequest'
import {
    PermitAllowance,
    SignMessageSimulationResponse,
    SignMessageSimulationResult,
} from '@zeal/domains/RPCRequest/domains/SignMessageSimulation'
import { parseSmartContract } from '@zeal/domains/SmartContract/parsers/parseSmartContract'
import { parseApprovalAmount } from '@zeal/domains/Transactions/helpers/parseActivityTransaction'

const parsePermitAllowance = (
    input: unknown,
    knownCurrencies: unknown
): Result<unknown, PermitAllowance> =>
    object(input).andThen((obj) =>
        shape({
            amount: parseApprovalAmount(obj.amount, knownCurrencies),
            expiration: object(obj.expiration).andThen((expirationObj) =>
                oneOf(expirationObj, [
                    shape({
                        type: match(
                            expirationObj.type,
                            'FiniteExpiration' as const
                        ),
                        timestamp: number(expirationObj.timestamp),
                    }),
                    shape({
                        type: match(
                            expirationObj.type,
                            'InfiniteExpiration' as const
                        ),
                    }),
                ])
            ),
            unlimitedAmountValue: bigint(obj.unlimitedAmountValue),
            infiniteExpirationValue: bigint(obj.infiniteExpirationValue),
        })
    )

const parseSignMessageSimulationResponse = (
    input: components['schemas']['SimulateMessageSigningResponse']
): Result<unknown, SignMessageSimulationResponse> =>
    shape({
        currencies: parseKnownCurrencies(input.currencies),
        checks: success(input.checks),
        message: object(input.message).andThen((messageDto) =>
            oneOf(messageDto, [
                shape({
                    type: match(messageDto.type, 'UnknownSignMessage' as const),
                    rawMessage: string(messageDto.rawMessage),
                }),
                shape({
                    type: match(messageDto.type, 'PermitSignMessage' as const),
                    approveTo: parseSmartContract(messageDto.approveTo),
                    allowance: parsePermitAllowance(
                        messageDto.allowance,
                        input.currencies
                    ),
                }),
                shape({
                    type: match(
                        messageDto.type,
                        'DaiPermitSignMessage' as const
                    ),
                    approveTo: parseSmartContract(messageDto.approveTo),
                    allowance: parsePermitAllowance(
                        messageDto.allowance,
                        input.currencies
                    ),
                }),
                shape({
                    type: match(messageDto.type, 'Permit2SignMessage' as const),
                    approveTo: parseSmartContract(messageDto.approveTo),
                    allowances: array(messageDto.allowances).andThen((arr) =>
                        combine(
                            arr.map((allowance) =>
                                parsePermitAllowance(
                                    allowance,
                                    input.currencies
                                )
                            )
                        )
                    ),
                }),
            ])
        ),
    })

export const fetchSimulatedSignMessage = async ({
    network,
    request,
    dApp,
}: {
    request: SignMessageRequest
    network: Network
    dApp: DAppSiteInfo | null
}): Promise<SignMessageSimulationResult> => {
    switch (network.type) {
        case 'predefined':
        case 'testnet':
            return post('/wallet/rpc-sign-message/simulate/', {
                body: (() => {
                    switch (request.method) {
                        case 'personal_sign':
                        case 'eth_signTypedData':
                        case 'eth_signTypedData_v3':
                        case 'eth_signTypedData_v4':
                            return request
                        default:
                            return notReachable(request)
                    }
                })(),
                query: { network: network.name },
                requestSource: dApp?.hostname,
            })
                .then((response) =>
                    parseSignMessageSimulationResponse(
                        response
                    ).getSuccessResultOrThrow(
                        'failed to parse sign messagesimulation'
                    )
                )
                .then((response) => ({
                    type: 'simulated' as const,
                    simulationResponse: response,
                }))
                .catch((e) => {
                    captureError(e)
                    return { type: 'failed' }
                })

        case 'custom':
            return { type: 'not_supported' }

        default:
            return notReachable(network)
    }
}
