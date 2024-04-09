import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { localStorageConnected } from '@zeal/domains/Storage/api/fixtures/localStorage'
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

test(`As a user I should see my connections, so that I have the real picture of the state and I am able to disconnect
    When I disconnect a connection, I should no longer see that connection in the list of connections.
    When I disconnect all connections, I should have an empty list of connections.`, async () => {
    env.chromeMocks.storages.local[LS_KEY] = JSON.stringify(
        localStorageConnected
    )

    await renderPage('/index.html?type=extension&mode=popup')

    await userEvent.click(
        await screen.findByRole('button', {
            name: 'Settings',
        })
    )

    await userEvent.click(
        await screen.findByRole('button', {
            name: 'Connections',
        })
    )

    expect(
        await screen.findByRole('button', {
            name: 'Disconnect all',
        })
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'DEX1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'DEX2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'DEX3' })).toBeInTheDocument()
    expect(screen.queryByText('You have no connected apps')).toBeNull()

    // Disconnect one connection

    await userEvent.click(
        await screen.findByRole('button', {
            name: 'DEX1',
        })
    )

    await userEvent.click(
        await screen.findByRole('button', {
            name: 'Disconnect',
        })
    )

    expect(await screen.findByText('Apps Disconnected')).toBeInTheDocument()

    await runLottieListeners()

    // Go back to connections screen and do not see the connection anymore

    await userEvent.click(
        await screen.findByRole('button', {
            name: 'Settings',
        })
    )

    await userEvent.click(
        await screen.findByRole('button', {
            name: 'Connections',
        })
    )

    expect(
        await screen.findByRole('button', {
            name: 'Disconnect all',
        })
    ).toBeInTheDocument()

    expect(screen.queryByRole('button', { name: 'DEX1' })).toBeNull()
    expect(screen.getByRole('button', { name: 'DEX2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'DEX3' })).toBeInTheDocument()
    expect(screen.queryByText('You have no connected apps')).toBeNull()

    // Disconnect all connections

    await userEvent.click(
        await screen.findByRole('button', {
            name: 'Disconnect all',
        })
    )

    expect(
        await screen.findByText(
            'Are you sure you want to disconnect all connections?'
        )
    ).toBeInTheDocument()

    const dialog = await screen.findByRole('dialog')

    const confirmButton = await within(dialog).findByRole('button', {
        name: 'Disconnect all',
    })

    await userEvent.click(confirmButton)

    expect(await screen.findByText('Apps Disconnected')).toBeInTheDocument()

    await runLottieListeners()

    // Go back to connections screen and see no connections

    await userEvent.click(
        await screen.findByRole('button', {
            name: 'Settings',
        })
    )

    await userEvent.click(
        await screen.findByRole('button', {
            name: 'Connections',
        })
    )

    expect(
        await screen.findByText('You have no connected apps')
    ).toBeInTheDocument()
})
