import { fromString } from './helpers/fromString'

const parseStaticAddress = (address: string) =>
    fromString(address).getSuccessResultOrThrow(
        'Failed to parse static address'
    )

export const NULL_ADDRESS = fromString(
    '0x0000000000000000000000000000000000000000'
).getSuccessResultOrThrow('Failed to parse NULL address')

export const OP_STACK_GAS_PRICE_ORACLE_ADDRESS = fromString(
    '0x420000000000000000000000000000000000000F'
).getSuccessResultOrThrow('Failed to parse op stack gas price oracle address')

export const ARBITRUM_NODE_INTERFACE_ADDRESS = fromString(
    '0x00000000000000000000000000000000000000C8'
).getSuccessResultOrThrow('Failed to parse arbitrum node interface address')

// 4337 safe implementation addresses

export const PASSKEY_4337_SIGNER_FACTORY_PROXY_ADDRESS = parseStaticAddress(
    '0x3e8f42Ee8029f9Fd654B2eD2CBD0C6048A42b0Ae'
)

export const SAFE_4337_DEPLOYMENT_ROUTER_ADDRESS = parseStaticAddress(
    '0x40B0568E05B46340eeC557C750B93803A6A2febB'
)

export const SAFE_4337_PROXY_FACTORY_ADDRESS = parseStaticAddress(
    '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2'
)

export const SAFE_4337_MODULE_ADDRESS = parseStaticAddress(
    '0xa581c4A4DB7175302464fF3C06380BC3270b4037'
)

export const SAFE_4337_MODULE_ENTRYPOINT_ADDRESS = parseStaticAddress(
    '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'
)

export const SAFE_4337_MASTER_COPY_ADDRESS = parseStaticAddress(
    '0x29fcB43b46531BcA003ddC8FCB67FFE91900C762'
)

export const MULTI_SEND_CALL_ONLY_ADDRESS = fromString(
    '0x9641d764fc13c8B624c04430C7356C1C7C8102e2'
).getSuccessResultOrThrow('Failed to parse multisend call only address')
