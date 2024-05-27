import Messaging from '@react-native-firebase/messaging'
import { post } from '@zeal/api/request'

import { Address } from '@zeal/domains/Address'

export const registerPushNotifications = async (
    addresses: Address[]
): Promise<void> =>
    //  FIXME @resetko-zeal dtop keystore filtration when this thing is invoked
    Messaging()
        .getToken()
        .then((token) =>
            post('/wallet/notifications/registration', {
                body: {
                    token,
                    addresses: addresses,
                },
            }).then(() => undefined)
        )
