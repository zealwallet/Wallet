export const revokeToken = async ({
    token,
}: {
    token: string
}): Promise<void> => {
    await chrome.identity.removeCachedAuthToken({ token: token })
    await window.fetch(
        'https://accounts.google.com/o/oauth2/revoke?token=' + token
    )
}
