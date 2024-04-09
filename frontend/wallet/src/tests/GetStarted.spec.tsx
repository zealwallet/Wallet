import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { LS_KEY } from '@zeal/domains/Storage/constants'

import { cleanEnv, mockEnv, TestEnvironment } from 'src/tests/env'
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
})

test('As a user I should be able to open freshly installed extension, so I can start my onboarding process', async () => {
    env.chromeMocks.storages.local[LS_KEY] = JSON.stringify(null)
    window.open = jest.fn()

    await renderPage('/index.html?type=extension&mode=popup')

    await userEvent.click(await screen.findByText('Get Started'))

    expect(window.open).toHaveBeenCalledWith(
        'chrome-extension://ext-id/page_entrypoint.html?type=onboarding',
        '_blank'
    )
})
