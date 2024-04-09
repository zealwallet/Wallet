import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { usdcApprovalBSCForecast } from '@zeal/domains/Transactions/api/fixtures/usdcApprovalBSCForecast'
import { usdcApprovalBSCForecastCustom } from '@zeal/domains/Transactions/api/fixtures/usdcApprovalBSCForecastCustom'
import { usdcSwapEthereumForecast } from '@zeal/domains/Transactions/api/fixtures/usdcSwapEthereumForecast'
import { usdcSwapEthereumForecastCustom } from '@zeal/domains/Transactions/api/fixtures/usdcSwapEthereumForecastCustom'
import { usdcSwapEthereumOptimismForecast } from '@zeal/domains/Transactions/api/fixtures/usdcSwapEthereumOptimismForecast'
import { usdcSwapEthereumOptimismForecastLowBalance } from '@zeal/domains/Transactions/api/fixtures/usdcSwapEthereumOptimismForecastLowBalance'
import { approvalUSDCBSC } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fixtures/approvalUSDCBSC'
import { unknownSwapUSDCEtherOptimism } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fixtures/unknownSwapUSDCEtherOptimism'
import { usdcSwapEthereum } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fixtures/usdcSwapEthereum'

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

const realTimers = async () => {
    await act(() => {
        jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
}

const fakeTimers = async () => {
    jest.useFakeTimers()
    await act(() => {
        jest.advanceTimersByTime(10000)
    })
}

test(`As a advanced user I should be able to submit Type2 transaction with custom fee settings even if forecast was not successful, so I won't be blocked by UI`, async () => {
    jest.useFakeTimers()

    const dAppHost = 'dapp.example.com'

    env.api['/wallet/fee/forecast'].post = () => [500, null]
    env.api['/wallet/transaction/simulate/'].post = () => [
        200,
        usdcSwapEthereum,
    ]

    // eslint-disable-next-line testing-library/render-result-naming-convention
    const port = await renderZWidget({ dAppHost })

    await port.toWidget({
        type: 'rpc_request',
        request: {
            id: 0,
            method: 'eth_requestAccounts',
            params: [],
        },
    })

    await userEvent.click(
        await screen.findByRole('button', { name: 'Connect Zeal' })
    )
    await runLottieListeners()

    await port.toWidget({
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

    expect(
        await screen.findByText('We couldn’t calculate network fee')
    ).toBeInTheDocument()

    await userEvent.click(
        await screen.findByLabelText('Network fee', { exact: false })
    )

    const feesPopup = await screen.findByLabelText('Edit network fee')

    await userEvent.click(
        await within(feesPopup).findByRole('radio', {
            name: 'Advanced settings',
        })
    )

    const maxBaseFee = await screen.findByRole('textbox', {
        name: 'Max Base Fee',
    })

    await userEvent.clear(maxBaseFee)
    await userEvent.type(maxBaseFee, '1')

    const priorityFee = await screen.findByRole('textbox', {
        name: 'Priority Fee',
    })

    await userEvent.clear(priorityFee)
    await userEvent.type(priorityFee, '5')

    await act(() => {
        jest.advanceTimersByTime(30000)
    })

    await userEvent.click(
        await within(feesPopup).findByRole('button', { name: 'Back' })
    )

    const submit = await screen.findByRole('button', { name: 'Submit' })
    expect(submit).not.toBeDisabled()
    await userEvent.click(submit)

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    expect(await screen.findByText('Added to queue')).toBeInTheDocument()
    expect(env.api['/wallet/rpc/'].eth_sendRawTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
            data: '{"id":123,"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["0x0"]}',
        })
    )

    jest.useRealTimers()
})

test(`As a advanced user I should be able to submit legacy transaction with custom fee settings even if forecast was not successful, so I won't be blocked by UI`, async () => {
    jest.useFakeTimers()

    const dAppHost = 'dapp.example.com'

    env.api['/wallet/fee/forecast'].post = () => [500, null]
    env.api['/wallet/transaction/simulate/'].post = () => [200, approvalUSDCBSC]

    // eslint-disable-next-line testing-library/render-result-naming-convention
    const port = await renderZWidget({ dAppHost })

    await port.toWidget({
        type: 'rpc_request',
        request: {
            id: 0,
            method: 'eth_requestAccounts',
            params: [],
        },
    })

    await userEvent.click(
        await screen.findByRole('button', { name: 'Connect Zeal' })
    )
    await runLottieListeners()

    // Set network to BSC
    await port.toWidget({
        type: 'rpc_request',
        request: {
            id: 1,
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }],
        },
    })

    await port.toWidget({
        type: 'rpc_request',
        request: {
            id: 2,
            method: 'eth_sendTransaction',
            params: [
                {
                    from: '0x61640a8d48bca205ba91b16b0b7745e7abc61084',
                    data: '0x5ae401dc000000000000000000000000000000000000000000000000000000006397238300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000124b858183f00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000186a0000000000000000000000000000000000000000000000000000048ee3a42593400000000000000000000000000000000000000000000000000000000000000427f5c764cbc14f9669b88837ca1490cca17c31607000064da10009cbd5d07dd0cecc66161fc93d7c9000da1000064420000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004449404b7c000000000000000000000000000000000000000000000000000048ee3a42593400000000000000000000000061640a8d48bca205ba91b16b0b7745e7abc6108400000000000000000000000000000000000000000000000000000000',
                    to: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
                    gas: '0x4896e',
                },
            ],
        },
    })

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    expect(
        await screen.findByText('We couldn’t calculate network fee')
    ).toBeInTheDocument()

    await userEvent.click(
        await screen.findByLabelText('Network fee', { exact: false })
    )

    const feesPopup = await screen.findByLabelText('Edit network fee')

    await userEvent.click(
        await within(feesPopup).findByRole('radio', {
            name: 'Advanced settings',
        })
    )

    const maxFee = await screen.findByRole('textbox', {
        name: 'Max Fee',
    })

    await userEvent.clear(maxFee)
    await userEvent.type(maxFee, '1')

    await act(() => {
        jest.advanceTimersByTime(30000)
    })

    await userEvent.click(
        await within(feesPopup).findByRole('button', { name: 'Back' })
    )

    const submit = await screen.findByRole('button', { name: 'Submit' })
    expect(submit).not.toBeDisabled()
    await userEvent.click(submit)

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    expect(await screen.findByText('Added to queue')).toBeInTheDocument()
    expect(env.api['/wallet/rpc/'].eth_sendRawTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
            data: '{"id":123,"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["0x0"]}',
        })
    )

    jest.useRealTimers()
})

