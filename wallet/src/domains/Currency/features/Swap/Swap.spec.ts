import { act, screen, within } from '@testing-library/react'
import { renderPage } from 'src/tests/utils/renderers'

import userEvent from '@testing-library/user-event'
import { allowanceEthereumUSDC } from 'src/domains/Currency/domains/SwapQuote/api/fixtures/allowanceEthereumUSDC'
import { allowancePolygonUSDC } from 'src/domains/Currency/domains/SwapQuote/api/fixtures/allowancePolygonUSDC'
import { buildTxApprovalEthereumUSDC } from 'src/domains/Currency/domains/SwapQuote/api/fixtures/buildTxApprovalEthereumUSDC'
import { buildTxApprovalPolygonUSDC } from 'src/domains/Currency/domains/SwapQuote/api/fixtures/buildTxApprovalPolygonUSDC'
import { buildTxSwapEthereumUSDCUSDT } from 'src/domains/Currency/domains/SwapQuote/api/fixtures/buildTxSwapEthereumUSDCUSDT'
import { buildTxSwapPolygonUSDCMATIC } from 'src/domains/Currency/domains/SwapQuote/api/fixtures/buildTxSwapPolygonUSDCMATIC'
import {
    swapQuoteOneInchEthereumUSDCUSDT,
    swapQuoteOneInchPolygonUSDCMATIC,
    swapQuotePolygonMaticUSDCNoRoutes,
} from 'src/domains/Currency/domains/SwapQuote/api/fixtures/swapQuote'
import { testPassword } from 'src/domains/KeyStore/api/fixtures/testPassword'
import {
    onlyPKAccount,
    onlyPKAccountEmptyPortfolio,
} from 'src/domains/Storage/api/fixtures/localStorage'
import { LS_KEY } from '@zeal/domains/Storage/constants'
import { TestEnvironment, cleanEnv, mockEnv } from 'src/tests/env'
import { runLottieListeners } from 'src/tests/mocks/lottie'
import { ethGetTransactionReceipt } from 'src/domains/RPCRequest/api/fixtures/ethGetTransactionReceipt'
import { ethGetTransactionByHashWithBlockNumber } from 'src/domains/RPCRequest/api/fixtures/ethGetTransactionByHash'
import { ethBlockNumberAfterTransaction } from 'src/domains/RPCRequest/api/fixtures/ethBlockNumber'

let env: TestEnvironment

let originalClose: Window['close']

beforeEach(() => {
    env = mockEnv()
    originalClose = window.close
})

afterEach(() => {
    cleanEnv(env)
    window.close = originalClose
    jest.restoreAllMocks()
})

