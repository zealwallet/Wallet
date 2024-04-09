import {
    failure,
    maxStringLength,
    nonEmptyString,
    Result,
    shape,
    success,
} from '@zeal/toolkit/Result'

import { Account } from '@zeal/domains/Account'
import { FormError, Label } from '@zeal/domains/Account/domains/Label'

import { MAX_LENGTH } from '../constants'

export type Form = { label: Label }

const accountLabelAlreadyExist = (
    form: Form,
    accounts: Account[]
): Result<{ type: 'label_already_exist' }, string> => {
    const acc = accounts.find(({ label }) => label === form.label)
    return acc ? failure({ type: 'label_already_exist' }) : success(form.label)
}

export const validateAsYouType = (form: Form): Result<FormError, unknown> => {
    return shape({
        label: maxStringLength(MAX_LENGTH, form.label),
        submit: nonEmptyString(form.label),
    })
}

export const validateOnSubmit = (
    form: Form,
    accounts: Account[]
): Result<FormError, { label: string }> =>
    shape({
        label: maxStringLength(MAX_LENGTH, form.label).andThen(() =>
            accountLabelAlreadyExist(form, accounts)
        ),
        submit: nonEmptyString(form.label).andThen(() =>
            accountLabelAlreadyExist(form, accounts)
        ),
    })
