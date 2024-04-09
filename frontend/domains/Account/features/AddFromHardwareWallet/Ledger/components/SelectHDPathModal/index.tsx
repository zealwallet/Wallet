import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Group } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'

import { keys } from '@zeal/toolkit/Object'

import { PathItem } from './PathItem'

import { HDPath } from '../../helpers/generatePaths'

type Props = {
    hdPath: HDPath
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'hd_path_selected'; hdPath: HDPath }

const pathsHash: Record<HDPath, true> = {
    bip44: true,
    ledger_live: true,
    legacy: true,
    phantom: true,
}

const paths = keys(pathsHash)

export const SelectHdPathModal = ({ hdPath, onMsg }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                title={
                    <FormattedMessage
                        id="ledger.select.hd_path.title"
                        defaultMessage="Select HD Path"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="ledger.select.hd_path.subtitle"
                        defaultMessage="HD paths are the way by which hardware wallets sort their accounts. This similar to how an index sorts pages in a book."
                    />
                }
            />
            <Popup.Content>
                <Group variant="default">
                    {paths.map((path) => (
                        <PathItem
                            key={path}
                            hdPath={path}
                            selected={hdPath === path}
                            onClick={() =>
                                onMsg({
                                    type: 'hd_path_selected',
                                    hdPath: path,
                                })
                            }
                        />
                    ))}
                </Group>
            </Popup.Content>
        </Popup.Layout>
    )
}
