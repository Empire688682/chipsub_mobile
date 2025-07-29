// app/_layout.js or app/_layout.tsx

import { useRouter, usePathname, Stack } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider, useGlobalContext } from "../lib/GlobalContext";

function AuthLayoutHandler() {
  const { isAuthenticated, authChecked } = useGlobalContext();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!authChecked) return;

    // Redirect to auth screen if not authenticated
    if (!isAuthenticated && pathname !== "/auth-screen") {
      router.replace("/auth-screen");
    }

    // Redirect to home if already authenticated but still on auth page
    if (isAuthenticated && pathname === "/auth-screen") {
      router.replace("/(tabs)");
    }
  }, [authChecked, isAuthenticated, pathname, router]);

  if (!authChecked) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 16, color: "#666" }}>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Stack screenOptions={{
          headerStyle: {
            elevation: 0, // for Android
            shadowOpacity: 0, // for iOS
            borderBottomWidth: 0,
            backgroundColor:"#F9FAFB"
          },
        }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="contact" options={{ title: "Contact" }} />
          <Stack.Screen name="fund-wallet" options={{ title: "Wallet" }} />
          <Stack.Screen name="buy-electricity" options={{ title: "Electricity" }} />
          <Stack.Screen name="buy-tv" options={{ title: "TV" }} />
          <Stack.Screen name="buy-airtime" options={{ title: "Airtime" }} />
          <Stack.Screen name="buy-data" options={{ title: "Data" }} />
          <Stack.Screen name="crypto" options={{ title: "Crypto" }} />
          <Stack.Screen name="gift-card" options={{ title: "Gift Card" }} />
          <Stack.Screen name="transaction-history" options={{ title: "Transactions" }} />
          <Stack.Screen name="auth-screen" options={{headerShown: false}} />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <AuthLayoutHandler />
    </AppProvider>
  );
}
