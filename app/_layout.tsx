import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { createStackNavigator } from '@react-navigation/stack';
import { useColorScheme } from '@/hooks/useColorScheme';
import HomeScreen from './(tabs)/index';
import TabTwoScreen from './(tabs)/explore';
import NotFoundScreen from './+not-found';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const Stack = createStackNavigator();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen name="(tabs)/index" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/explore" component={TabTwoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" component={NotFoundScreen} options={{ title: 'Not Found' }} />
      </Stack.Navigator>
    </ThemeProvider>
  );
}
