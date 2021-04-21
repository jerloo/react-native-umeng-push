/**
 * @format
 */
// https://github.com/facebook/react-native/issues/23922#issuecomment-648096619
/** URL polyfill */
import 'react-native-url-polyfill/auto';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

console.log('for code push ios');
