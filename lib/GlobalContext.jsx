import { useRouter } from "expo-router";
import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);
  const router = useRouter();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  return (
    <AppContext.Provider value={{
      isDrawerOpen,
      toggleDrawer,
      setIsDrawerOpen,
      router,
      apiUrl
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useGlobalContext = () => {
  return useContext(AppContext);
};