test(`As a user I should be able to see fee forecast consists of potential fee and time it would take to complete my legacy transaction, so I can decide which fee to use
    As a user when confirming legacy transaction I should be able to select between slow, normal and fast presets of fees, so I can use the one which is most suitable for me
    As an advanced user I should be able to see how changing presets is affecting gas price, to better understand my choice

    As an advanced user I should be able to change MaxBaseFee of the transaction, so I have full control on base fee
    As an advanced user I should see warning if my MaxBaseFee is too low, so I change it accordingly
    As an advanced user I should see warning if I'm trying to submit transaction with low base fee, so I can confirm my intention
      
    As an advanced user I should be able to change gas limit of the legacy transaction, so I have full control on how much gas transaction can spend
    As an advanced user I should see warning if my gas limit is less than suggested, so I will know that my legacy transaction may fail
    As an advanced user I should see warning if my gas limit is less than minimum, so I will know that my legacy transaction may fail
    As an advanced user I should be able to fix problem with gas limit, so I can quickly change gas limit to suggested value
    As an advanced user I should see warning if I'm trying to submit legacy transaction with low gas limit, so I can confirm my intention
    As a user I should not be able to submit legacy transaction with gas limit less than estimated, so I won't submit transaction which will fail

    As an advanced user I should be able to change nonce of the legacy transaction, so I have full of nonce of the transaction
    As an advanced user I should be able to fix problem with nonce, so I can quickly change nonce to suggested value
    As a user I should not be able to submit legacy transaction with nonce less than current, so I won't submit transaction which will fail
    As an advanced user I should see warning if I'm trying to submit legacy transaction with nonce higher than expected, so I can confirm my intention`, async () => {
    jest.useFakeTimers()

    const dAppHost = 'dapp.example.com'

    env.api['/wallet/fee/forecast'].post = () => [500, null]
    env.api['/wallet/transaction/simulate/'].post = () => [200, approvalUSDCBSC]
    env.api['/wallet/rpc/']['eth_estimateGas'] = () => [
        200,
        { jsonrpc: '2.0', id: 0, result: '0x11448' },
    ]
    env.api['/wallet/rpc/']['eth_getTransactionCount'] = () => [
        200,
        {
            jsonrpc: '2.0',
            id: '7a3e5749-2c8a-49d0-bd29-7bda9c06292b',
            result: '0xB',
        },
    ]

    // eslint-disable-next-line testing-library/render-result-naming-convention
    const port = await renderZWidget({ dAppHost })

    await port.toWidget({
        type: 'rpc_request',
        request: {
            id: 0,
            method: 'eth_requestAccounts',
            params: [],
        },
    })

    await userEvent.click(
        await screen.findByRole('button', { name: 'Connect Zeal' })
    )
    await runLottieListeners()

    // Set network to BSC
    await port.toWidget({
        type: 'rpc_request',
        request: {
            id: 1,
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }],
        },
    })

    await port.toWidget({
        type: 'rpc_request',
        request: {
            id: 2,
            method: 'eth_sendTransaction',
            params: [
                {
                    from: '0x61640a8d48bca205ba91b16b0b7745e7abc61084',
                    data: '0x5ae401dc000000000000000000000000000000000000000000000000000000006397238300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000124b858183f00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000186a0000000000000000000000000000000000000000000000000000048ee3a42593400000000000000000000000000000000000000000000000000000000000000427f5c764cbc14f9669b88837ca1490cca17c31607000064da10009cbd5d07dd0cecc66161fc93d7c9000da1000064420000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004449404b7c000000000000000000000000000000000000000000000000000048ee3a42593400000000000000000000000061640a8d48bca205ba91b16b0b7745e7abc6108400000000000000000000000000000000000000000000000000000000',
                    to: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
                    gas: '0x4896e',
                },
            ],
        },
    })

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    expect(
        await screen.findByLabelText('Network fee', { exact: false })
    ).toHaveAccessibleDescription('Unknown')

    expect(
        await screen.findByText('We couldn’t calculate network fee')
    ).toBeInTheDocument()

    await userEvent.click(
        await screen.findByLabelText('Network Fee', { exact: false })
    )

    let header = await within(
        await screen.findByLabelText('Edit network fee')
    ).findByLabelText('Current fee')

    expect(await within(header).findByText('Fee unknown')).toBeInTheDocument()
    expect(await within(header).findByText('Time Unknown')).toBeInTheDocument()

    await userEvent.click(
        await within(
            await screen.findByLabelText('Edit network fee')
        ).findByRole('button', { name: 'Back' })
    )

    env.api['/wallet/fee/forecast'].post = () => [200, usdcApprovalBSCForecast]
    await userEvent.click(await screen.findByRole('button', { name: 'Retry' }))
    await act(() => {
        jest.runOnlyPendingTimers()
    })

    expect(
        await screen.findByLabelText('Network Fee', { exact: false })
    ).toHaveAccessibleDescription('6 sec $0.15')

    env.api['/wallet/fee/forecast'].post = () => [500, null]
    await act(() => {
        jest.advanceTimersByTime(30000)
    })

    expect(
        await screen.findByText('Estimates might be old, last refresh failed')
    ).toBeInTheDocument()

    env.api['/wallet/fee/forecast'].post = () => [200, usdcApprovalBSCForecast]
    await userEvent.click(await screen.findByRole('button', { name: 'Retry' }))
    await act(() => {
        jest.runOnlyPendingTimers()
    })

    await userEvent.click(
        await screen.findByLabelText('Network Fee', { exact: false })
    )

    let editFeesScreen = await screen.findByLabelText('Edit network fee')

    header = await within(editFeesScreen).findByLabelText('Current fee')

    expect(await within(header).findByText('$0.15')).toBeInTheDocument()
    expect(await within(header).findByText('< 0.001 BNB')).toBeInTheDocument()
    expect(await within(header).findByText('6 sec')).toBeInTheDocument()

    const selector = await within(editFeesScreen).findByLabelText(
        'Select fee preset'
    )

    const slow = await within(selector).findByRole('radio', {
        name: 'Slow',
        checked: false,
    })
    expect(await within(slow).findByText('$0.15')).toBeInTheDocument()
    expect(await within(slow).findByText('18 sec')).toBeInTheDocument()

    const normal = await within(selector).findByRole('radio', {
        name: 'Normal',
        checked: false,
    })
    expect(await within(normal).findByText('$0.15')).toBeInTheDocument()
    expect(await within(normal).findByText('9 sec')).toBeInTheDocument()

    const fast = await within(selector).findByRole('radio', {
        name: 'Fast',
        checked: true,
    })
    expect(await within(fast).findByText('$0.15')).toBeInTheDocument()
    expect(await within(fast).findByText('6 sec')).toBeInTheDocument()

    const advanced = await screen.findByRole('radio', {
        name: 'Advanced settings',
    })
    expect(advanced).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(advanced)
    expect(advanced).toHaveAttribute('aria-expanded', 'true')

    let advancedRegion = await screen.findByRole('region', {
        name: 'Advanced settings',
    })
    let maxFeeInput = await within(advancedRegion).findByRole('textbox', {
        name: 'Max Fee',
    })

    await realTimers()

    // Select slow
    await userEvent.click(slow)
    expect(slow).toHaveAttribute('aria-checked', 'true')
    expect(normal).toHaveAttribute('aria-checked', 'false')
    expect(fast).toHaveAttribute('aria-checked', 'false')
    expect(advanced).toHaveAttribute('aria-selected', 'false')
    expect(await within(header).findByText('$0.15')).toBeInTheDocument()
    expect(await within(header).findByText('< 0.001 BNB')).toBeInTheDocument()
    expect(await within(header).findByText('18 sec')).toBeInTheDocument()
    expect(maxFeeInput).toHaveValue('5')

    // Select normal
    await userEvent.click(normal)
    expect(slow).toHaveAttribute('aria-checked', 'false')
    expect(normal).toHaveAttribute('aria-checked', 'true')
    expect(fast).toHaveAttribute('aria-checked', 'false')
    expect(advanced).toHaveAttribute('aria-selected', 'false')
    expect(await within(header).findByText('$0.15')).toBeInTheDocument()
    expect(await within(header).findByText('< 0.001 BNB')).toBeInTheDocument()
    expect(await within(header).findByText('9 sec')).toBeInTheDocument()
    expect(maxFeeInput).toHaveValue('5')

    // Select back to fast
    await userEvent.click(fast)
    expect(slow).toHaveAttribute('aria-checked', 'false')
    expect(normal).toHaveAttribute('aria-checked', 'false')
    expect(fast).toHaveAttribute('aria-checked', 'true')
    expect(advanced).toHaveAttribute('aria-selected', 'false')
    expect(await within(header).findByText('$0.15')).toBeInTheDocument()
    expect(await within(header).findByText('< 0.001 BNB')).toBeInTheDocument()
    expect(await within(header).findByText('6 sec')).toBeInTheDocument()
    expect(maxFeeInput).toHaveValue('5')

    await fakeTimers()

    // Turn to custom
    env.api['/wallet/fee/forecast'].post = () => [
        200,
        usdcApprovalBSCForecastCustom,
    ]
    await userEvent.clear(maxFeeInput)
    await userEvent.type(maxFeeInput, '2')
    expect(maxFeeInput).toHaveValue('2')
    expect(slow).toHaveAttribute('aria-checked', 'false')
    expect(normal).toHaveAttribute('aria-checked', 'false')
    expect(fast).toHaveAttribute('aria-checked', 'false')
    expect(advanced).toHaveAttribute('aria-selected', 'true')
    header = await within(editFeesScreen).findByLabelText('Current fee')
    expect(await within(header).findByText('$0.09')).toBeInTheDocument()
    expect(await within(header).findByText('< 0.001 BNB')).toBeInTheDocument()
    expect(await within(header).findByText('Time Unknown')).toBeInTheDocument()

    /**
     * Edit max fee variations
     */
    await userEvent.clear(maxFeeInput)
    await userEvent.type(maxFeeInput, '0')
    expect(maxFeeInput).toHaveValue('0')
    expect(maxFeeInput).toHaveAttribute('aria-invalid', 'true')
    const maxBaseFeeContainer = await screen.findByTestId(
        'max-fee-input-container'
    )
    expect(
        await within(maxBaseFeeContainer).findByText(
            'Might get stuck until network fees decrease'
        )
    ).toBeInTheDocument()
    await userEvent.click(
        await within(maxBaseFeeContainer).findByRole('button', {
            name: 'Fix',
        })
    )
    expect(maxFeeInput).toHaveValue('5')
    expect(maxFeeInput).toHaveAttribute('aria-invalid', 'false')
    await userEvent.clear(maxFeeInput)
    await userEvent.type(maxFeeInput, '0')
    expect(maxFeeInput).toHaveValue('0')
    expect(maxFeeInput).toHaveAttribute('aria-invalid', 'true')
    editFeesScreen = await screen.findByLabelText('Edit network fee')
    await userEvent.click(
        await within(editFeesScreen).findByRole('button', { name: 'Back' })
    )
    expect(editFeesScreen).not.toBeInTheDocument()
    expect(
        await screen.findByText('Might take long to process')
    ).toBeInTheDocument()
    await userEvent.click(await screen.findByRole('button', { name: 'Submit' }))
    let confirmPopup = await screen.findByRole('dialog', {
        name: 'Transaction will get stuck',
    })
    expect(confirmPopup).toHaveAccessibleDescription(
        'Transaction Max Fee is too low. Increase Max Fee to prevent transaction from getting stuck.'
    )
    expect(
        await within(confirmPopup).findByRole('button', {
            name: 'Submit anyway',
        })
    ).toBeInTheDocument()
    await userEvent.click(
        await within(confirmPopup).findByRole('button', { name: 'Cancel' })
    )
    expect(confirmPopup).not.toBeInTheDocument()
    await userEvent.click(
        await screen.findByLabelText('Network Fee', { exact: false })
    )
    expect(await screen.findByLabelText('Edit network fee')).toBeInTheDocument()
    await realTimers()
    await userEvent.click(await screen.findByRole('radio', { name: 'Fast' })) // Reset custom to fast
    await fakeTimers()
    maxFeeInput = await screen.findByRole('textbox', { name: 'Max Fee' })
    expect(maxFeeInput).toHaveValue('5')
    expect(maxFeeInput).toHaveAttribute('aria-invalid', 'false')

    /**
     * Edit gas variations
     */
    let gasLimitContainer = await screen.findByTestId(
        'gas-limit-input-container'
    )
    expect(
        await within(gasLimitContainer).findByText('Gas Limit 106092')
    ).toBeInTheDocument()
    await userEvent.click(
        await within(gasLimitContainer).findByRole('button', {
            name: 'edit',
        })
    )
    let gasLimitPopup = await screen.findByRole('dialog', {
        name: 'Edit gas limit',
    })
    expect(
        await within(gasLimitPopup).findByText(
            'Est gas: 70728 • Safety buffer: 1.5x'
        )
    ).toBeInTheDocument()
    // More gas than limit (happy editing)
    let gasInput = await within(gasLimitPopup).findByRole('textbox')
    await userEvent.clear(gasInput)
    await userEvent.type(gasInput, '800000')
    expect(
        await within(gasLimitPopup).findByText(
            'Est gas: 70728 • Safety buffer: 11.3x'
        )
    ).toBeInTheDocument()
    await userEvent.type(gasInput, '{enter}')
    expect(gasLimitPopup).not.toBeInTheDocument()

    // Less than suggested
    await userEvent.click(
        await within(gasLimitContainer).findByRole('button', {
            name: 'edit',
        })
    )
    gasLimitPopup = await screen.findByRole('dialog', {
        name: 'Edit gas limit',
    })
    gasInput = await within(gasLimitPopup).findByRole('textbox')
    await userEvent.clear(gasInput)
    await userEvent.type(gasInput, '71000')
    expect(
        await within(gasLimitPopup).findByText(
            'Less than suggested limit. Transaction could fail'
        )
    ).toBeInTheDocument()
    expect(gasInput).toHaveAttribute('aria-invalid', 'true')
    await userEvent.click(
        await within(gasLimitPopup).findByRole('button', { name: 'Fix' })
    )
    expect(gasInput).toHaveValue('106092')
    expect(gasInput).toHaveAttribute('aria-invalid', 'false')
    expect(
        await within(gasLimitPopup).findByText(
            'Est gas: 70728 • Safety buffer: 1.5x'
        )
    ).toBeInTheDocument()
    await userEvent.clear(gasInput)
    await userEvent.type(gasInput, '71000')
    await userEvent.type(gasInput, '{enter}')
    expect(gasLimitPopup).not.toBeInTheDocument()
    editFeesScreen = await screen.findByLabelText('Edit network fee')
    await userEvent.click(
        await within(editFeesScreen).findByRole('button', { name: 'Back' })
    )
    expect(editFeesScreen).not.toBeInTheDocument()
    expect(await screen.findByText('Likely to fail')).toBeInTheDocument()
    await userEvent.click(await screen.findByRole('button', { name: 'Submit' }))
    confirmPopup = await screen.findByRole('dialog', {
        name: 'Transaction is likely to fail',
    })
    expect(confirmPopup).toHaveAccessibleDescription(
        'Transaction Gas Limit is too low. Increase Gas Limit to suggested limit to prevent failure.'
    )
    expect(
        await within(confirmPopup).findByRole('button', {
            name: 'Submit anyway',
        })
    ).toBeInTheDocument()
    await userEvent.click(
        await within(confirmPopup).findByRole('button', { name: 'Cancel' })
    )
    expect(confirmPopup).not.toBeInTheDocument()
    await userEvent.click(
        await screen.findByLabelText('Network Fee', { exact: false })
    )
    gasLimitContainer = await screen.findByTestId('gas-limit-input-container')
    expect(
        await within(gasLimitContainer).findByText(
            'Less than suggested limit. Transaction could fail'
        )
    ).toBeInTheDocument()
    await userEvent.click(
        await within(gasLimitContainer).findByRole('button', {
            name: 'Fix',
        })
    )
    expect(
        await within(gasLimitContainer).findByText('Gas Limit 106092')
    ).toBeInTheDocument()

    // Less than estimated
    await userEvent.click(
        await within(gasLimitContainer).findByRole('button', {
            name: 'edit',
        })
    )
    gasLimitPopup = await screen.findByRole('dialog', {
        name: 'Edit gas limit',
    })
    gasInput = await within(gasLimitPopup).findByRole('textbox')
    await userEvent.clear(gasInput)
    await userEvent.type(gasInput, '30000')
    expect(
        await within(gasLimitPopup).findByText(
            'Less than estimated limit. Transaction will fail'
        )
    ).toBeInTheDocument()
    expect(gasInput).toHaveAttribute('aria-invalid', 'true')
    await userEvent.click(
        await within(gasLimitPopup).findByRole('button', { name: 'Fix' })
    )
    expect(gasInput).toHaveValue('106092')
    expect(gasInput).toHaveAttribute('aria-invalid', 'false')
    expect(
        await within(gasLimitPopup).findByText(
            'Est gas: 70728 • Safety buffer: 1.5x'
        )
    ).toBeInTheDocument()
    await userEvent.clear(gasInput)
    await userEvent.type(gasInput, '30000')
    await userEvent.type(gasInput, '{enter}')
    expect(gasLimitPopup).not.toBeInTheDocument()
    editFeesScreen = await screen.findByLabelText('Edit network fee')
    await userEvent.click(
        await within(editFeesScreen).findByRole('button', { name: 'Back' })
    )
    expect(editFeesScreen).not.toBeInTheDocument()
    await userEvent.click(await screen.findByRole('button', { name: 'Submit' }))
    confirmPopup = await screen.findByRole('dialog', {
        name: 'Transaction will fail',
    })
    expect(confirmPopup).toHaveAccessibleDescription(
        'Gas Limit is lower than estimated gas. Increase Gas Limit to suggested limit.'
    )
    expect(
        await within(confirmPopup).findByRole('button', {
            name: 'Submit anyway',
        })
    ).toBeInTheDocument()
    await userEvent.click(
        await within(confirmPopup).findByRole('button', { name: 'Cancel' })
    )
    expect(confirmPopup).not.toBeInTheDocument()
    expect(await screen.findByText('Transaction will fail')).toBeInTheDocument()
    await userEvent.click(
        await screen.findByLabelText('Network Fee', { exact: false })
    )
    gasLimitContainer = await screen.findByTestId('gas-limit-input-container')
    expect(
        await within(gasLimitContainer).findByText(
            'Less than estimated limit. Transaction will fail'
        )
    ).toBeInTheDocument()
    await userEvent.click(
        await within(gasLimitContainer).findByRole('button', {
            name: 'Fix',
        })
    )
    expect(
        await within(gasLimitContainer).findByText('Gas Limit 106092')
    ).toBeInTheDocument()

    // Less than minimum
    await userEvent.click(
        await within(gasLimitContainer).findByRole('button', {
            name: 'edit',
        })
    )
    gasLimitPopup = await screen.findByRole('dialog', {
        name: 'Edit gas limit',
    })
    gasInput = await within(gasLimitPopup).findByRole('textbox')
    await userEvent.clear(gasInput)
    await userEvent.type(gasInput, '10000')
    expect(
        await within(gasLimitPopup).findByText(
            'Less than minimum gas limit: 21000'
        )
    ).toBeInTheDocument()
    expect(gasInput).toHaveAttribute('aria-invalid', 'true')
    await userEvent.click(
        await within(gasLimitPopup).findByRole('button', { name: 'Fix' })
    )
    expect(gasInput).toHaveValue('106092')
    expect(gasInput).toHaveAttribute('aria-invalid', 'false')
    expect(
        await within(gasLimitPopup).findByText(
            'Est gas: 70728 • Safety buffer: 1.5x'
        )
    ).toBeInTheDocument()
    await userEvent.clear(gasInput)
    await userEvent.type(gasInput, '10000')
    await userEvent.type(gasInput, '{enter}')
    expect(gasLimitPopup).not.toBeInTheDocument()
    editFeesScreen = await screen.findByLabelText('Edit network fee')
    await userEvent.click(
        await within(editFeesScreen).findByRole('button', { name: 'Back' })
    )
    expect(editFeesScreen).not.toBeInTheDocument()
    expect(await screen.findByText('Transaction will fail')).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Submit' })).toBeDisabled()
    await userEvent.click(
        await screen.findByLabelText('Network Fee', { exact: false })
    )
    editFeesScreen = await screen.findByLabelText('Edit network fee')
    gasLimitContainer = await screen.findByTestId('gas-limit-input-container')
    expect(
        await within(gasLimitContainer).findByText(
            'Less than minimum gas limit: 21000'
        )
    ).toBeInTheDocument()
    await userEvent.click(
        await within(gasLimitContainer).findByRole('button', {
            name: 'Fix',
        })
    )
    expect(
        await within(gasLimitContainer).findByText('Gas Limit 106092')
    ).toBeInTheDocument()

    /**
     * Edit nonce variations
     */
    advancedRegion = await screen.findByRole('region', {
        name: 'Advanced settings',
    })
    let nonceContainer = await within(advancedRegion).findByTestId(
        'nonce-input-container'
    )
    expect(
        await within(nonceContainer).findByText('Nonce 11')
    ).toBeInTheDocument()
    await userEvent.click(
        await within(nonceContainer).findByRole('button', {
            name: 'edit',
        })
    )
    // Bigger than current
    await userEvent.click(
        await within(nonceContainer).findByRole('button', {
            name: 'edit',
        })
    )
    let noncePopup = await screen.findByRole('dialog', {
        name: 'Edit nonce',
    })
    let nonceInput = await within(noncePopup).findByRole('textbox')
    await userEvent.clear(nonceInput)
    await userEvent.type(nonceInput, '13')
    expect(
        await within(noncePopup).findByText(
            'Higher than next Nonce. Will get stuck'
        )
    ).toBeInTheDocument()
    expect(nonceInput).toHaveAttribute('aria-invalid', 'true')
    await userEvent.click(
        await within(noncePopup).findByRole('button', { name: 'Fix' })
    )
    expect(nonceInput).toHaveValue('11')
    expect(nonceInput).toHaveAttribute('aria-invalid', 'false')
    await userEvent.clear(nonceInput)
    await userEvent.type(nonceInput, '13')
    await userEvent.type(nonceInput, '{enter}')
    expect(noncePopup).not.toBeInTheDocument()
    await userEvent.click(
        await within(
            await screen.findByLabelText('Edit network fee')
        ).findByRole('button', { name: 'Back' })
    )
    expect(editFeesScreen).not.toBeInTheDocument()
    expect(
        await screen.findByText('Transaction will get stuck')
    ).toBeInTheDocument()
    await userEvent.click(await screen.findByRole('button', { name: 'Submit' }))
    confirmPopup = await screen.findByRole('dialog', {
        name: 'Transaction will get stuck',
    })
    expect(confirmPopup).toHaveAccessibleDescription(
        'Nonce is higher than current Nonce. Decrease Nonce to prevent transaction from getting stuck.'
    )
    expect(
        await within(confirmPopup).findByRole('button', {
            name: 'Submit anyway',
        })
    ).toBeInTheDocument()
    await userEvent.click(
        await within(confirmPopup).findByRole('button', { name: 'Cancel' })
    )
    expect(confirmPopup).not.toBeInTheDocument()
    await userEvent.click(
        await screen.findByLabelText('Network Fee', { exact: false })
    )
    nonceContainer = await screen.findByTestId('nonce-input-container')
    expect(
        await within(nonceContainer).findByText(
            'Higher than next Nonce. Will get stuck'
        )
    ).toBeInTheDocument()
    await userEvent.click(
        await within(nonceContainer).findByRole('button', { name: 'Fix' })
    )
    expect(
        await within(nonceContainer).findByText('Nonce 11')
    ).toBeInTheDocument()

    // Less than current
    await userEvent.click(
        await within(nonceContainer).findByRole('button', { name: 'edit' })
    )
    noncePopup = await screen.findByRole('dialog', { name: 'Edit nonce' })
    nonceInput = await within(noncePopup).findByRole('textbox')
    await userEvent.clear(nonceInput)
    await userEvent.type(nonceInput, '1')
    expect(
        await within(noncePopup).findByText(
            'Can’t set nonce lower than current nonce'
        )
    ).toBeInTheDocument()
    expect(nonceInput).toHaveAttribute('aria-invalid', 'true')
    await userEvent.click(
        await within(noncePopup).findByRole('button', { name: 'Fix' })
    )
    expect(nonceInput).toHaveValue('11')
    expect(nonceInput).toHaveAttribute('aria-invalid', 'false')
    await userEvent.clear(nonceInput)
    await userEvent.type(nonceInput, '1')
    await userEvent.type(nonceInput, '{enter}')
    expect(noncePopup).not.toBeInTheDocument()
    editFeesScreen = await screen.findByLabelText('Edit network fee')
    await userEvent.click(
        await within(editFeesScreen).findByRole('button', { name: 'Back' })
    )
    expect(editFeesScreen).not.toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Submit' })).toBeDisabled()
    expect(await screen.findByText('Transaction will fail')).toBeInTheDocument()
    await userEvent.click(
        await screen.findByLabelText('Network Fee', { exact: false })
    )
    nonceContainer = await screen.findByTestId('nonce-input-container')
    expect(
        await within(nonceContainer).findByText(
            'Can’t set nonce lower than current nonce'
        )
    ).toBeInTheDocument()
    await userEvent.click(
        await within(nonceContainer).findByRole('button', { name: 'Fix' })
    )
    expect(
        await within(nonceContainer).findByText('Nonce 11')
    ).toBeInTheDocument()

    // Low balance error
    // FIXME dont work
    // env.api['/wallet/fee/forecast'].post = () => [
    //     200,
    //     usdcApprovalBSCForecastLowBalance,
    // ]
    // await userEvent.click(await screen.findByRole('radio', { name: 'Fast' })) // Reset custom to fast
    // editFeesScreen = await screen.findByLabelText('Edit network fee')
    // await userEvent.click(
    //     await within(editFeesScreen).findByRole('button', { name: 'Back' })
    // )
    // expect(editFeesScreen).not.toBeInTheDocument()
    // expect(
    //     await screen.findByText('Need 0.0005305 BNB to submit transaction')
    // ).toBeInTheDocument()
    // await userEvent.click(
    //     await screen.findByLabelText('Network Fee', { exact: false })
    // )
    // expect(await screen.findByRole('button', { name: 'Submit' })).toBeDisabled()
    // expect(
    //     await within(
    //         await screen.findByLabelText('Edit network fee')
    //     ).findByText('Need 0.0005305 BNB to submit')
    // ).toBeInTheDocument()

    env.api['/wallet/fee/forecast'].post = () => [200, usdcSwapEthereumForecast]

    await act(() => {
        jest.advanceTimersByTime(30000)
    })

    const submit = await screen.findByRole('button', { name: 'Submit' })
    expect(submit).not.toBeDisabled()
    await userEvent.click(submit)

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    expect(await screen.findByText('Added to queue')).toBeInTheDocument()
    expect(env.api['/wallet/rpc/'].eth_sendRawTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
            data: '{"id":123,"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["0x0"]}',
        })
    )

    jest.useRealTimers()
})

