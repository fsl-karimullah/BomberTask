import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import Routes from './app/routes/index';
import { ActivityIndicator, View } from 'react-native';
import { Provider } from 'react-redux';
import { store, persistor } from './app/redux/store/index';
import { PersistGate } from 'redux-persist/integration/react';
import 'react-native-gesture-handler';
import 'react-native-reanimated'; 
import Toast from 'react-native-toast-message';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <Routes />
      </PersistGate>
       <Toast />
    </Provider>
  );
} 

export default App;
