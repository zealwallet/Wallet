export const formatSortCode = (sortCode: string | undefined): string => {
    if (!sortCode) {
        return ''
    }

    const parts = sortCode.match(/.{1,2}/g) || []
    return parts.join('-')
}
