import { useLayoutEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { ZealSplashScreenLogo } from '@zeal/uikit/Icon/ZealSplashScreenLogo'
import { Screen } from '@zeal/uikit/Screen'

import { notReachable, useLiveRef } from '@zeal/toolkit'

import { Mode } from '@zeal/domains/Main'

type Props = {
    mode: Mode
    onGetStartedClicked: () => void
}

export const GetStarted = ({ onGetStartedClicked, mode }: Props) => {
    const onGetStartedClickedLive = useLiveRef(onGetStartedClicked)
    useLayoutEffect(() => {
        switch (mode) {
            case 'fullscreen':
                onGetStartedClickedLive.current()
                break
            case 'popup':
                break
            /* istanbul ignore next */
            default:
                return notReachable(mode)
        }
    }, [mode, onGetStartedClickedLive])

    return (
        <Screen padding="form" background="splashScreen" onNavigateBack={null}>
            <Column spacing={0} alignY="center" alignX="center" fill>
                <ZealSplashScreenLogo />
            </Column>

            <Actions>
                <Button
                    size="regular"
                    variant="secondary"
                    onClick={onGetStartedClicked}
                >
                    <FormattedMessage
                        id="actions.getStarted"
                        defaultMessage="Get Started"
                    />
                </Button>
            </Actions>
        </Screen>
    )
}
