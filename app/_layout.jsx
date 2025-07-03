import { Slot,} from "expo-router";
import { AppProvider, useGlobalContext } from "../lib/GlobalContext";
import { View, ActivityIndicator, Text } from "react-native";
import { useEffect } from "react";

function AuthLayoutHandler() {
  const { isAuthenticated, authChecked, pathname, router } = useGlobalContext();

  useEffect(() => {
    if (!authChecked) {
      console.log("Auth not checked yet, waiting...");
      return;
    }

    // Redirect to AuthScreen if not authenticated and not already there
    if (!isAuthenticated && pathname !== "/AuthScreen") {
      console.log("Redirecting to AuthScreen - not authenticated");
      router.replace("/AuthScreen");
      return;
    }

    // Redirect to tabs if authenticated but still on AuthScreen
    if (isAuthenticated && pathname === "/AuthScreen") {
      console.log("Redirecting to tabs - authenticated");
      router.replace("/(tabs)");
      return;
    }
  }, [authChecked, isAuthenticated, pathname, router]);

  if (!authChecked) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 16, color: "#666" }}>Loading...</Text>
      </View>
    );
  }

  return <Slot />;
}


export default function RootLayout() {
  return (
    <AppProvider>
      <AuthLayoutHandler />
    </AppProvider>
  );
}
