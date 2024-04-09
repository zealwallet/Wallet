import { ImperativeError } from '@zeal/domains/Error'
import { FailedToFetchGoogleAuthToken } from '@zeal/domains/GoogleDriveFile'

export const fetchGoogleToken = async (): Promise<string> => {
    try {
        const { token } = await chrome.identity.getAuthToken({
            interactive: true,
        })
        if (!token) {
            throw new ImperativeError(`no token after getAuthToken call`)
        }
        return token
    } catch (e) {
        throw new FailedToFetchGoogleAuthToken(e)
    }
}
