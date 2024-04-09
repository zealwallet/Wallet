import { IntlProvider } from 'react-intl'

import { noop } from '@zeal/toolkit'

type Props = {
    children: React.ReactNode
}

export const AppProvider = ({ children }: Props) => {
    return (
        <IntlProvider onError={noop} locale="en">
            {children}
        </IntlProvider>
    )
}