test(`As a user I should be able to open swap flow even is my portfolio is empty, so I can explore the feature
    As a user I should see the account label for which I want to swap, so I won't do swap on wrong account by mistake
    As a user I should not be able to continue swap if I'm not selected destination token, so I'll be motivated to select one
    As a user I should see an error if Zeal was not able to load swap providers, so I can retry
    As a user I should be able to select source token, so I can choose which token I want to swap from
    As a user I should be see a message that token I'm searching for is not found, so I know that this token is not supported yet
    As a user I should be able to search source and destination tokens, so I can quickly find the token I'm looking for
    As a user I should be able to set slippage from available options or provide custom, so I make sure my swap parameters are under control
    As a user I should be able to select destination token, so I can choose which token I want to swap to`, async () => {
    env.chromeMocks.storages.session = {}
    env.chromeMocks.storages.local[LS_KEY] = JSON.stringify(
        onlyPKAccountEmptyPortfolio
    )

    renderPage(
        '/page_entrypoint.html?type=swap&fromAddress=0x26D0d88fFe184b1BA244D08Fb2a0c695e65c8932'
    )

    await userEvent.type(
        await screen.findByPlaceholderText('Enter password'),
        `${testPassword}{enter}`
    )

    expect(await screen.findByText('0x26D0...8932')).toBeInTheDocument()
    expect(await screen.findByText('Private Key 1')).toBeInTheDocument()
    expect(await screen.findByText('Swap')).toBeInTheDocument()

    expect(
        await screen.findByRole('button', { name: 'Continue' })
    ).toBeDisabled()

    // From token
    await userEvent.click(await screen.findByRole('button', { name: 'ETH' }))
    let tokens = await screen.findByLabelText('Tokens')
    await userEvent.type(
        await within(tokens).findByPlaceholderText('Search'),
        'USDC'
    )
    await userEvent.click(await within(tokens).findByLabelText('USDC'))
    expect(tokens).not.toBeInTheDocument()
    expect(
        await screen.findByRole('button', { name: 'USDC' })
    ).toBeInTheDocument()

    // To token
    await userEvent.click(
        await screen.findByRole('button', { name: 'Select token' })
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
    await userEvent.click(await within(tokens).findByLabelText('USDT'))
    expect(tokens).not.toBeInTheDocument()
    expect(
        await screen.findByRole('button', { name: 'USDT' })
    ).toBeInTheDocument()

    await userEvent.type(await screen.findByLabelText('Amount to swap'), '10')

    env.api['@socket/quote'] = jest.fn(() => [
        200,
        swapQuoteOneInchEthereumUSDCUSDT,
    ])
    env.api['@socket/approval/check-allowance'] = jest.fn(() => [
        200,
        allowanceEthereumUSDC,
    ])
    env.api['@socket/approval/build-tx'] = jest.fn(() => [
        200,
        buildTxApprovalEthereumUSDC,
    ])
    env.api['@socket/build-tx'] = jest.fn(() => [
        200,
        buildTxSwapEthereumUSDCUSDT,
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
                userAddress: '0x26D0d88fFe184b1BA244D08Fb2a0c695e65c8932',
                defaultSwapSlippage: '0.50',
                fromAmount: '10000000',
                fromChainId: '0x1',
                toChainId: '0x1',
                fromTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                toTokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            }),
        })
    )
    expect(env.api['@socket/approval/check-allowance']).toHaveBeenCalledWith(
        expect.objectContaining({
            params: expect.objectContaining({
                allowanceTarget: '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
                chainID: '1',
                owner: '0x26D0d88fFe184b1BA244D08Fb2a0c695e65c8932',
                tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            }),
        })
    )
    expect(env.api['@socket/approval/build-tx']).toHaveBeenCalledWith(
        expect.objectContaining({
            params: {
                allowanceTarget: '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
                amount: '10000000',
                chainID: '1',
                owner: '0x26D0d88fFe184b1BA244D08Fb2a0c695e65c8932',
                tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            },
        })
    )

    // Route
    expect(await screen.findByLabelText('Destination amount')).toHaveValue(
        '9.96'
    )
    expect(await screen.findByLabelText('1Inch')).toHaveAccessibleDescription(
        'Network fees $5.93'
    )
    await userEvent.click(await screen.findByLabelText('1Inch'))
    const providerModal = await screen.findByLabelText('Swap provider')
    const oneInch = await within(providerModal).findByLabelText('1Inch')
    expect(await within(oneInch).findByText('9.96 USDT')).toBeInTheDocument()
    expect(
        await within(oneInch).findByText('Network fees $5.93')
    ).toBeInTheDocument()
    expect(
        await within(oneInch).findByLabelText('Best return route')
    ).toBeInTheDocument()
    await userEvent.click(
        await within(providerModal).findByRole('button', {
            name: 'Slippage 0.5%',
        })
    )
    await userEvent.click(
        await within(
            await screen.findByRole('dialog', { name: 'Slippage settings' })
        ).findByRole('radio', { name: '0.5%' })
    )

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
            params: expect.objectContaining({ defaultSwapSlippage: '1.00' }),
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
        '0.38{enter}'
    )
    // FIME: remove following line after FloatInput migrated - added because {enter} above is not working
    await userEvent.click(await screen.findByRole('button', { name: 'Save' }))

    expect(slippageModal).not.toBeInTheDocument()
    expect(
        await screen.findByRole('button', { name: 'Not enough balance' })
    ).toBeDisabled()
    expect(env.api['@socket/quote']).toHaveBeenCalledWith(
        expect.objectContaining({
            params: expect.objectContaining({ defaultSwapSlippage: '0.38' }),
        })
    )
    expect(
        JSON.parse((await chrome.storage.local.get(LS_KEY))[LS_KEY])
    ).toEqual(expect.objectContaining({ swapSlippagePercent: 0.38 }))
})

