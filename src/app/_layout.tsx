import { SignIn } from '@/components/sign-in';
import { useSession } from '@/hooks/use-session';
import { DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AppTabs from '../components/app-tabs';
import Navigation from '../components/navbar';

SplashScreen.preventAutoHideAsync();

const AppTheme = {

  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#000000',
    text: '#ffffff',
    card: '#0b0f14',
    border: '#26313d',
    primary: '#62e6ff',
  },
};

export default function TabLayout() {
  const session = useSession();

  useEffect(() => {
    if (session !== undefined) {
      SplashScreen.hideAsync();
    }
  }, [session]);

  return (
    <ThemeProvider value={AppTheme}>
      <View style={{ flex: 1, backgroundColor: '#000000' }}>
        {session === undefined && <ActivityIndicator style={{ flex: 1 }} />}
        {session === null && <SignIn />}
        {session && (
          <>
            <Navigation title="Customers" />
            <AppTabs />
          </>
        )}
      </View>
    </ThemeProvider>
  );
}
