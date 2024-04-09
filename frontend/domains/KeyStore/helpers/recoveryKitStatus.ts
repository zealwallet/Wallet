import { SecretPhrase } from '@zeal/domains/KeyStore'

export const recoveryKitStatus = (
    keystore: SecretPhrase
): 'configured' | 'not_configured' => {
    return [keystore.confirmed, !!keystore.googleDriveFile].some(Boolean)
        ? 'configured'
        : 'not_configured'
}
