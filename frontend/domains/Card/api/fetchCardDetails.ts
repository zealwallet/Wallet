import { get } from '@zeal/api/gnosisApi'

import {
    decryptAESGCM,
    encryptRSAOAEP,
    getRandomIntArray,
} from '@zeal/toolkit/Crypto'
import { parse as parseJSON } from '@zeal/toolkit/JSON'
import { object, shape, string } from '@zeal/toolkit/Result'

import { CardDetails, GnosisPayLoginInfo } from '..'

const GNOSIS_PUBLIC_KEY = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCPGTymqjTrzIZOO9XwGPepvAYMNCCMIkNhSkSLzWF51LwSatILicxmUTuLkAra55Pttqmm92S+LCRwtmRjAOyb8FD1P0O7K3lvx716xEauf2BqjBW+9/tF0EI0V503qHCI9qcaQerlnckehkdQkPp98pzDzf5RT/X2VxA1tdz+NwIDAQAB`

const PIN_REGEXP = /24(\d{4})FFFFFFFFFF/i

type Params = {
    cardId: string
    gnosisPayLoginInfo: GnosisPayLoginInfo
}

export const fetchCardPin = async ({
    cardId,
    gnosisPayLoginInfo,
}: Params): Promise<string | null> => {
    const fetchKey = Buffer.from(
        getRandomIntArray(new Uint8Array(32))
    ).toString('base64')

    const encryptedKey = await encryptRSAOAEP({
        dataBase64: fetchKey,
        publicKeyBase64: GNOSIS_PUBLIC_KEY,
    })

    const encryptedCardDetailsResponse = await get(`/cards/${cardId}/pin`, {
        query: {
            encryptedKey,
        },
        auth: { type: 'bearer_token', token: gnosisPayLoginInfo.token },
    })

    const encryptedCardDetails = string(encryptedCardDetailsResponse)
        .andThen(parseJSON)
        .andThen(object)
        .andThen((obj) =>
            shape({
                encryptedPin: string(obj.encryptedPin),
                iv: string(obj.iv),
            })
        )
        .getSuccessResultOrThrow('Failed to parse encrypted card details')

    try {
        const rawPinString = await decryptAESGCM({
            cipherBase64: encryptedCardDetails.encryptedPin,
            keyBase64: fetchKey,
            ivBase64: encryptedCardDetails.iv,
        })

        return rawPinString.match(PIN_REGEXP)?.[1] || null
    } catch {
        // TODO @resetko-zeal Should we report this, or it's scary?
        return null
    }
}

const fetchRawDetails = async ({
    cardId,
    gnosisPayLoginInfo,
}: Params): Promise<{
    cvv: string
    pan: string
    expiryYear: string
    expiryMonth: string
} | null> => {
    const fetchKey = Buffer.from(
        getRandomIntArray(new Uint8Array(32))
    ).toString('base64')

    const encryptedKey = await encryptRSAOAEP({
        dataBase64: fetchKey,
        publicKeyBase64: GNOSIS_PUBLIC_KEY,
    })

    const encryptedCardDetailsResponse = await get(`/cards/${cardId}/details`, {
        query: {
            encryptedKey,
        },
        auth: { type: 'bearer_token', token: gnosisPayLoginInfo.token },
    })

    const encryptedCardDetails = string(encryptedCardDetailsResponse)
        .andThen(parseJSON)
        .andThen(object)
        .andThen((obj) =>
            shape({
                cvv: string(obj.cvv),
                pan: string(obj.secret),
                iv: string(obj.iv),
                exp_date: string(obj.exp_date),
            })
        )
        .getSuccessResultOrThrow('Failed to parse encrypted card details')

    try {
        return {
            cvv: await decryptAESGCM({
                cipherBase64: encryptedCardDetails.cvv,
                keyBase64: fetchKey,
                ivBase64: encryptedCardDetails.iv,
            }),
            pan: await decryptAESGCM({
                cipherBase64: encryptedCardDetails.pan,
                keyBase64: fetchKey,
                ivBase64: encryptedCardDetails.iv,
            }),
            expiryYear: encryptedCardDetails.exp_date.slice(0, 2),
            expiryMonth: encryptedCardDetails.exp_date.slice(2),
        }
    } catch {
        // TODO @resetko-zeal Should we report this, or it's scary?
        return null
    }
}

export const fetchCardDetails = async (
    params: Params
): Promise<CardDetails | null> => {
    const [rawDetails, pin] = await Promise.all([
        fetchRawDetails(params),
        fetchCardPin(params),
    ])

    return rawDetails ? { ...rawDetails, pin } : null
}
