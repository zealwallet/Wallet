import { EmptyStringError, MaxStringLengthError } from '@zeal/toolkit/Result'

export type Label = string

export type FormError = {
    label?: MaxStringLengthError | { type: 'label_already_exist' }
    submit?: EmptyStringError | { type: 'label_already_exist' }
}
