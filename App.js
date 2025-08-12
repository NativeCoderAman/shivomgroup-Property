import React, { useState } from 'react';
import MainNavigation from './src/Routes/MainNavigation/MainNavigation';
import { ThemeContext } from './src/Utils/Theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import store from './src/Service/Store';
import FlashMessage from 'react-native-flash-message';
import { ModalProvider } from './src/context/ComingSoonContext';
import SubscriptionHistoryScreen from './src/Screen/payments/SubscriptionHisScreen';
import TransactionHistoryScreen from './src/Screen/payments/TransactioHisScreen';
import SettlementsScreen from './src/Screen/payments/SettlementScreen';
import NotificationScreen from './src/Screen/Profile/NotificationScreen';
import BusinessProfile from './src/Screen/OnlineBusiness/BusinessProfile';
import RoomViewScreen from './src/Screen/OnlineBusiness/RoomViewScreen';
import EditRoom from './src/Screen/OnlineBusiness/EditRoom';

const App = () => {
  const [theme, setTheme] = useState('dark');

  return (


    <Provider store={store}>
      <ThemeContext.Provider value={theme}>
        <GestureHandlerRootView style={{flex: 1}}>
          <FlashMessage position="top" />
          <ModalProvider>
            <MainNavigation />
          </ModalProvider>
        </GestureHandlerRootView>
      </ThemeContext.Provider>
    </Provider>


  //<BusinessProfile/>
   //<RoomViewScreen/>
   //<EditRoom />





  );
};

export default App;
