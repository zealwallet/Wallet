import ExpoModulesCore

public class PasskeysModule: Module {
  let passkeyManager = PasskeyManager()
  
  public func definition() -> ModuleDefinition {
    Name("Passkeys")
    
    AsyncFunction("createPasskeyCredential") { (challengeBase64: String, userIdBase64: String, userName: String, rpId: String, promise: Promise) in
      self.passkeyManager.createPasskeyCredential(challengeBase64: challengeBase64, userIdBase64: userIdBase64, userName: userName, rpId: rpId, promise: promise)
    }
    
    AsyncFunction("signWithPasskeyCredential") { (challengeBase64: String, allowedCredentialsBase64: [String], rpId: String, promise: Promise) in
      self.passkeyManager.signWithPasskeyCredential(challengeBase64: challengeBase64, allowedCredentials: allowedCredentialsBase64, rpId: rpId, promise: promise)
    }
  }
}
