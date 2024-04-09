import { act } from '@testing-library/react'

type Listener = () => void

const lottieListeners: Listener[] = []

jest.mock('lottie-web', () => {
    return {
        loadAnimation: () => ({
            getDuration: jest.fn(),
            setSpeed: jest.fn(),
            destroy: jest.fn(),
            addEventListener: (_event: string, listener: Listener) => {
                lottieListeners.push(listener)
            },
            removeEventListener: (_event: string, listener: Listener) => {
                const indexOf = lottieListeners.indexOf(listener)
                lottieListeners.splice(indexOf, 1)
            },
        }),
    }
})

export const runLottieListeners = async () => {
    await act(() => {
        lottieListeners.forEach((listener) => listener())
    })
}
