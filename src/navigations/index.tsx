import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { Platform, StatusBar, useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { LoginResponse } from '../types/api.types';
import AuthNav from './AuthNav';
import MainNav from './MainNav';

interface RootState {
  auth: {
    data: LoginResponse | null;
    isLoading: boolean;
    isError: boolean;
    errorMessage: string | null;
  };
}

export default () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { data } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#000000', true);
    }
    StatusBar.setBarStyle('dark-content', true);
  }, [isDarkMode]);

  console.log('TEST: ', JSON.stringify(data, null, 2));

  const isLoggedIn = !!data;

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainNav /> : <AuthNav />}
    </NavigationContainer>
  );
};