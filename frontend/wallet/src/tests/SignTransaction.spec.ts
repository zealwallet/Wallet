import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { dummySendTransaction } from '@zeal/domains/RPCRequest/api/fixtures/dummySendTransaction'
import { nftCollectionApproval } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fixtures/nftConnectionApproval'
import { singleNftApproval } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fixtures/signleNFTApproval'
import { unknownNftBuy } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fixtures/unknownNftBuy'
import { unknownNftSend } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fixtures/unknownNftSend'
import { unknownSwapMaticUSDC } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fixtures/unknownSwapMaticUSDC'

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

test(`As a user I should see if dApp is asking me to sign Approval transaction, so I can see details of transaction and decide what to do next
    As a user I should be able to dApp transaction request, so transaction won't be signed
    As a user I should see if dApp is asking me to sign NFT collection Approval transaction, so I can see details of transaction and decide what to do next
    As a user I should see if dApp is asking me to sign signle NFT Approval transaction, so I can see details of transaction and decide what to do next
    As a user I should see if dApp is asking me to sign some transaction, which will trigger spending tokens, so I can decide if I want to proceed
    As a user I should see if dApp is asking me to sign some transaction, which will trigger receivng tokens, so I can decide if I want to proceed
    As a user I should see if dApp is asking me to sign some transaction, which will trigger receivng NFTs, so I can decide if I want to proceed
    As a user I should see an estimated fee which will be applied if I submit this transaction, so I can decide what to do next`, async () => {
    jest.useFakeTimers()
    const dAppHost = 'dapp.example.com'

    const { toWidget, postMessage } = await renderZWidget({ dAppHost })

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

    await toWidget({
        type: 'rpc_request',
        request: dummySendTransaction,
    })

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    expect(await screen.findByText('Approve')).toBeInTheDocument()
    expect(await screen.findByText('USDC')).toBeInTheDocument()
    expect(await screen.findByText('Spend limit')).toBeInTheDocument()
    expect(await screen.findByText('Unlimited')).toBeInTheDocument()

    expect(
        await screen.findByLabelText('Network Fee', { exact: false })
    ).toHaveAccessibleDescription('4 sec $0.01')

    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))
    expect(screen.queryByText('Approve')).not.toBeInTheDocument()

    expect(postMessage).toReceiveMsg({
        id: 0,
        response: {
            reason: { code: 4001, message: 'User Rejected Request' },
            type: 'Failure',
        },
        type: 'rpc_response',
    })

    // Collection NFT Approval
    env.api['/wallet/transaction/simulate/'].post = () => [
        200,
        nftCollectionApproval,
    ]
    await toWidget({
        type: 'rpc_request',
        request: dummySendTransaction,
    })

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    expect(await screen.findByText('Approve')).toBeInTheDocument()
    expect(await screen.findByText('OpenSea Collections')).toBeInTheDocument()
    expect(await screen.findByText('Entire collection')).toBeInTheDocument()
    expect(
        await screen.findByLabelText('Network Fee', { exact: false })
    ).toHaveAccessibleDescription('4 sec $0.01')

    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))

    // Unknown trasaction send token, receive NFT
    env.api['/wallet/transaction/simulate/'].post = () => [200, unknownNftBuy]
    await toWidget({
        type: 'rpc_request',
        request: dummySendTransaction,
    })

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    expect(await screen.findByText('fulfillAdvancedOrder')).toBeInTheDocument()

    let sendSection = await screen.findByLabelText('Send')
    let token = within(sendSection).getByLabelText('MATIC')
    expect(within(token).getByText('-0.00039')).toBeInTheDocument()
    expect(within(token).getByText('-$0.01')).toBeInTheDocument()

    let receiveSection = await screen.findByLabelText('Receive')
    let nft = within(receiveSection).getByLabelText('Sunflower')
    expect(within(nft).getByText('0x22d5...7422')).toBeInTheDocument()
    expect(within(nft).getByText('+1')).toBeInTheDocument()

    expect(
        await screen.findByLabelText('Network Fee', { exact: false })
    ).toHaveAccessibleDescription('4 sec $0.01')

    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))

    // Unknown trasaction send token, receive token (swap as unknown)
    env.api['/wallet/transaction/simulate/'].post = () => [
        200,
        unknownSwapMaticUSDC,
    ]
    await toWidget({
        type: 'rpc_request',
        request: dummySendTransaction,
    })

    await act(() => {
        jest.advanceTimersByTime(10000)
    })
    expect(await screen.findByText('multicall')).toBeInTheDocument()

    sendSection = await screen.findByLabelText('Send')
    token = within(sendSection).getByLabelText('MATIC')
    expect(within(token).getByText('-0.01')).toBeInTheDocument()
    expect(within(token).getByText('-$0.01')).toBeInTheDocument()

    receiveSection = await screen.findByLabelText('Receive')
    token = within(receiveSection).getByLabelText('USDC')
    expect(within(token).getByText('+0.01061')).toBeInTheDocument()
    expect(within(token).getByText('+$0.01')).toBeInTheDocument()

    expect(
        await screen.findByLabelText('Network Fee', { exact: false })
    ).toHaveAccessibleDescription('4 sec $0.01')

    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))

    // Unknown trasaction send NFT
    env.api['/wallet/transaction/simulate/'].post = () => [200, unknownNftSend]
    await toWidget({
        type: 'rpc_request',
        request: dummySendTransaction,
    })

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    expect(await screen.findByText('safeTransferFrom')).toBeInTheDocument()

    sendSection = await screen.findByLabelText('Send')
    nft = within(sendSection).getByLabelText('Sunflower')
    expect(within(nft).getByText('0x22d5...7422')).toBeInTheDocument()
    expect(within(nft).getByText('-1')).toBeInTheDocument()

    expect(
        await screen.findByLabelText('Network Fee', { exact: false })
    ).toHaveAccessibleDescription('4 sec $0.01')

    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))

    // Single NFT Approval
    env.api['/wallet/transaction/simulate/'].post = () => [
        200,
        singleNftApproval,
    ]
    await toWidget({
        type: 'rpc_request',
        request: dummySendTransaction,
    })

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    expect(await screen.findByText('Approve')).toBeInTheDocument()
    const lbl = await screen.findByLabelText('Slacker Duck #559')
    expect(lbl).toHaveAccessibleDescription('Slacker Duck Pond')
    expect(
        await screen.findByLabelText('Network Fee', { exact: false })
    ).toHaveAccessibleDescription('4 sec $0.01')

    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))
    jest.useRealTimers()
})
test(`As a user I should be able to sign transaction, so it will be submitted to the network`, async () => {
    jest.useFakeTimers().setSystemTime(new Date('2022-11-11 17:03'))
    const dAppHost = 'dapp.example.com'

    const { toWidget } = await renderZWidget({ dAppHost })

    await toWidget({
        type: 'rpc_request',
        request: { id: 0, method: 'eth_requestAccounts', params: [] },
    })

    await userEvent.click(
        await screen.findByRole('button', { name: 'Connect Zeal' })
    )
    await runLottieListeners()

    await toWidget({
        type: 'rpc_request',
        request: dummySendTransaction,
    })

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    await userEvent.click(await screen.findByRole('button', { name: 'Submit' }))

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    expect(await screen.findByText('Added to queue')).toBeInTheDocument()

    expect(env.api['/wallet/rpc/'].eth_sendRawTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
            data: '{"id":123,"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["0x0"]}',
        })
    )
    jest.useRealTimers()
})
