import { ConnectionSafetyCheck } from './ConnectionSafetyCheck'
import { SignMessageSafetyCheck } from './SignMessageSafetyCheck'
import { TransactionSafetyCheck } from './TransactionSafetyCheck'

export type SafetyCheck =
    | ConnectionSafetyCheck
    | TransactionSafetyCheck
    | SignMessageSafetyCheck
