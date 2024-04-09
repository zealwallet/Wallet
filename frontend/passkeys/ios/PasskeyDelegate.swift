import AuthenticationServices
import ExpoModulesCore

var pendingRequests = Set<PasskeyDelegate>()

class PasskeyDelegate: NSObject, ASAuthorizationControllerPresentationContextProviding, ASAuthorizationControllerDelegate {
  private var callback: ((ASAuthorization?, Error?) -> Void)?
  
  func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
    guard let window = (UIApplication.shared.connectedScenes.first as? UIWindowScene)?.windows.first(where: { $0.isKeyWindow }) else {
      fatalError("Unable to present modal view controller - no key window available")
    }
    return window
  }
  
  
  func performAuth(authController: ASAuthorizationController, callback: @escaping (ASAuthorization?, Error?) -> Void) {
    self.callback = callback
    authController.delegate = self
    authController.presentationContextProvider = self
    pendingRequests.insert(self)
    
    authController.performRequests()
  }
  
  func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
    self.callback!(authorization, nil)
    self.callback = nil
    pendingRequests.remove(self)
  }
  
  func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
    self.callback!(nil, error)
    self.callback = nil
    pendingRequests.remove(self)
  }
}
