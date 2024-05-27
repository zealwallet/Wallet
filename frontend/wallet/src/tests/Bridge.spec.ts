import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
    bridgeQuoteArbitrumUSDCEBaseUSDbC,
    bridgeQuotePolygonUSDCArbitrumUSDT,
    bridgeQuotePolygonUSDCArbitrumUSDTRefuel,
} from '@zeal/domains/Currency/domains/Bridge/api/fixtures/bridgeQuote'
import {
    bridgeStatusPolygonUSDCArbitrumUSDTRefuelCompleted,
    bridgeStatusPolygonUSDCArbitrumUSDTRefuelPendingAll,
    bridgeStatusPolygonUSDCArbitrumUSDTRefuelPendingRefuel,
} from '@zeal/domains/Currency/domains/Bridge/api/fixtures/bridgeStatus'
import { buildAllowanceTxEthereumUSDC as buildAllowanceTxArbitrumUSDCe } from '@zeal/domains/Currency/domains/Bridge/api/fixtures/buildAllowanceTx'
import {
    buildTxEthereumUSDCPolygonUSDT as buildTxArbitrumUSDCeBaseUSDbC,
    buildTxPolygonUSDCArbitrumUSDT,
} from '@zeal/domains/Currency/domains/Bridge/api/fixtures/buildTx'
import { checkAllowanceArbitrumUSDCe } from '@zeal/domains/Currency/domains/Bridge/api/fixtures/checkAllowanceArbitrumUSDCe'
import { allowancePolygonUSDC } from '@zeal/domains/Currency/domains/SwapQuote/api/fixtures/allowancePolygonUSDC'
import { buildTxApprovalPolygonUSDC } from '@zeal/domains/Currency/domains/SwapQuote/api/fixtures/buildTxApprovalPolygonUSDC'
import { swapQuotePolygonMaticUSDCNoRoutes } from '@zeal/domains/Currency/domains/SwapQuote/api/fixtures/swapQuote'
import { testPassword } from '@zeal/domains/KeyStore/api/fixtures/testPassword'
import { ethBlockNumberAfterTransaction } from '@zeal/domains/RPCRequest/api/fixtures/ethBlockNumber'
import { ethGetTransactionByHashWithBlockNumber } from '@zeal/domains/RPCRequest/api/fixtures/ethGetTransactionByHash'
import { ethGetTransactionReceipt } from '@zeal/domains/RPCRequest/api/fixtures/ethGetTransactionReceipt'
import {
    emptyPortfolioMap,
    onlyPKAccount,
    pendingBridge,
    portfolioMap,
} from '@zeal/domains/Storage/api/fixtures/localStorage'
import { LS_KEY, PORTFOLIO_MAP_KEY } from '@zeal/domains/Storage/constants'

import { cleanEnv, mockEnv, TestEnvironment } from 'src/tests/env'
import { runLottieListeners } from 'src/tests/mocks/lottie'
import { renderPage } from 'src/tests/utils/renderers'

let env: TestEnvironment

let originalOpen: Window['open']

beforeEach(() => {
    env = mockEnv()
    originalOpen = window.open
})

afterEach(() => {
    cleanEnv(env)
    window.open = originalOpen
    jest.restoreAllMocks()
})

test(`As a user I should be able to see bridge which is in progress even after closing the bridge flow, so I can continue monitoring it`, async () => {
    env.chromeMocks.storages.session = {}
    env.chromeMocks.storages.local[LS_KEY] = JSON.stringify(pendingBridge)

    await renderPage('/index.html?type=extension&mode=popup')

    await userEvent.type(
        await screen.findByPlaceholderText('Enter password'),
        `${testPassword}{enter}`
    )

    expect(await screen.findByText('Bridge')).toBeInTheDocument()
    expect(await screen.findByText('USDC to USDT')).toBeInTheDocument()
})

