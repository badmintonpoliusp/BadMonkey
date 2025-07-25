import { Session } from '@supabase/supabase-js';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { supabase } from '../lib/supabase';
import Auth from './components/auth';
import IntroScreen from './components/IntroScreen'; // ✅ Check this path

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [showIntro, setShowIntro] = useState(true); // ✅ new state for intro

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Show intro screen first
  if (showIntro) {
    return <IntroScreen onFinish={() => setShowIntro(false)} />;
  }

  // If no user session, show auth
  if (!session) {
    return (
      <View style={{ flex: 1 }}>
        <Auth />
      </View>
    );
  }

  // Otherwise, load app stack
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        }}
      }
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
