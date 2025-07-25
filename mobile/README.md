# Everything Is Awesome - Mobile App 📱

A React Native mobile application that brings the optimistic news experience to iOS and Android devices. Built with Expo for cross-platform compatibility and enhanced with mobile-specific features.

## ✨ Mobile Features

### 🎯 Core Functionality
- **Cross-Platform**: Single codebase for iOS, Android, and web
- **Real-time News**: Live connection to the same backend API as the web version
- **AI-Generated Content**: Dynamic story summaries and AI-created images
- **Theme-Based Design**: Color gradients that change based on story categories

### 📱 Mobile-Specific Features
- **Swipe Navigation**: Intuitive left/right swipe gestures between stories
- **Haptic Feedback**: Tactile responses for button presses and interactions
- **Native Sharing**: Platform-specific sharing (SMS, email, social media)
- **Auto-Rotation**: Stories transition every 30 seconds (tap to pause/resume)
- **Touch Interactions**: Tap story content to view detailed information
- **Mobile-Optimized UI**: Designed for touch interfaces and mobile screens

### 🎨 User Interface
- **Glassmorphism Design**: Beautiful blur effects and transparency
- **Dynamic Gradients**: Background colors based on story themes
- **Smooth Animations**: Fade and slide transitions between stories
- **Progress Indicators**: Visual dots showing current story position
- **Awesome Score Badges**: Prominent display of story positivity ratings

### 📖 Screen Architecture
- **HomeScreen**: Latest news overview with date navigation
- **NewsScreen**: Story carousel with auto-rotation and controls
- **StoryScreen**: Detailed story view with sharing and external links

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g @expo/cli`)
- For iOS: Xcode (macOS only)
- For Android: Android Studio

### Installation

```bash
# From the root directory
cd mobile

# Install dependencies
npm install

# Start the development server
npm start
```

### Running the App

```bash
# Web (browser)
npm run web

# iOS Simulator (macOS only)
npm run ios

# Android Emulator
npm run android

# Scan QR code with Expo Go app (mobile devices)
npm start
```

## 📱 Mobile Development

### Development Mode
```bash
# Start with specific platform
expo start --ios
expo start --android
expo start --web

# Clear cache if needed
expo start --clear
```

### Building for Production
```bash
# Build for Android
expo build:android

# Build for iOS
expo build:ios
```

## 🎯 Screen Flow

```
HomeScreen
    ↓ (tap on date/story)
NewsScreen
    ↓ (tap "View Details" or tap story content)
StoryScreen
    ↓ ("Read Full Story" opens external browser)
External Browser
```

## 🎮 User Interactions

### NewsScreen
- **Swipe Left**: Next story
- **Swipe Right**: Previous story
- **Tap Story Content**: View detailed story screen
- **Tap "View Details"**: Navigate to story details
- **Tap "Read Full Story"**: Open source article in browser
- **Tap "Share"**: Native platform sharing
- **Tap Pause/Play**: Control auto-rotation
- **Tap Progress Dots**: Jump to specific story

### StoryScreen
- **Tap "Read Full Story"**: Open source article in browser
- **Tap "Share"**: Native platform sharing with story details
- **Tap "← Back"**: Return to news screen

## 🎨 Theme System

The app uses dynamic theming based on story categories:

- **Hope**: Gold to orange gradients
- **Health**: Green to blue gradients
- **Innovation**: Purple to blue gradients
- **Science**: Cyan to green gradients
- **Community**: Pink to purple gradients
- **Arts**: Violet to pink gradients
- **And more...**: 18 total theme variations

## 📊 API Integration

The mobile app connects to the same backend as the web version:

### Endpoints Used
- `GET /api/news/latest` - Latest news stories
- `GET /api/news/:date` - News for specific date
- `GET /api/news/dates` - Available dates
- Static files for images via direct URLs

### Data Structure
Each story includes:
- `title` - Story headline
- `summary` - AI-generated summary
- `link` - Source article URL
- `awesome_index` - Positivity score (0-100)
- `theme` - Category for styling
- `image` - AI-generated image path

## 🛠️ Technical Stack

### Core Technologies
- **React Native 0.79.4** - Mobile framework
- **Expo 53** - Development platform
- **React Navigation 7** - Navigation system
- **React 19** - UI library

### UI & UX Libraries
- **expo-linear-gradient** - Gradient backgrounds
- **expo-blur** - Glassmorphism effects
- **expo-haptics** - Tactile feedback
- **react-native-safe-area-context** - Safe area handling

### Networking & Data
- **axios** - HTTP client
- **moment** - Date formatting
- **React Native Share** - Native sharing

### Development Tools
- **Expo CLI** - Development server
- **Metro Bundler** - JavaScript bundler
- **React DevTools** - Debugging

## 🗂️ File Structure

```
mobile/
├── App.js                 # Main app navigation
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js  # Latest news overview
│   │   ├── NewsScreen.js  # Story carousel
│   │   └── StoryScreen.js # Detailed story view
│   └── services/
│       └── api.js         # API integration
├── package.json
└── README.md
```

## 🎯 Performance Optimizations

- **Image Caching**: Automatic image caching for faster loading
- **API Efficiency**: Shared API layer with web application
- **Smooth Animations**: Hardware-accelerated transitions
- **Memory Management**: Efficient state management
- **Bundle Optimization**: Tree-shaking and code splitting

## 🔮 Future Enhancements

### Planned Features
- **Push Notifications**: Daily positive news alerts
- **Offline Mode**: Cache stories for offline reading
- **Bookmarking**: Save favorite stories
- **Reading History**: Track viewed stories
- **Dark Mode**: Alternative color scheme
- **Accessibility**: VoiceOver and TalkBack support

### Advanced Features
- **Story Categories**: Filter by theme/topic
- **Search Functionality**: Find specific stories
- **Social Features**: Community reactions
- **Personalization**: AI-recommended stories
- **Widget Support**: Home screen widget

## 📱 Platform Compatibility

### iOS
- iOS 13.0+
- iPhone and iPad support
- Native iOS sharing
- Haptic feedback support

### Android
- Android 6.0+ (API level 23)
- Phone and tablet support
- Native Android sharing
- Vibration feedback

### Web
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive mobile-first design
- Progressive Web App capabilities

## 🚀 Deployment

### Expo Go (Development)
- Install Expo Go on your device
- Scan QR code from development server
- Live reload during development

### Production Builds
- **Android**: Google Play Store (APK/AAB)
- **iOS**: Apple App Store (IPA)
- **Web**: Hosted on any static server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes in the `/mobile` directory
4. Test on multiple platforms (iOS, Android, web)
5. Submit a pull request

## 📄 License

This project is part of the Everything Is Awesome monorepo. See the main README for license information.

---

**Built with ❤️ using React Native and Expo**
