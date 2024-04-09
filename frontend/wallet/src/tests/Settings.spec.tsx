import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { cleanEnv, mockEnv, TestEnvironment } from 'src/tests/env'
import { renderPage } from 'src/tests/utils/renderers'

let env: TestEnvironment

beforeEach(() => {
    env = mockEnv()
})

afterEach(() => {
    cleanEnv(env)
})

test('As a user I should be able to see current version of extension, so I know if I need to check for updates', async () => {
    env.chromeMocks.manifest.version = '1.2.34'

    await renderPage('/index.html?type=extension&mode=popup')

    await userEvent.click(
        await screen.findByRole('button', {
            name: 'Settings',
            pressed: false,
        })
    )

    expect(
        screen.getByRole('button', {
            name: 'Settings',
            pressed: true,
        })
    ).toBeInTheDocument()

    expect(screen.getByText('Version 1.2.34')).toBeInTheDocument()
})
