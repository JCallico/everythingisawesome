import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Import screens
import HomeScreenSimple from './src/screens/HomeScreenSimple';
import NewsScreenSimple from './src/screens/NewsScreenSimple';

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
              backgroundColor: 'transparent',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTransparent: true,
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreenSimple}
            options={{ 
              title: 'Everything Is Awesome',
              headerShown: false 
            }}
          />
          <Stack.Screen 
            name="News" 
            component={NewsScreenSimple}
            options={({ route }) => ({ 
              title: route.params?.date || 'News',
              headerShown: false 
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
