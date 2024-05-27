import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
    connected,
    connectedPolygon,
    connectedToMetaMask,
    diconnected,
} from '@zeal/domains/Storage/api/fixtures/connectionState'
import { LS_KEY } from '@zeal/domains/Storage/constants'

import { cleanEnv, mockEnv, TestEnvironment } from 'src/tests/env'
import { runLottieListeners } from 'src/tests/mocks/lottie'
import { renderZWidget } from 'src/tests/utils/renderers'

let env: TestEnvironment

beforeEach(() => {
    env = mockEnv()
})

afterEach(() => {
    cleanEnv(env)
})

test('As a user I should see if dApp is trying to connect with my wallet, so I can decide if I want to connect', async () => {
    const dAppHost = 'dapp.example.com'

    const { postMessage, toWidget } = await renderZWidget({ dAppHost })

    await toWidget({
        type: 'rpc_request',
        request: {
            id: 0,
            method: 'eth_requestAccounts',
            params: [],
        },
    })

    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))

    expect(postMessage).toReceiveMsg({
        id: 0,
        response: {
            reason: { code: 4001, message: 'User Rejected Request' },
            type: 'Failure',
        },
    })

    postMessage.mockReset()
    await toWidget({
        type: 'rpc_request',
        request: {
            id: 1,
            method: 'eth_requestAccounts',
            params: [],
        },
    })

    await userEvent.click(
        await screen.findByRole('button', { name: 'Connect Zeal' })
    )
    await runLottieListeners()

    expect(postMessage).not.toHaveBeenCalledWith({
        chainId: '0x89',
        type: 'network_change',
    })

    expect(postMessage).not.toHaveBeenCalledWith({
        account: '0x83f1caadabeec2945b73087f803d404f054cc2b7',
        type: 'account_change',
    })

    expect(postMessage).not.toHaveBeenCalledWith({
        chainId: '0x89',
        account: '0x83f1caadabeec2945b73087f803d404f054cc2b7',
        type: 'init_provider',
    })
    expect(postMessage).toReceiveMsg({
        id: 1,
        response: {
            data: ['0x83f1caadabeec2945b73087f803d404f054cc2b7'],
            type: 'Success',
        },
        type: 'rpc_response',
    })
})

test('As a user I should see ZWidget onboarding screen after dApp trying to interact with wallet, so I can see how to connect', async () => {
    const dAppHost = 'dapp.example.com'

    const { toWidget } = await renderZWidget({ dAppHost })

    await toWidget({
        type: 'rpc_request',
        request: { id: 0, method: 'eth_chainId', params: [] },
    })

    expect(
        await screen.findByText(`How to connect with Zeal?`)
    ).toBeInTheDocument()
})

test('As a user I should see Zeal is preventing dApp to make certain requests to wallet when in disconnected state, so I keep my addresses safe from dApp until I decide to connect', async () => {
    const dAppHost = 'dapp.example.com'

    const { toWidget, postMessage } = await renderZWidget({ dAppHost })

    await toWidget({
        type: 'rpc_request',
        request: { id: 0, method: 'eth_gasPrice', params: [] },
    })

    expect(postMessage).toReceiveMsg({
        type: 'rpc_response',
        id: 0,
        response: {
            reason: { code: 4100, message: 'Un authorized' },
            type: 'Failure',
        },
    })
})

test('As a user when connecting to dApp I should not see option to connect through MM if MM is not available, so that I dont have an unresponsive experience', async () => {
    const dAppHost = 'dapp.example.com'

    const { postMessage, toWidget } = await renderZWidget({ dAppHost })

    expect(postMessage).toReceiveMsg({
        type: 'ready',
        state: { type: 'not_interacted' },
    })

    await toWidget({
        type: 'rpc_request',
        request: {
            id: 0,
            method: 'eth_requestAccounts',
            params: [],
        },
    })

    expect(
        screen.queryByRole('button', { name: 'Change to MetaMask' })
    ).not.toBeInTheDocument()
})

test('As a user when connecting to dApp I should see option to connect through MM if its available, so I can keep using MM without uninstalling zeal', async () => {
    const dAppHost = 'dapp.example.com'

    const { postMessage, toWidget } = await renderZWidget({ dAppHost })

    expect(postMessage).toReceiveMsg({
        type: 'ready',
        state: { type: 'not_interacted' },
    })

    await toWidget({ type: 'meta_mask_provider_available' })

    await toWidget({
        type: 'rpc_request',
        request: {
            id: 0,
            method: 'eth_requestAccounts',
            params: [],
        },
    })

    postMessage.mockReset()

    await userEvent.click(
        await screen.findByRole('button', { name: 'Change to MetaMask' })
    )

    await runLottieListeners()

    expect(postMessage).toReceiveMsg({
        type: 'select_meta_mask_provider',
        request: {
            id: 0,
            jsonrpc: '2.0',
            method: 'eth_requestAccounts',
            params: [],
        },
    })
})

test('As a user when connected to dApp through MM I should see option to switch back to Zeal, so I can keep using MM without uninstalling zeal', async () => {
    env.chromeMocks.storages.local[LS_KEY] = JSON.stringify(connectedToMetaMask)

    const dAppHost = 'dapp.example.com'

    const { postMessage } = await renderZWidget({ dAppHost })

    expect(postMessage).toReceiveMsg({
        type: 'ready',
        state: { type: 'connected_to_meta_mask' },
    })

    await userEvent.click(
        await screen.findByRole('button', { name: 'Connected to MetaMask' })
    )

    await userEvent.click(
        await screen.findByRole('button', { name: 'Change to Zeal' })
    )

    postMessage.mockReset()

    await userEvent.click(await screen.findByText('Private Key 1'))

    expect(postMessage).toReceiveMsg({
        type: 'select_zeal_provider',
        chainId: '0x1',
        address: '0x26d0d88ffe184b1ba244d08fb2a0c695e65c8932',
    })
})

