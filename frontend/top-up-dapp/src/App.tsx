import { ApplicationContainer } from '@zeal/uikit/ApplicationContainer'

import { SendCryptoCurrency } from './features/SendCryptoCurrency'

export const App = () => (
    <ApplicationContainer variant="dApp">
        <SendCryptoCurrency />
    </ApplicationContainer>
)
