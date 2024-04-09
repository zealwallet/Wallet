import {
    match,
    nullableOf,
    number,
    object,
    oneOf,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'

import { parse as parseAccount } from '@zeal/domains/Account/helpers/parse'
import { parseDAppSiteInfo } from '@zeal/domains/DApp/parsers/parseDAppSiteInfo'
import { parse as parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'
import {
    parseEthSendRawTransaction,
    parseEthSendTransaction,
} from '@zeal/domains/RPCRequest/parsers/parseRPCRequest'
import { parseSubmitedTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction/parsers/parseSubmitedTransaction'
import { parseEstimatedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction/parsers/parseEstimatedFee'
import { parseSimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/parsers/parseSimulateTransactionResponse'

import { Submited } from '../TransactionRequest'

export const parseSubmitted = (input: unknown): Result<unknown, Submited> =>
    object(input).andThen((obj) =>
        shape({
            state: match(obj.state, 'submited' as const),
            networkHexId: oneOf(obj, [
                parseNetworkHexId(obj.network),
                parseNetworkHexId(obj.networkHexId),
            ]),
            account: parseAccount(obj.account),
            dApp: nullableOf(obj.dApp, parseDAppSiteInfo),
            rpcRequest: object(obj.rpcRequest).andThen(parseEthSendTransaction),
            simulation: parseSimulationResult(obj.simulation),
            gasEstimate: string(obj.gasEstimate),
            selectedFee: parseEstimatedFee(obj.selectedFee),
            rawTransaction: object(obj.rawTransaction).andThen(
                parseEthSendRawTransaction
            ),
            submitedTransaction: parseSubmitedTransaction(
                obj.submitedTransaction
            ),
            selectedGas: string(obj.selectedGas),
            selectedNonce: number(obj.selectedNonce),
        })
    )
