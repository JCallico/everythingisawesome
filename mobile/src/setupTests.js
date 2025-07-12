// Setup for React Native Testing Library
// Only mock modules that actually exist in our project

// Mock Expo modules that are commonly used
jest.mock('expo-blur', () => ({
  BlurView: 'BlurView'
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy'
  }
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient'
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar'
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children,
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn()
  }),
  useRoute: () => ({
    params: {}
  }),
  useFocusEffect: jest.fn()
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children
  })
}));

// Mock safe area
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 })
}));
