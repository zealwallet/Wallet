import { get } from '@zeal/api/gnosisApi'

import { notReachable } from '@zeal/toolkit'
import { parse as parseJSON } from '@zeal/toolkit/JSON'
import {
    array,
    failure,
    match,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import { FiatCurrency, FiatCurrencyCode } from '@zeal/domains/Currency'
import { FIAT_CURRENCIES } from '@zeal/domains/Currency/constants'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'

import { fetchBalance } from './fetchBalance'
import { fetchCardDetails } from './fetchCardDetails'
import { fetchTransactions } from './fetchTransactions'

import { GnosisPayAccountState, GnosisPayLoginInfo } from '..'

type OnboardedProfileRaw = {
    type: 'onboarded'
    SafeAccount: {
        address: Address
        fiatCurrency: FiatCurrency
    }
    cards: { id: string }

    hasSignedUp: true
}

type NoSignupProfileRaw = {
    type: 'no_signup'
    hasSignedUp: false
}

type SignupNoKYCProfileRaw = {
    type: 'signup_no_kyc'
    hasSignedUp: true
    kycProviders: readonly []
}

type KYCSubmittedProfileRaw = {
    type: 'kyc_submitted'
    hasSignedUp: true
    kycProviders: {
        id: string
        active: true
        approved: false
    }
}

type KYCApprovedProfileRaw = {
    type: 'kyc_approved'
    hasSignedUp: true
    kycProviders: {
        id: string
        active: true
        approved: true
    }

    cardOrders: readonly [] | { id: string; status: 'PENDINGTRANSACTION' }
}

type CardReadyToBeShippedProfileRaw = {
    type: 'card_ready_to_be_shipped'
    hasSignedUp: true
    kycProviders: {
        id: string
        active: true
        approved: true
    }

    cardOrders: { id: string; status: 'READY' }
}

type CardShippedProfileRaw = {
    type: 'card_shipped'
    hasSignedUp: true
    kycProviders: {
        id: string
        active: true
        approved: true
    }

    cardOrders: { id: string; status: 'CARDCREATED' }
}

type GnosisTokenSymbols = 'EURe' | 'GBPe'

const tokenMapping: Record<GnosisTokenSymbols, FiatCurrencyCode> = {
    EURe: 'EUR',
    GBPe: 'GBP',
}

const parseOnboardedProfileRaw = (
    input: unknown
): Result<unknown, OnboardedProfileRaw> =>
    object(input).andThen((obj) =>
        shape({
            type: success('onboarded' as const),
            hasSignedUp: match(obj.hasSignedUp, true),
            SafeAccount: array(obj.SafeAccount)
                .map(([first]) => first)
                .andThen(object)
                .andThen((safeObj) =>
                    shape({
                        address: string(safeObj.address).andThen(parseAddress),
                        fiatCurrency: string(safeObj.tokenSymbol).andThen(
                            (symbol) => {
                                const matchingCurrencyCode =
                                    tokenMapping[symbol as GnosisTokenSymbols]

                                if (!matchingCurrencyCode) {
                                    return failure({
                                        type: 'unknown_token_symbol',
                                        symbol,
                                    })
                                }

                                const matchingCurrency =
                                    FIAT_CURRENCIES[matchingCurrencyCode]

                                if (!matchingCurrency) {
                                    return failure({
                                        type: 'unknown_token_symbol',
                                        symbol,
                                    })
                                }

                                return success(matchingCurrency)
                            }
                        ),
                    })
                ),
            cards: array(obj.cards)
                .map(([first]) => first)
                .andThen(object)
                .andThen((cardObj) =>
                    shape({
                        id: string(cardObj.id),
                    })
                ),
        })
    )

const parseNoSignupProfileRaw = (
    input: unknown
): Result<unknown, NoSignupProfileRaw> =>
    object(input).andThen((obj) =>
        shape({
            type: success('no_signup' as const),
            hasSignedUp: match(obj.hasSignedUp, false),
        })
    )

const parseSignupNoKYCProfileRaw = (
    input: unknown
): Result<unknown, SignupNoKYCProfileRaw> =>
    object(input).andThen((obj) =>
        shape({
            type: success('signup_no_kyc' as const),
            hasSignedUp: match(obj.hasSignedUp, true),
            kycProviders: array(obj.kycProviders)
                .andThen((arr) => match(arr.length, 0))
                .map(() => [] as const),
        })
    )

const parseKYCSubmittedProfileRaw = (
    input: unknown
): Result<unknown, KYCSubmittedProfileRaw> =>
    object(input).andThen((obj) =>
        shape({
            type: success('kyc_submitted' as const),
            hasSignedUp: match(obj.hasSignedUp, true),
            kycProviders: array(obj.kycProviders)
                .map(([first]) => first)
                .andThen(object)
                .andThen((kycProviderObj) =>
                    shape({
                        id: string(kycProviderObj.id),
                        active: match(kycProviderObj.active, true),
                        approved: match(kycProviderObj.approved, false),
                    })
                ),
        })
    )

const parseKYCApprovedProfileRaw = (
    input: unknown
): Result<unknown, KYCApprovedProfileRaw> =>
    object(input).andThen((obj) =>
        shape({
            type: success('kyc_approved' as const),
            hasSignedUp: match(obj.hasSignedUp, true),
            kycProviders: array(obj.kycProviders)
                .map(([first]) => first)
                .andThen(object)
                .andThen((kycProviderObj) =>
                    shape({
                        id: string(kycProviderObj.id),
                        active: match(kycProviderObj.active, true),
                        approved: match(kycProviderObj.approved, true),
                    })
                ),
            cardOrders: oneOf({}, [
                array(obj.cardOrders)
                    .andThen((arr) => match(arr.length, 0))
                    .map(() => [] as const),
                array(obj.cardOrders)
                    .map(([first]) => first)
                    .andThen(object)
                    .andThen((cardOrderObj) =>
                        shape({
                            id: string(cardOrderObj.id),
                            status: match(
                                cardOrderObj.status,
                                'PENDINGTRANSACTION'
                            ),
                        })
                    ),
            ]),
        })
    )

const parseCardShippedProfileRaw = (
    input: unknown
): Result<unknown, CardShippedProfileRaw> =>
    object(input).andThen((obj) =>
        shape({
            type: success('card_shipped' as const),
            hasSignedUp: match(obj.hasSignedUp, true),
            kycProviders: array(obj.kycProviders)
                .map(([first]) => first)
                .andThen(object)
                .andThen((kycProviderObj) =>
                    shape({
                        id: string(kycProviderObj.id),
                        active: match(kycProviderObj.active, true),
                        approved: match(kycProviderObj.approved, true),
                    })
                ),
            cardOrders: array(obj.cardOrders)
                .map(([first]) => first)
                .andThen(object)
                .andThen((cardOrderObj) =>
                    shape({
                        id: string(cardOrderObj.id),
                        status: match(cardOrderObj.status, 'CARDCREATED'),
                    })
                ),
        })
    )

const parseCardReadToBeShippedProfileRaw = (
    input: unknown
): Result<unknown, CardReadyToBeShippedProfileRaw> =>
    object(input).andThen((obj) =>
        shape({
            type: success('card_ready_to_be_shipped' as const),
            hasSignedUp: match(obj.hasSignedUp, true),
            kycProviders: array(obj.kycProviders)
                .map(([first]) => first)
                .andThen(object)
                .andThen((kycProviderObj) =>
                    shape({
                        id: string(kycProviderObj.id),
                        active: match(kycProviderObj.active, true),
                        approved: match(kycProviderObj.approved, true),
                    })
                ),
            cardOrders: array(obj.cardOrders)
                .map(([first]) => first)
                .andThen(object)
                .andThen((cardOrderObj) =>
                    shape({
                        id: string(cardOrderObj.id),
                        status: match(cardOrderObj.status, 'READY'),
                    })
                ),
        })
    )

type ProfileRaw =
    | OnboardedProfileRaw
    | NoSignupProfileRaw
    | SignupNoKYCProfileRaw
    | KYCSubmittedProfileRaw
    | KYCApprovedProfileRaw
    | CardShippedProfileRaw
    | CardReadyToBeShippedProfileRaw

// Map to not to forget to add parsers for new types
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const map: Record<ProfileRaw['type'], true> = {
    onboarded: true,
    no_signup: true,
    signup_no_kyc: true,
    kyc_submitted: true,
    kyc_approved: true,
    card_shipped: true,
    card_ready_to_be_shipped: true,
}

const parseProfileRaw = (input: unknown): Result<unknown, ProfileRaw> =>
    object(input).andThen((obj) =>
        oneOf({ id: obj.id }, [
            parseOnboardedProfileRaw(obj),
            parseNoSignupProfileRaw(obj),
            parseSignupNoKYCProfileRaw(obj),
            parseKYCSubmittedProfileRaw(obj),
            parseKYCApprovedProfileRaw(obj),
            parseCardShippedProfileRaw(obj),
            parseCardReadToBeShippedProfileRaw(obj),
        ])
    )

export const fetchGnosisPayProfileRaw = async ({
    gnosisPayLoginInfo,
}: {
    gnosisPayLoginInfo: GnosisPayLoginInfo
}): Promise<ProfileRaw> => {
    try {
        const response = await get('/me', {
            auth: { type: 'bearer_token', token: gnosisPayLoginInfo.token },
        })

        return string(response)
            .andThen(parseJSON)
            .andThen(parseProfileRaw)
            .getSuccessResultOrThrow('Failed to parse gnosis pay raw profile')
    } catch (error) {
        const parsedError = parseAppError(error)

        switch (parsedError.type) {
            case 'http_error': {
                switch (parsedError.status) {
                    case 401:
                        return {
                            type: 'no_signup',
                            hasSignedUp: false,
                        }

                    default:
                        throw error
                }
            }

            default:
                throw error
        }
    }
}

export const fetchGnosisPayAccountState = async ({
    gnosisPayLoginInfo,
}: {
    gnosisPayLoginInfo: GnosisPayLoginInfo
}): Promise<GnosisPayAccountState> => {
    const profileRaw = await fetchGnosisPayProfileRaw({ gnosisPayLoginInfo })

    switch (profileRaw.type) {
        case 'onboarded':
            const [transactions, balance, details] = await Promise.all([
                fetchTransactions({ gnosisPayLoginInfo }),
                fetchBalance({ gnosisPayLoginInfo }),
                fetchCardDetails({
                    gnosisPayLoginInfo,
                    cardId: profileRaw.cards.id,
                }),
            ])

            return {
                type: 'onboarded',
                card: {
                    balance: {
                        amount: balance,
                        currency: profileRaw.SafeAccount.fiatCurrency,
                    },
                    id: profileRaw.cards.id,
                    safeAddress: profileRaw.SafeAccount.address,
                    details,
                },
                gnosisPayLoginInfo,
                transactions,
            }

        case 'no_signup':
        case 'signup_no_kyc':
            return { type: 'not_onboarded', state: 'kyc_not_started' }

        case 'card_shipped':
            return { type: 'not_onboarded', state: 'card_shipped' }

        case 'kyc_submitted':
            return { type: 'not_onboarded', state: 'kyc_submitted' }

        case 'kyc_approved':
            return { type: 'not_onboarded', state: 'kyc_approved' }

        case 'card_ready_to_be_shipped':
            return { type: 'not_onboarded', state: 'card_ready_to_be_shipped' }

        default:
            return notReachable(profileRaw)
    }
}
