import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { testPassword } from '@zeal/domains/KeyStore/api/fixtures/testPassword'

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

test(`As a user I should be able to reveal my secret phrase, so I can write it down
    As a user I should be challenged by the app if I wrote down my secret phrase, so in case I forgot it - I'll be able to restore my account`, async () => {
    env.chromeMocks.storages.session = {}

    await renderPage(
        '/index.html?type=setup_recovery_kit&address=0x83f1caadabeec2945b73087f803d404f054cc2b7'
    )

    await userEvent.type(
        await screen.findByPlaceholderText('Enter password'),
        testPassword
    )
    await userEvent.click(
        await screen.findByRole('button', { name: 'Continue' })
    )

    await userEvent.click(
        await screen.findByRole('button', { name: 'Manual backup' })
    )

    const passwordPopup = await screen.findByRole('dialog', {
        name: 'Enter password',
    })

    await userEvent.type(
        await within(passwordPopup).findByPlaceholderText(''),
        testPassword
    )

    await userEvent.click(
        await within(passwordPopup).findByRole('button', { name: 'Continue' })
    )

    const beforeYouBegin = await screen.findByLabelText('Before you begin')

    const firstCheckbox = await within(beforeYouBegin).findByRole('checkbox', {
        name: 'I understand that anyone with my Secret Phrase can transfer my assets',
    })
    const secondCheckbox = await within(beforeYouBegin).findByRole('checkbox', {
        name: 'I’m responsible for keeping my Secret Phrase secret and safe',
    })
    const thirdCheckbox = await within(beforeYouBegin).findByRole('checkbox', {
        name: 'I’m in a private place with no people or cameras around me',
    })

    const continueButton = await within(beforeYouBegin).findByRole('button', {
        name: 'Continue',
    })

    expect(firstCheckbox).not.toBeChecked()
    expect(firstCheckbox).not.toHaveAttribute('aria-disabled')
    expect(secondCheckbox).not.toBeChecked()
    expect(secondCheckbox).toHaveAttribute('aria-disabled')
    expect(thirdCheckbox).not.toBeChecked()
    expect(thirdCheckbox).toHaveAttribute('aria-disabled')
    expect(continueButton).toBeDisabled()

    await userEvent.click(firstCheckbox)

    expect(firstCheckbox).toBeChecked()
    expect(firstCheckbox).not.toHaveAttribute('aria-disabled')
    expect(secondCheckbox).not.toBeChecked()
    expect(secondCheckbox).not.toHaveAttribute('aria-disabled')
    expect(thirdCheckbox).not.toBeChecked()
    expect(thirdCheckbox).toHaveAttribute('aria-disabled')
    expect(continueButton).toBeDisabled()

    await userEvent.click(secondCheckbox)

    expect(firstCheckbox).toBeChecked()
    expect(firstCheckbox).not.toHaveAttribute('aria-disabled')
    expect(secondCheckbox).toBeChecked()
    expect(secondCheckbox).not.toHaveAttribute('aria-disabled')
    expect(thirdCheckbox).not.toBeChecked()
    expect(thirdCheckbox).not.toHaveAttribute('aria-disabled')
    expect(continueButton).toBeDisabled()

    await userEvent.click(thirdCheckbox)

    expect(firstCheckbox).toBeChecked()
    expect(firstCheckbox).not.toHaveAttribute('aria-disabled')
    expect(secondCheckbox).toBeChecked()
    expect(secondCheckbox).not.toHaveAttribute('aria-disabled')
    expect(thirdCheckbox).toBeChecked()
    expect(thirdCheckbox).not.toHaveAttribute('aria-disabled')
    expect(continueButton).not.toBeDisabled()

    await userEvent.click(continueButton)

    const phraseInput = await screen.findByTestId('write-down-phrase-input')

    const phrase = phraseInput.innerHTML
        .replace(/<[^>]+>/gim, ' ')
        .replace(/\s+\d+\.\s+/gim, ' ')
        .trim()
        .split(' ')

    await userEvent.click(await screen.findByRole('button', { name: 'Verify' }))
    await userEvent.click(
        await screen.findByRole('button', { name: 'Let’s do it' })
    )

    let wordNum = await screen.findByText(/#\d/im, { exact: false })
    let word = phrase[parseInt(wordNum.innerHTML.replace(/[^\d]*/im, '')) - 1]
    await userEvent.click(await screen.findByRole('button', { name: word }))

    wordNum = await screen.findByText(/#\d/im, { exact: false })
    word = phrase[parseInt(wordNum.innerHTML.replace(/[^\d]*/im, '')) - 1]
    await userEvent.click(await screen.findByRole('button', { name: word }))

    wordNum = await screen.findByText(/#\d/im, { exact: false })
    word = phrase[parseInt(wordNum.innerHTML.replace(/[^\d]*/im, '')) - 1]
    await userEvent.click(await screen.findByRole('button', { name: word }))

    expect(
        await screen.findByText('Secret Phrase secured 🎉')
    ).toBeInTheDocument()

    await runLottieListeners()
})
