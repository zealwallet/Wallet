package expo.modules.ZealReactNativeCrypto

import android.util.Base64
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.security.KeyFactory
import java.security.spec.X509EncodedKeySpec
import javax.crypto.Cipher
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

class ZealReactNativeCryptoModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ZealReactNativeCrypto")

    AsyncFunction("encryptRSAOAEP") { data: String, publicKeyBase64: String ->
      val publicKeyBytes = Base64.decode(publicKeyBase64, Base64.DEFAULT)
      val keySpec = X509EncodedKeySpec(publicKeyBytes)
      val keyFactory = KeyFactory.getInstance("RSA")
      val publicKey = keyFactory.generatePublic(keySpec)

      val cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-1AndMGF1Padding")
      cipher.init(Cipher.ENCRYPT_MODE, publicKey)

      val dataBytes = data.toByteArray(Charsets.UTF_8)
      val encryptedData = cipher.doFinal(dataBytes)

      val encryptedBase64 = Base64.encodeToString(encryptedData, Base64.NO_WRAP)
      return@AsyncFunction encryptedBase64
    }

    AsyncFunction("decryptAESGCM") { cipherBase64: String, keyBase64: String, ivBase64: String ->
      val cipherData = Base64.decode(cipherBase64, Base64.DEFAULT)
      val keyBytes = Base64.decode(keyBase64, Base64.DEFAULT)
      val ivBytes = Base64.decode(ivBase64, Base64.DEFAULT)

      val keySpec = SecretKeySpec(keyBytes, "AES")
      val cipher = Cipher.getInstance("AES/GCM/NoPadding")
      val gcmSpec = GCMParameterSpec(128, ivBytes)

      cipher.init(Cipher.DECRYPT_MODE, keySpec, gcmSpec)
      val decryptedData = cipher.doFinal(cipherData)
      return@AsyncFunction String(decryptedData, Charsets.UTF_8)
    }
  }
}
