import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { wait } from '@testing-library/user-event/dist/utils'

import { testPassword } from '@zeal/domains/KeyStore/api/fixtures/testPassword'
import {
    permit2WithUnlimitedSpendAndLongExpiry,
    permit2WithUnlimitedSpendAndShortExpiry,
    permitWithDangerFailedSafetyCheck,
    permitWithLimitedSpendLimitAndShortExpiry,
} from '@zeal/domains/RPCRequest/domains/SignMessageSimulation/api/fixtures/permitWithLimitedSpendLimitAndShortExpiry'
import {
    EC_RECOVER_RPC_REQUEST,
    NFT_SIGN_RPC_REQUEST,
    PERMIT_RPC_REQUEST,
    PERMIT_WITH_MALICIOUS_SPENDER_RPC_REQUEST,
    PERMIT2_EXPIRATION_TOO_FAR_IN_THE_FUTURE_RPC_REQUEST,
    PERMIT2_UNLIMITED_SPEND_RPC_REQUEST,
    PERSONAL_SIGN_RPC_REQUEST,
} from '@zeal/domains/RPCRequest/domains/SignMessageSimulation/api/fixtures/signMessageRpcRequests'
import { onlyPKAccount } from '@zeal/domains/Storage/api/fixtures/localStorage'
import { LS_KEY } from '@zeal/domains/Storage/constants'

import { cleanEnv, mockEnv, TestEnvironment } from 'src/tests/env'
import { runLottieListeners } from 'src/tests/mocks/lottie'
import { renderZWidget } from 'src/tests/utils/renderers'

