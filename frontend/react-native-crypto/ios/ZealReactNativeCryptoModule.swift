import CommonCrypto
import CryptoKit
import ExpoModulesCore
import Foundation
import Security

public class ZealReactNativeCryptoModule: Module {
    public func definition() -> ModuleDefinition {
        Name("ZealReactNativeCrypto")

        AsyncFunction("encryptRSAOAEP") {
            (data: String, publicKeyBase64: String) async throws -> String in
            guard let publicKeyData = Data(base64Encoded: publicKeyBase64),
            let publicKey = SecKeyCreateWithData(publicKeyData as CFData, [
                kSecAttrKeyType: kSecAttrKeyTypeRSA,
                kSecAttrKeyClass: kSecAttrKeyClassPublic,]
                                                 as CFDictionary, nil),
            let data = data.data(using: .utf8) else {
                throw NSError(domain: "Invalid input", code: 0, userInfo: nil)
            }
            let algorithm: SecKeyAlgorithm = .rsaEncryptionOAEPSHA1
            guard SecKeyIsAlgorithmSupported(publicKey, .encrypt, algorithm) else {
                throw NSError(domain: "Algorithm not supported", code: 0, userInfo: nil)
            }
            var error: Unmanaged<CFError>?
            guard let cipherData = SecKeyCreateEncryptedData(publicKey, algorithm, data as CFData, &error) else {
                throw NSError(domain: "Failed to encrypt", code: 0, userInfo: nil)
            }

            return (cipherData as Data).base64EncodedString(options: [])
        }

        AsyncFunction("decryptAESGCM") {
            (cipherBase64: String, keyBase64: String, ivBase64: String) async throws -> String in
            guard let cipherData = Data(base64Encoded: cipherBase64),
            let keyData = Data(base64Encoded: keyBase64),
            let ivData = Data(base64Encoded: ivBase64) else {
                throw NSError(domain: "invalid input data", code: 0, userInfo: nil)
            }
            guard cipherData.count > 16 else {
                throw NSError(domain: "Ciphertext too short", code: 0, userInfo: nil)
            }

            let tag = cipherData.suffix(16)
            let actualCipherText = cipherData.prefix(cipherData.count - 16)
            let symmetricKey = SymmetricKey(data: keyData)

            
            let nonce = try AES.GCM.Nonce(data: ivData)
            let sealedBox = try AES.GCM.SealedBox(nonce: nonce, ciphertext: actualCipherText, tag: tag)
            let decryptedData = try AES.GCM.open(sealedBox, using: symmetricKey)

            guard let result = String(data: decryptedData, encoding: .utf8) else {
                throw NSError(domain: "Empty result from decryption", code: 0, userInfo: nil)
            }

            return result            
        }
    }

}
