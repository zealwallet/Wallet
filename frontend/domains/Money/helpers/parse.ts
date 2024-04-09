import { components } from '@zeal/api/portfolio'

import {
    bigint,
    object,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import {
    parseCryptoCurrency,
    parseFiatCurrency,
} from '@zeal/domains/Currency/helpers/parse'
import { CryptoMoney, FiatMoney } from '@zeal/domains/Money'

type MoneyDto = Omit<components['schemas']['Money'], 'amount'> & {
    amount: bigint
}

// TODO @resetko-zeal this should not be exported when Money migrated to Money2
export const parse = (input: unknown): Result<unknown, MoneyDto> =>
    object(input).andThen((obj) =>
        shape({
            amount: bigint(obj.amount),
            currencyId: string(obj.currencyId),
        })
    )

export const parseFiatMoney = (
    input: unknown,
    knownCurrencies: unknown
): Result<unknown, FiatMoney> =>
    parse(input).andThen((moneyDto) =>
        shape({
            amount: success(moneyDto.amount),
            currency: object(knownCurrencies)
                .andThen((knownCurrenciesObj) =>
                    object(knownCurrenciesObj[moneyDto.currencyId])
                )
                .andThen(parseFiatCurrency),
        })
    )

export const parseCryptoMoney = (
    input: unknown,
    knownCurrencies: unknown
): Result<unknown, CryptoMoney> =>
    parse(input).andThen((moneyDto) =>
        shape({
            amount: success(moneyDto.amount),
            currency: object(knownCurrencies)
                .andThen((knownCurrenciesObj) =>
                    object(knownCurrenciesObj[moneyDto.currencyId])
                )
                .andThen(parseCryptoCurrency),
        })
    )
