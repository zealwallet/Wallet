import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { testPassword } from '@zeal/domains/KeyStore/api/fixtures/testPassword'
import { dummySendTransaction } from '@zeal/domains/RPCRequest/api/fixtures/dummySendTransaction'
import { ethBlockNumberAfterTransaction } from '@zeal/domains/RPCRequest/api/fixtures/ethBlockNumber'
import { ethGetTransactionByHashWithBlockNumber } from '@zeal/domains/RPCRequest/api/fixtures/ethGetTransactionByHash'
import { ethGetTransactionReceipt } from '@zeal/domains/RPCRequest/api/fixtures/ethGetTransactionReceipt'
import { pendingTransaction } from '@zeal/domains/Storage/api/fixtures/localStorage'
import { LS_KEY } from '@zeal/domains/Storage/constants'

import { cleanEnv, mockEnv, TestEnvironment } from 'src/tests/env'
import { runLottieListeners } from 'src/tests/mocks/lottie'
import { renderPage, renderZWidget } from 'src/tests/utils/renderers'

let env: TestEnvironment

let originalOpen: Window['open']

beforeEach(() => {
    originalOpen = window.open
    env = mockEnv()
})

afterEach(() => {
    window.open = originalOpen
    cleanEnv(env)
    jest.restoreAllMocks()
})

test('As a user I should be able to see transaction in activity tab, so I can track it if I closed the dApp', async () => {
    env.chromeMocks.storages.session = {}
    env.chromeMocks.storages.local[LS_KEY] = JSON.stringify(pendingTransaction)

    jest.spyOn(Date, 'now').mockImplementation(() =>
        new Date('2023-02-28T12:00:00.000Z').getTime()
    )

    env.api['/wallet/rpc/'].eth_getTransactionByHash = jest.fn(() => [
        200,
        ethGetTransactionByHashWithBlockNumber,
    ])

    env.api['/wallet/rpc/'].eth_getTransactionReceipt = jest.fn(() => [
        200,
        ethGetTransactionReceipt,
    ])

    await renderPage('/index.html?type=extension&mode=popup')

    await userEvent.type(
        await screen.findByPlaceholderText('Enter password'),
        `${testPassword}{enter}`
    )

    await userEvent.click(await screen.findByLabelText('Activity'))

    const trxWidget = (await screen.findAllByLabelText('Approve'))[0]

    expect(
        await within(trxWidget).findByText('For 0x68b3...fc45')
    ).toBeInTheDocument()
    expect(await within(trxWidget).findByText('In block')).toBeInTheDocument()
    expect(await within(trxWidget).findByText('3 m')).toBeInTheDocument()
})

test(`As a user I should be able to sign transaction, so it will be submitted to the network`, async () => {
    jest.useFakeTimers().setSystemTime(new Date('2022-11-11 17:03'))
    window.open = jest.fn()

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
    expect(await screen.findByText('0x1A...13')).toBeInTheDocument()

    expect(env.api['/wallet/rpc/'].eth_sendRawTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
            data: '{"id":123,"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["0x0"]}',
        })
    )

    // expect(await screen.findByText('1:57')).toBeInTheDocument()

    await act(() => {
        jest.runOnlyPendingTimers()
    })

    expect(
        env.api['/wallet/rpc/'].eth_getTransactionByHash
    ).toHaveBeenCalledWith(
        expect.objectContaining({
            data: expect.stringContaining(
                '"params":["0x1a44ec6f4652f4635064fee89516d22495d2827e8127c8a7afe2b67affca7913"]'
            ),
        })
    )

    env.api['/wallet/rpc/'].eth_getTransactionByHash = jest.fn(() => [
        200,
        ethGetTransactionByHashWithBlockNumber,
    ])

    env.api['/wallet/rpc/'].eth_getTransactionReceipt = jest.fn(() => [
        200,
        ethGetTransactionReceipt,
    ])

    await act(() => {
        jest.runOnlyPendingTimers()
        jest.advanceTimersByTime(5000)
    })

    await act(() => {
        jest.runOnlyPendingTimers()
        jest.advanceTimersByTime(5000)
    })

    expect(await screen.findByText('Included in block')).toBeInTheDocument()

    await act(() => {
        jest.runOnlyPendingTimers()
        jest.advanceTimersByTime(5000)
    })

    await act(() => {
        jest.runOnlyPendingTimers()
        jest.advanceTimersByTime(5000)
    })

    env.api['/wallet/rpc/'].eth_blockNumber = jest.fn(() => [
        200,
        ethBlockNumberAfterTransaction,
    ])

    await act(() => {
        jest.runOnlyPendingTimers()
        jest.advanceTimersByTime(5000)
    })

    await screen.findAllByText('Complete')

    await userEvent.click(
        await screen.findByRole('button', { name: '0x1A...13' })
    )
    expect(window.open).toHaveBeenCalledWith(
        'https://etherscan.io/tx/0x1a44ec6f4652f4635064fee89516d22495d2827e8127c8a7afe2b67affca7913',
        '_blank'
    )

    jest.useRealTimers()
})
