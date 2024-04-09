import { screen, within } from '@testing-library/react'

import { cleanEnv, mockEnv, TestEnvironment } from 'src/tests/env'
import { renderPage } from 'src/tests/utils/renderers'

let env: TestEnvironment

beforeEach(() => {
    env = mockEnv()
})

afterEach(() => {
    cleanEnv(env)
})

test(`As a user I should be able to see my tokens and their balances when I load extension, so I can do actions with them accordingly
    As a user I should be able to see price changes of my tokens for last 24h, so I can plan my actions using this information`, async () => {
    await renderPage('/index.html?type=extension&mode=popup')

    const ethToken = await within(
        await screen.findByLabelText('Tokens')
    ).findByLabelText('ETH')

    expect(await within(ethToken).findByText('0.01971')).toBeInTheDocument()
    expect(await within(ethToken).findByText('$31')).toBeInTheDocument()
    expect(await within(ethToken).findByText('$1,621.60')).toBeInTheDocument()
    expect(await within(ethToken).findByText('-0.05%')).toBeInTheDocument()
})
