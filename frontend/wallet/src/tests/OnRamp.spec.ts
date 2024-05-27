import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
    unblockEURtoUSDRate,
    unblockGBPtoUSDRate,
} from '@zeal/domains/Currency/domains/BankTransfer/api/fixtures/exchangeRate'
import {
    onRampCompleted,
    onRampCryptoIssued,
    onRampOutsideTransferReceived,
} from '@zeal/domains/Currency/domains/BankTransfer/api/fixtures/webhookEvents'
import { testPassword } from '@zeal/domains/KeyStore/api/fixtures/testPassword'
import {
    bankTransferOnboarded,
    portfolioMap,
} from '@zeal/domains/Storage/api/fixtures/localStorage'
import { LS_KEY, PORTFOLIO_MAP_KEY } from '@zeal/domains/Storage/constants'

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

test(`As a user, I should be able to setup onramp, so I can learn how to top up my wallet and see bank account details
    As a user I should be able to see different steps of my on ramp process, so I know where my funds are`, async () => {
    env.chromeMocks.storages.session = {}
    env.chromeMocks.storages.local[LS_KEY] = JSON.stringify(
        bankTransferOnboarded
    )
    env.chromeMocks.storages.local[PORTFOLIO_MAP_KEY] =
        JSON.stringify(portfolioMap)

    env.api['/wallet/smart-wallet/unblock/']['/exchange-rates/'].get = () => [
        200,
        unblockGBPtoUSDRate,
    ]

    renderPage('/page_entrypoint.html?type=bank_transfer')

    await userEvent.type(
        await screen.findByPlaceholderText('Enter password'),
        `${testPassword}{enter}`
    )

    let depositAmountInput = await screen.findByRole('textbox', {
        name: 'Amount to deposit',
    })

    let continueButton = await screen.findByRole('button', {
        name: 'Continue',
    })

    expect(continueButton).toBeDisabled()

    await userEvent.type(depositAmountInput, '100')
    expect(depositAmountInput).toHaveValue('£100')

    expect(
        await screen.findByRole('textbox', { name: 'Destination amount' })
    ).toHaveValue('122')

    // FIXME ensure fees loaded, then check enabled\disabled button, then click

    expect(continueButton).toBeEnabled()
    await userEvent.click(continueButton)

    expect(await screen.findByLabelText('To beneficiary')).toHaveTextContent(
        'Vasily Pupkin'
    )
    expect(await screen.findByLabelText('Account')).toHaveTextContent(
        '00123670'
    )
    expect(await screen.findByLabelText('Sort Code')).toHaveTextContent(
        '01-23-79'
    )

    await userEvent.click(await screen.findByRole('button', { name: 'Back' }))

    await userEvent.click(await screen.findByRole('button', { name: /GBP/ }))

    const chooseCurrencyScreen = await screen.findByLabelText('Choose currency')

    env.api['/wallet/smart-wallet/unblock/']['/exchange-rates/'].get = () => [
        200,
        unblockEURtoUSDRate,
    ]

    await userEvent.click(
        await within(chooseCurrencyScreen).findByRole('button', {
            name: 'EUR',
        })
    )

    expect(chooseCurrencyScreen).not.toBeInTheDocument()

    continueButton = await screen.findByRole('button', {
        name: 'Continue',
    })

    depositAmountInput = await screen.findByRole('textbox', {
        name: 'Amount to deposit',
    })

    expect(continueButton).toBeDisabled()

    await userEvent.type(depositAmountInput, '100')
    expect(depositAmountInput).toHaveValue('€100')

    expect(
        await screen.findByRole('textbox', { name: 'Destination amount' })
    ).toHaveValue('105.4')

    expect(continueButton).toBeEnabled()

    jest.useFakeTimers()

    await userEvent.click(
        await screen.findByRole('button', {
            name: 'Continue',
        })
    )

    expect(await screen.findByLabelText('To beneficiary')).toHaveTextContent(
        'Vasily Pupkin'
    )
    expect(await screen.findByLabelText('IBAN')).toHaveTextContent(
        'MT61 CFTE 1230 4000 0000 0000 4566 567'
    )

    env.api['/wallet/smart-wallet/unblock/webhook/'].get = () => [
        200,
        onRampOutsideTransferReceived,
    ]
    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    expect(await screen.findByLabelText('EUR')).toHaveTextContent(/-4\.76/)
    expect(
        await screen.findByRole('progressbar', { name: 'Funds received' })
    ).toBeInTheDocument()

    env.api['/wallet/smart-wallet/unblock/webhook/'].get = () => [
        200,
        onRampCryptoIssued,
    ]
    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    expect(await screen.findByLabelText('EUR')).toHaveTextContent('-4.76')
    expect(await screen.findByLabelText('USDC.e')).toHaveTextContent('+5')
    expect(
        await screen.findByRole('progressbar', {
            name: 'Sending to your wallet',
        })
    ).toBeInTheDocument()

    env.api['/wallet/smart-wallet/unblock/webhook/'].get = () => [
        200,
        onRampCompleted,
    ]
    await act(() => {
        jest.advanceTimersByTime(10000)
    })
    await runLottieListeners()

    expect(await screen.findByLabelText('EUR')).toHaveTextContent('-4.76')
    expect(await screen.findByLabelText('USDC.e')).toHaveTextContent('+5')
    expect(
        await screen.findByRole('progressbar', {
            name: `You've received USDC.e`,
        })
    ).toBeInTheDocument()
    expect(
        await screen.findByText(
            'Your bank transfer has successfully transferred EUR to USDC.e.'
        )
    ).toBeInTheDocument()

    jest.useRealTimers()

    await userEvent.click(await screen.findByRole('button', { name: 'Close' }))

    expect(
        await screen.findByRole('button', { name: 'Portfolio' })
    ).toBeInTheDocument()
})
