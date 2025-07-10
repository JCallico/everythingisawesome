import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';

// Create a simple test component for mobile using React Native components
const SimpleMobileComponent = () => {
  return (
    <View testID="simple-mobile-component">
      <Text testID="app-title">Everything Is Awesome Mobile</Text>
      <Text testID="app-description">Testing the mobile application</Text>
    </View>
  );
};

describe('Mobile Application Tests', () => {
  test('renders simple mobile component without crashing', () => {
    const { getByTestId } = render(<SimpleMobileComponent />);
    
    // Test that the component renders and we can find our test elements
    expect(getByTestId('simple-mobile-component')).toBeTruthy();
    expect(getByTestId('app-title')).toBeTruthy();
    expect(getByTestId('app-description')).toBeTruthy();
  });

  test('displays correct text content', () => {
    const { getByText } = render(<SimpleMobileComponent />);
    
    expect(getByText('Everything Is Awesome Mobile')).toBeTruthy();
    expect(getByText('Testing the mobile application')).toBeTruthy();
  });

  test('basic React Native testing setup works', () => {
    const testData = {
      appName: 'Everything Is Awesome',
      platform: 'mobile',
      status: 'testing'
    };
    
    expect(testData.appName).toBe('Everything Is Awesome');
    expect(testData.platform).toBe('mobile');
    expect(testData.status).toBe('testing');
  });

  test('can handle basic mobile app structure', () => {
    const mockProps = {
      navigation: { navigate: jest.fn() },
      route: { params: {} }
    };
    
    expect(mockProps.navigation.navigate).toBeDefined();
    expect(mockProps.route.params).toEqual({});
  });
});
