package expo.modules.passkeys

import android.app.Activity
import android.content.Context
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class PasskeysModule : Module() {
    private val context: Context
        get() = requireNotNull(appContext.reactContext)

    private val currentActivity: Activity?
        get() = appContext.currentActivity

    private val passkeyManager: PasskeyManager by lazy {
        PasskeyManager(context, currentActivity)
    }

    override fun definition() = ModuleDefinition {
        Name("Passkeys")

        AsyncFunction("createPasskeyCredential") { requestJson: String, promise: Promise ->
            passkeyManager.createPasskeyCredential(requestJson, promise)
        }

        AsyncFunction("signWithPasskeyCredential") { requestJson: String, promise: Promise ->
            passkeyManager.signWithPasskeyCredential(requestJson, promise)
        }
    }
}
