import { Account } from '@zeal/domains/Account'
import { NetworkHexId } from '@zeal/domains/Network'

export type ConnectionState =
    | {
          type: 'disconnected' | 'connecting' | 'reconnecting'
      }
    | { type: 'connected'; account: Account; networkHexId: NetworkHexId }
    | { type: 'connected_to_unsupported_network'; account: Account }
