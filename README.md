This monorepo contains Frontend, Backend, Smart Contracts and Infrastructure code for the Zeal neowallet associated products.

# Frontend getting started

1. Install [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)
2. Run `nvm use` in the root of the project.
3. Run `corepack enable`
4. Run `yarn start` to start dev server or `yarn build:dev` or `yarn build:prod` to create an optimized build

# Frontend troubleshooting

If you have any sort of build issues or errors after fresh pull of master - first thing to do - run following command:
`rm -Rf node_modules && yarn rebuild`. This will make sure you re-install and re-build all needed dependencies. Most errors should disappear after this, and if something remaining - you can debug from there.

# Running mobile

1. Setup the development environment as described [here](https://reactnative.dev/docs/environment-setup)
    - TL;DR; for Android: Android studio installed, `ANDROID_HOME` env variable in the terminal where you call expo commands
2. `cd frontend/mobile/`
3. Run `yarn dlx expo prebuild` to create and populate the `android/` and `ios/` folders
4. Run `yarn start` to start the bundler
5. Run `yarn run android` to build, install and start the Android debug version
6. Run `yarn run ios` to build, install and start the iOS debug version

The run commands use a physical device if one is plugged into the laptop; otherwise it starts a simulator.

After the Android and/or iOS versions are installed, `yarn start` is enough to start the app; in the menu, pressing `a` will start the app in Android, and pressing `i` will start the app in iOS.

If native code configuration is changed, or native libraries are added, the prebuild and the run steps above have to be rerun.

To run the IOS app on a specific device:
1. Run `xcrun simctl list devices` to list all available devices
2. Run `yarn run ios --device="{device_name}"` to run the app on the desired simulator / phone

## Mobile troubleshooting
- If you get any sort of Sandbox file permission errors when running on IOS (e.g. `error: Sandbox: bash(58711) deny(1) file-read-data` ): https://stackoverflow.com/questions/76792138/sandbox-bash72986-deny1-file-write-data-users-xxx-ios-pods-resources-to-co
- If you get `PhaseScriptExecution failed with a nonzero exit code` when running on IOS: Delete the `ios/.xcode.env.local` due to https://github.com/facebook/react-native/pull/43333
