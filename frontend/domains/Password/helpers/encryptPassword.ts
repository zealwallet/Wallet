import { encrypt, uuid } from '@zeal/toolkit/Crypto'

export const encryptPassword = async ({ password }: { password: string }) => {
    const sessionPassword = uuid()
    const encryptedPassword = await encrypt(password, {
        password: sessionPassword,
    })
    return { sessionPassword, encryptedPassword }
}
