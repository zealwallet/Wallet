import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { testAccountPK } from '@zeal/domains/KeyStore/api/fixtures/testAccountPK'
import { localStorageOnboarded } from '@zeal/domains/Storage/api/fixtures/localStorage'
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
})

test(`As a user I should be able to add account by PK, so I can use this account for transactions
    As a user I should be able to add account, even if this account already exists as account of other keystore type, so the keystore type will change, but rest account properties will be persisted
    As a user I should be able to go back to choosing a way of account add, so I can change my mind after selecting account restore`, async () => {
    env.chromeMocks.storages.local[LS_KEY] = JSON.stringify(
        localStorageOnboarded
    )

    renderPage('/page_entrypoint.html?type=add_account')

    await userEvent.click(
        await screen.findByRole('button', { name: 'Private Key' })
    )

    await userEvent.click(await screen.findByRole('button', { name: 'Back' }))

    await userEvent.click(
        await screen.findByRole('button', { name: 'Private Key' })
    )

    expect(
        await screen.findByText(
            'Enter your Private Key or Secret Phrase separated by spaces'
        )
    ).toBeInTheDocument()

    const continueButton = await screen.findByRole('button', {
        name: 'Continue',
    })
    let pkInput = await screen.findByPlaceholderText('Type or paste here')

    expect(continueButton).toBeDisabled()

    await userEvent.type(pkInput, 'abc')

    expect(pkInput).toHaveAttribute('type', 'password')
    await userEvent.click(await screen.findByRole('button', { name: 'Reveal' }))
    // need to re-fetch input as it is new component after type change to make not to lose value on ios
    pkInput = await screen.findByPlaceholderText('Type or paste here')
    await waitFor(() => {
        expect(pkInput).toHaveAttribute('type', 'text')
    })

    await userEvent.click(await screen.findByRole('button', { name: 'Hide' }))
    pkInput = await screen.findByPlaceholderText('Type or paste here')
    expect(pkInput).toHaveAttribute('type', 'password')

    expect(continueButton).not.toBeDisabled()
    await userEvent.click(continueButton)

    expect(
        await screen.findByText('This is not a valid private key')
    ).toBeInTheDocument()

    await userEvent.clear(pkInput)
    await userEvent.paste(pkInput, testAccountPK)

    await userEvent.click(continueButton)

    expect(await screen.findByText('Private key added 🎉')).toBeInTheDocument()

    await runLottieListeners()
})