test(`As a user I should be able to open bridge flow even is my portfolio is empty, so I can explore the feature
    As a user I should see the account label from which I want to bridge, so I won't do it on wrong account by mistake
    As a user I should see an error if Zeal was not able to load bridge providers, so I can retry
    As a user I should be able to select source token, so I can choose which token I want to bridge from
    As a user I should be see a message that token I'm searching for is not found, so I know that this token is not supported yet
    As a user I should be able to search source and destination tokens, so I can quickly find the token I'm looking for
    As a user I should be able to set slippage from available options or provide custom, so I make sure my swap parameters during bridge are under control
    As a user I should be able to select destination token, so I can choose which token I want to swap to`, async () => {
    env.chromeMocks.storages.session = {}
    env.chromeMocks.storages.local[LS_KEY] = JSON.stringify(onlyPKAccount)
    env.chromeMocks.storages.local[PORTFOLIO_MAP_KEY] =
        JSON.stringify(emptyPortfolioMap)

    renderPage(
        '/page_entrypoint.html?type=bridge&fromAddress=0x26d0d88ffe184b1ba244d08fb2a0c695e65c8932'
    )

    await userEvent.type(
        await screen.findByPlaceholderText('Enter password'),
        `${testPassword}{enter}`
    )

    expect(await screen.findByText('0x26d0...8932')).toBeInTheDocument()
    expect(await screen.findByText('Private Key 1')).toBeInTheDocument()
    expect(await screen.findByText('Bridge')).toBeInTheDocument()

    expect(
        await screen.findByRole('button', { name: 'Continue' })
    ).toBeDisabled()

    // From token
    expect(
        await screen.findByRole('button', { name: 'Arbitrum' })
    ).toBeInTheDocument()
    await userEvent.click(
        await within(await screen.findByLabelText('From')).findByRole(
            'button',
            { name: 'ETH' }
        )
    )
    let tokens = await screen.findByLabelText('Tokens')
    await userEvent.type(
        await within(tokens).findByPlaceholderText('Search'),
        'USDC'
    )
    await userEvent.click(await within(tokens).findByLabelText('USDC.e'))
    expect(tokens).not.toBeInTheDocument()
    expect(
        await screen.findByRole('button', { name: 'USDC.e' })
    ).toBeInTheDocument()

    // To token
    expect(
        await screen.findByRole('button', { name: 'Base' })
    ).toBeInTheDocument()
    await userEvent.click(
        await within(await screen.findByLabelText('To')).findByRole('button', {
            name: 'ETH',
        })
    )
    tokens = await screen.findByLabelText('Tokens')
    await userEvent.type(
        await within(tokens).findByPlaceholderText('Search'),
        'shicoin'
    )
    expect(
        await within(tokens).findByText('We found no tokens')
    ).toBeInTheDocument()
    await userEvent.clear(await within(tokens).findByPlaceholderText('Search'))
    await userEvent.type(
        await within(tokens).findByPlaceholderText('Search'),
        'USD'
    )
    await userEvent.click(await within(tokens).findByLabelText('USDbC'))
    expect(tokens).not.toBeInTheDocument()
    expect(
        await screen.findByRole('button', { name: 'USDbC' })
    ).toBeInTheDocument()

    await userEvent.type(await screen.findByLabelText('Amount to bridge'), '10')

    env.api['@socket/quote'] = jest.fn(() => [
        200,
        bridgeQuoteArbitrumUSDCEBaseUSDbC,
    ])
    env.api['@socket/approval/check-allowance'] = jest.fn(() => [
        200,
        checkAllowanceArbitrumUSDCe,
    ])
    env.api['@socket/approval/build-tx'] = jest.fn(() => [
        200,
        buildAllowanceTxArbitrumUSDCe,
    ])
    env.api['@socket/build-tx'] = jest.fn(() => [
        200,
        buildTxArbitrumUSDCeBaseUSDbC,
    ])

    expect(
        await screen.findByText('We had issues loading providers')
    ).toBeInTheDocument()
    await userEvent.click(await screen.findByRole('button', { name: 'Retry' }))

    expect(
        await screen.findByRole('button', { name: 'Not enough balance' })
    ).toBeDisabled()

    expect(env.api['@socket/quote']).toHaveBeenCalledWith(
        expect.objectContaining({
            params: expect.objectContaining({
                bridgeWithGas: false,
                defaultBridgeSlippage: '0.50',
                defaultSwapSlippage: '0.50',
                fromAmount: '10000000',
                fromChainId: '0xa4b1',
                fromTokenAddress: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
                recipient: '0x26d0d88ffe184b1ba244d08fb2a0c695e65c8932',
                singleTxOnly: true,
                sort: 'output',
                toChainId: '0x2105',
                toTokenAddress: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
                userAddress: '0x26d0d88ffe184b1ba244d08fb2a0c695e65c8932',
            }),
        })
    )
    expect(env.api['@socket/approval/check-allowance']).toHaveBeenCalledWith(
        expect.objectContaining({
            params: expect.objectContaining({
                allowanceTarget: '0x3a23f943181408eac424116af7b7790c94cb97a5',
                chainID: '42161',
                owner: '0x40fcdd8c164ea13cfd85a871e8755e977d885da4',
                tokenAddress: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
            }),
        })
    )
    expect(env.api['@socket/approval/build-tx']).toHaveBeenCalledWith(
        expect.objectContaining({
            params: {
                allowanceTarget: '0x3a23f943181408eac424116af7b7790c94cb97a5',
                amount: '100000000',
                chainID: '42161',
                owner: '0x40fcdd8c164ea13cfd85a871e8755e977d885da4',
                tokenAddress: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
            },
        })
    )

    // Route
    expect(await screen.findByLabelText('Destination amount')).toHaveValue(
        '99.76'
    )
    expect(await screen.findByLabelText('Across')).toHaveAccessibleDescription(
        '1 minNetwork fees $0.03'
    )
    await userEvent.click(await screen.findByLabelText('Across'))
    const providerModal = await screen.findByLabelText('Bridge provider')
    const across = await within(providerModal).findByLabelText('Across')
    expect(await within(across).findByText('99.76 USDbC')).toBeInTheDocument()
    expect(await within(across).findByText('1 min')).toBeInTheDocument()
    expect(
        await within(across).findByText('Network fees $0.03')
    ).toBeInTheDocument()
    expect(
        await within(across).findByLabelText('Best return route')
    ).toBeInTheDocument()
    expect(
        await within(across).findByLabelText('Best service time route')
    ).toBeInTheDocument()
    const stargate = await within(providerModal).findByLabelText('Stargate')
    expect(await within(stargate).findByText('98.78 USDbC')).toBeInTheDocument()
    expect(await within(stargate).findByText('1 min')).toBeInTheDocument()
    expect(
        await within(stargate).findByText('Network fees $0.05')
    ).toBeInTheDocument()
    expect(
        within(stargate).queryByLabelText('Best return route')
    ).not.toBeInTheDocument()
    expect(
        within(stargate).queryByLabelText('Best service time route')
    ).not.toBeInTheDocument()

    await userEvent.click(stargate)
    expect(
        await screen.findByLabelText('Stargate')
    ).toHaveAccessibleDescription('1 minNetwork fees $0.05')

    // Slippage
    await userEvent.click(
        await screen.findByRole('button', { name: 'Slippage 0.5%' })
    )
    let slippageModal = await screen.findByRole('dialog', {
        name: 'Slippage settings',
    })
    expect(
        await within(slippageModal).findByRole('radio', { name: '0.1%' })
    ).toBeInTheDocument()
    expect(
        await within(slippageModal).findByRole('radio', { name: '0.5%' })
    ).toBeInTheDocument()
    await userEvent.click(
        await within(slippageModal).findByRole('radio', { name: '1%' })
    )
    expect(
        await screen.findByRole('button', { name: 'Not enough balance' })
    ).toBeDisabled()
    expect(env.api['@socket/quote']).toHaveBeenCalledWith(
        expect.objectContaining({
            params: expect.objectContaining({
                defaultBridgeSlippage: '1.00',
                defaultSwapSlippage: '1.00',
            }),
        })
    )
    expect(
        JSON.parse((await chrome.storage.local.get(LS_KEY))[LS_KEY])
    ).toEqual(expect.objectContaining({ swapSlippagePercent: 1 }))
    await userEvent.click(
        await screen.findByRole('button', { name: 'Slippage 1%' })
    )
    slippageModal = await screen.findByRole('dialog', {
        name: 'Slippage settings',
    })
    expect(
        await within(slippageModal).findByRole('button', { name: 'Save' })
    ).toBeDisabled()
    await userEvent.type(
        await within(slippageModal).findByPlaceholderText('Custom'),
        '0.24{enter}'
    )

    expect(slippageModal).not.toBeInTheDocument()
    expect(
        await screen.findByRole('button', { name: 'Not enough balance' })
    ).toBeDisabled()
    expect(env.api['@socket/quote']).toHaveBeenCalledWith(
        expect.objectContaining({
            params: expect.objectContaining({ defaultSwapSlippage: '0.24' }),
        })
    )
    expect(
        JSON.parse((await chrome.storage.local.get(LS_KEY))[LS_KEY])
    ).toEqual(expect.objectContaining({ swapSlippagePercent: 0.24 }))
})

