import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { rpcTransaction } from '@zeal/domains/Transactions/api/fixtures/rpcTransaction'

import { cleanEnv, mockEnv, TestEnvironment } from 'src/tests/env'
import { renderPage } from 'src/tests/utils/renderers'

let env: TestEnvironment

beforeEach(() => {
    env = mockEnv()
})

afterEach(() => {
    cleanEnv(env)
    jest.restoreAllMocks()
})

test(`As a user I should be able to see historical transactions categorized logically so that I can find a specific transaction easily
As a user I should be able to click on a transaction to see more details about it`, async () => {
    env.api['/wallet/rpc/'].eth_getTransactionByHash = jest.fn(() => [
        200,
        rpcTransaction,
    ])

    jest.useFakeTimers().setSystemTime(new Date('2023-09-07 17:03'))

    await renderPage('/index.html?type=extension&mode=popup')

    await act(() => {
        jest.runOnlyPendingTimers()
    })

    await userEvent.click(await screen.findByLabelText('Activity'))

    expect(await screen.findByText('Today')).toBeInTheDocument()
    expect(await screen.findByText('This week')).toBeInTheDocument()
    expect(await screen.findByText('This month')).toBeInTheDocument()

    // Outbound P2P
    const outboundP2pTrx = await screen.findByLabelText('Send')
    await userEvent.click(outboundP2pTrx)

    let detailModal = await screen.findByRole('dialog')

    expect(await within(detailModal).findAllByText('$0.01')).toHaveLength(2)
    expect(
        await within(detailModal).findByText('To 0x2b5D...605C')
    ).toBeInTheDocument()

    expect(await within(detailModal).findByText('Sent to')).toBeInTheDocument()
    expect(
        await within(detailModal).findByText('0xCD...88')
    ).toBeInTheDocument()

    expect(
        await within(detailModal).findByText('Transaction hash')
    ).toBeInTheDocument()
    expect(
        await within(detailModal).findByText('0x2b5D...605C')
    ).toBeInTheDocument()

    expect(await within(detailModal).findByText('Network')).toBeInTheDocument()
    expect(await within(detailModal).findByText('Polygon')).toBeInTheDocument()

    expect(
        await within(detailModal).findByText('Network fee in Tokens')
    ).toBeInTheDocument()
    expect(
        await within(detailModal).findByText('Network fee in USD')
    ).toBeInTheDocument()
    expect(
        await within(detailModal).findByText('0.01581 MATIC')
    ).toBeInTheDocument()
    expect(await within(detailModal).findByText('Nonce')).toBeInTheDocument()
    expect(await within(detailModal).findByText('586')).toBeInTheDocument()

    expect(await within(detailModal).findByText('Block')).toBeInTheDocument()
    expect(await within(detailModal).findByText('47169811')).toBeInTheDocument()

    expect(
        await within(detailModal).findByText('Shiba Inu Head')
    ).toBeInTheDocument()
    expect(
        await within(detailModal).findByText('Decentraland Wearables (Polygon)')
    ).toBeInTheDocument()
    expect(await within(detailModal).findByText('-1')).toBeInTheDocument()

    await userEvent.click(await within(detailModal).findByLabelText('Close'))

    // SelfP2P
    const selfP2pTrx = await screen.findByLabelText('Send to self')
    await userEvent.click(selfP2pTrx)

    detailModal = await screen.findByRole('dialog')

    expect(await within(detailModal).findAllByText('$0.01')).toHaveLength(2)
    expect(
        await within(detailModal).findByText('To Account 1')
    ).toBeInTheDocument()

    expect(await within(detailModal).findByText('Sent to')).toBeInTheDocument()
    expect(
        await within(detailModal).findByText('Account 1')
    ).toBeInTheDocument()

    expect(
        await within(detailModal).findByText('Transaction hash')
    ).toBeInTheDocument()
    expect(
        await within(detailModal).findByText('0x68...C0')
    ).toBeInTheDocument()

    expect(await within(detailModal).findByText('Network')).toBeInTheDocument()
    expect(await within(detailModal).findByText('Polygon')).toBeInTheDocument()

    expect(
        await within(detailModal).findByText('Network fee in Tokens')
    ).toBeInTheDocument()
    expect(
        await within(detailModal).findByText('Network fee in USD')
    ).toBeInTheDocument()
    expect(
        await within(detailModal).findByText('0.004608 MATIC')
    ).toBeInTheDocument()
    expect(await within(detailModal).findByText('Nonce')).toBeInTheDocument()
    expect(await within(detailModal).findByText('586')).toBeInTheDocument()

    expect(await within(detailModal).findByText('Block')).toBeInTheDocument()
    expect(await within(detailModal).findByText('47169811')).toBeInTheDocument()

    expect(
        await within(detailModal).findByLabelText('No balance change')
    ).toBeInTheDocument()

    await userEvent.click(await within(detailModal).findByLabelText('Close'))

    // ERC20 Approval
    const approvalTrx = await screen.findByLabelText('Approve')
    await userEvent.click(approvalTrx)

    detailModal = await screen.findByRole('dialog')

    expect(await within(detailModal).findAllByText('$0.01')).toHaveLength(2)
    expect(
        await within(detailModal).findByText('For Socket')
    ).toBeInTheDocument()

    expect(
        await within(detailModal).findByText('Approve for')
    ).toBeInTheDocument()
    expect(await within(detailModal).findByText('Socket')).toBeInTheDocument()

    expect(
        await within(detailModal).findByText('Transaction hash')
    ).toBeInTheDocument()
    expect(
        await within(detailModal).findByText('0xEA...DC')
    ).toBeInTheDocument()

    expect(await within(detailModal).findByText('Network')).toBeInTheDocument()
    expect(await within(detailModal).findByText('Polygon')).toBeInTheDocument()

    expect(
        await within(detailModal).findByText('Network fee in Tokens')
    ).toBeInTheDocument()
    expect(
        await within(detailModal).findByText('Network fee in USD')
    ).toBeInTheDocument()
    expect(
        await within(detailModal).findByText('0.005052 MATIC')
    ).toBeInTheDocument()
    expect(await within(detailModal).findByText('Nonce')).toBeInTheDocument()
    expect(await within(detailModal).findByText('586')).toBeInTheDocument()

    expect(await within(detailModal).findByText('Block')).toBeInTheDocument()
    expect(await within(detailModal).findByText('47169811')).toBeInTheDocument()

    expect(
        await within(detailModal).findByText('Spend limits approved')
    ).toBeInTheDocument()

    expect(
        await within(detailModal).findByLabelText('USDC')
    ).toBeInTheDocument()

    await userEvent.click(await within(detailModal).findByLabelText('Close'))

    // Inbound P2P
    const inboundP2pTrx = await screen.findByLabelText('Receive')
    await userEvent.click(inboundP2pTrx)

    detailModal = await screen.findByRole('dialog')

    expect(
        await within(detailModal).findByText('From 0x2c29...B299')
    ).toBeInTheDocument()

    expect(
        await within(detailModal).findByText('Received from')
    ).toBeInTheDocument()
    expect(
        await within(detailModal).findByText('0x2c29...B299')
    ).toBeInTheDocument()

    expect(
        await within(detailModal).findByText('Transaction hash')
    ).toBeInTheDocument()
    expect(
        await within(detailModal).findByText('0xf0f4...660f')
    ).toBeInTheDocument()

    expect(await within(detailModal).findByText('Network')).toBeInTheDocument()
    expect(await within(detailModal).findByText('Polygon')).toBeInTheDocument()

    expect(await within(detailModal).findByText('Block')).toBeInTheDocument()
    expect(await within(detailModal).findByText('47169811')).toBeInTheDocument()

    expect(
        await within(detailModal).findByLabelText('MATIC')
    ).toBeInTheDocument()
    expect(await within(detailModal).findByText('+0.2854')).toBeInTheDocument()

    await userEvent.click(await within(detailModal).findByLabelText('Close'))

    // Multi-token transactions
    const multiTokenTrx = await screen.findByLabelText('mintAndSwap')
    expect(
        await within(multiTokenTrx).findByText('+1 more token(s)')
    ).toBeInTheDocument()

    await userEvent.click(multiTokenTrx)

    detailModal = await screen.findByRole('dialog')

    expect(
        await within(detailModal).findByText('Using 0x8f5b...1280')
    ).toBeInTheDocument()

    expect(await within(detailModal).findByText('Using')).toBeInTheDocument()
    expect(
        await within(detailModal).findByText('0x8f5b...1280')
    ).toBeInTheDocument()

    expect(
        await within(detailModal).findByText('Transaction hash')
    ).toBeInTheDocument()
    expect(
        await within(detailModal).findByText('0x3D...7C')
    ).toBeInTheDocument()

    expect(await within(detailModal).findByText('Network')).toBeInTheDocument()
    expect(await within(detailModal).findByText('Polygon')).toBeInTheDocument()

    expect(await within(detailModal).findByText('Nonce')).toBeInTheDocument()
    expect(await within(detailModal).findByText('586')).toBeInTheDocument()

    expect(await within(detailModal).findByText('Block')).toBeInTheDocument()
    expect(await within(detailModal).findByText('47169811')).toBeInTheDocument()

    expect(await within(detailModal).findAllByLabelText('USDC')).toHaveLength(3)
    expect(
        await within(detailModal).findByLabelText('MATIC')
    ).toBeInTheDocument()
    expect(await within(detailModal).findByLabelText('ETH')).toBeInTheDocument()

    expect(await within(detailModal).findByText('+0.4991')).toBeInTheDocument()
    expect(await within(detailModal).findByText('+0.25')).toBeInTheDocument()
    expect(await within(detailModal).findAllByText('-0.4991')).toHaveLength(2)
    expect(await within(detailModal).findByText('-0.4211')).toBeInTheDocument()

    await userEvent.click(await within(detailModal).findByLabelText('Close'))

    jest.useRealTimers()
})
