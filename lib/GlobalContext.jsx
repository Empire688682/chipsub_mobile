import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);
  const router = useRouter();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({})

  const getLocalStorageUser = async() =>{
    try {
      const storedData = await AsyncStorage.getItem("userData");
      setUserData(storedData? JSON.parse(storedData) : {});
    } catch (error) {
      console.log("getLocalStorageUser:", error)
    }
  }

  useEffect(()=>{
    getLocalStorageUser();
  }, [])

  return (
    <AppContext.Provider value={{
      isDrawerOpen,
      toggleDrawer,
      setIsDrawerOpen,
      router,
      apiUrl,
      isAuthenticated,
      setIsAuthenticated,
      userData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useGlobalContext = () => {
  return useContext(AppContext);
};
