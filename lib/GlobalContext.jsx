import { usePathname, useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);
  const router = useRouter();
  const pathname = usePathname();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({})
  const [authChecked, setAuthChecked] = useState(false);

const getLocalStorageUser = async () => {
    try {
      console.log("Checking stored user data...");
      const stored = await AsyncStorage.getItem("userData");
      
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log("Found stored user:", parsed);
        setUserData(parsed);
        setIsAuthenticated(!!parsed?.token);
      } else {
        console.log("No stored user data found");
        setUserData({});
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log("Error reading stored user:", error);
      setUserData({});
      setIsAuthenticated(false);
    } finally {
      setAuthChecked(true);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      setUserData({});
      setIsAuthenticated(false);
      router.replace("/AuthScreen");
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };

  useEffect(() => {
    getLocalStorageUser();
  }, []);


  return (
    <AppContext.Provider value={{
      isDrawerOpen,
      toggleDrawer,
      setIsDrawerOpen,
      router,
      pathname,
      apiUrl,
      isAuthenticated,
      setIsAuthenticated,
      userData,
      authChecked,
      getLocalStorageUser,
      setAuthChecked,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useGlobalContext = () => {
  return useContext(AppContext);
};
