import * as Hexadecimal from '../Hexadecimal'
import { failure, Result } from '../Result'

const MINIMAL_PROXY_REGEXP =
    /^0x363d3d373d3d3d363d73([0-9a-z]{40})5af43d82803e903d91602b57fd5bf3$/i

export const parseMasterCopyAddress = (
    byteCode: Hexadecimal.Hexadecimal
): Result<
    | {
          type: 'contract_does_not_look_like_minimal_proxy'
          byteCode: Hexadecimal.Hexadecimal
      }
    | Hexadecimal.StringValueNotHexadecimal,
    Hexadecimal.Hexadecimal
> => {
    const [, masterCopy] = byteCode.match(MINIMAL_PROXY_REGEXP) || []

    return masterCopy
        ? Hexadecimal.parseFromString(`0x${masterCopy}`)
        : failure({
              type: 'contract_does_not_look_like_minimal_proxy',
              byteCode,
          } as const)
}
