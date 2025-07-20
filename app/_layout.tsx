import { Stack, useRouter, useSegments } from "expo-router";
import "./globals.css";
import { useEffect } from "react";
import { useAuth, AuthProvider } from "@/lib/auth-context";

function RouterGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isloadingUser } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    const isAuthGroup = segments[0] === "auth";
    if (!user && !isAuthGroup && !isloadingUser) {
      router.replace("/auth");
    } else if (user && isAuthGroup && !isloadingUser) {
      router.replace("/");
    }
  }, [user, segments, isloadingUser]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouterGuard>
        <Stack
          screenOptions={{
            headerTitleAlign: 'center', // This centers all stack titles by default
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false 
            }} 
          />
          {/* Add other screens here with centered titles by default */}
          <Stack.Screen 
            name="auth" 
            options={{ 
              headerShown: true,
              title: 'Authentication', // Example title
              // headerTitleAlign is already set in screenOptions
            }} 
          />
        </Stack>
      </RouterGuard>
    </AuthProvider>
  );
}