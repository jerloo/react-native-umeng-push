/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import {ThemeProvider} from 'react-native-elements';

import {Provider} from '@ant-design/react-native';
import ProfileScreen from './src/screens/ProfileScreen';
import EditNameScreen from './src/screens/EditNameScreen';
import EditPhoneScreen from './src/screens/EditPhoneScreen';
import EditPasswordScreen from './src/screens/EditPasswordScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <Provider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{header: () => null}}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{header: () => null}}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{header: () => null}}
            />
            <Stack.Screen
              name="EditName"
              component={EditNameScreen}
              options={{header: () => null}}
            />
            <Stack.Screen
              name="EditPhone"
              component={EditPhoneScreen}
              options={{header: () => null}}
            />
            <Stack.Screen
              name="EditPassword"
              component={EditPasswordScreen}
              options={{header: () => null}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
