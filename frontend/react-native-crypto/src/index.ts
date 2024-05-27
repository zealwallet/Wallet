// Import the native module. On web, it will be resolved to ZealReactNativeCrypto.web.ts
// and on native platforms to ZealReactNativeCrypto.ts
import {
    decryptAESGCM as decryptAESGCMNative,
    encryptRSAOAEP as encryptRSAOAEPNative,
} from './ZealReactNativeCryptoModule'

export const encryptRSAOAEP = async (
    dataBase64: string,
    publicKeyBase64: string
): Promise<string> => encryptRSAOAEPNative(dataBase64, publicKeyBase64)

export const decryptAESGCM = async (
    cipherBase64: string,
    keyBase64: string,
    ivBase64: string
): Promise<string> => decryptAESGCMNative(cipherBase64, keyBase64, ivBase64)