test(`As a user I should be able to open bridge with source token specified, so I can swap quicker
    As a user I should be able to switch from network on bridge, so I can choose tokens on different networks
    As a user I should be able to switch to network on bridge, so I can choose tokens on different networks
    As a user I should be able to add native currency topup to my bridge, so I'll have native currency on the network I'm bridging to
    As a user I should be able to submit bridge, so my swap will be sent to RPC
    As a user I should be able to monitor my bridge, so I know when my bridge is completd`, async () => {
    window.open = jest.fn()
    env.chromeMocks.storages.session = {}
    env.chromeMocks.storages.local[LS_KEY] = JSON.stringify(onlyPKAccount)
    env.chromeMocks.storages.local[PORTFOLIO_MAP_KEY] =
        JSON.stringify(portfolioMap)

    env.api['/wallet/rpc/'].eth_getTransactionByHash = jest.fn(() => [
        200,
        ethGetTransactionByHashWithBlockNumber,
    ])
    env.api['/wallet/rpc/'].eth_getTransactionReceipt = jest.fn(() => [
        200,
        ethGetTransactionReceipt,
    ])
    env.api['/wallet/rpc/'].eth_blockNumber = jest.fn(() => [
        200,
        ethBlockNumberAfterTransaction,
    ])
    env.api['@socket/quote'] = jest.fn(() => [
        200,
        swapQuotePolygonMaticUSDCNoRoutes,
    ])
    env.api['@socket/approval/check-allowance'] = jest.fn(() => [
        200,
        allowancePolygonUSDC,
    ])
    env.api['@socket/approval/build-tx'] = jest.fn(() => [
        200,
        buildTxApprovalPolygonUSDC,
    ])
    env.api['@socket/build-tx'] = jest.fn(() => [
        200,
        buildTxPolygonUSDCArbitrumUSDT,
    ])

    renderPage(
        '/page_entrypoint.html?type=bridge&fromAddress=0x26d0d88ffe184b1ba244d08fb2a0c695e65c8932&fromCurrencyId=Polygon%7C0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
    )

    await userEvent.type(
        await screen.findByPlaceholderText('Enter password'),
        `${testPassword}{enter}`
    )

    expect(await screen.findByText('0x26d0...8932')).toBeInTheDocument()
    expect(await screen.findByText('Private Key 1')).toBeInTheDocument()
    expect(await screen.findByText('Bridge')).toBeInTheDocument()

    // Polygon USDC -> Arbitrum USDT
    expect(
        await screen.findByRole('button', { name: 'Continue' })
    ).toBeDisabled()

    expect(
        await screen.findByRole('button', { name: 'Polygon' })
    ).toBeInTheDocument()
    expect(
        await screen.findByRole('button', { name: 'USDC' })
    ).toBeInTheDocument()
    expect(
        await screen.findByRole('button', { name: 'Arbitrum' })
    ).toBeInTheDocument()
    await userEvent.click(await screen.findByRole('button', { name: 'ETH' }))
    const tokens = await screen.findByLabelText('Tokens')
    await userEvent.click(await within(tokens).findByLabelText('USDT'))
    expect(tokens).not.toBeInTheDocument()

    // Try no routes
    await userEvent.type(await screen.findByLabelText('Amount to bridge'), '1')
    expect(
        await screen.findByRole('button', { name: 'No routes found' })
    ).toBeDisabled()

    // Above available balance and full balance
    env.api['@socket/quote'] = jest.fn(() => [
        200,
        bridgeQuotePolygonUSDCArbitrumUSDT,
    ])
    await userEvent.type(
        await screen.findByLabelText('Amount to bridge'),
        '160'
    )
    expect(
        await screen.findByRole('button', { name: 'Not enough balance' })
    ).toBeDisabled()
    await userEvent.click(
        await screen.findByRole('button', { name: 'Balance 157.2' })
    )
    expect(await screen.findByLabelText('Amount to bridge')).toHaveValue(
        '157.223311'
    )
    expect(await screen.findByText('$157')).toBeInTheDocument()
    expect(await screen.findByLabelText('Across')).toHaveAccessibleDescription(
        '2 minNetwork fees $0.06'
    )
    expect(await screen.findByLabelText('Destination amount')).toHaveValue(
        '156.8'
    )

    expect(env.api['@socket/quote']).toHaveBeenCalledWith(
        expect.objectContaining({
            params: expect.objectContaining({
                bridgeWithGas: false,
                defaultBridgeSlippage: '0.50',
                defaultSwapSlippage: '0.50',
                fromAmount: '1160000000',
                fromChainId: '0x89',
                fromTokenAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                recipient: '0x26d0d88ffe184b1ba244d08fb2a0c695e65c8932',
                toChainId: '0xa4b1',
                toTokenAddress: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                userAddress: '0x26d0d88ffe184b1ba244d08fb2a0c695e65c8932',
            }),
        })
    )
    expect(env.api['@socket/approval/check-allowance']).toHaveBeenCalledWith(
        expect.objectContaining({
            params: expect.objectContaining({
                allowanceTarget: '0x3a23f943181408eac424116af7b7790c94cb97a5',
                chainID: '137',
                owner: '0x61640a8d48bca205ba91b16b0b7745e7abc61084',
                tokenAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
            }),
        })
    )
    expect(env.api['@socket/approval/build-tx']).toHaveBeenCalledWith(
        expect.objectContaining({
            params: {
                allowanceTarget: '0x3a23f943181408eac424116af7b7790c94cb97a5',
                amount: '157223311',
                chainID: '137',
                owner: '0x61640a8d48bca205ba91b16b0b7745e7abc61084',
                tokenAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
            },
        })
    )

    // Refuel
    env.api['@socket/quote'] = jest.fn(() => [
        200,
        bridgeQuotePolygonUSDCArbitrumUSDTRefuel,
    ])
    await userEvent.click(
        await screen.findByRole('button', { name: 'Top up ETH' })
    )
    expect(env.api['@socket/quote']).toHaveBeenCalledWith(
        expect.objectContaining({
            params: expect.objectContaining({
                bridgeWithGas: true,
            }),
        })
    )
    const refuelFrom = await screen.findByLabelText('MATIC')
    expect(refuelFrom).toHaveAccessibleDescription('-8.701')
    const refuelTo = await screen.findByLabelText('ETH')
    expect(refuelTo).toHaveAccessibleDescription('+0.003053')
    env.api['@socket/quote'] = jest.fn(() => [
        200,
        bridgeQuotePolygonUSDCArbitrumUSDT,
    ])
    await userEvent.click(
        await within(refuelFrom).findByRole('button', { name: 'Remove Topup' })
    )
    expect(refuelFrom).not.toBeInTheDocument()
    expect(refuelTo).not.toBeInTheDocument()
    env.api['@socket/quote'] = jest.fn(() => [
        200,
        bridgeQuotePolygonUSDCArbitrumUSDTRefuel,
    ])
    await userEvent.click(
        await screen.findByRole('button', { name: 'Top up ETH' })
    )
    expect(await screen.findByLabelText('MATIC')).toBeInTheDocument()

    const submitButton = await screen.findByRole('button', { name: 'Continue' })
    expect(submitButton).not.toBeDisabled()

    jest.useFakeTimers()
    await userEvent.click(submitButton)
    expect(await screen.findByText('Doing safety checks…')).toBeInTheDocument()
    await act(() => {
        jest.runOnlyPendingTimers()
        jest.advanceTimersByTime(5000)
    })
    await runLottieListeners()

    // Approval transaction
    await userEvent.click(await screen.findByRole('button', { name: 'Submit' }))

    await act(() => {
        jest.runOnlyPendingTimers()
        jest.advanceTimersByTime(5000)
    })

    await userEvent.click(await screen.findByRole('button', { name: 'Close' }))
    expect(await screen.findByText('Doing safety checks…')).toBeInTheDocument()
    await act(() => {
        jest.runOnlyPendingTimers()
        jest.advanceTimersByTime(5000)
    })
    await runLottieListeners()

    // Bridge transaction
    await userEvent.click(await screen.findByRole('button', { name: 'Submit' }))

    await act(() => {
        jest.runOnlyPendingTimers()
        jest.advanceTimersByTime(5000)
    })
    await runLottieListeners()

    await userEvent.click(await screen.findByRole('button', { name: 'Close' }))

    // Bridge status
    env.api['@socket/bridge-status'] = jest.fn(() => [
        200,
        bridgeStatusPolygonUSDCArbitrumUSDTRefuelPendingAll,
    ])
    expect(await screen.findByText('Bridging USDC to USDT')).toBeInTheDocument()
    expect(await screen.findByText('2 sec / 3 min')).toBeInTheDocument()
    await act(() => {
        jest.runOnlyPendingTimers()
        jest.advanceTimersByTime(5000)
    })
    expect(await screen.findByText('12 sec / 3 min')).toBeInTheDocument()

    await userEvent.click(await screen.findByRole('button', { name: '0x' }))
    expect(window.open).toHaveBeenCalledWith(
        'https://socketscan.io/tx/0x1a44ec6f4652f4635064fee89516d22495d2827e8127c8a7afe2b67affca7913',
        '_blank'
    )

    const source = await screen.findByLabelText('USDC')
    expect(await within(source).findByText('-157.2')).toBeInTheDocument()
    expect(await within(source).findByText('-$157')).toBeInTheDocument()
    expect(
        await within(source).findByLabelText('Completed')
    ).toBeInTheDocument()
    const sourceRefuel = await screen.findByLabelText('MATIC')
    expect(await within(sourceRefuel).findByText('-8.701')).toBeInTheDocument()
    expect(
        await within(sourceRefuel).findByLabelText('Completed')
    ).toBeInTheDocument()
    const target = await screen.findByLabelText('USDT')
    expect(await within(target).findByText('+156.9')).toBeInTheDocument()
    expect(await within(target).findByText('+$156')).toBeInTheDocument()
    expect(await within(target).findByLabelText('Pending')).toBeInTheDocument()
    const targetRefuel = await screen.findByLabelText('ETH')
    expect(
        await within(targetRefuel).findByText('+0.003053')
    ).toBeInTheDocument()
    expect(
        await within(targetRefuel).findByLabelText('Pending')
    ).toBeInTheDocument()

    env.api['@socket/bridge-status'] = jest.fn(() => [
        200,
        bridgeStatusPolygonUSDCArbitrumUSDTRefuelPendingRefuel,
    ])
    await act(() => {
        jest.runOnlyPendingTimers()
        jest.advanceTimersByTime(5000)
    })
    expect(
        await within(target).findByLabelText('Completed')
    ).toBeInTheDocument()

    env.api['@socket/bridge-status'] = jest.fn(() => [
        200,
        bridgeStatusPolygonUSDCArbitrumUSDTRefuelCompleted,
    ])
    await act(() => {
        jest.runOnlyPendingTimers()
        jest.advanceTimersByTime(5000)
    })
    await runLottieListeners()

    expect(
        await within(await screen.findByLabelText('ETH')).findByLabelText(
            'Completed'
        )
    ).toBeInTheDocument()

    await userEvent.click(
        await within(await screen.findByLabelText('Bridge')).findByRole(
            'button',
            { name: 'Close' }
        )
    )

    await act(() => {
        jest.runOnlyPendingTimers()
        jest.advanceTimersByTime(5000)
    })

    expect(
        await screen.findByRole('button', { name: 'Portfolio' })
    ).toBeInTheDocument()

    jest.useRealTimers()
})
