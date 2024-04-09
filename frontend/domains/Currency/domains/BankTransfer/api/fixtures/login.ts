export const successfulUnblockLogin: unknown = {
    user_uuid: 'xxx',
    unblock_session_id: 'yyy',
}

export const unblockUserNotFound: unknown = {
    message: 'User not found for crypto address 0x000',
    name: 'AuthBadRequestError',
    statusCode: 400,
    level: 'error',
    error_id: 'Root=1-64e34e8b-0d00c58d39eb26e910bac371',
}
