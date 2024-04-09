// eslint-disable-next-line import/no-anonymous-default-export
export default {
    async createPasskeyCredential(
        request: PublicKeyCredentialCreationOptions
    ): Promise<Credential | null> {
        return navigator.credentials.create({ publicKey: request })
    },

    async signWithPasskeyCredential(
        request: PublicKeyCredentialRequestOptions
    ): Promise<Credential | null> {
        return navigator.credentials.get({ publicKey: request })
    },
}
