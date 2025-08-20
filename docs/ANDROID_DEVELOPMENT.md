# Android Development Guide

This guide covers building and distributing Android APK and AAB files for the Everything Is Awesome mobile application.

## Building and Sideloading Android APK

For testing on Android devices without the Expo app, you can build a standalone APK:

### Prerequisites
Ensure you have the following installed (no need to reinstall if already available):
- **Java Development Kit (JDK)**: OpenJDK 17 or later
  ```bash
  # Check if already installed
  java -version
  
  # If not installed, install with Homebrew:
  brew install openjdk@17
  
  # Add to your shell profile (.zshrc, .bashrc, etc.):
  export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
  export PATH="$JAVA_HOME/bin:$PATH"
  ```
- **Android SDK**: Available if you have Android Studio installed
- **React Native CLI**: Install if not already available
  ```bash
  npm install -g @react-native-community/cli
  ```

### Build Process
1. **Navigate to mobile directory**:
   ```bash
   cd mobile
   ```

2. **Ensure dependencies are installed**:
   ```bash
   npm install
   ```

3. **Build Release APK** (recommended - standalone with embedded JavaScript bundle):
   ```bash
   # Verify Watchman is working (should show version number)
   watchman version
   
   # Build production APK with embedded bundle
   ./android/gradlew -p android assembleRelease
   
   # APK location: android/app/build/outputs/apk/release/app-release.apk (~70MB)
   ```

4. **Alternative: Build Debug APK** (requires Metro bundler running):
   ```bash
   # Only use if you need development build
   npx expo run:android --variant debug
   
   # APK location: android/app/build/outputs/apk/debug/app-debug.apk (~165MB)
   ```

### Sideloading to Android Device

1. **Enable Developer Options** on your Android device:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times until developer mode is enabled
   - Go back to Settings → Developer Options (or System → Developer Options)
   - Enable "USB Debugging"

2. **Connect device and verify**:
   ```bash
   adb devices
   # Should show: emulator-5554    device (or your device ID)
   ```

3. **Install the APK**:
   ```bash
   # Install release APK (recommended - works without Metro)
   adb install -r mobile/android/app/build/outputs/apk/release/app-release.apk
   
   # Or install debug APK (requires Metro bundler running)
   adb install -r mobile/android/app/build/outputs/apk/debug/app-debug.apk
   ```

4. **Launch the application**:
   ```bash
   adb shell am start -n com.jcallico.everythingisawesome/.MainActivity
   ```

### APK Comparison
| Build Type | Size | Metro Required | JavaScript Bundle | Use Case |
|------------|------|----------------|-------------------|----------|
| **Release** | ~70MB | No | Embedded | Production/Distribution |
| **Debug** | ~165MB | Yes | External | Development/Testing |

### Quick Troubleshooting
- **Build fails**: Clean with `cd mobile/android && ./gradlew clean` then rebuild
- **Watchman errors**: Run `watchman shutdown-server` and restart the build
- **"Too many open files"**: Run `ulimit -n 4096` before building
- **Permission issues**: Fix with `sudo chown -R $(whoami) ~/Library/LaunchAgents/`
- **Device not detected**: Check USB debugging is enabled and accept computer authorization on device

## Building Play Store Release (AAB)

For Google Play Store submission, you need to build a properly signed Android App Bundle (AAB):

### Production Keystore Setup

1. **Generate production keystore** (one-time setup):
   ```bash
   cd mobile/android/app
   keytool -genkey -v -keystore everything-is-awesome-release-key.keystore \
     -alias everything-is-awesome -keyalg RSA -keysize 2048 -validity 10000 \
     -storepass YOUR_STORE_PASSWORD -keypass YOUR_KEY_PASSWORD \
     -dname "CN=Your Name, OU=Your Unit, O=Your Org, L=Your City, ST=Your State, C=Your Country"
   ```

2. **Create keystore properties file**:
   ```bash
   # Create: mobile/android/keystore.properties
   echo "storePassword=YOUR_STORE_PASSWORD
   keyPassword=YOUR_KEY_PASSWORD
   keyAlias=everything-is-awesome
   storeFile=everything-is-awesome-release-key.keystore" > mobile/android/keystore.properties
   ```

3. **Secure your credentials**:
   - Keep `keystore.properties` and `*.keystore` files secure and backed up
   - These files are automatically added to `.gitignore`
   - ⚠️ **Critical**: You need the exact same keystore for all future app updates!

### Build AAB for Play Store

```bash
cd mobile

# Build the Android App Bundle (AAB) for Play Store submission
./android/gradlew -p android bundleRelease

# Output location: android/app/build/outputs/bundle/release/app-release.aab (~46MB)
```

### Release Artifact Details

- **File**: `mobile/android/app/build/outputs/bundle/release/app-release.aab`
- **Size**: ~46MB (optimized for Play Store distribution)
- **Format**: Android App Bundle (AAB) - required for Google Play Store
- **Signing**: Production-signed with your release keystore
- **Optimization**: Google Play will generate optimized APKs for different devices

### Play Store Submission Checklist

- ✅ **AAB file**: Use `app-release.aab` for upload
- ✅ **Signing certificate**: SHA-256 fingerprint available via:
  ```bash
  keytool -list -v -keystore mobile/android/app/everything-is-awesome-release-key.keystore \
    -alias everything-is-awesome -storepass YOUR_PASSWORD
  ```
  - Current development keystore SHA-256: `12:FA:F7:3C:B7:05:8F:B8:0C:95:42:86:67:42:2A:05:64:9B:E2:E8:AD:5A:2A:A7:62:F0:7C:20:4A:9B:30:AD`
- ✅ **Version info**: Update `versionCode` and `versionName` in `android/app/build.gradle`
- ✅ **App metadata**: Prepare app description, screenshots, and store listing
- ✅ **Testing**: Verify the app works correctly before submission

### Security Notes

- **Keystore backup**: Store your keystore and properties files securely
- **Password strength**: Use strong passwords for production keystores
- **Version control**: Keystore files are excluded from Git for security
- **Certificate validity**: Generated certificates are valid for 27+ years

## Quick Reference

**Common Build Commands**:
```bash
# Development APK (requires Metro)
npx expo run:android --variant debug

# Standalone APK (no Metro required)  
./android/gradlew -p android assembleRelease

# Play Store AAB (production)
./android/gradlew -p android bundleRelease
```

**File Locations**:
- Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk` (~165MB)
- Release APK: `android/app/build/outputs/apk/release/app-release.apk` (~70MB)
- Release AAB: `android/app/build/outputs/bundle/release/app-release.aab` (~46MB)

**Distribution Methods**:
- **Development/Testing**: Debug APK or Expo app
- **Sideloading**: Release APK for manual installation
- **Play Store**: Release AAB for store submission

## Additional Resources

- [Android Developer Documentation](https://developer.android.com/docs)
- [React Native Android Setup Guide](https://reactnative.dev/docs/environment-setup)
- [Expo Development Build](https://docs.expo.dev/develop/development-builds/)
- [Google Play Console](https://play.google.com/console)
