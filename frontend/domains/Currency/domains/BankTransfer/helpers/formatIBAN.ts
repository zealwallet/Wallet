export const formatIBAN = (iban: string): string =>
    iban.replace(/(.{4})/g, '$1 ').trim()
