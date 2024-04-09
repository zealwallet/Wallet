import {
    failure,
    match,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { PasskeyOperationCancelled } from '@zeal/domains/Error'

const parseWebPasskeyOperationCancelled = (
    input: unknown
): Result<unknown, unknown> =>
    object(input).andThen((obj) =>
        shape({
            name: match('NotAllowedError', obj.name),
            message: string(obj.message).andThen((msg) =>
                msg.match('webauthn')
                    ? success(msg)
                    : failure({
                          type: 'message_does_not_match_regexp',
                          msg,
                      })
            ),
        })
    )

const parseMobilePasskeyOperationCancelled = (
    input: unknown
): Result<unknown, unknown> =>
    object(input).andThen((obj) =>
        shape({
            code: string(obj.code).andThen((code) =>
                oneOf(code, [
                    match('PasskeyCreationError', code),
                    match('PasskeyAuthError', code),
                ])
            ),
            message: string(obj.message).andThen((msg) =>
                match('User cancelled passkey auth request', msg)
            ),
        })
    )

export const parsePasskeyOperationCancelled = (
    input: unknown
): Result<unknown, PasskeyOperationCancelled> =>
    oneOf(input, [
        parseWebPasskeyOperationCancelled(input),
        parseMobilePasskeyOperationCancelled(input),
    ]).map(() => ({ type: 'passkey_operation_cancelled' }))
