import { Hexadecimal } from '@zeal/toolkit/Hexadecimal'

export type MetaTransactionData = {
    to: Hexadecimal
    value: string
    data: Hexadecimal
    operation: OperationType
}

export enum OperationType {
    Call = 0,
    DelegateCall = 1,
}
