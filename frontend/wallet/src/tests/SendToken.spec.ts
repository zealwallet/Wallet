import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ecr20TransactionSimulation } from '@zeal/domains/RPCRequest/api/fixtures/ecr20TransactionSimulation'
import { erc20Rate } from '@zeal/domains/RPCRequest/api/fixtures/erc20Rate'
import { erc20TransactionByHash } from '@zeal/domains/RPCRequest/api/fixtures/erc20TransactionByHash'
import { ecr20TransactionFeeForecast } from '@zeal/domains/RPCRequest/api/fixtures/erc20TransactionFeeForecast'
import { erc20TransactionReceipt } from '@zeal/domains/RPCRequest/api/fixtures/erc20TransactionReceipt'
import { erc20TransactionResult } from '@zeal/domains/RPCRequest/api/fixtures/erc20TransactionResult'
import { ethGetBlockByNumber } from '@zeal/domains/RPCRequest/api/fixtures/ethGetBlockByNumber'
import { onlyPKAccount } from '@zeal/domains/Storage/api/fixtures/localStorage'
import { LS_KEY } from '@zeal/domains/Storage/constants'

import { cleanEnv, mockEnv, TestEnvironment } from 'src/tests/env'
import { runLottieListeners } from 'src/tests/mocks/lottie'
import { renderPage } from 'src/tests/utils/renderers'

let env: TestEnvironment

beforeEach(() => {
    env = mockEnv()
})

afterEach(() => {
    cleanEnv(env)
    jest.restoreAllMocks()
})

test(`As a user, I should be able to search for an address to send to, so that I can send tokens to any wallet, even without tracking already
    As a user I should be able to send tokens, so that I can transact`, async () => {
    env.chromeMocks.storages.local[LS_KEY] = JSON.stringify(onlyPKAccount)

    const fromAddress = '0x26D0d88fFe184b1BA244D08Fb2a0c695e65c8932'

    await renderPage(
        `/page_entrypoint.html?type=send_erc20_token&fromAddress=${fromAddress}`
    )

    const tokensModal = await screen.findByLabelText('Tokens')

    await userEvent.click(await within(tokensModal).findByText('USDC'))

    expect(tokensModal).not.toBeInTheDocument()

    await userEvent.click(
        await screen.findByRole('button', { name: 'Select address' })
    )

    const sendToModal = await screen.findByLabelText('Send to')

    expect(sendToModal).toBeInTheDocument()

    const searchBox = await within(sendToModal).findByPlaceholderText(
        'Add or search address'
    )

    await userEvent.type(searchBox, 'someRandomTextThatIsNotAnAddress')

    expect(
        await screen.findByText('We couldn’t find any wallets')
    ).toBeInTheDocument()

    const validNewAddress = '0x14b889b25e70f60d8dc0aa5f10c83680add61351'

    await userEvent.clear(searchBox)
    await userEvent.type(searchBox, validNewAddress)

    expect(
        await screen.findByText('Wallet is not in your list')
    ).toBeInTheDocument()

    await userEvent.click(
        await within(sendToModal).findByRole('button', { name: 'Continue' })
    )

    const labelPopup = await screen.findByRole('dialog', {
        name: 'Label this wallet',
    })

    await userEvent.type(
        await within(labelPopup).findByPlaceholderText('Wallet label'),
        'New Test Wallet'
    )

    await userEvent.click(
        await within(labelPopup).findByRole('button', {
            name: 'Continue',
        })
    )

    expect(labelPopup).not.toBeInTheDocument()

    await userEvent.type(
        await screen.findByRole('textbox', {
            name: 'Send amount',
        }),
        '1'
    )

    const mainContinueButton = await screen.findByRole('button', {
        name: 'Continue',
    })

    expect(mainContinueButton).not.toBeDisabled()

    env.api['/wallet/fee/forecast'].post = jest.fn(() => [
        200,
        ecr20TransactionFeeForecast,
    ])

    env.api['/wallet/transaction/simulate/'].post = jest.fn(() => [
        200,
        ecr20TransactionSimulation,
    ])

    env.api['/wallet/rpc/'].eth_getTransactionCount = jest.fn(() => [
        200,
        { jsonrpc: '2.0', id: 1489852546, result: '0x18e' },
    ])

    env.api['/wallet/rpc/'].eth_estimateGas = jest.fn(() => [
        200,
        { jsonrpc: '2.0', id: 3035632473, result: '0xa7f9' },
    ])

    expect(await screen.findByText('Send')).toBeInTheDocument()

    jest.useFakeTimers()

    await userEvent.click(
        await screen.findByRole('button', {
            name: 'Continue',
        })
    )

    // Wait for the simulation to finish

    expect(await screen.findByText('Doing safety checks…')).toBeInTheDocument()

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    expect(screen.queryByText('Doing safety checks…')).not.toBeInTheDocument()

    // Validate the transaction and submit

    expect(await screen.findByText('Safety Checks Passed')).toBeInTheDocument()
    expect(await screen.findByText('Network fee')).toBeInTheDocument()
    expect(await screen.findByText('$0.01')).toBeInTheDocument()

    await userEvent.click(
        await screen.findByRole('button', {
            name: 'Submit',
        })
    )

    // Wait for the transaction to go through

    env.api['/wallet/rpc/'].eth_blockNumber = jest.fn(() => [
        200,
        { jsonrpc: '2.0', id: 2593987905, result: '0x2aaf1ad' },
    ])

    env.api['/wallet/rpc/'].eth_getBlockByNumber = jest.fn(() => [
        200,
        ethGetBlockByNumber,
    ])

    env.api['/wallet/rpc/'].eth_sendRawTransaction = jest.fn(() => [
        200,
        {
            jsonrpc: '2.0',
            id: 2897282340,
            result: '0xa3b072cff5d0c01aeaa61079fa98cb8e373da077ab19cd903e864753038559fd',
        },
    ])

    env.api['/wallet/rpc/'].eth_getTransactionByHash = jest.fn(() => [
        200,
        erc20TransactionByHash,
    ])

    env.api['/wallet/rpc/'].eth_getTransactionReceipt = jest.fn(() => [
        200,
        erc20TransactionReceipt,
    ])

    env.api['/wallet/transaction/:hash/result'].get = jest.fn(() => [
        200,
        erc20TransactionResult,
    ])

    env.api['/wallet/rate/default/:network/:address/'].get = jest.fn(() => [
        200,
        erc20Rate,
    ])

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    await runLottieListeners()

    // Final screen

    expect(await screen.findByText('Final network fee')).toBeInTheDocument()
    expect(await screen.findByText('$0.01')).toBeInTheDocument()
    expect(await screen.findByText('Close')).toBeInTheDocument()

    jest.useRealTimers()
})
