import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import DisclaimerScreen from './src/screens/DisclaimerScreen';
import HowItWorksScreen from './src/screens/HowItWorksScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: 'transparent'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold'
            },
            headerTransparent: true
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ 
              title: 'Everything Is Awesome',
              headerShown: false 
            }}
          />
          <Stack.Screen 
            name="Disclaimer" 
            component={DisclaimerScreen}
            options={{ 
              title: 'Legal Disclaimer',
              headerShown: false 
            }}
          />
          <Stack.Screen 
            name="HowItWorks" 
            component={HowItWorksScreen}
            options={{ 
              title: 'How It Works',
              headerShown: false 
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