test(`As a user I should be able to open swap with source token specified, so I can swap quicker
    As a user I should be able to switch network on swap, so I can swap on different networks
    As a user I should be able to submit swap, so my swap will be sent to RPC`, async () => {
    window.close = jest.fn()
    env.chromeMocks.storages.session = {}
    env.chromeMocks.storages.local[LS_KEY] = JSON.stringify(onlyPKAccount)
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
        buildTxSwapPolygonUSDCMATIC,
    ])

    renderPage(
        '/page_entrypoint.html?type=swap&fromAddress=0x26D0d88fFe184b1BA244D08Fb2a0c695e65c8932&fromCurrencyId=Polygon%7C0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
    )

    await userEvent.type(
        await screen.findByPlaceholderText('Enter password'),
        `${testPassword}{enter}`
    )

    expect(await screen.findByText('0x26D0...8932')).toBeInTheDocument()
    expect(await screen.findByText('Private Key 1')).toBeInTheDocument()
    expect(await screen.findByText('Swap')).toBeInTheDocument()

    expect(
        await screen.findByRole('button', { name: 'Continue' })
    ).toBeDisabled()

    expect(
        await screen.findByRole('button', { name: 'USDC' })
    ).toBeInTheDocument()
    await userEvent.click(
        await screen.findByRole('button', { name: 'Select token' })
    )
    let tokens = await screen.findByLabelText('Tokens')
    await userEvent.click(await within(tokens).findByLabelText('MATIC'))
    expect(tokens).not.toBeInTheDocument()
    expect(
        await screen.findByRole('button', { name: 'MATIC' })
    ).toBeInTheDocument()

    // Switch to Arbitrum
    const [fromNetwork] = await screen.findAllByRole('button', {
        name: 'Polygon',
    })
    await userEvent.click(fromNetwork)
    await userEvent.click(
        await screen.findByRole('button', { name: 'Arbitrum' })
    )
    expect(
        await screen.findByRole('button', { name: 'ETH' })
    ).toBeInTheDocument()

    // Back to Polygon
    await userEvent.click(
        await screen.findByRole('button', { name: 'Select token' })
    )
    tokens = await screen.findByLabelText('Tokens')
    await userEvent.click(
        await within(tokens).findByRole('button', { name: 'Arbitrum' })
    )
    await userEvent.click(
        await screen.findByRole('button', { name: 'Polygon' })
    )
    expect(tokens).not.toBeInTheDocument()

    // Set tokens
    await userEvent.click(await screen.findByRole('button', { name: 'MATIC' }))
    tokens = await screen.findByLabelText('Tokens')
    await userEvent.click(
        await within(tokens).findByRole('button', { name: 'USDC' })
    )
    await userEvent.click(
        await screen.findByRole('button', { name: 'Select token' })
    )
    tokens = await screen.findByLabelText('Tokens')
    await userEvent.click(
        await within(tokens).findByRole('button', { name: 'MATIC' })
    )
    expect(tokens).not.toBeInTheDocument()

    // Try no routes
    await userEvent.type(await screen.findByLabelText('Amount to swap'), '1')
    expect(
        await screen.findByRole('button', { name: 'No routes found' })
    ).toBeDisabled()

    // Above available balance and full balance
    env.api['@socket/quote'] = jest.fn(() => [
        200,
        swapQuoteOneInchPolygonUSDCMATIC,
    ])
    await userEvent.type(await screen.findByLabelText('Amount to swap'), '160')
    expect(
        await screen.findByRole('button', { name: 'Not enough balance' })
    ).toBeDisabled()
    await userEvent.click(
        await screen.findByRole('button', { name: 'Balance 157.2' })
    )
    expect(await screen.findByLabelText('Amount to swap')).toHaveValue(
        '157.223311'
    )
    expect(await screen.findByText('$157')).toBeInTheDocument()
    expect(await screen.findByLabelText('1Inch')).toHaveAccessibleDescription(
        'Network fees $0.07'
    )
    expect(await screen.findByLabelText('Destination amount')).toHaveValue(
        '242'
    )

    expect(env.api['@socket/quote']).toHaveBeenCalledWith(
        expect.objectContaining({
            params: expect.objectContaining({
                defaultSwapSlippage: '0.50',
                fromAmount: '157223311',
                fromChainId: '0x89',
                fromTokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
                toChainId: '0x89',
                toTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
                userAddress: '0x26D0d88fFe184b1BA244D08Fb2a0c695e65c8932',
            }),
        })
    )
    expect(env.api['@socket/approval/check-allowance']).toHaveBeenCalledWith(
        expect.objectContaining({
            params: expect.objectContaining({
                allowanceTarget: '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
                chainID: '137',
                owner: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                tokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
            }),
        })
    )
    expect(env.api['@socket/approval/build-tx']).toHaveBeenCalledWith(
        expect.objectContaining({
            params: {
                allowanceTarget: '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
                amount: '157223311',
                chainID: '137',
                owner: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                tokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
            },
        })
    )

    const submitButton = await screen.findByRole('button', { name: 'Continue' })
    expect(submitButton).not.toBeDisabled()

    jest.useFakeTimers()
    await userEvent.click(submitButton)
    expect(await screen.findByText('Simulating...')).toBeInTheDocument()
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
    expect(await screen.findByText('Simulating...')).toBeInTheDocument()
    await act(() => {
        jest.runOnlyPendingTimers()
        jest.advanceTimersByTime(5000)
    })
    await runLottieListeners()

    // Swap transaction
    await userEvent.click(await screen.findByRole('button', { name: 'Submit' }))

    await act(() => {
        jest.runOnlyPendingTimers()
        jest.advanceTimersByTime(5000)
    })
    await runLottieListeners()

    await userEvent.click(await screen.findByRole('button', { name: 'Close' }))

    expect(window.close).toHaveBeenCalled()

    jest.useRealTimers()
})
