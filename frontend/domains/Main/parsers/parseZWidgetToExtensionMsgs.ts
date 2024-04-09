import { match, object, Result, shape } from '@zeal/toolkit/Result'

import { CurrentZWidgetConnectionStateAndNetwork } from '@zeal/domains/Main'
import { parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'
import { parseDAppConnectionState } from '@zeal/domains/Storage/domains/DAppConnectionState'

export const parseCurrentZWidgetConnectionStateAndNetwork = (
    input: unknown
): Result<unknown, CurrentZWidgetConnectionStateAndNetwork> =>
    object(input).andThen((obj) =>
        shape({
            type: match(
                obj.type,
                'current_zwidget_connection_state_and_network'
            ),
            state: parseDAppConnectionState(obj.state),
            networkHexId: parseNetworkHexId(obj.networkHexId),
        })
    )
