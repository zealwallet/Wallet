import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { erc20AllowanceError } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fixtures/erc20AllowanceError'

import { cleanEnv, mockEnv, TestEnvironment } from 'src/tests/env'
import { runLottieListeners } from 'src/tests/mocks/lottie'
import { renderZWidget } from 'src/tests/utils/renderers'

let env: TestEnvironment

beforeEach(() => {
    env = mockEnv()
})

afterEach(() => {
    cleanEnv(env)
})
test(`As a user I should see is transaction proposed by dApp has passed all safetychecks, so I can feel safety
    As a user I should see that transaction proposed by dApp will potentially fail during execution, so I can decide if I really want to submit it`, async () => {
    jest.useFakeTimers()
    const dAppHost = 'dapp.example.com'

    const { toWidget } = await renderZWidget({ dAppHost })

    await toWidget({
        type: 'rpc_request',
        request: { id: 0, method: 'eth_requestAccounts', params: [] },
    })

    await userEvent.click(
        await screen.findByRole('button', { name: 'Connect Zeal' })
    )
    await runLottieListeners()

    await toWidget({
        type: 'rpc_request',
        request: {
            id: 1,
            method: 'eth_sendTransaction',
            params: [
                {
                    from: '0x26d0d88ffe184b1ba244d08fb2a0c695e65c8932',
                    data: '0x095ea7b300000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
                    to: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                    gas: '0x13466',
                },
            ],
        },
    })

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    await userEvent.click(
        await screen.findByRole('button', {
            name: 'Safety Checks Passed',
        })
    )

    let checksPopup = await screen.findByRole('dialog', {
        name: 'Transaction Safety Checks',
    })

    expect(await within(checksPopup).findAllByRole('listitem')).toHaveLength(3)

    expect(
        await within(checksPopup).findByLabelText(
            'Transaction preview was successful'
        )
    ).toHaveAccessibleDescription('Simulation done using')

    expect(
        await within(checksPopup).findByLabelText('Contract is not blacklisted')
    ).toHaveAccessibleDescription('No malicious reports by')

    expect(
        await within(checksPopup).findByLabelText(
            'USDC is verified by CoinGecko'
        )
    ).toHaveAccessibleDescription('Token is listed on')

    await userEvent.click(document.body)
    // FIXME: dialog not closing
    // expect(checksPopup).not.toBeInTheDocument()

    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))

    // Failed simulation check
    env.api['/wallet/transaction/simulate/'].post = () => [
        200,
        erc20AllowanceError,
    ]
    await toWidget({
        type: 'rpc_request',
        request: {
            id: 1,
            method: 'eth_sendTransaction',
            params: [
                {
                    from: '0x26d0d88ffe184b1ba244d08fb2a0c695e65c8932',
                    data: '0x5ae401dc00000000000000000000000000000000000000000000000000000000636d2fba000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000e404e45aaf0000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa841740000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf127000000000000000000000000000000000000000000000000000000000000001f4000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000c3a3aee4d6c4be1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004449404b7c0000000000000000000000000000000000000000000000000c3a3aee4d6c4be1000000000000000000000000722d5c59d5c31a83ea0bd02930822beeab2a726400000000000000000000000000000000000000000000000000000000',
                    to: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
                    gas: '0x2fcb3',
                },
            ],
        },
    })

    await act(async () => {
        jest.advanceTimersByTime(10000)
    })

    const checksButton = await screen.findByRole('button', {
        name: 'Transaction is likely to fail',
    })
    expect(checksButton).toHaveAccessibleDescription(
        'Error: ERC20: transfer amount exceeds allowance'
    )

    await userEvent.click(checksButton)

    checksPopup = await screen.findByRole('dialog', {
        name: 'Transaction Safety Checks',
    })

    expect(await within(checksPopup).findAllByRole('listitem')).toHaveLength(2)

    expect(
        await within(checksPopup).findByLabelText(
            'Transaction is likely to fail'
        )
    ).toHaveAccessibleDescription(
        'Error: ERC20: transfer amount exceeds allowance'
    )

    expect(
        await within(checksPopup).findByLabelText('Contract is not blacklisted')
    ).toHaveAccessibleDescription('No malicious reports by')

    await userEvent.click(await screen.findByRole('button', { name: 'Submit' }))

    const confirmationPopup = await screen.findByRole('dialog', {
        name: 'Transaction likely to fail',
    })

    expect(confirmationPopup).toHaveAccessibleDescription(
        'We simulated this transaction and found an issue that would cause it to fail. You can submit this transaction, but it will likely fail and you may lose your network fee.'
    )

    jest.useRealTimers()
})
