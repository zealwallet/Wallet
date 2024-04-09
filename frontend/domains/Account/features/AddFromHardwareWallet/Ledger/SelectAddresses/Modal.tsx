import React from 'react'

import { notReachable } from '@zeal/toolkit'

import {
    Msg as SelectHdPathModalMsg,
    SelectHdPathModal,
} from '../components/SelectHDPathModal'
import { HDPath } from '../helpers/generatePaths'

type Props = {
    hdPath: HDPath
    state: State
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' } | SelectHdPathModalMsg

export type State = { type: 'closed' } | { type: 'select_hd_path' }

export const Modal = ({ state, hdPath, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'select_hd_path':
            return <SelectHdPathModal hdPath={hdPath} onMsg={onMsg} />
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
