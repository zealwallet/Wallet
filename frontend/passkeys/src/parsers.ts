import { parse as parseJSON } from '@zeal/toolkit/JSON'
import {
    arrayBuffer,
    object,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'
import { base64Decode } from '@zeal/toolkit/String/base64'

import { PasskeyCreationResponse, PasskeySignatureResponse } from './index'

export const parsePasskeyCreationResponse = (
    input: unknown
): Result<unknown, PasskeyCreationResponse> =>
    object(input).andThen((obj) =>
        shape({
            credentialId: string(obj.credentialId).map(base64Decode),
            attestationObject: string(obj.attestationObject).map(base64Decode),
            clientDataJSON: string(obj.clientDataJSON).map(base64Decode),
        })
    )

export const parsePasskeySignatureResponse = (
    input: unknown
): Result<unknown, PasskeySignatureResponse> =>
    object(input).andThen((obj) =>
        shape({
            credentialId: string(obj.credentialId).map(base64Decode),
            userId: string(obj.userId).map(base64Decode),
            clientDataJSON: string(obj.clientDataJSON).map(base64Decode),
            signature: string(obj.signature).map(base64Decode),
            authenticatorData: string(obj.authenticatorData).map(base64Decode),
        })
    )

export const parseAndroidCreationResponse = (
    input: unknown
): Result<unknown, PasskeyCreationResponse> =>
    string(input)
        .andThen(parseJSON)
        .andThen(object)
        .andThen((obj) =>
            shape({
                credentialId: string(obj.rawId),
                attestationObject: object(obj.response).map(
                    (resObj) => resObj.attestationObject
                ),
                clientDataJSON: object(obj.response).map(
                    (resObj) => resObj.clientDataJSON
                ),
            })
        )
        .andThen(parsePasskeyCreationResponse)

export const parseAndroidSignatureResponse = (
    input: unknown
): Result<unknown, PasskeySignatureResponse> =>
    string(input)
        .andThen(parseJSON)
        .andThen(object)
        .andThen((obj) =>
            shape({
                credentialId: string(obj.rawId),
                userId: object(obj.response).map((resObj) => resObj.userHandle),
                signature: object(obj.response).map(
                    (resObj) => resObj.signature
                ),
                clientDataJSON: object(obj.response).map(
                    (resObj) => resObj.clientDataJSON
                ),
                authenticatorData: object(obj.response).map(
                    (resObj) => resObj.authenticatorData
                ),
            })
        )
        .andThen(parsePasskeySignatureResponse)

export const parseWebCreationResponse = (
    input: unknown
): Result<unknown, PasskeyCreationResponse> =>
    object(input).andThen((obj) =>
        shape({
            credentialId: arrayBuffer(obj.rawId).map(
                (id) => new Uint8Array(id)
            ),
            response: object(obj.response).andThen((res) =>
                shape({
                    attestationObject: arrayBuffer(res.attestationObject).map(
                        (a) => new Uint8Array(a)
                    ),
                    clientDataJSON: arrayBuffer(res.clientDataJSON).map(
                        (c) => new Uint8Array(c)
                    ),
                })
            ),
        }).map((result) => ({
            credentialId: result.credentialId,
            attestationObject: result.response.attestationObject,
            clientDataJSON: result.response.clientDataJSON,
        }))
    )

export const parseWebSignatureResponse = (
    input: unknown
): Result<unknown, PasskeySignatureResponse> =>
    object(input).andThen((obj) =>
        shape({
            credentialId: arrayBuffer(obj.rawId).map(
                (id) => new Uint8Array(id)
            ),
            response: object(obj.response).andThen((res) =>
                shape({
                    userId: arrayBuffer(res.userHandle).map(
                        (a) => new Uint8Array(a)
                    ),
                    clientDataJSON: arrayBuffer(res.clientDataJSON).map(
                        (c) => new Uint8Array(c)
                    ),
                    signature: arrayBuffer(res.signature).map(
                        (c) => new Uint8Array(c)
                    ),
                    authenticatorData: arrayBuffer(res.authenticatorData).map(
                        (c) => new Uint8Array(c)
                    ),
                })
            ),
        }).map((result) => ({
            credentialId: result.credentialId,
            userId: result.response.userId,
            signature: result.response.signature,
            clientDataJSON: result.response.clientDataJSON,
            authenticatorData: result.response.authenticatorData,
        }))
    )
