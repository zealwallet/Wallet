import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
    successfulUnblockLogin,
    unblockUserNotFound,
} from '@zeal/domains/Currency/domains/BankTransfer/api/fixtures/login'
import { testPassword } from '@zeal/domains/KeyStore/api/fixtures/testPassword'
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

test(`As a user, I should be able to setup bank transfers, so I can do deposits and withdrawals`, async () => {
    env.chromeMocks.storages.session = {}
    env.chromeMocks.storages.local[LS_KEY] = JSON.stringify(onlyPKAccount)

    renderPage('/page_entrypoint.html?type=bank_transfer')

    await userEvent.type(
        await screen.findByPlaceholderText('Enter password'),
        `${testPassword}{enter}`
    )

    expect(
        await screen.findByText('Free, fast bank transfers')
    ).toBeInTheDocument()

    await userEvent.click(screen.getByText('Get started'))

    expect(await screen.findByText('Choose wallet')).toBeInTheDocument()
    expect(
        await screen.findByText('Choose your wallet wisely')
    ).toBeInTheDocument()

    expect(
        await screen.findByRole('button', { name: 'Continue' })
    ).toBeDisabled()

    await userEvent.click(await screen.findByLabelText('Private Key 1'))

    expect(
        await screen.findByRole('button', { name: 'Continue' })
    ).toBeEnabled()

    env.api['/wallet/unblock/']['/auth/login'].post = () => [
        400,
        unblockUserNotFound,
    ]

    await userEvent.click(
        await screen.findByRole('button', { name: 'Continue' })
    )

    await runLottieListeners()

    expect(
        await screen.findByText('Link your bank account')
    ).toBeInTheDocument()

    await userEvent.type(
        await screen.findByPlaceholderText('Vitalik'),
        `Vitalik`
    )
    await userEvent.type(
        await screen.findByPlaceholderText('Buterin'),
        `Buterin`
    )
    await userEvent.type(
        await screen.findByPlaceholderText('@email.com'),
        `vb@example.com`
    )
    await userEvent.click(await screen.findByText('Country'))

    await userEvent.click(await screen.findByText('United Kingdom'))

    env.api['/wallet/unblock/']['/user'].post = () => [
        200,
        { status: 'CREATED', first_name: 'Vitalik', last_name: 'Buterin' },
    ]
    env.api['/wallet/unblock/']['/auth/login'].post = () => [
        200,
        successfulUnblockLogin,
    ]
    env.api['/wallet/smart-wallet/unblock/']['/user/bank-account/remote'].get =
        () => [200, []]
    env.api['/wallet/smart-wallet/unblock/']['/user/bank-account/unblock'].get =
        () => [200, []]

    await userEvent.click(
        await screen.findByRole('button', { name: 'Continue' })
    )

    await userEvent.type(
        await screen.findByPlaceholderText('00000000'),
        `12345678`
    )
    await userEvent.type(
        await screen.findByPlaceholderText('00-00-00'),
        `12-34-56`
    )

    env.api['/wallet/smart-wallet/unblock/']['/user/bank-account/remote'].post =
        () => [200, { uuid: '06f9fd73-d3d7-40db-aab4-dcd2f2c94c0c' }]
    env.api['/wallet/smart-wallet/unblock/'][
        '/user/bank-account/remote/:uuid'
    ].get = () => [
        200,
        {
            uuid: '06f9fd73-d3d7-40db-aab4-dcd2f2c94c0c',
            main_beneficiary: true,
            account_number: '31510604',
            bic: null,
            iban: null,
            sort_code: '100000',
            currency: 'GBP',
        },
    ]

    await userEvent.click(
        await screen.findByRole('button', { name: 'Continue' })
    )

    expect(await screen.findByText('Account set up')).toBeInTheDocument()

    env.api['/wallet/smart-wallet/unblock/']['/user'].get = () => [
        200,
        { status: 'CREATED', first_name: 'Vitalik', last_name: 'Buterin' },
    ]
    env.api['/wallet/smart-wallet/unblock/']['/user/transactions'].get = () => [
        200,
        [],
    ]
    env.api['/wallet/smart-wallet/unblock/']['/exchange-rates/'].get = () => [
        200,
        { exchange_rate: 1.2173 },
    ]
    env.api['/wallet/smart-wallet/unblock/']['/fees'].get = () => [
        200,
        {
            unblock_fee: 0.002,
            merchant_fee: { amount: 0, type: 'add' },
            total_fee_percentage: 0.002,
        },
    ]

    await runLottieListeners()

    expect(await screen.findByText('Deposit')).toBeInTheDocument()
    expect(await screen.findByText('Withdraw')).toBeInTheDocument()
})
