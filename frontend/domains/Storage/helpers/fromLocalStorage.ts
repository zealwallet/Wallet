import { uuid } from '@zeal/toolkit/Crypto'
import { values } from '@zeal/toolkit/Object'
import {
    array,
    boolean,
    groupByType,
    match,
    nullable,
    nullableOf,
    number,
    object,
    oneOf,
    parseDate,
    record,
    recordStrict,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { parse as parseAccount } from '@zeal/domains/Account/helpers/parse'
import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import { parseIndexKey } from '@zeal/domains/Address/helpers/parseIndexKey'
import { parseBankTransferInfo } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseBankTransferInfo'
import { parseSubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseSubmittedWithdrawalTransaction'
import { parseBridgeSubmitted } from '@zeal/domains/Currency/domains/Bridge/parsers/parseBridgeSubmitted'
import { parseCryptoCurrency } from '@zeal/domains/Currency/helpers/parse'
import { parse as parseKeyStoreMap } from '@zeal/domains/KeyStore/parsers/parse'
import { PREDEFINED_AND_TEST_NETWORKS } from '@zeal/domains/Network/constants'
import { parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { Storage } from '@zeal/domains/Storage'
import { parseDAppConnectionState } from '@zeal/domains/Storage/domains/DAppConnectionState'
import { parseSubmitted } from '@zeal/domains/TransactionRequest/parsers/parseTransactionRequest'

export const parseLocalStorage = (
    local: unknown,
    portfolioMap: PortfolioMap
): Result<unknown, Storage> =>
    object(local).andThen((obj) =>
        shape({
            currencyHiddenMap: oneOf(obj, [
                object(obj.currencyHiddenMap).andThen((currencyHiddenMap) =>
                    recordStrict(currencyHiddenMap, {
                        keyParser: string,
                        valueParser: boolean,
                    })
                ),
                success({}),
            ]),
            currencyPinMap: oneOf(obj.currencyPinMap, [
                object(obj.currencyPinMap).andThen((currencyPinMap) =>
                    recordStrict(currencyPinMap, {
                        keyParser: string,
                        valueParser: boolean,
                    })
                ),
                success({}),
            ]),
            gasCurrencyPresetMap: oneOf(obj.gasCurrencyPresetMap, [
                object(obj.gasCurrencyPresetMap).andThen(
                    (gasCurrencyPresetMap) =>
                        recordStrict(gasCurrencyPresetMap, {
                            keyParser: parseNetworkHexId,
                            valueParser: string,
                        })
                ),
                success({}),
            ]),
            isOnboardingStorySeen: oneOf(obj.isOnboardingStorySeen, [
                boolean(obj.isOnboardingStorySeen),
                success(false),
            ]),
            feePresetMap: oneOf(obj.feePresetMap, [
                object(obj.feePresetMap).andThen((obj) =>
                    recordStrict(obj, {
                        keyParser: parseNetworkHexId,
                        valueParser: (preset) =>
                            object(preset).andThen((presetObj) =>
                                oneOf(presetObj, [
                                    shape({
                                        type: match(
                                            presetObj.type,
                                            'Slow' as const
                                        ),
                                    }),
                                    shape({
                                        type: match(
                                            presetObj.type,
                                            'Normal' as const
                                        ),
                                    }),
                                    shape({
                                        type: match(
                                            presetObj.type,
                                            'Fast' as const
                                        ),
                                    }),
                                ])
                            ),
                    })
                ),
                success({}),
            ]),
            customNetworkMap: oneOf(obj.customNetworkMap, [
                object(obj.customNetworkMap).andThen((obj) =>
                    recordStrict(obj, {
                        keyParser: string,
                        valueParser: (customNetwork) =>
                            object(customNetwork).andThen((customNetwork) =>
                                shape({
                                    type: success('custom' as const),
                                    name: string(customNetwork.name),
                                    nativeCurrency: object(
                                        customNetwork.nativeCurrency
                                    ).andThen(parseCryptoCurrency),
                                    hexChainId: parseNetworkHexId(
                                        customNetwork.hexChainId
                                    ),
                                    blockExplorerUrl: nullableOf(
                                        customNetwork.blockExplorerUrl,
                                        string
                                    ),
                                    defaultRpcUrl: oneOf(customNetwork, [
                                        string(customNetwork.defaultRpcUrl),
                                        string(customNetwork.rpcUrl),
                                    ]),
                                    rpcUrl: string(customNetwork.rpcUrl),
                                    isSimulationSupported: success(
                                        false as const
                                    ),
                                    isZealRPCSupported: success(false as const),
                                    isSafeSupported: success(false as const),
                                    trxType: oneOf(customNetwork.trxType, [
                                        match(
                                            customNetwork.trxType,
                                            'legacy' as const
                                        ),
                                        match(
                                            customNetwork.trxType,
                                            'eip1559' as const
                                        ),
                                    ]),
                                })
                            ),
                    })
                ),
                success({}),
            ]),
            networkRPCMap: oneOf(obj.networkRPCMap, [
                object(obj.networkRPCMap).andThen((obj) =>
                    recordStrict(obj, {
                        keyParser: string,
                        valueParser: (networkRPC) =>
                            object(networkRPC).andThen((networkRPC) =>
                                shape({
                                    current: object(networkRPC.current).andThen(
                                        (current) =>
                                            oneOf(current.type, [
                                                shape({
                                                    type: match(
                                                        current.type,
                                                        'default' as const
                                                    ),
                                                }),
                                                shape({
                                                    type: match(
                                                        current.type,
                                                        'custom' as const
                                                    ),
                                                    url: string(current.url),
                                                }),
                                            ])
                                    ),

                                    available: array(
                                        networkRPC.available
                                    ).andThen((arr) => {
                                        const [, parsed] = groupByType(
                                            arr.map(string)
                                        )
                                        return success(parsed)
                                    }),
                                })
                            ),
                    })
                ),
                success({}),
            ]),
            selectedAddress: nullableOf(obj.selectedAddress, parseAddress),
            fetchedAt: parseDate(obj.fetchedAt),
            accounts: object(obj.accounts)
                .andThen(parseIndexKey)
                .andThen((accounts) => record(accounts, parseAccount)),
            portfolios: success(portfolioMap),

            keystoreMap: oneOf(obj.keystoreMap, [
                parseKeyStoreMap(obj.keystoreMap),
                success({}),
            ]),
            encryptedPassword: string(obj.encryptedPassword),
            customCurrencies: oneOf(obj.customCurrencies, [
                object(obj.customCurrencies)
                    .andThen((curriencies) =>
                        recordStrict(curriencies, {
                            keyParser: string,
                            valueParser: (val) =>
                                object(val).andThen(parseCryptoCurrency),
                        })
                    )
                    .map((customCurrencies) =>
                        values(customCurrencies).reduce((hash, currency) => {
                            const network = PREDEFINED_AND_TEST_NETWORKS.find(
                                (net) =>
                                    net.hexChainId ===
                                    currency.networkHexChainId
                            )

                            const newCurrency = {
                                ...currency,
                                id: network
                                    ? [
                                          network.name,
                                          currency.address.toLocaleLowerCase(),
                                      ].join('|')
                                    : [
                                          currency.networkHexChainId,
                                          currency.address.toLocaleLowerCase(),
                                      ].join('|'),
                            }

                            hash[newCurrency.id] = newCurrency

                            return hash
                        }, {} as typeof customCurrencies)
                    ),
                success({}),
            ]),
            dApps: oneOf(obj.dApps, [
                object(obj.dApps).andThen((dApps) =>
                    record(dApps, parseDAppConnectionState)
                ),
                success({}),
            ]),
            transactionRequests: oneOf(obj.transactionRequests, [
                object(obj.transactionRequests)
                    .andThen(parseIndexKey)
                    .andThen((transactionRequestsDto) =>
                        record(transactionRequestsDto, (arrDto) =>
                            array(arrDto).andThen((items) => {
                                const [, parsed] = groupByType(
                                    items.map(parseSubmitted)
                                )
                                return success(parsed)
                            })
                        )
                    ),
                success({}),
            ]),
            submitedBridges: oneOf(obj.submitedBridges, [
                object(obj.submitedBridges).andThen((dto) =>
                    recordStrict(dto, {
                        keyParser: parseAddress,
                        valueParser: (bribges: unknown) =>
                            array(bribges).andThen((arr) => {
                                const [, parsed] = groupByType(
                                    arr.map(parseBridgeSubmitted)
                                )
                                return success(parsed)
                            }),
                    })
                ),
                success({}),
            ]),
            submittedOffRampTransactions: oneOf(
                obj.submittedOffRampTransactions,
                [
                    array(obj.submittedOffRampTransactions).andThen((arr) => {
                        const [, parsed] = groupByType(
                            arr.map(parseSubmittedOfframpTransaction)
                        )
                        return success(parsed)
                    }),
                    success([]),
                ]
            ),
            installationId: oneOf(obj.installationId, [
                string(obj.installationId),
                success(uuid()),
            ]),
            swapSlippagePercent: oneOf(obj.swapSlippagePercent, [
                number(obj.swapSlippagePercent),
                nullable(obj.swapSlippagePercent),
                success(null),
            ]),
            bankTransferInfo: parseBankTransferInfo(obj.bankTransferInfo),
            cardConfig: oneOf(obj.cardConfig, [
                object(obj.cardConfig).andThen((cardConfig) =>
                    shape({
                        type: match(
                            cardConfig.type,
                            'card_owner_address_is_selected' as const
                        ),
                        owner: parseAddress(cardConfig.owner),
                    })
                ),
                success({
                    type: 'card_owner_address_is_not_selected' as const,
                }),
            ]),
        })
    )
