export const dummySendTransaction: {
    id: number
    method: unknown
    params: unknown
} = {
    id: 0,
    method: 'eth_sendTransaction',
    params: [
        {
            from: '0x26d0d88ffe184b1ba244d08fb2a0c695e65c8932',
            data: '0x095ea7b300000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
            to: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
            gas: '0x13466',
        },
    ],
}
