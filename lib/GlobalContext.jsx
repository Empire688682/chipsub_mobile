import { usePathname, useRouter } from "expo-router";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);
  const router = useRouter();
  const pathname = usePathname();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({});
  const [authChecked, setAuthChecked] = useState(false);
  const [userTransactionData, setUserTransactionData] = useState({});
  const [allData, setAllData] = useState({});
  const mobileUserId = userData?.userId;
  const [dataPlan, setDataPlan] = useState([]);

  const getLocalStorageUser = async () => {
    try {
      console.log("Checking stored user data...");
      const stored = await AsyncStorage.getItem("userData");

      if (stored) {
        const parsed = JSON.parse(stored);
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

  const fetchUserTransactionData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await axios.get(apiUrl + "api/real-time-data", { params: { mobileUserId: mobileUserId } });
      setUserTransactionData(response.data.data)
    } catch (error) {
      console.log("FetchUserTransc:", error)
    }
  }, [isAuthenticated, apiUrl, mobileUserId]);

  const fetchAllData = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await axios.get(`${apiUrl}api/all-data`, { params: { mobileUserId: mobileUserId } });
      console.log("response:", response);
      if (response.data.success) {
        setAllData(response.data.data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

    // const onRefresh = async () => {
    //   setRefreshing(true);
    //   await fetchAllData();
    //   setRefreshing(false);
    // };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllData();
    }, 180000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchAllData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);


  useEffect(() => {
    fetchUserTransactionData();
  }, [fetchUserTransactionData]);

  useEffect(() => {
    getLocalStorageUser();
  }, []);

  // On mount, fetch available data plans from backend API
  useEffect(() => {
    const fetchDataPlan = async () => {
      try {
        const res = await axios.get(apiUrl + "api/data-plan");
        if (res.data.success) {
          setDataPlan(res.data.data);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchDataPlan();
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
      mobileUserId,
      authChecked,
      getLocalStorageUser,
      setAuthChecked,
      logout,
      fetchUserTransactionData,
      userTransactionData,
      allData,
      dataPlan
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useGlobalContext = () => {
  return useContext(AppContext);
};
