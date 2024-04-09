import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { testPassword } from '@zeal/domains/KeyStore/api/fixtures/testPassword'
import { approvalWithLimitedAmount } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fixtures/approvalWithLimitedAmount'
import { approvalWithUnlimitedAmount } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fixtures/approvalWithUnlimitedAmount'

import { cleanEnv, mockEnv, TestEnvironment } from 'src/tests/env'
import { runLottieListeners } from 'src/tests/mocks/lottie'
import { renderZWidget } from 'src/tests/utils/renderers'

let env: TestEnvironment

const RPC_REQUEST = {
    id: 12345,
    method: 'eth_sendTransaction',
    params: [
        {
            gas: '0x100c4',
            from: '0x61640a8d48bca205ba91b16b0b7745e7abc61084',
            to: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
            data: '0x095ea7b3000000000000000000000000000000000022d473030f116ddee9f6b43ac78ba3ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
        },
    ],
}

beforeEach(() => {
    env = mockEnv()
})

afterEach(() => {
    cleanEnv(env)
})

test('As a user I should be able to edit the allowance value of an Approval so that I can protect myself against problems in the smart contract', async () => {
    env.chromeMocks.storages.session = {}
    const dAppHost = 'dapp.example.com'

    const { toWidget } = await renderZWidget({ dAppHost })
    await toWidget({
        type: 'rpc_request',
        request: {
            id: 0,
            method: 'eth_requestAccounts',
            params: [],
        },
    })
    await userEvent.type(
        await screen.findByPlaceholderText('Enter password'),
        testPassword
    )
    await userEvent.click(
        await screen.findByRole('button', { name: 'Continue' })
    )

    await userEvent.click(
        await screen.findByRole('button', { name: 'Connect Zeal' })
    )

    await runLottieListeners()

    jest.useFakeTimers()

    env.api['/wallet/transaction/simulate/'].post = () => [
        200,
        approvalWithUnlimitedAmount,
    ]

    await toWidget({
        type: 'rpc_request',
        request: RPC_REQUEST,
    })

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    expect(await screen.findByText('Approve')).toBeInTheDocument()

    expect(await screen.findByText('USDC')).toBeInTheDocument()
    expect(await screen.findByText('Spend limit')).toBeInTheDocument()
    expect(await screen.findByText('Unlimited')).toBeInTheDocument()

    await userEvent.click(
        await screen.findByRole('button', { name: 'Safety Checks Passed' })
    )

    let checksDialog = await screen.findByRole('dialog', {
        name: 'Transaction Safety Checks',
    })

    expect(
        await within(checksDialog).findByText(
            'Transaction preview was successful'
        )
    ).toBeInTheDocument()

    await userEvent.click(document.body)

    await userEvent.click(
        await screen.findByRole('button', { name: 'What are Approvals?' })
    )
    expect(
        await screen.findByRole('dialog', { name: 'What are Approvals?' })
    ).toBeInTheDocument()

    await userEvent.click(document.body)

    await userEvent.click(
        await screen.findByRole('button', { name: 'What is spend limit?' })
    )
    expect(
        await screen.findByRole('dialog', { name: 'What is spend limit?' })
    ).toBeInTheDocument()

    await userEvent.click(document.body)

    await userEvent.click(
        await screen.findByRole('button', { name: 'Edit spend limit' })
    )

    let editModal = await screen.findByRole('dialog', {
        name: 'Edit permissions',
    })

    expect(
        await within(editModal).findByRole('button', { name: 'Revert changes' })
    ).toBeDisabled()

    expect(
        await within(editModal).findByRole('switch', {
            name: 'Set to Unlimited',
        })
    ).toBeInTheDocument()
    expect(
        await within(editModal).findByRole('textbox', { name: 'Spend limit' })
    ).toBeDisabled()

    await userEvent.click(
        await within(editModal).findByRole('button', {
            name: 'Warning, high limit',
        })
    )

    expect(
        await screen.findByRole('dialog', { name: 'High spend limit' })
    ).toBeInTheDocument()

    await userEvent.click(document.body)

    await userEvent.click(
        await within(editModal).findByRole('button', { name: 'Cancel' })
    )

    expect(screen.queryByLabelText('Edit permissions')).not.toBeInTheDocument()

    await userEvent.click(
        await screen.findByRole('button', { name: 'Edit spend limit' })
    )

    editModal = await screen.findByRole('dialog', { name: 'Edit permissions' })

    expect(
        await within(editModal).findByRole('textbox', { name: 'Spend limit' })
    ).toBeDisabled()
    expect(
        await within(editModal).findByRole('button', {
            name: 'Warning, high limit',
        })
    ).toBeInTheDocument()

    await userEvent.click(
        await screen.findByRole('switch', { name: 'Set to Unlimited' })
    )

    expect(
        await within(editModal).findByRole('textbox', { name: 'Spend limit' })
    ).not.toBeDisabled()
    expect(
        within(editModal).queryByRole('button', {
            name: 'Warning, high limit',
        })
    ).not.toBeInTheDocument()

    await userEvent.click(
        await within(editModal).findByRole('switch', {
            name: 'Set to Unlimited',
        })
    )

    expect(
        await within(editModal).findByRole('textbox', { name: 'Spend limit' })
    ).toBeDisabled()
    expect(
        await within(editModal).findByRole('button', {
            name: 'Warning, high limit',
        })
    ).toBeInTheDocument()

    await userEvent.click(
        await screen.findByRole('switch', { name: 'Set to Unlimited' })
    )

    await userEvent.click(
        await screen.findByRole('button', { name: 'Revert changes' })
    )

    expect(
        await within(editModal).findByRole('textbox', { name: 'Spend limit' })
    ).toBeDisabled()
    expect(
        await within(editModal).findByRole('button', {
            name: 'Warning, high limit',
        })
    ).toBeInTheDocument()

    await userEvent.click(
        await screen.findByRole('switch', { name: 'Set to Unlimited' })
    )

    await expect(
        await screen.findByRole('button', { name: 'Save changes' })
    ).toBeDisabled()

    await userEvent.type(
        await within(editModal).findByRole('textbox', { name: 'Spend limit' }),
        '1'
    )

    await expect(
        await screen.findByRole('button', { name: 'Save changes' })
    ).not.toBeDisabled()

    env.api['/wallet/transaction/simulate/'].post = jest.fn(() => [
        200,
        approvalWithLimitedAmount,
    ])

    await userEvent.click(
        await screen.findByRole('button', { name: 'Save changes' })
    )

    expect(env.api['/wallet/transaction/simulate/'].post).toHaveBeenCalledWith(
        expect.objectContaining({
            data: JSON.stringify({
                from: '0x61640a8d48bca205ba91b16b0b7745e7abc61084',
                data: '0x095ea7b3000000000000000000000000000000000022d473030f116ddee9f6b43ac78ba300000000000000000000000000000000000000000000000000000000000f4240',
                to: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                gas: '0x100c4',
            }),
        })
    )

    await expect(
        await screen.findByText('Doing safety checks…')
    ).toBeInTheDocument()

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    await userEvent.click(
        await screen.findByRole('button', { name: 'Safety Checks Passed' })
    )

    checksDialog = await screen.findByRole('dialog', {
        name: 'Transaction Safety Checks',
    })

    expect(
        await within(checksDialog).findByText(
            'Transaction preview was successful'
        )
    ).toBeInTheDocument()

    await userEvent.click(document.body)

    await userEvent.click(
        await screen.findByRole('button', { name: 'Edit spend limit' })
    )

    editModal = await screen.findByRole('dialog', { name: 'Edit permissions' })

    expect(
        await within(editModal).findByRole('textbox', { name: 'Spend limit' })
    ).not.toBeDisabled()
    expect(
        within(editModal).queryByText('Warning, high limit')
    ).not.toBeInTheDocument()

    await userEvent.click(
        await screen.findByRole('switch', { name: 'Set to Unlimited' })
    )

    expect(
        await within(editModal).findByRole('textbox', { name: 'Spend limit' })
    ).toBeDisabled()
    expect(
        await within(editModal).findByRole('button', {
            name: 'Warning, high limit',
        })
    ).toBeInTheDocument()

    env.api['/wallet/transaction/simulate/'].post = jest.fn(() => [
        200,
        approvalWithUnlimitedAmount,
    ])

    await userEvent.click(
        await screen.findByRole('button', { name: 'Save changes' })
    )

    await expect(
        await screen.findByText('Doing safety checks…')
    ).toBeInTheDocument()

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    expect(env.api['/wallet/transaction/simulate/'].post).toHaveBeenCalledWith(
        expect.objectContaining({
            data: JSON.stringify({
                from: '0x61640a8d48bca205ba91b16b0b7745e7abc61084',
                data: '0x095ea7b3000000000000000000000000000000000022d473030f116ddee9f6b43ac78ba30000000000000000000000000000000000000000000001e847fffffffff0bdc0',
                to: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                gas: '0x100c4',
            }),
        })
    )

    await userEvent.click(await screen.findByRole('button', { name: 'Submit' }))

    expect(await screen.findByText('Approve')).toBeInTheDocument()

    expect(
        await screen.findByRole('button', { name: 'Stop' })
    ).toBeInTheDocument()
    expect(
        await screen.findByRole('button', { name: 'Speed up' })
    ).toBeInTheDocument()

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    expect(await screen.findByText('Approve')).toBeInTheDocument()

    expect(await screen.findByText('USDC')).toBeInTheDocument()
    expect(await screen.findByText('Spend limit')).toBeInTheDocument()
    expect(await screen.findByText('Unlimited')).toBeInTheDocument()
    expect(await screen.findByText('Added to queue')).toBeInTheDocument()

    jest.useRealTimers()
})
