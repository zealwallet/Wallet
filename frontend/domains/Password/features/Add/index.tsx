import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { AddPassword } from './AddPassword'
import { AddPin } from './AddPin'

type Props = {
    installationId: string
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof AddPassword> | MsgOf<typeof AddPin>
export const Add = ({ installationId, onMsg }: Props) => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            return <AddPin installationId={installationId} onMsg={onMsg} />
        case 'web':
            return <AddPassword installationId={installationId} onMsg={onMsg} />
        /* istanbul ignore next */
        default:
            return notReachable(ZealPlatform.OS)
    }
}
