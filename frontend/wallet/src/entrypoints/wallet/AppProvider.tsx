import React from 'react'
import { IntlProvider } from 'react-intl'

type Props = {
    children: React.ReactNode
}

export const AppProvider = ({ children }: Props) => {
    return <IntlProvider locale="en">{children}</IntlProvider>
}
