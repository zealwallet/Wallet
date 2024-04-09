import { act, render as rtlRender, waitFor } from '@testing-library/react'

import { ProviderToZwidget } from '@zeal/domains/Main'
import { getManifest } from '@zeal/domains/Manifest/helpers/getManifest'

import { RootComponent } from 'src/entrypoints/wallet/RootComponent'

expect.extend({
    toReceiveMsg: (input, msg) => {
        expect(input).toHaveBeenCalledWith(
            expect.objectContaining(msg),
            expect.stringContaining('*')
        )
        return { pass: true, message: () => '' }
    },
})

const changeJsDomUrl = (url: string) => {
    const href = `${window.origin}${url}`
    window.history.replaceState(window.history.state, '', href)
}

export const renderPage = async (
    url:
        | '/page_entrypoint.html?type=add_account'
        | '/page_entrypoint.html?type=onboarding'
        | '/index.html?type=extension&mode=fullscreen'
        | '/index.html?type=extension&mode=popup'
        | `/index.html?type=setup_recovery_kit&address=${string}`
        | `/page_entrypoint.html?type=swap&fromAddress=${string}&fromCurrencyId=${string}`
        | `/page_entrypoint.html?type=swap&fromAddress=${string}`
        | `/page_entrypoint.html?type=bridge&fromAddress=${string}`
        | `/page_entrypoint.html?type=bridge&fromAddress=${string}&fromCurrencyId=${string}`
        | `/page_entrypoint.html?type=send_erc20_token&fromAddress=${string}&tokenCurrencyId=${string}`
        | `/page_entrypoint.html?type=send_erc20_token&fromAddress=${string}`
        | `/page_entrypoint.html?type=bank_transfer`
) => {
    changeJsDomUrl(url)
    return rtlRender(<RootComponent manifest={getManifest()} />)
}

export const renderZWidget = async ({
    dAppHost,
}: {
    dAppHost: string
}): Promise<{
    postMessage: jest.Mock
    toWidget: (msg: ProviderToZwidget) => Promise<void>
}> => {
    const parentWindowMock = {
        postMessage: jest.fn(),
        toWidget: async (msg: ProviderToZwidget) => {
            await act(async () => {
                window.dispatchEvent(
                    new MessageEvent('message', {
                        data: msg,
                    })
                )
            })
        },
    }
    jest.spyOn(window, 'parent', 'get').mockImplementation(
        () => parentWindowMock as any
    )

    changeJsDomUrl(`/index.html?type=zwidget&dAppUrl=${dAppHost}`)

    await act(async () => {
        rtlRender(<RootComponent manifest={getManifest()} />)
    })

    await waitFor(() => {
        expect(parentWindowMock.postMessage).toReceiveMsg({ type: 'ready' })
    })
    return parentWindowMock
}
