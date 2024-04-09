import { Image } from 'react-native'

export const validateImage = (src: string): Promise<string> =>
    new Promise((resolve, reject) => {
        Image.prefetch(src)
            .then(() => resolve(src))
            .catch((error) => reject(error))
    })