test(`As a user I should be able to see fee forecast consists of potential fee and time it would take to complete my transaction, so I can decide which fee to use
    As a user I should be able to select between slow, normal and fast presets of fees, so I can use the one which is most suitable for me
    As an advanced user I should be able to see how changing presets is affecting components of my fees, to better understand my choice

    As an advanced user I should be able to change MaxBaseFee of the transaction, so I have full control on base fee
    As an advanced user I should see warning if my MaxBaseFee is too low, so I change it accordingly
    As an advanced user I should see warning if I'm trying to submit transaction with low base fee, so I can confirm my intention

    As an advanced user I should be able to change PriorityFee of the transaction, so I have full control on priority fee
    As an advanced user I should be see warning if my PriorityFee is too low, so I change it accordingly
    As an advanced user I should see warning if I'm trying to submit transaction with low priority fee, so I can confirm my intention

    As an advanced user I should be able to change gas limit of the transaction, so I have full control on how much gas transaction can spend
    As an advanced user I should see warning if my gas limit is less than suggested, so I will know that my transaction may fail
    As an advanced user I should see warning if my gas limit is less than minimum, so I will know that my transaction may fail
    As an advanced user I should be able to fix problem with gas limit, so I can quickly change gas limit to suggested value
    As an advanced user I should see warning if I'm trying to submit transaction with low gas limit, so I can confirm my intention
    As a user I should not be able to submit transaction with gas limit less than estimated, so I won't submit transaction which will fail

    As an advanced user I should be able to change nonce of the transaction, so I have full of nonce of the transaction
    As an advanced user I should be able to fix problem with nonce, so I can quickly change nonce to suggested value
    As a user I should not be able to submit transaction with nonce less than current, so I won't submit transaction which will fail
    As an advanced user I should see warning if I'm trying to submit transaction with nonce higher than expected, so I can confirm my intention
    
    As a yser I should see a warning that my transaction will fail due to insufficient funds, so I can adjust the fee or do transaction later`, async () => {
    jest.useFakeTimers()

    const dAppHost = 'dapp.example.com'

    env.api['/wallet/fee/forecast'].post = () => [500, null]
    env.api['/wallet/transaction/simulate/'].post = () => [
        200,
        usdcSwapEthereum,
    ]
    env.api['/wallet/rpc/']['eth_getTransactionCount'] = () => [
        200,
        {
            jsonrpc: '2.0',
            id: '7a3e5749-2c8a-49d0-bd29-7bda9c06292b',
            result: '0x2',
        },
    ]
    env.api['/wallet/rpc/']['eth_estimateGas'] = () => [
        200,
        { jsonrpc: '2.0', id: 1, result: '0x40c8c' },
    ]

    // eslint-disable-next-line testing-library/render-result-naming-convention
    const port = await renderZWidget({ dAppHost })

    await port.toWidget({
        type: 'rpc_request',
        request: {
            id: 0,
            method: 'eth_requestAccounts',
            params: [],
        },
    })

    await userEvent.click(
        await screen.findByRole('button', { name: 'Connect Zeal' })
    )
    await runLottieListeners()

    await port.toWidget({
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

    expect(
        await screen.findByLabelText('Network Fee', { exact: false })
    ).toHaveAccessibleDescription('Unknown')

    expect(
        await screen.findByText('We couldn’t calculate network fee')
    ).toBeInTheDocument()

    await userEvent.click(
        await screen.findByLabelText('Network Fee', { exact: false })
    )

    let header = await within(
        await screen.findByLabelText('Edit network fee')
    ).findByLabelText('Current fee')

    expect(await within(header).findByText('Fee unknown')).toBeInTheDocument()
    expect(await within(header).findByText('Time Unknown')).toBeInTheDocument()

    await userEvent.click(
        await within(
            await screen.findByLabelText('Edit network fee')
        ).findByRole('button', { name: 'Back' })
    )

    env.api['/wallet/fee/forecast'].post = () => [200, usdcSwapEthereumForecast]
    await userEvent.click(await screen.findByRole('button', { name: 'Retry' }))
    await act(() => {
        jest.runOnlyPendingTimers()
    })

    expect(
        await screen.findByLabelText('Network Fee', { exact: false })
    ).toHaveAccessibleDescription('30 sec $17.16')

    env.api['/wallet/fee/forecast'].post = () => [500, null]
    await act(() => {
        jest.advanceTimersByTime(30000)
    })

    expect(
        await screen.findByText('Estimates might be old, last refresh failed')
    ).toBeInTheDocument()

    env.api['/wallet/fee/forecast'].post = () => [200, usdcSwapEthereumForecast]
    await userEvent.click(await screen.findByRole('button', { name: 'Retry' }))
    await act(() => {
        jest.runOnlyPendingTimers()
    })

    await userEvent.click(
        await screen.findByLabelText('Network Fee', { exact: false })
    )

    let editFeesScreen = await screen.findByLabelText('Edit network fee')

    header = await within(editFeesScreen).findByLabelText('Current fee')

    expect(await within(header).findByText('$17.16')).toBeInTheDocument()
    expect(await within(header).findByText('0.01336 ETH')).toBeInTheDocument()
    expect(await within(header).findByText('30 sec')).toBeInTheDocument()

    const selector = await within(editFeesScreen).findByLabelText(
        'Select fee preset'
    )

    const slow = await within(selector).findByRole('radio', {
        name: 'Slow',
        checked: false,
    })
    expect(await within(slow).findByText('$16.14')).toBeInTheDocument()
    expect(await within(slow).findByText('2 min')).toBeInTheDocument()

    const normal = await within(selector).findByRole('radio', {
        name: 'Normal',
        checked: false,
    })
    expect(await within(normal).findByText('$16.65')).toBeInTheDocument()
    expect(await within(normal).findByText('45 sec')).toBeInTheDocument()

    const fast = await within(selector).findByRole('radio', {
        name: 'Fast',
        checked: true,
    })
    expect(await within(fast).findByText('$17.16')).toBeInTheDocument()
    expect(await within(fast).findByText('30 sec')).toBeInTheDocument()

    const advanced = await screen.findByRole('radio', {
        name: 'Advanced settings',
    })
    expect(advanced).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(advanced)
    expect(advanced).toHaveAttribute('aria-expanded', 'true')

    let advancedRegion = await screen.findByRole('region', {
        name: 'Advanced settings',
    })
    let baseFeeInput = await within(advancedRegion).findByRole('textbox', {
        name: 'Max Base Fee',
    })
    let priorityFeeInput = await within(advancedRegion).findByRole('textbox', {
        name: 'Priority Fee',
    })

    await realTimers()
    // Select slow
    await userEvent.click(slow)
    expect(slow).toHaveAttribute('aria-checked', 'true')
    expect(normal).toHaveAttribute('aria-checked', 'false')
    expect(fast).toHaveAttribute('aria-checked', 'false')
    expect(advanced).toHaveAttribute('aria-selected', 'false')
    expect(await within(header).findByText('$16.14')).toBeInTheDocument()
    expect(await within(header).findByText('0.01257 ETH')).toBeInTheDocument()
    expect(await within(header).findByText('2 min')).toBeInTheDocument()
    expect(baseFeeInput).toHaveValue('31.08')
    expect(priorityFeeInput).toHaveValue('0.45')

    // Select normal
    await userEvent.click(normal)
    expect(slow).toHaveAttribute('aria-checked', 'false')
    expect(normal).toHaveAttribute('aria-checked', 'true')
    expect(fast).toHaveAttribute('aria-checked', 'false')
    expect(advanced).toHaveAttribute('aria-selected', 'false')
    expect(await within(header).findByText('$16.65')).toBeInTheDocument()
    expect(await within(header).findByText('0.01297 ETH')).toBeInTheDocument()
    expect(await within(header).findByText('45 sec')).toBeInTheDocument()
    expect(baseFeeInput).toHaveValue('31.08')
    expect(priorityFeeInput).toHaveValue('1.45')

    // Select back to fast
    await userEvent.click(fast)
    expect(slow).toHaveAttribute('aria-checked', 'false')
    expect(normal).toHaveAttribute('aria-checked', 'false')
    expect(fast).toHaveAttribute('aria-checked', 'true')
    expect(advanced).toHaveAttribute('aria-selected', 'false')
    expect(await within(header).findByText('$17.16')).toBeInTheDocument()
    expect(await within(header).findByText('0.01336 ETH')).toBeInTheDocument()
    expect(await within(header).findByText('30 sec')).toBeInTheDocument()
    expect(baseFeeInput).toHaveValue('31.08')
    expect(priorityFeeInput).toHaveValue('2.45')

    await fakeTimers()
    // Turn to custom
    env.api['/wallet/fee/forecast'].post = () => [
        200,
        usdcSwapEthereumForecastCustom,
    ]
    await userEvent.clear(baseFeeInput)
    await userEvent.type(baseFeeInput, '16000000000')
    expect(baseFeeInput).toHaveValue('16,000,000,000')
    expect(slow).toHaveAttribute('aria-checked', 'false')
    expect(normal).toHaveAttribute('aria-checked', 'false')
    expect(fast).toHaveAttribute('aria-checked', 'false')
    expect(advanced).toHaveAttribute('aria-selected', 'true')
    header = await within(editFeesScreen).findByLabelText('Current fee')
    expect(await within(header).findByText('$16.38')).toBeInTheDocument()
    expect(await within(header).findByText('0.01275 ETH')).toBeInTheDocument()
    expect(await within(header).findByText('30 sec')).toBeInTheDocument()

    /**
     * Edit max base fee variations
     */
    await userEvent.clear(baseFeeInput)
    await userEvent.type(baseFeeInput, '14')
    expect(baseFeeInput).toHaveValue('14')
    expect(baseFeeInput).toHaveAttribute('aria-invalid', 'true')
    const maxBaseFeeContainer = await screen.findByTestId(
        'max-base-fee-input-container'
    )
    expect(
        await within(maxBaseFeeContainer).findByText(
            'Will get stuck until Base Fee decreases'
        )
    ).toBeInTheDocument()
    await userEvent.click(
        await within(maxBaseFeeContainer).findByRole('button', {
            name: 'Fix',
        })
    )
    expect(baseFeeInput).toHaveValue('14.5')
    expect(baseFeeInput).toHaveAttribute('aria-invalid', 'false')
    await userEvent.clear(baseFeeInput)
    await userEvent.type(baseFeeInput, '5')
    expect(baseFeeInput).toHaveValue('5')
    expect(baseFeeInput).toHaveAttribute('aria-invalid', 'true')
    editFeesScreen = await screen.findByLabelText('Edit network fee')
    await userEvent.click(
        await within(editFeesScreen).findByRole('button', { name: 'Back' })
    )
    expect(editFeesScreen).not.toBeInTheDocument()
    expect(
        await screen.findByText('Might take long to process')
    ).toBeInTheDocument()
    await userEvent.click(await screen.findByRole('button', { name: 'Submit' }))
    let confirmPopup = await screen.findByRole('dialog', {
        name: 'Transaction will get stuck',
    })
    expect(confirmPopup).toHaveAccessibleDescription(
        'Max Base Fee is lower than current base fee. Increase Max Base Fee to prevent transaction from getting stuck.'
    )
    expect(
        await within(confirmPopup).findByRole('button', {
            name: 'Submit anyway',
        })
    ).toBeInTheDocument()
    await userEvent.click(
        await within(confirmPopup).findByRole('button', { name: 'Cancel' })
    )
    expect(confirmPopup).not.toBeInTheDocument()
    await userEvent.click(
        await screen.findByLabelText('Network Fee', { exact: false })
    )
    expect(await screen.findByLabelText('Edit network fee')).toBeInTheDocument()
    await realTimers()
    await userEvent.click(await screen.findByRole('radio', { name: 'Fast' })) // Reset custom to fast
    await fakeTimers()
    baseFeeInput = await screen.findByRole('textbox', {
        name: 'Max Base Fee',
    })
    expect(baseFeeInput).toHaveValue('29.01')
    expect(baseFeeInput).toHaveAttribute('aria-invalid', 'false')

    /**
     * Edit max priority fee
     */
    priorityFeeInput = await screen.findByRole('textbox', {
        name: 'Priority Fee',
    })
    await userEvent.clear(priorityFeeInput)
    await userEvent.type(priorityFeeInput, '0')
    expect(priorityFeeInput).toHaveValue('0')
    expect(priorityFeeInput).toHaveAttribute('aria-invalid', 'true')
    const priorityFeeContainer = await screen.findByTestId(
        'priority-fee-input-container'
    )
    expect(
        await within(priorityFeeContainer).findByText(
            'Low fee. Might get stuck'
        )
    ).toBeInTheDocument()
    await userEvent.click(
        await within(priorityFeeContainer).findByRole('button', {
            name: 'Fix',
        })
    )
    expect(priorityFeeInput).toHaveValue('1.49')
    expect(priorityFeeInput).toHaveAttribute('aria-invalid', 'false')
    await userEvent.clear(priorityFeeInput)
    await userEvent.type(priorityFeeInput, '0')
    expect(priorityFeeInput).toHaveValue('0')
    expect(priorityFeeInput).toHaveAttribute('aria-invalid', 'true')
    editFeesScreen = await screen.findByLabelText('Edit network fee')
    await userEvent.click(
        await within(editFeesScreen).findByRole('button', { name: 'Back' })
    )
    expect(editFeesScreen).not.toBeInTheDocument()
    expect(
        await screen.findByText('Might take long to process')
    ).toBeInTheDocument()
    await userEvent.click(await screen.findByRole('button', { name: 'Submit' }))
    confirmPopup = await screen.findByRole('dialog', {
        name: 'Transaction might take long to complete',
    })
    expect(confirmPopup).toHaveAccessibleDescription(
        'Priority Fee is lower than recommended. Increase Priority Fee to speed up transaction.'
    )
    expect(
        await within(confirmPopup).findByRole('button', {
            name: 'Submit anyway',
        })
    ).toBeInTheDocument()
    await userEvent.click(
        await within(confirmPopup).findByRole('button', { name: 'Cancel' })
    )
    expect(confirmPopup).not.toBeInTheDocument()
    await userEvent.click(
        await screen.findByLabelText('Network Fee', { exact: false })
    )
    expect(await screen.findByLabelText('Edit network fee')).toBeInTheDocument()
    await realTimers()
    await userEvent.click(await screen.findByRole('radio', { name: 'Fast' })) // Reset custom to fast
    await fakeTimers()
    priorityFeeInput = await screen.findByRole('textbox', {
        name: 'Priority Fee',
    })
    expect(priorityFeeInput).toHaveValue('1.49')
    expect(priorityFeeInput).toHaveAttribute('aria-invalid', 'false')

    /**
     * Edit gas variations
     */
    let gasLimitContainer = await screen.findByTestId(
        'gas-limit-input-container'
    )
    expect(
        await within(gasLimitContainer).findByText('Gas Limit 398034')
    ).toBeInTheDocument()
    await userEvent.click(
        await within(gasLimitContainer).findByRole('button', {
            name: 'edit',
        })
    )
    let gasLimitPopup = await screen.findByRole('dialog', {
        name: 'Edit gas limit',
    })
    expect(
        await within(gasLimitPopup).findByText(
            'Est gas: 265356 • Safety buffer: 1.5x'
        )
    ).toBeInTheDocument()
    // More gas than limit (happy editing)
    let gasInput = await within(gasLimitPopup).findByRole('textbox')
    await userEvent.clear(gasInput)
    await userEvent.type(gasInput, '800000')
    expect(
        await within(gasLimitPopup).findByText(
            'Est gas: 265356 • Safety buffer: 3.0x'
        )
    ).toBeInTheDocument()
    await userEvent.type(gasInput, '{enter}')
    expect(gasLimitPopup).not.toBeInTheDocument()

    // Less than suggested
    await userEvent.click(
        await within(gasLimitContainer).findByRole('button', {
            name: 'edit',
        })
    )
    gasLimitPopup = await screen.findByRole('dialog', {
        name: 'Edit gas limit',
    })
    gasInput = await within(gasLimitPopup).findByRole('textbox')
    await userEvent.clear(gasInput)
    await userEvent.type(gasInput, '300000')
    expect(
        await within(gasLimitPopup).findByText(
            'Less than suggested limit. Transaction could fail'
        )
    ).toBeInTheDocument()
    expect(gasInput).toHaveAttribute('aria-invalid', 'true')
    await userEvent.click(
        await within(gasLimitPopup).findByRole('button', { name: 'Fix' })
    )
    expect(gasInput).toHaveValue('398034')
    expect(gasInput).toHaveAttribute('aria-invalid', 'false')
    expect(
        await within(gasLimitPopup).findByText(
            'Est gas: 265356 • Safety buffer: 1.5x'
        )
    ).toBeInTheDocument()
    await userEvent.clear(gasInput)
    await userEvent.type(gasInput, '300000')
    await userEvent.type(gasInput, '{enter}')
    expect(gasLimitPopup).not.toBeInTheDocument()
    editFeesScreen = await screen.findByLabelText('Edit network fee')
    await userEvent.click(
        await within(editFeesScreen).findByRole('button', { name: 'Back' })
    )
    expect(editFeesScreen).not.toBeInTheDocument()
    expect(await screen.findByText('Likely to fail')).toBeInTheDocument()
    await userEvent.click(await screen.findByRole('button', { name: 'Submit' }))
    confirmPopup = await screen.findByRole('dialog', {
        name: 'Transaction is likely to fail',
    })
    expect(confirmPopup).toHaveAccessibleDescription(
        'Transaction Gas Limit is too low. Increase Gas Limit to suggested limit to prevent failure.'
    )
    expect(
        await within(confirmPopup).findByRole('button', {
            name: 'Submit anyway',
        })
    ).toBeInTheDocument()
    await userEvent.click(
        await within(confirmPopup).findByRole('button', { name: 'Cancel' })
    )
    expect(confirmPopup).not.toBeInTheDocument()
    await userEvent.click(
        await screen.findByLabelText('Network Fee', { exact: false })
    )
    gasLimitContainer = await screen.findByTestId('gas-limit-input-container')
    expect(
        await within(gasLimitContainer).findByText(
            'Less than suggested limit. Transaction could fail'
        )
    ).toBeInTheDocument()
    await userEvent.click(
        await within(gasLimitContainer).findByRole('button', {
            name: 'Fix',
        })
    )
    expect(
        await within(gasLimitContainer).findByText('Gas Limit 398034')
    ).toBeInTheDocument()

    // Less than estimated
    await userEvent.click(
        await within(gasLimitContainer).findByRole('button', {
            name: 'edit',
        })
    )
    gasLimitPopup = await screen.findByRole('dialog', {
        name: 'Edit gas limit',
    })
    gasInput = await within(gasLimitPopup).findByRole('textbox')
    await userEvent.clear(gasInput)
    await userEvent.type(gasInput, '260000')
    expect(
        await within(gasLimitPopup).findByText(
            'Less than estimated limit. Transaction will fail'
        )
    ).toBeInTheDocument()
    expect(gasInput).toHaveAttribute('aria-invalid', 'true')
    await userEvent.click(
        await within(gasLimitPopup).findByRole('button', { name: 'Fix' })
    )
    expect(gasInput).toHaveValue('398034')
    expect(gasInput).toHaveAttribute('aria-invalid', 'false')
    expect(
        await within(gasLimitPopup).findByText(
            'Est gas: 265356 • Safety buffer: 1.5x'
        )
    ).toBeInTheDocument()
    await userEvent.clear(gasInput)
    await userEvent.type(gasInput, '260000')
    await userEvent.type(gasInput, '{enter}')
    expect(gasLimitPopup).not.toBeInTheDocument()
    editFeesScreen = await screen.findByLabelText('Edit network fee')
    await userEvent.click(
        await within(editFeesScreen).findByRole('button', { name: 'Back' })
    )
    expect(editFeesScreen).not.toBeInTheDocument()
    // TODO does not work
    /*
        userEvent.click(await screen.findByRole('button', { name: 'Submit' }))
        confirmPopup = await screen.findByRole('dialog', {
            name: 'Transaction will fail',
        })
        expect(confirmPopup).toHaveAccessibleDescription(
            'Transaction Gas Limit is too low. Increase Gas Limit to suggested limit to prevent failure.'
        )
        expect(
            await within(confirmPopup).findByRole('button', {
                name: 'Submit anyway',
            })
        ).toBeInTheDocument()
        userEvent.click(
            await within(confirmPopup).findByRole('button', { name: 'Cancel' })
        )
        expect(confirmPopup).not.toBeInTheDocument()
        */
    expect(await screen.findByText('Transaction will fail')).toBeInTheDocument()
    await userEvent.click(
        await screen.findByLabelText('Network Fee', { exact: false })
    )
    gasLimitContainer = await screen.findByTestId('gas-limit-input-container')
    expect(
        await within(gasLimitContainer).findByText(
            'Less than estimated limit. Transaction will fail'
        )
    ).toBeInTheDocument()
    await userEvent.click(
        await within(gasLimitContainer).findByRole('button', {
            name: 'Fix',
        })
    )
    expect(
        await within(gasLimitContainer).findByText('Gas Limit 398034')
    ).toBeInTheDocument()

    // Less than minimum
    await userEvent.click(
        await within(gasLimitContainer).findByRole('button', {
            name: 'edit',
        })
    )
    gasLimitPopup = await screen.findByRole('dialog', {
        name: 'Edit gas limit',
    })
    gasInput = await within(gasLimitPopup).findByRole('textbox')
    await userEvent.clear(gasInput)
    await userEvent.type(gasInput, '10000')
    expect(
        await within(gasLimitPopup).findByText(
            'Less than minimum gas limit: 21000'
        )
    ).toBeInTheDocument()
    expect(gasInput).toHaveAttribute('aria-invalid', 'true')
    await userEvent.click(
        await within(gasLimitPopup).findByRole('button', { name: 'Fix' })
    )
    expect(gasInput).toHaveValue('398034')
    expect(gasInput).toHaveAttribute('aria-invalid', 'false')
    expect(
        await within(gasLimitPopup).findByText(
            'Est gas: 265356 • Safety buffer: 1.5x'
        )
    ).toBeInTheDocument()
    await userEvent.clear(gasInput)
    await userEvent.type(gasInput, '10000')
    await userEvent.type(gasInput, '{enter}')
    expect(gasLimitPopup).not.toBeInTheDocument()
    editFeesScreen = await screen.findByLabelText('Edit network fee')
    await userEvent.click(
        await within(editFeesScreen).findByRole('button', { name: 'Back' })
    )
    expect(editFeesScreen).not.toBeInTheDocument()
    expect(await screen.findByText('Transaction will fail')).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Submit' })).toBeDisabled()
    await userEvent.click(
        await screen.findByLabelText('Network Fee', { exact: false })
    )
    editFeesScreen = await screen.findByLabelText('Edit network fee')
    gasLimitContainer = await screen.findByTestId('gas-limit-input-container')
    expect(
        await within(gasLimitContainer).findByText(
            'Less than minimum gas limit: 21000'
        )
    ).toBeInTheDocument()
    await userEvent.click(
        await within(gasLimitContainer).findByRole('button', {
            name: 'Fix',
        })
    )
    expect(
        await within(gasLimitContainer).findByText('Gas Limit 398034')
    ).toBeInTheDocument()

    /**
     * Edit nonce variations
     */
    advancedRegion = await screen.findByRole('region', {
        name: 'Advanced settings',
    })
    let nonceContainer = await within(advancedRegion).findByTestId(
        'nonce-input-container'
    )
    expect(
        await within(nonceContainer).findByText('Nonce 2')
    ).toBeInTheDocument()
    await userEvent.click(
        await within(nonceContainer).findByRole('button', {
            name: 'edit',
        })
    )
    // Bigger than current
    await userEvent.click(
        await within(nonceContainer).findByRole('button', {
            name: 'edit',
        })
    )
    let noncePopup = await screen.findByRole('dialog', {
        name: 'Edit nonce',
    })
    let nonceInput = await within(noncePopup).findByRole('textbox')
    await userEvent.clear(nonceInput)
    await userEvent.type(nonceInput, '3')
    expect(
        await within(noncePopup).findByText(
            'Higher than next Nonce. Will get stuck'
        )
    ).toBeInTheDocument()
    expect(nonceInput).toHaveAttribute('aria-invalid', 'true')
    await userEvent.click(
        await within(noncePopup).findByRole('button', { name: 'Fix' })
    )
    expect(nonceInput).toHaveValue('2')
    expect(nonceInput).toHaveAttribute('aria-invalid', 'false')
    await userEvent.clear(nonceInput)
    await userEvent.type(nonceInput, '3')
    await userEvent.type(nonceInput, '{enter}')
    expect(noncePopup).not.toBeInTheDocument()
    await userEvent.click(
        await within(
            await screen.findByLabelText('Edit network fee')
        ).findByRole('button', { name: 'Back' })
    )
    expect(editFeesScreen).not.toBeInTheDocument()
    expect(
        await screen.findByText('Transaction will get stuck')
    ).toBeInTheDocument()
    await userEvent.click(await screen.findByRole('button', { name: 'Submit' }))
    confirmPopup = await screen.findByRole('dialog', {
        name: 'Transaction will get stuck',
    })
    expect(confirmPopup).toHaveAccessibleDescription(
        'Nonce is higher than current Nonce. Decrease Nonce to prevent transaction from getting stuck.'
    )
    expect(
        await within(confirmPopup).findByRole('button', {
            name: 'Submit anyway',
        })
    ).toBeInTheDocument()
    await userEvent.click(
        await within(confirmPopup).findByRole('button', { name: 'Cancel' })
    )
    expect(confirmPopup).not.toBeInTheDocument()
    await userEvent.click(
        await screen.findByLabelText('Network Fee', { exact: false })
    )
    nonceContainer = await screen.findByTestId('nonce-input-container')
    expect(
        await within(nonceContainer).findByText(
            'Higher than next Nonce. Will get stuck'
        )
    ).toBeInTheDocument()
    await userEvent.click(
        await within(nonceContainer).findByRole('button', { name: 'Fix' })
    )
    expect(
        await within(nonceContainer).findByText('Nonce 2')
    ).toBeInTheDocument()

    // Less than current
    await userEvent.click(
        await within(nonceContainer).findByRole('button', { name: 'edit' })
    )
    noncePopup = await screen.findByRole('dialog', { name: 'Edit nonce' })
    nonceInput = await within(noncePopup).findByRole('textbox')
    await userEvent.clear(nonceInput)
    await userEvent.type(nonceInput, '1')
    expect(
        await within(noncePopup).findByText(
            'Can’t set nonce lower than current nonce'
        )
    ).toBeInTheDocument()
    expect(nonceInput).toHaveAttribute('aria-invalid', 'true')
    await userEvent.click(
        await within(noncePopup).findByRole('button', { name: 'Fix' })
    )
    expect(nonceInput).toHaveValue('2')
    expect(nonceInput).toHaveAttribute('aria-invalid', 'false')
    await userEvent.clear(nonceInput)
    await userEvent.type(nonceInput, '1')
    await userEvent.type(nonceInput, '{enter}')
    expect(noncePopup).not.toBeInTheDocument()
    editFeesScreen = await screen.findByLabelText('Edit network fee')
    await userEvent.click(
        await within(editFeesScreen).findByRole('button', { name: 'Back' })
    )
    expect(editFeesScreen).not.toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Submit' })).toBeDisabled()
    expect(await screen.findByText('Transaction will fail')).toBeInTheDocument()
    await userEvent.click(
        await screen.findByLabelText('Network Fee', { exact: false })
    )
    nonceContainer = await screen.findByTestId('nonce-input-container')
    expect(
        await within(nonceContainer).findByText(
            'Can’t set nonce lower than current nonce'
        )
    ).toBeInTheDocument()
    await userEvent.click(
        await within(nonceContainer).findByRole('button', { name: 'Fix' })
    )
    expect(
        await within(nonceContainer).findByText('Nonce 2')
    ).toBeInTheDocument()

    // Low balance error
    // FIXME
    // env.api['/wallet/fee/forecast'].post = () => [
    //     200,
    //     usdcSwapEthereumForecastHugeFee,
    // ]
    // await userEvent.click(await screen.findByRole('radio', { name: 'Fast' })) // Reset custom to fast
    // editFeesScreen = await screen.findByLabelText('Edit network fee')
    // await userEvent.click(
    //     await within(editFeesScreen).findByRole('button', { name: 'Back' })
    // )
    // expect(editFeesScreen).not.toBeInTheDocument()
    // expect(
    //     await screen.findByText('Need 0.1429 ETH to submit transaction')
    // ).toBeInTheDocument()
    // await userEvent.click(
    //     await screen.findByLabelText('Network Fee', { exact: false })
    // )
    // expect(await screen.findByRole('button', { name: 'Submit' })).toBeDisabled()
    // expect(
    //     await within(
    //         await screen.findByLabelText('Edit network fee')
    //     ).findByText('Need 0.1429 ETH to submit')
    // ).toBeInTheDocument()

    env.api['/wallet/fee/forecast'].post = () => [200, usdcSwapEthereumForecast]

    await act(() => {
        jest.advanceTimersByTime(30000)
    })

    const submit = await screen.findByRole('button', { name: 'Submit' })
    expect(submit).not.toBeDisabled()
    await userEvent.click(submit)

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    expect(await screen.findByText('Added to queue')).toBeInTheDocument()
    expect(env.api['/wallet/rpc/'].eth_sendRawTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
            data: '{"id":123,"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["0x0"]}',
        })
    )

    jest.useRealTimers()
})

