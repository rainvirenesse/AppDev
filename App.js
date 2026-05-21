import React from 'react';
import { View } from 'react-native';

import AppNavigationNi from './src/navigations';

import rootSaga from './src/app/sagas';
import configureStore from './src/app/reducers';

import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { PersistGate } from 'redux-persist/integration/react';

const { store, runSaga } = configureStore();
runSaga(rootSaga);

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <AppNavigationNi />
        </View>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;