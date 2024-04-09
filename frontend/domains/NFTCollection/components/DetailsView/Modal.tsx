import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { Img } from '@zeal/uikit/Img'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'

import { PriceInfoPopup } from '../PriceInfoPopup'

type Props = {
    account: Account
    state: State
    onMsg: (msg: Msg) => void
}

export type State =
    | { type: 'closed' }
    | { type: 'pricing_modal' }
    | { type: 'confirm_account_profile_picture_change'; src: string }

export type Msg =
    | { type: 'close' }
    | { type: 'on_profile_change_confirm_click'; src: string; account: Account }

export const Modal = ({ state, onMsg, account }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'pricing_modal':
            return <PriceInfoPopup onMsg={onMsg} />
        case 'confirm_account_profile_picture_change':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Header
                        icon={() => <Img size="100%" src={state.src} />}
                        title={
                            <FormattedMessage
                                id="nft_collection.change_account_picture.title"
                                defaultMessage="Update Profile picture to NFT"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="nft_collection.change_account_picture.subtitle"
                                defaultMessage="Are you sure you want to update your profile picture?"
                            />
                        }
                    />
                    <Popup.Actions>
                        <Button
                            variant="secondary"
                            size="regular"
                            onClick={() => onMsg({ type: 'close' })}
                        >
                            <FormattedMessage
                                id="action.cancel"
                                defaultMessage="Cancel"
                            />
                        </Button>

                        <Button
                            variant="primary"
                            size="regular"
                            onClick={() =>
                                onMsg({
                                    type: 'on_profile_change_confirm_click',
                                    src: state.src,
                                    account,
                                })
                            }
                        >
                            <FormattedMessage
                                id="action.update"
                                defaultMessage="Update"
                            />
                        </Button>
                    </Popup.Actions>
                </Popup.Layout>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