test(`As a user I should be able to see fee forecast consists of potential fee and time it would take to complete my transaction on L2 network with fixed fees, so I can decide which fee to use
    As a user I should not be able to change fee settings for L2 networks with fixed fees, because editing fees on such networks doesnt make sense
    As a user I should be able to see that forecast for my transaction on L2 network with fixed fee was not succesfull, so I'll be able to trigger retry
    As a user I should be able to see that forecast for my transaction on L2 network with fixed fee is outdated, so I'll be able to trigger retry
    As a user I should see and error if I have insufficient funds to submit transaction on L2 network with fixed fee, so I know I need more native token to pay for gas`, async () => {
    jest.useFakeTimers()

    const dAppHost = 'dapp.example.com'

    env.api['/wallet/fee/forecast'].post = () => [500, null]
    env.api['/wallet/transaction/simulate/'].post = () => [
        200,
        unknownSwapUSDCEtherOptimism,
    ]
    env.api['/wallet/rpc/']['eth_getTransactionCount'] = () => [
        200,
        {
            jsonrpc: '2.0',
            id: '7a3e5749-2c8a-49d0-bd29-7bda9c06292b',
            result: '0x2',
        },
    ]

    // eslint-disable-next-line testing-library/render-result-naming-convention
    const port = await renderZWidget({ dAppHost })

    await port.toWidget({
        type: 'rpc_request',
        request: {
            id: 0,
            method: 'eth_requestAccounts',
            params: [],
        },
    })

    await userEvent.click(
        await screen.findByRole('button', { name: 'Connect Zeal' })
    )
    await runLottieListeners()

    // Set network to Optimism
    await port.toWidget({
        type: 'rpc_request',
        request: {
            id: 1,
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xa' }],
        },
    })

    await port.toWidget({
        type: 'rpc_request',
        request: {
            id: 2,
            method: 'eth_sendTransaction',
            params: [
                {
                    from: '0x61640a8d48bca205ba91b16b0b7745e7abc61084',
                    data: '0x5ae401dc000000000000000000000000000000000000000000000000000000006397238300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000124b858183f00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000186a0000000000000000000000000000000000000000000000000000048ee3a42593400000000000000000000000000000000000000000000000000000000000000427f5c764cbc14f9669b88837ca1490cca17c31607000064da10009cbd5d07dd0cecc66161fc93d7c9000da1000064420000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004449404b7c000000000000000000000000000000000000000000000000000048ee3a42593400000000000000000000000061640a8d48bca205ba91b16b0b7745e7abc6108400000000000000000000000000000000000000000000000000000000',
                    to: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
                    gas: '0x4896e',
                },
            ],
        },
    })

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    expect(
        await screen.findByLabelText('Network Fee', { exact: false })
    ).toHaveAccessibleDescription('Unknown')

    expect(
        await screen.findByText('We couldn’t calculate network fee')
    ).toBeInTheDocument()

    env.api['/wallet/fee/forecast'].post = () => [
        200,
        usdcSwapEthereumOptimismForecast,
    ]
    await userEvent.click(await screen.findByRole('button', { name: 'Retry' }))
    await act(() => {
        jest.runOnlyPendingTimers()
    })

    expect(
        await screen.findByLabelText('Network Fee', { exact: false })
    ).toHaveAccessibleDescription('6 sec $0.01')

    env.api['/wallet/fee/forecast'].post = () => [500, null]
    await act(() => {
        jest.advanceTimersByTime(30000)
    })

    expect(
        await screen.findByText('Estimates might be old, last refresh failed')
    ).toBeInTheDocument()

    env.api['/wallet/fee/forecast'].post = () => [
        200,
        usdcSwapEthereumOptimismForecastLowBalance,
    ]
    await userEvent.click(await screen.findByRole('button', { name: 'Retry' }))
    await act(() => {
        jest.runOnlyPendingTimers()
    })

    // Suddenly low balance appears
    expect(
        await screen.findByText('Need 0.000000303 ETH to submit transaction')
    ).toBeInTheDocument()

    expect(await screen.findByRole('button', { name: 'Submit' })).toBeDisabled()

    env.api['/wallet/fee/forecast'].post = () => [
        200,
        usdcSwapEthereumOptimismForecast,
    ]
    await act(() => {
        jest.advanceTimersByTime(30000)
    })

    const submit = await screen.findByRole('button', { name: 'Submit' })
    expect(submit).not.toBeDisabled()
    await userEvent.click(submit)

    await act(() => {
        jest.advanceTimersByTime(10000)
    })

    expect(await screen.findByText('Added to queue')).toBeInTheDocument()
    expect(env.api['/wallet/rpc/'].eth_sendRawTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
            data: '{"id":123,"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["0x0"]}',
        })
    )

    jest.useRealTimers()
})
