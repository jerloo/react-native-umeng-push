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
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import { ThemeProvider } from 'react-native-elements';

import { Provider, Toast } from '@ant-design/react-native';
import ProfileScreen from './src/screens/ProfileScreen';
import EditNameScreen from './src/screens/EditNameScreen';
import EditPhoneScreen from './src/screens/EditPhoneScreen';
import EditPasswordScreen from './src/screens/EditPasswordScreen';
import { getSession } from './src/utils/sesstionUtils';
import AuthContext from './src/utils/contextUtls';
import BooksScreen from './src/screens/BooksScreen';
import BookTaskScreen from './src/screens/BookTaskScreen';
import BookTaskSortScreen from './src/screens/BookTaskSortScreen';
import NewReadScreen from './src/screens/NewReadScreen';
import CustDetailsScreen from './src/screens/CustDetailsScreen';
import { PortalProvider } from 'react-native-portal-view';
import ReadingCollectScreen from './src/screens/ReadingCollectScreen';
import CameraScreen from './src/screens/CameraScreen';
import SearchScreen from './src/screens/SearchScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import ArrearagesScreen from './src/screens/ArrearagesScreen';
import { MainStackParamList } from './src/screens/routeParams';
import PaymentCollectScreen from './src/screens/PaymentCollectScreen';
import PaymentSubtotalScreen from './src/screens/PaymentSubtotalScreen';

// Toast.config({ duration: 0.5 });

const Stack = createStackNavigator<MainStackParamList>();

function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            session: action.session,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            session: action.session,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            session: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let session;

      try {
        session = await getSession();
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: session });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        const session = await getSession();
        dispatch({ type: 'SIGN_IN', session: session });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
    }),
    [],
  );

  return (
    <Provider>
      <PortalProvider>
        <ThemeProvider>
          <NavigationContainer>
            <AuthContext.Provider value={authContext}>
              <Stack.Navigator>
                {state.session == null || state.isSignout ? (
                  <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ header: () => null }}
                  />
                ) : (
                  <>
                    <Stack.Screen
                      name="Home"
                      component={HomeScreen}
                      options={{ header: () => null }}
                    />
                    <Stack.Screen
                      name="Profile"
                      component={ProfileScreen}
                      options={{ header: () => null }}
                    />
                    <Stack.Screen
                      name="EditName"
                      component={EditNameScreen}
                      options={{ header: () => null }}
                    />
                    <Stack.Screen
                      name="EditPhone"
                      component={EditPhoneScreen}
                      options={{ header: () => null }}
                    />
                    <Stack.Screen
                      name="EditPassword"
                      component={EditPasswordScreen}
                      options={{ header: () => null }}
                    />
                    <Stack.Screen
                      name="Books"
                      component={BooksScreen}
                      options={{ header: () => null }}
                    />
                    <Stack.Screen
                      name="BookTask"
                      component={BookTaskScreen}
                      options={{ header: () => null }}
                    />
                    <Stack.Screen
                      name="BookTaskSort"
                      component={BookTaskSortScreen}
                      options={{ header: () => null }}
                    />
                    <Stack.Screen
                      name="NewRead"
                      component={NewReadScreen}
                      options={{ header: () => null }}
                    />
                    <Stack.Screen
                      name="CustDetails"
                      component={CustDetailsScreen}
                      options={{ header: () => null }}
                    />
                    <Stack.Screen
                      name="ReadingCollect"
                      component={ReadingCollectScreen}
                      options={{ header: () => null }}
                    />
                    <Stack.Screen
                      name="Camera"
                      component={CameraScreen}
                      options={{ header: () => null }}
                    />
                    <Stack.Screen
                      name="Search"
                      component={SearchScreen}
                      options={{ header: () => null }}
                    />
                    <Stack.Screen
                      name="Payment"
                      component={PaymentScreen}
                      options={{ header: () => null }}
                    />
                    <Stack.Screen
                      name="Arrearages"
                      component={ArrearagesScreen}
                      options={{ header: () => null }}
                    />
                    <Stack.Screen
                      name="PaymentCollect"
                      component={PaymentCollectScreen}
                      options={{ header: () => null }}
                    />
                    <Stack.Screen
                      name="PaymentSubtotal"
                      component={PaymentSubtotalScreen}
                      options={{ header: () => null }}
                    />
                  </>
                )}
              </Stack.Navigator>
            </AuthContext.Provider>
          </NavigationContainer>
        </ThemeProvider>
      </PortalProvider>
    </Provider>
  );
}

export default App;
