import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { wait } from '@testing-library/user-event/dist/utils'

import { testPassword } from '@zeal/domains/KeyStore/api/fixtures/testPassword'
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

test(`As a user I should be able to generate new account, so I can user Zeal even if I'm a new user`, async () => {
    jest.mock('expo-crypto', () => ({
        ...jest.requireActual('expo-crypto'),
        randomBytes: jest.fn((size: number) =>
            Uint8Array.from(new Array(size).fill(0).map((_, index) => index))
        ),
    }))

    env.chromeMocks.storages.local[LS_KEY] = undefined
    env.chromeMocks.storages.session = {}

    renderPage('/page_entrypoint.html?type=onboarding')

    await wait(2000)

    await userEvent.click(await screen.findByText('Get started'))

    await screen.findByText(
        'Have you used a self-custodial web3 wallet before?'
    )

    await userEvent.click(await screen.findByText('I’ve used web3 before'))

    await userEvent.type(
        await screen.findByPlaceholderText('Create password'),
        testPassword
    )

    await userEvent.click(
        await screen.findByRole('button', { name: 'Continue' })
    )

    expect(
        await screen.findByRole('button', { name: 'Continue' })
    ).toBeDisabled()

    await userEvent.type(
        await screen.findByPlaceholderText('Re-enter password'),
        testPassword
    )

    expect(
        await screen.findByRole('button', { name: 'Continue' })
    ).not.toBeDisabled()

    await userEvent.click(
        await screen.findByRole('button', { name: 'Continue' })
    )
    expect(await screen.findByText('Password created 🔥')).toBeInTheDocument()

    await runLottieListeners()

    await userEvent.click(
        await screen.findByText('Create, Connect or Import Wallet')
    )

    await userEvent.click(await screen.findByText('Create wallet'))

    expect(await screen.findByText('New wallet created 🎉')).toBeInTheDocument()

    await wait(100)

    await runLottieListeners()

    expect(
        await screen.findByRole('button', { name: 'Portfolio' })
    ).toBeInTheDocument()
})
