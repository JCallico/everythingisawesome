# iOS Development Guide

This guide covers building and distributing iOS IPA files for the Everything Is Awesome mobile application, including App Store submission preparation.

## Prerequisites

Before building the iOS app, ensure you have:

- **macOS**: iOS development requires macOS (Xcode is macOS-only)
- **Xcode 15+**: Download from App Store or Apple Developer portal
  ```bash
  # Verify Xcode installation
  xcodebuild -version
  # Should show: Xcode 16.4 Build 16F6 (or newer)
  ```
- **iOS Simulator**: Included with Xcode installation
- **CocoaPods**: iOS dependency manager
  ```bash
  # Install CocoaPods if not already installed
  sudo gem install cocoapods
  
  # Verify installation
  pod --version
  # Should show: 1.16.2 (or newer)
  ```
- **Apple Developer Account**: Required for device testing and App Store distribution
- **iOS Device** (optional): For testing on physical devices

## Development Setup

1. **Install iOS dependencies**:
   ```bash
   cd mobile
   
   # Install npm dependencies
   pnpm install
   
   # Generate native iOS project (if not already present)
   npx expo prebuild --platform ios
   
   # Install iOS native dependencies
   cd ios && pod install && cd ..
   ```

2. **Open in Xcode** (optional, for native iOS development):
   ```bash
   # Open the iOS project in Xcode
   open ios/everythingisawesome.xcworkspace
   ```

## Building iOS Apps

### Debug Builds (Development with Metro)

For development and testing with hot reloading:

```bash
cd mobile

# Build and run on iOS Simulator (with Metro bundler for development)
npx expo run:ios --device

# Alternative: Direct build with Xcode command line tools (Debug configuration)
xcodebuild -workspace ios/EverythingIsAwesome.xcworkspace \
  -scheme EverythingIsAwesome \
  -configuration Debug \
  -destination 'platform=iOS Simulator,name=iPhone 16 Pro Max' \
  -derivedDataPath ios/build clean build

# Output: ios/build/Build/Products/Debug-iphonesimulator/EverythingIsAwesome.app
```

**Note**: Debug builds depend on Metro bundler running (`npm start`) and are meant for development with live reloading.

### Release Builds (Standalone Distribution)

For standalone apps that don't require Metro bundler:

```bash
cd mobile

# Build standalone Release version for iOS Simulator
xcodebuild -workspace ios/EverythingIsAwesome.xcworkspace \
  -scheme EverythingIsAwesome \
  -configuration Release \
  -destination 'platform=iOS Simulator,name=iPhone 16 Pro Max' \
  -derivedDataPath ios/build clean build

# Install on simulator
xcrun simctl boot "iPhone 16 Pro Max"
xcrun simctl install booted ios/build/Build/Products/Release-iphonesimulator/EverythingIsAwesome.app
xcrun simctl launch booted com.mobile.everythingisawesome

# Build release archive for App Store
xcodebuild -workspace ios/EverythingIsAwesome.xcworkspace \
  -scheme EverythingIsAwesome \
  -configuration Release \
  -destination generic/platform=iOS \
  -archivePath ios/build/EverythingIsAwesome.xcarchive \
  archive

# Export IPA for App Store submission
xcodebuild -exportArchive \
  -archivePath ios/build/EverythingIsAwesome.xcarchive \
  -exportOptionsPlist ios/ExportOptions.plist \
  -exportPath ios/build/ipa/
```

### Export Options Configuration

Create `mobile/ios/ExportOptions.plist` for IPA export:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>uploadBitcode</key>
    <false/>
    <key>compileBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
