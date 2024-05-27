package expo.modules.passkeys

import android.app.Activity
import android.content.Context
import android.util.Log
import androidx.credentials.CreatePublicKeyCredentialRequest
import androidx.credentials.CredentialManager
import androidx.credentials.GetCredentialRequest
import androidx.credentials.GetPublicKeyCredentialOption
import androidx.credentials.exceptions.CreateCredentialCancellationException
import androidx.credentials.exceptions.CreateCredentialException
import androidx.credentials.exceptions.GetCredentialCancellationException
import androidx.credentials.exceptions.GetCredentialException
import androidx.credentials.exceptions.publickeycredential.CreatePublicKeyCredentialDomException
import androidx.credentials.exceptions.publickeycredential.GetPublicKeyCredentialDomException
import expo.modules.kotlin.Promise
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.lang.IllegalStateException

class ActivityNotFoundException(message: String) : Exception(message)

class PasskeyManager(private val context: Context, private val currentActivity: Activity?) {

    companion object {
        private const val REGISTRATION_RESPONSE_BUNDLE_KEY = "androidx.credentials.BUNDLE_KEY_REGISTRATION_RESPONSE_JSON"
        private const val AUTH_RESPONSE_BUNDLE_KEY = "androidx.credentials.BUNDLE_KEY_AUTHENTICATION_RESPONSE_JSON"
        private const val WEB_IDL_NOT_ALLOWED_ERROR = "androidx.credentials.TYPE_NOT_ALLOWED_ERROR" // https://webidl.spec.whatwg.org/#idl-DOMException-error-names
        private const val REGISTRATION_ERROR_KEY = "PasskeyCreationError"
        private const val AUTH_ERROR_KEY = "PasskeyAuthError"
        private const val USER_CANCELLED_REQUEST_MESSAGE = "User cancelled passkey auth request"
    }

    private val coroutineScope = CoroutineScope(Dispatchers.Default)

    private fun parseCreationError(exception: CreateCredentialException): String {
        return when (exception) {
            is CreatePublicKeyCredentialDomException -> {
                when (exception.domError.type) {
                    WEB_IDL_NOT_ALLOWED_ERROR -> USER_CANCELLED_REQUEST_MESSAGE
                    else -> exception.toString()
                }
            }
            is CreateCredentialCancellationException -> USER_CANCELLED_REQUEST_MESSAGE
            else -> exception.toString()
        }
    }

    private fun parseSignError(exception: GetCredentialException): String {
        return when (exception) {
            is GetCredentialCancellationException -> USER_CANCELLED_REQUEST_MESSAGE
            is GetPublicKeyCredentialDomException -> {
                when (exception.domError.type) {
                    WEB_IDL_NOT_ALLOWED_ERROR -> USER_CANCELLED_REQUEST_MESSAGE
                    else -> exception.toString()
                }
            }
            else -> exception.toString()
        }
    }

    fun createPasskeyCredential(requestJson: String, promise: Promise) {
        val credentialManager = CredentialManager.create(context)
        val createPublicKeyCredentialRequest = CreatePublicKeyCredentialRequest(requestJson)

        if (currentActivity == null) {
            throw ActivityNotFoundException("Missing activity when creating passkey")
        }

        coroutineScope.launch {
            try {
                val result = credentialManager.createCredential(
                        context = currentActivity,
                        request = createPublicKeyCredentialRequest,
                )

                val response = result.data.getString(REGISTRATION_RESPONSE_BUNDLE_KEY)

                if (response == null) {
                    promise.reject(REGISTRATION_ERROR_KEY, "Invalid passkey registration response", IllegalStateException("Invalid passkey registration response"))
                }

                promise.resolve(response)

            } catch (e: CreateCredentialException) {
                val message = parseCreationError(e)
                promise.reject(REGISTRATION_ERROR_KEY, message, e)
            }
        }
    }

    fun signWithPasskeyCredential(requestJSON: String, promise: Promise) {
        val credentialManager = CredentialManager.create(context)
        val publicKeyCredentialOption = GetPublicKeyCredentialOption(requestJSON)
        val credentialRequest = GetCredentialRequest(listOf(publicKeyCredentialOption))

        if (currentActivity == null) {
            throw ActivityNotFoundException("Missing activity when signing with passkey")
        }

        coroutineScope.launch {
            try {
                val result = credentialManager.getCredential(
                        context = currentActivity,
                        request = credentialRequest
                )

                val response = result.credential.data.getString(AUTH_RESPONSE_BUNDLE_KEY)

                if (response == null) {
                    promise.reject(AUTH_ERROR_KEY, "Invalid passkey auth response", IllegalStateException("Invalid passkey auth response"))
                }

                promise.resolve(response)

            } catch (e: GetCredentialException) {
                val message = parseSignError(e)
                promise.reject(AUTH_ERROR_KEY, message, e)
            }
        }

    }
}
