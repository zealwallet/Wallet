import AuthenticationServices
import ExpoModulesCore

enum PasskeyAuthError: Error {
  case unexpectedError(description: String)
  case userCancelled(description: String)
  case generalError(info: [String: Any])
}

public class PasskeyManager {
    let AUTH_ERROR_KEY = "PasskeyAuthError"
    let REGISTRATION_ERROR_KEY = "PasskeyCreationError"
    
  internal func parseError(_ error: Error) -> String {
    guard let authorizationError = error as? ASAuthorizationError else {
      return "Unexpected auth error: \(error.localizedDescription)"
    }
    
    switch authorizationError.code {
    case .canceled:
      return "User cancelled passkey auth request"
    default:
      let errorInfo = (error as NSError).userInfo.description
      return "Error: \(errorInfo)"
    }
  }
  
  
  public func createPasskeyCredential(challengeBase64: String, userIdBase64: String, userName: String, rpId: String, promise: Promise) {
    let platformProvider = ASAuthorizationPlatformPublicKeyCredentialProvider(relyingPartyIdentifier: rpId)
    let challengeData = Data(base64Encoded: challengeBase64)!
    let userIdData = Data(base64Encoded: userIdBase64)!
    
    let passkeyCreationRequest = platformProvider.createCredentialRegistrationRequest(challenge: challengeData, name: userName, userID: userIdData)
    
    let authController = ASAuthorizationController(authorizationRequests: [passkeyCreationRequest])
    
    PasskeyDelegate().performAuth(authController: authController, callback: { (response, error) in
      if let error = error {
        promise.reject(self.REGISTRATION_ERROR_KEY, self.parseError(error))
        return
      }
      
      guard let response = response else {
        promise.reject("UnknownError", "Invalid passkey registration response")
        return
      }
      
      switch response.credential {
      case let credential as ASAuthorizationPlatformPublicKeyCredentialRegistration:
        let response: [AnyHashable: Any] = [
          "clientDataJSON": credential.rawClientDataJSON.base64EncodedString(),
          "attestationObject": credential.rawAttestationObject?.base64EncodedString(),
          "credentialId": credential.credentialID.base64EncodedString()
        ]
        promise.resolve(response)
      default:
        promise.reject("UnknownError", "Unexpected credential type: \(response.credential)")
      }
    })
  }
  
  public func signWithPasskeyCredential(challengeBase64: String, allowedCredentials: [String], rpId: String, promise: Promise) {
    let platformProvider = ASAuthorizationPlatformPublicKeyCredentialProvider(relyingPartyIdentifier: rpId)
    let challengeData = Data(base64Encoded: challengeBase64)!
    
    let allowedCredentialsData: [ASAuthorizationPlatformPublicKeyCredentialDescriptor] = allowedCredentials.map {
      let credentialIdData = Data(base64Encoded: $0)!
      return ASAuthorizationPlatformPublicKeyCredentialDescriptor(credentialID: credentialIdData)
    }
    
    let passkeySigningRequest = platformProvider.createCredentialAssertionRequest(challenge: challengeData)
    passkeySigningRequest.allowedCredentials = allowedCredentialsData
    
    let authController = ASAuthorizationController(authorizationRequests: [passkeySigningRequest])
    
    PasskeyDelegate().performAuth(authController: authController, callback: { (response, error) in
      if let error = error {
        promise.reject(self.AUTH_ERROR_KEY, self.parseError(error))
        return
      }
      
      guard let response = response else {
        promise.reject("UnknownError", "Invalid passkey auth response")
        return
      }
      
      switch response.credential {
      case let credential as ASAuthorizationPlatformPublicKeyCredentialAssertion:
        let response: [AnyHashable: Any] = [
          "credentialId": credential.credentialID.base64EncodedString(),
          "userId": credential.userID.base64EncodedString(),
          "signature": credential.signature.base64EncodedString(),
          "clientDataJSON": credential.rawClientDataJSON.base64EncodedString(),
          "authenticatorData": credential.rawAuthenticatorData.base64EncodedString()
        ]
        promise.resolve(response)
      default:
        promise.reject("UnknownError", "Unexpected credential type: \(response.credential)")
      }
    })
  }
}
