import {
    email,
    EmailStringError,
    EmptyStringError,
    nonEmptyString,
    required,
    RequiredError,
    Result,
    shape,
} from '@zeal/toolkit/Result'

import { Account } from '@zeal/domains/Account'
import { CountryISOCode } from '@zeal/domains/Country'
import { CreateUnblockUserParams } from '@zeal/domains/Currency/domains/BankTransfer/api/createUnblockUser'

export type EmptyForm = {
    firstName: string
    lastName: string
    email: string
    countryCode: CountryISOCode | null
}

export type FirstNameError = EmptyStringError
export type LastNameError = EmptyStringError
export type EmailError = EmailStringError
export type CountryError = RequiredError

type FormError = {
    firstName?: FirstNameError
    lastName?: LastNameError
    email?: EmailError
    countryCode?: CountryError

    submit?: FirstNameError | LastNameError | EmailError | CountryError
}

const validateFirstName = (form: EmptyForm): Result<EmptyStringError, string> =>
    nonEmptyString(form.firstName)

const validateLastName = (form: EmptyForm): Result<EmptyStringError, string> =>
    nonEmptyString(form.lastName)

const validateEmail = (form: EmptyForm): Result<EmailStringError, string> =>
    email(form.email)

const validateCountry = (
    form: EmptyForm
): Result<CountryError, CountryISOCode> => required(form.countryCode)

export const validateOnSubmit = (
    form: EmptyForm,
    account: Account
): Result<FormError, CreateUnblockUserParams> =>
    shape({
        firstName: validateFirstName(form),
        lastName: validateLastName(form),
        email: validateEmail(form),
        countryCode: validateCountry(form),

        submit: validateFirstName(form)
            .andThen(() => validateLastName(form))
            .andThen(() => validateEmail(form)),
    }).map((validForm) => ({
        targetAddress: account.address,
        countryCode: validForm.countryCode,
        email: validForm.email,
        firstName: validForm.firstName,
        lastName: validForm.lastName,
    }))

export const validateAsYouType = (
    form: EmptyForm
): Result<FormError, unknown> =>
    shape({
        submit: validateFirstName(form)
            .andThen(() => validateLastName(form))
            .andThen(() => nonEmptyString(form.email))
            .andThen(() => validateCountry(form)),
    })
