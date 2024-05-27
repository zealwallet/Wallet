import {
    failure,
    object,
    oneOf,
    Result,
    string,
    success,
} from '@zeal/toolkit/Result'

import { BiometricPromptCancelled } from '@zeal/domains/Error'

const parseIosBiometricPromptCancelled = (
    input: string
): Result<unknown, string> =>
    (input.match('getValueWithKeyAsync') ||
        input.match('etValueWithKeyAsync')) &&
    input.match('User canceled the operation')
        ? success(input)
        : failure({ type: 'message_does_not_match_regexp', msg: input })

const parseAndroidBiometricPromptCancelled = (
    input: string
): Result<unknown, string> =>
    (input.match('ExpoSecureStore.getValueWithKeyAsync') ||
        input.match('ExpoSecureStore.setValueWithKeyAsync')) &&
    input.match('User canceled the authentication')
        ? success(input)
        : failure({ type: 'message_does_not_match_regexp', msg: input })

export const parseBiometricPromptCancelledError = (
    input: unknown
): Result<unknown, BiometricPromptCancelled> =>
    object(input)
        .andThen((obj) =>
            string(obj.message).andThen((msg) =>
                oneOf(msg, [
                    parseIosBiometricPromptCancelled(msg),
                    parseAndroidBiometricPromptCancelled(msg),
                ])
            )
        )
        .map(() => ({ type: 'biometric_prompt_cancelled' } as const))
