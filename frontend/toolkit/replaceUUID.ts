const UUID_REGEXP =
    /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/g

export const replaceUUID = (input: string, replace: string): string =>
    input.replace(UUID_REGEXP, replace)