describe('sign', () => {
    let env: TestEnvironment

    beforeEach(() => {
        env = mockEnv()
    })

    afterEach(() => {
        cleanEnv(env)
    })

    test('As a user I want to sign NTF for sale', async () => {
        env.chromeMocks.storages.session = {}
        const dAppHost = 'dapp.example.com'

        const { toWidget, postMessage } = await renderZWidget({ dAppHost })
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

        await toWidget(NFT_SIGN_RPC_REQUEST)

        await userEvent.click(
            await screen.findByRole('button', { name: 'Accept' })
        )

        await waitFor(() => {
            expect(postMessage).toReceiveMsg({
                type: 'rpc_response',
                id: 12345,
                response: {
                    type: 'Success',
                    data: '0x8024e5eeb1164309275f5485e77a1284b91cd23dce18f2f91b42b97da23820e456fbf6cecbffc0ccb238f9b786fa57c045f92458fee3aaf0caf8795e741303ed1b',
                },
            })
        })
    })

    test('As a user I should be able to sign simple message, so I can authorize various actions for dApps', async () => {
        env.chromeMocks.storages.session = {}
        env.chromeMocks.storages.local[LS_KEY] = JSON.stringify(onlyPKAccount)

        const dAppHost = 'dapp.example.com'

        const { toWidget, postMessage } = await renderZWidget({ dAppHost })
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

        await toWidget(PERSONAL_SIGN_RPC_REQUEST)

        await userEvent.click(
            await screen.findByRole('button', { name: 'Accept' })
        )

        await waitFor(() => {
            expect(postMessage).toReceiveMsg({
                type: 'rpc_response',
                id: 123,
                response: {
                    type: 'Success',
                    data: '0x5a853d0362acb3a0b022f8d3e5082149ec94c47c069ead1997081d2a2fc33d863fcedabacde4e858fdb40b1638f1592237027513db1a2b481a6fd48a9bf733101c',
                },
            })
        })
    })
    // eslint-disable-next-line jest/no-disabled-tests
    test.skip(`As a user I should be able to sign a permit / permit2 / permitBatch / DAI permit messages, so that I can set spend limits for specific contracts
    As a user I should see a warning if the spend limit on a permit is set to UNLIMITED, so that I am made aware of the dangerous action
    As a user I should see a warning and safety check failure if a permit has an expiration date of > 24hrs so that I am made aware of the dangerous action
    As a user I should see a confirmation popup if I try to sign a permit message with a DANGER failed safety check, so that I don't make a mistake`, async () => {
        env.chromeMocks.storages.session = {}
        env.chromeMocks.storages.local[LS_KEY] = JSON.stringify(onlyPKAccount)
        const dAppHost = 'dapp.example.com'

        const { toWidget, postMessage } = await renderZWidget({ dAppHost })
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

        jest.useFakeTimers().setSystemTime(new Date('2023-10-16 17:03'))

        // Permit
        env.api['/wallet/sign-message/simulate/'].post = jest.fn(() => [
            200,
            permitWithLimitedSpendLimitAndShortExpiry,
        ])

        await toWidget(PERMIT_RPC_REQUEST)

        expect(await screen.findByText('Permit')).toBeInTheDocument()

        await userEvent.click(
            await screen.findByRole('button', { name: 'Permit information' })
        )

        expect(
            await screen.findByRole('dialog', { name: 'What are Permits?' })
        ).toBeInTheDocument()

        await userEvent.click(document.body)

        expect(await screen.findByText('USDC')).toBeInTheDocument()
        expect(await screen.findByText('Spend limit')).toBeInTheDocument()

        await userEvent.click(
            await screen.findByRole('button', { name: 'USDC spend limit info' })
        )

        expect(
            await screen.findByRole('dialog', { name: 'What is spend limit?' })
        ).toBeInTheDocument()

        await userEvent.click(document.body)

        let editSpendLimitButton = await screen.findByRole('button', {
            name: 'Edit USDC spend limit',
        })

        expect(editSpendLimitButton).toHaveTextContent('25')

        await userEvent.click(editSpendLimitButton)

        expect(
            await screen.findByRole('dialog', { name: 'Editing locked' })
        ).toBeInTheDocument()

        await userEvent.click(document.body)

        expect(await screen.findByText('Expires in…')).toBeInTheDocument()

        await userEvent.click(
            await screen.findByRole('button', { name: 'USDC expiration info' })
        )

        expect(
            await screen.findByRole('dialog', { name: 'What is expiry time?' })
        ).toBeInTheDocument()

        await userEvent.click(document.body)

        let editExpirationButton = await screen.findByRole('button', {
            name: 'Edit USDC expiration',
        })

        expect(editExpirationButton).toHaveTextContent('2 hours')

        await userEvent.click(editExpirationButton)

        expect(
            await screen.findByRole('dialog', { name: 'Editing locked' })
        ).toBeInTheDocument()

        await userEvent.click(document.body)

        let contractDetails = await screen.findByLabelText('For')
        expect(
            await within(contractDetails).findByText('For')
        ).toBeInTheDocument()
        expect(
            await within(contractDetails).findByText('Uniswap V3')
        ).toBeInTheDocument()
        expect(
            await within(contractDetails).findByText('0x68b3...fc45')
        ).toBeInTheDocument()

        await userEvent.click(
            await screen.findByRole('button', { name: 'Safety Checks Passed' })
        )

        let checksDialog = await screen.findByRole('dialog', {
            name: 'Permit safety checks',
        })

        expect(
            await within(checksDialog).findByText('Expiry time not too long')
        ).toBeInTheDocument()

        await userEvent.click(document.body)

        await userEvent.click(
            await screen.findByRole('button', { name: 'Accept' })
        )

        await waitFor(() => {
            expect(postMessage).toReceiveMsg({
                type: 'rpc_response',
                id: 3024541540,
                response: {
                    type: 'Success',
                    data: '0x2cc67783ca532a372f9aceda32461862ee99f97b7f6c81a5c9e165baa45130eb6527f5abf7b409cb22b77f176a926d9581902f699b5e24e0f0a8a4ab467a112e1c',
                },
            })
        })

        // Permit 2 unlimited spend limit
        env.api['/wallet/sign-message/simulate/'].post = jest.fn(() => [
            200,
            permit2WithUnlimitedSpendAndShortExpiry,
        ])

        await toWidget(PERMIT2_UNLIMITED_SPEND_RPC_REQUEST)

        expect(await screen.findByText('Permit')).toBeInTheDocument()

        expect(await screen.findByText('USDT')).toBeInTheDocument()
        expect(await screen.findByText('Spend limit')).toBeInTheDocument()

        await userEvent.click(
            await screen.findByRole('button', {
                name: 'USDT spend limit warning',
            })
        )

        expect(
            await screen.findByRole('dialog', { name: 'High spend limit' })
        ).toBeInTheDocument()

        await userEvent.click(document.body)

        editSpendLimitButton = await screen.findByRole('button', {
            name: 'Edit USDT spend limit',
        })

        expect(editSpendLimitButton).toHaveTextContent('Unlimited')

        await userEvent.click(editSpendLimitButton)

        expect(
            await screen.findByRole('dialog', { name: 'Editing locked' })
        ).toBeInTheDocument()

        await userEvent.click(document.body)

        expect(await screen.findByText('Expires in…')).toBeInTheDocument()

        editExpirationButton = await screen.findByRole('button', {
            name: 'Edit USDT expiration',
        })

        expect(editExpirationButton).toHaveTextContent('2 hours')

        await userEvent.click(editExpirationButton)

        expect(
            await screen.findByRole('dialog', { name: 'Editing locked' })
        ).toBeInTheDocument()

        await userEvent.click(document.body)

        contractDetails = await screen.findByLabelText('For')
        expect(
            await within(contractDetails).findByText('For')
        ).toBeInTheDocument()
        expect(
            await within(contractDetails).findByText('Uniswap V3')
        ).toBeInTheDocument()
        expect(
            await within(contractDetails).findByText('0xef1c...bf6b')
        ).toBeInTheDocument()

        expect(
            await screen.findByRole('button', { name: 'Safety Checks Passed' })
        ).toBeInTheDocument()

        await userEvent.click(
            await screen.findByRole('button', { name: 'Accept' })
        )

        await waitFor(() => {
            expect(postMessage).toReceiveMsg({
                type: 'rpc_response',
                id: 3975542902,
                response: {
                    type: 'Success',
                    data: '0x642e65955fce16d653c4b8094965e6952a1932527133fdb66f761750308bfe19204048d4dcb6472e06349705a3413b894e58d55791358fefd5e1584006ae61bb1b',
                },
            })
        })

        // Permit2 warning on expiration time
        env.api['/wallet/sign-message/simulate/'].post = jest.fn(() => [
            200,
            permit2WithUnlimitedSpendAndLongExpiry,
        ])

        await toWidget(PERMIT2_EXPIRATION_TOO_FAR_IN_THE_FUTURE_RPC_REQUEST)

        expect(await screen.findByText('Permit')).toBeInTheDocument()
        expect(await screen.findByText('USDT')).toBeInTheDocument()
        expect(await screen.findByText('Expires in…')).toBeInTheDocument()

        editExpirationButton = await screen.findByRole('button', {
            name: 'Edit USDT expiration',
        })

        expect(editExpirationButton).toHaveTextContent('3 days')

        await userEvent.click(
            await screen.findByRole('button', {
                name: 'USDT expiration warning',
            })
        )

        expect(
            await screen.findByRole('dialog', { name: 'Long expiry time' })
        ).toBeInTheDocument()

        await userEvent.click(document.body)

        await userEvent.click(
            await screen.findByRole('button', {
                name: 'Long expiry time',
            })
        )

        checksDialog = await screen.findByRole('dialog', {
            name: 'Permit safety checks',
        })

        expect(
            await within(checksDialog).findByText('Long expiry time')
        ).toBeInTheDocument()

        await userEvent.click(document.body)

        await userEvent.click(
            await screen.findByRole('button', { name: 'Accept' })
        )

        await waitFor(async () => {
            await wait()
            expect(postMessage).toReceiveMsg({
                type: 'rpc_response',
                id: 3975542903,
                response: {
                    type: 'Success',
                    data: '0x24cedee959876618d78a82a16d2712c3bfe65185b23ff7d57d6fb50e71b871020de24c379fbe547f7cd0add7535b5d23347d21ba9ca7e71c6a560802d67936771c',
                },
            })
        })

        // Permit with malicious spender contract
        env.api['/wallet/sign-message/simulate/'].post = jest.fn(() => [
            200,
            permitWithDangerFailedSafetyCheck,
        ])

        await toWidget(PERMIT_WITH_MALICIOUS_SPENDER_RPC_REQUEST)

        expect(await screen.findByText('Permit')).toBeInTheDocument()
        expect(await screen.findByText('USDT')).toBeInTheDocument()

        await userEvent.click(
            await screen.findByRole('button', {
                name: 'Contract is blacklisted',
            })
        )

        checksDialog = await screen.findByRole('dialog', {
            name: 'Permit safety checks',
        })

        expect(
            await within(checksDialog).findByText('Contract is blacklisted')
        ).toBeInTheDocument()

        await userEvent.click(document.body)

        await userEvent.click(
            await screen.findByRole('button', { name: 'Accept' })
        )

        expect(
            await screen.findByRole('dialog', {
                name: 'Contract is blacklisted',
            })
        ).toBeInTheDocument()

        jest.useRealTimers()
    })

    test('As a user I should be able to recover signer address from personal message and signature, so I can keep using dApps which may verify signatures through the wallet', async () => {
        env.chromeMocks.storages.session = {}
        env.chromeMocks.storages.local[LS_KEY] = JSON.stringify(onlyPKAccount)

        const dAppHost = 'dapp.example.com'

        const { toWidget, postMessage } = await renderZWidget({ dAppHost })
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

        await toWidget(EC_RECOVER_RPC_REQUEST)

        await waitFor(() => {
            expect(postMessage).toReceiveMsg({
                type: 'rpc_response',
                id: 2401034411,
                response: {
                    type: 'Success',
                    data: '0x13eca1982fc5039a2cfe7cea9fdfdb10c890f8f5',
                },
            })
        })
    })
})
