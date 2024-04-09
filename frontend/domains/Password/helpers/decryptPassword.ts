import { decrypt } from '@zeal/toolkit/Crypto'
import { object, Result, shape, string } from '@zeal/toolkit/Result'

export const decryptPassword = async ({
    encrypted,
    userPassword,
}: {
    userPassword: string
    encrypted: string
}): Promise<{
    sessionPassword: string
    unencryptedUserPassword: string
}> => {
    const { password } = await decrypt(userPassword, encrypted, parser)
    return {
        sessionPassword: password,
        unencryptedUserPassword: userPassword,
    }
}

const parser = (input: unknown): Result<unknown, { password: string }> =>
    object(input).andThen((obj) =>
        shape({
            password: string(obj.password),
        })
    )
