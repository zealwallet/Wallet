import { notReachable } from '@zeal/toolkit'

export type BearerToken = {
    type: 'bearer_token'
    token: string
}

export type Auth =
    | {
          type: 'message_and_signature'
          message: string
          signature: string
      }
    | { type: 'unblock_user_id'; userId: string }
    | { type: 'session_id'; sessionId: string }
    | BearerToken

export const getAuthHeaders = (auth: Auth): Record<string, string> => {
    switch (auth.type) {
        case 'message_and_signature':
            return {
                Authorization: `Signature ${
                    auth.signature
                }; Message ${encodeURIComponent(auth.message)}`,
            }

        case 'session_id':
            return {
                'unblock-session-id': auth.sessionId,
            }

        case 'unblock_user_id':
            return {
                'user-uuid': auth.userId,
            }

        case 'bearer_token':
            return {
                Authorization: `Bearer ${auth.token}`,
            }

        /* istanbul ignore next */
        default:
            return notReachable(auth)
    }
}