test(`As user should be disconnected in all tabs of specific dapp if I diconnected in one tab
also with this test we are sure that changes to storage are propagated in tests`, async () => {
    const dAppHost = 'dapp.example.com'

    const { toWidget } = await renderZWidget({ dAppHost })

    await toWidget({
        type: 'rpc_request',
        request: {
            id: 0,
            method: 'eth_requestAccounts',
            params: [],
        },
    })

    await userEvent.click(
        await screen.findByRole('button', { name: 'Connect Zeal' })
    )
    await runLottieListeners()

    await userEvent.click(await screen.findByRole('button', { name: 'Expand' }))
    await screen.findByText('Connected')

    act(() => {
        chrome.storage.local.set({
            [LS_KEY]: JSON.stringify(diconnected),
        })
    })

    expect(
        await screen.findByText('How to connect with Zeal?')
    ).toBeInTheDocument() // diconnected state
})

test(`As a user I should be able to change connected account from another tab of same dApp, so accounts selected in different tabs are not affected
As a user I should be able to change connected network from another tab of same dApp, so networks selected in different tabs are not affected 
As a user I should be able to change connected account from extension, so I can quickly switch between accounts`, async () => {
    chrome.storage.local.set({
        [LS_KEY]: JSON.stringify(diconnected),
    })
    const dAppHost = 'dapp.example.com'

    const { toWidget } = await renderZWidget({ dAppHost })

    await toWidget({
        type: 'rpc_request',
        request: {
            id: 0,
            method: 'eth_requestAccounts',
            params: [],
        },
    })

    await userEvent.click(
        await screen.findByRole('button', { name: 'Connect Zeal' })
    )
    await runLottieListeners()

    await userEvent.click(await screen.findByRole('button', { name: 'Expand' }))
    await screen.findByText('Connected')
    await screen.findByText('0x83f1...c2b7')
    await screen.findByText('Ethereum') // old network

    act(() => {
        chrome.storage.local.set({
            [LS_KEY]: JSON.stringify(connected),
        })
    })

    await screen.findByText('Connected')
    await screen.findByText('0x83f1...c2b7')

    act(() => {
        chrome.storage.local.set({
            [LS_KEY]: JSON.stringify(connectedPolygon),
        })
    })

    await screen.findByText('Connected')
    await screen.findByText('Ethereum') // old network

    act(() => {
        env.chromeMocks.runtimeOnMessageListeners.forEach((listner) => {
            listner(
                {
                    type: 'extension_to_zwidget_extension_address_change',
                    address: '0x26D0d88fFe184b1BA244D08Fb2a0c695e65c8932',
                },
                { id: chrome.runtime.id },
                jest.fn()
            )
        })
    })

    expect(await screen.findByText('0x26d0...8932')).toBeInTheDocument()
})

test('Switch to MM in another tab should switch all tabs to MM state', async () => {
    chrome.storage.local.set({
        [LS_KEY]: JSON.stringify(diconnected),
    })

    const dAppHost = 'dapp.example.com'

    const { toWidget } = await renderZWidget({ dAppHost })

    await toWidget({ type: 'meta_mask_provider_available' })

    act(() => {
        chrome.storage.local.set({
            [LS_KEY]: JSON.stringify(connectedToMetaMask),
        })
    })

    await userEvent.click(await screen.findByLabelText('Connected to MetaMask'))
    await screen.findByLabelText('Change to Zeal')

    act(() => {
        chrome.storage.local.set({
            [LS_KEY]: JSON.stringify(connected),
        })
    })
    await userEvent.click(await screen.findByLabelText('Expand'))

    // this is due to current probably buggy implementation;
    // in storage ATM we connected to 0x26.. account but becouse we first render in disconnect state here we get selected state from disconnect (we store it in memory for tab independence)
    expect(await screen.findByText('0x83f1...c2b7')).toBeInTheDocument()
})

test("As a user I should be connected to dApp after reload, so I don't have to connect every time I reload the page", async () => {
    chrome.storage.local.set({
        [LS_KEY]: JSON.stringify(connected),
    })

    const dAppHost = 'dapp.example.com'

    await renderZWidget({ dAppHost })

    await userEvent.click(await screen.findByLabelText('Expand'))
    expect(await screen.findByText('0x26d0...8932')).toBeInTheDocument()
})

test('As a user if I was previously connected to MM and now MM is not available, I should see widget in disconnected state, so I can connect through zeal if needed', async () => {
    chrome.storage.local.set({
        [LS_KEY]: JSON.stringify(connectedToMetaMask),
    })

    const dAppHost = 'dapp.example.com'
    const { toWidget } = await renderZWidget({ dAppHost })
    await toWidget({
        type: 'no_meta_mask_provider_during_init',
    })

    expect(
        await screen.findByText('How to connect with Zeal?')
    ).toBeInTheDocument()
})
test('As a user if I was previously connected to MM and now MM is available, I should see widget in connected state, so I can keep using MM without uninstalling zeal', async () => {
    chrome.storage.local.set({
        [LS_KEY]: JSON.stringify(connectedToMetaMask),
    })

    const dAppHost = 'dapp.example.com'
    const { toWidget } = await renderZWidget({ dAppHost })
    await toWidget({
        type: 'meta_mask_provider_available',
    })

    expect(
        await screen.findByRole('button', { name: 'Connected to MetaMask' })
    ).toBeInTheDocument()
})
