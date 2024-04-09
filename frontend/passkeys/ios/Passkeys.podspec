Pod::Spec.new do |s|
  s.name           = 'Passkeys'
  s.version        = '1.0.0'
  s.summary        = 'Zeal native implementation for IOS Passkeys.'
  s.description    = 'Supports the creation and signing capabilities for IOS passkeys.'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platform       = :ios, '16.0'
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
