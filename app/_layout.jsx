// app/_layout.js or app/_layout.tsx

import { Slot, useRouter, usePathname } from "expo-router";
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
    if (!isAuthenticated && pathname !== "/auth") {
      router.replace("/auth");
    }

    // Redirect to home if already authenticated but still on auth page
    if (isAuthenticated && pathname === "/auth") {
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
        <Slot />
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
