import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { AppProvider } from "../lib/GlobalContext";


const LayoutGuide = ({ children }) => {
  const isAuthenticated = true;
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push("");
      }
    }, 0);
    return () => clearTimeout(timer)
  }, [isAuthenticated, router])
  return <>{children}</>
};

export default function RootLayout() {
  return <AppProvider>
    <LayoutGuide>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, headerBackTitle: null }} />
      </Stack>
    </LayoutGuide>;
  </AppProvider>
}
