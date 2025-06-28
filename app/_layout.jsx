import { Stack } from "expo-router";
import { AppProvider, useGlobalContext } from "../lib/GlobalContext";

const InnerLayout = () => {
  return <Stack>
    <Stack.Screen name="(tabs)" options={{ headerShown: false, headerBackTitle: null }} />
  </Stack>
}
export default function RootLayout() {
  return <AppProvider>
    <InnerLayout />
  </AppProvider>
}
