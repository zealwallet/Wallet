import { components } from '@zeal/api/portfolio'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { SignMessageSafetyCheck } from '@zeal/domains/SafetyCheck'
import { SmartContract } from '@zeal/domains/SmartContract'
import { ApprovalAmount } from '@zeal/domains/Transactions'

type PermitSignMessage = {
    type: 'PermitSignMessage'
    allowance: PermitAllowance
    approveTo: SmartContract
}
type Permit2SignMessage = {
    type: 'Permit2SignMessage'
    allowances: PermitAllowance[]
    approveTo: SmartContract
}

type DaiPermitSignMessage = {
    type: 'DaiPermitSignMessage'
    allowance: PermitAllowance
    approveTo: SmartContract
}

type UnknownSignMessage = components['schemas']['UnknownSignMessage']

export type SimulatedSignMessage =
    | PermitSignMessage
    | DaiPermitSignMessage
    | Permit2SignMessage
    | UnknownSignMessage

export type SignMessageSimulationResponse = {
    checks: SignMessageSafetyCheck[]
    message: SimulatedSignMessage
    currencies: KnownCurrencies
}

export type PermitAllowance = Omit<
    components['schemas']['PermitAllowance'],
    'amount' | 'infiniteExpirationValue' | 'unlimitedAmountValue'
> & {
    amount: ApprovalAmount
    unlimitedAmountValue: bigint
    infiniteExpirationValue: bigint
}

export type PermitExpiration = components['schemas']['Expiration']

export type SignMessageSimulationResult =
    | { type: 'not_supported' }
    | { type: 'failed' }
    | {
          type: 'simulated'
          simulationResponse: SignMessageSimulationResponse
      }
