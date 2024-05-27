import { format } from 'date-fns'

export const generatePasskeyName = (walletLabel: string): string => {
    const formattedDate = format(new Date(), 'd/M HH:mm yyyy')
    return `${walletLabel} ${formattedDate}`
}