</dict>
</plist>
```

## iOS App Configuration

The iOS app is configured via `mobile/app.json`:

```json
{
  "expo": {
    "name": "Everything Is Awesome",
    "slug": "everythingisawesome",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "ios": {
      "bundleIdentifier": "com.mobile.everythingisawesome",
      "buildNumber": "1",
      "supportsTablet": true,
      "infoPlist": {
        "UIBackgroundModes": ["fetch"]
      }
    }
  }
}
```

## Code Signing & Certificates

### Development Certificates

1. **Automatic Signing** (recommended for development):
   - Open `ios/everythingisawesome.xcworkspace` in Xcode
   - Select project → Target → Signing & Capabilities
   - Enable "Automatically manage signing"
   - Select your development team

2. **Manual Certificate Management**:
   ```bash
   # List available certificates
   security find-identity -v -p codesigning
   
   # List available provisioning profiles
   ls ~/Library/MobileDevice/Provisioning\ Profiles/
   ```

### App Store Distribution

For App Store submission, you'll need:

1. **Distribution Certificate**: Created via Apple Developer portal
2. **App Store Provisioning Profile**: Links your app ID to distribution certificate
3. **App Store Connect**: App listing and metadata

**Certificate Setup Process**:
1. Visit [Apple Developer Portal](https://developer.apple.com/account/resources/certificates/)
2. Create iOS Distribution Certificate
3. Create App Store Provisioning Profile for `com.mobile.everythingisawesome`
4. Download and install both in Xcode

## iOS Build Artifacts

| Build Type | Output Location | Size | Purpose |
|------------|----------------|------|---------|
| **Debug Simulator** | `ios/build/Build/Products/Debug-iphonesimulator/EverythingIsAwesome.app` | ~95MB | Development with Metro |
| **Release Simulator** | `ios/build/Build/Products/Release-iphonesimulator/EverythingIsAwesome.app` | ~43MB | Standalone Testing |
| **Release Archive** | `ios/build/EverythingIsAwesome.xcarchive` | ~180MB | Archival/Distribution |
| **App Store IPA** | `ios/build/ipa/EverythingIsAwesome.ipa` | ~65MB | App Store Submission |

**Key Differences**:
- **Debug builds**: Require Metro bundler running for live reloading and development
- **Release builds**: Self-contained with bundled JavaScript, work without Metro
- **main.jsbundle**: JavaScript bundle (~3.3MB) embedded in release builds

## Troubleshooting

### Common Issues

**"No such module 'React'"**:
```bash
cd mobile/ios
pod install
cd ..
npx expo prebuild --platform ios --clean
```

**Build fails with CocoaPods errors**:
```bash
cd mobile/ios
pod deintegrate
pod install
```

**"Developer cannot be verified" on device**:
- Go to Settings → General → VPN & Device Management
- Trust your developer certificate

**Archive fails with signing errors**:
- Verify provisioning profile matches bundle identifier
- Ensure distribution certificate is installed
- Check team ID in project settings

### Environment Verification

Run these commands to verify your iOS development setup:

```bash
# Check Xcode installation
xcodebuild -version

# Check available simulators
xcrun simctl list devices

# Verify CocoaPods
pod --version

# Check certificates
security find-identity -v -p codesigning
```

## iOS vs Android Comparison

| Feature | iOS | Android |
|---------|-----|---------|
| **Development OS** | macOS only | macOS/Linux/Windows |
| **IDE** | Xcode (required) | Android Studio (optional) |
| **Distribution** | App Store Connect | Google Play Console |
| **File Format** | .ipa (iOS App) | .apk/.aab (Android) |
| **Code Signing** | Certificates + Profiles | Keystore files |
| **Testing** | iOS Simulator/Device | Android Emulator/Device |
| **Build Time** | ~3-5 minutes | ~2-4 minutes |

## Quick Reference

**Common iOS Commands**:
```bash
# Development build (with Metro bundler)
npx expo run:ios --device

# Standalone Release build (no Metro required)
xcodebuild -workspace ios/EverythingIsAwesome.xcworkspace \
  -scheme EverythingIsAwesome -configuration Release \
  -destination 'platform=iOS Simulator,name=iPhone 16 Pro Max' \
  -derivedDataPath ios/build clean build

# Install and launch on simulator
xcrun simctl install booted ios/build/Build/Products/Release-iphonesimulator/EverythingIsAwesome.app
xcrun simctl launch booted com.mobile.everythingisawesome

# Clean and rebuild
npx expo prebuild --platform ios --clean
```

**Project Structure**:
```
mobile/ios/
├── everythingisawesome.xcworkspace  # Main workspace file
├── everythingisawesome/            # Main app target
│   ├── Info.plist                  # App configuration
│   └── LaunchScreen.storyboard     # Launch screen
├── Podfile                         # CocoaPods dependencies
└── build/                          # Build outputs
```

## App Store Submission

For comprehensive App Store submission instructions including code signing setup, archive creation, and IPA export, see: **[iOS App Store Submission Guide](./iOS_APP_STORE_SUBMISSION.md)**

### Quick App Store Build Commands

```bash
cd mobile

# Build App Store archive (requires proper code signing)
xcodebuild -workspace ios/EverythingIsAwesome.xcworkspace \
  -scheme EverythingIsAwesome \
  -configuration Release \
  -destination generic/platform=iOS \
  -archivePath ios/build/EverythingIsAwesome.xcarchive \
  archive

# Export IPA for App Store submission
xcodebuild -exportArchive \
  -archivePath ios/build/EverythingIsAwesome.xcarchive \
  -exportOptionsPlist ios/ExportOptions.plist \
  -exportPath ios/build/ipa/
```

### Distribution Files

| File Type | Location | Purpose |
|-----------|----------|---------|
| **Archive** | `ios/build/EverythingIsAwesome.xcarchive` | Xcode archive for distribution |
| **IPA** | `ios/build/ipa/EverythingIsAwesome.ipa` | App Store submission package |
| **Export Options** | `ios/ExportOptions.plist` | IPA export configuration |

## Additional Resources

- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [Xcode User Guide](https://developer.apple.com/documentation/xcode/)
- [iOS App Distribution](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [React Native iOS Setup](https://reactnative.dev/docs/environment-setup?platform=ios)
- [Expo Development Build](https://docs.expo.dev/develop/development-builds/)
