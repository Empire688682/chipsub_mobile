// app/(tabs)/_layout.js
import {
  SafeAreaView,
  StyleSheet,
  Image,
  Pressable,
  Animated,
  Dimensions,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, usePathname } from "expo-router";
import { useEffect, useRef } from "react";
import { useGlobalContext } from "../../lib/GlobalContext";
import CustomDrawer from "../components/CustomDrawer";

const { width } = Dimensions.get("window");

export default function TabsLayout() {
  const {
    toggleDrawer,
    isDrawerOpen,
    setIsDrawerOpen,
    router,
    userData,
  } = useGlobalContext();

  const pathname = usePathname();         
  const slideX = useRef(new Animated.Value(-width )).current;

  /* ----- Auto‑close drawer on route change ----- */
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname, setIsDrawerOpen]);

  /* ----- Animate drawer whenever state flips ----- */
  useEffect(() => {
    Animated.timing(slideX, {
      toValue: isDrawerOpen ? 0 : -width - 100,
      duration: 460,
      useNativeDriver: true,
    }).start();
  }, [isDrawerOpen, slideX]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Gradient header bar */}
      <LinearGradient
        colors={["#3b82f6", "#34d399"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.menuBar}
      >
        {/* Logo press -> home & close drawer */}
        <Pressable onPress={() => { router.push("/"); setIsDrawerOpen(false); }}>
          <Image
            source={require("../../assets/images/chipsub.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Pressable>

        {/* User info */}
        <Pressable
          style={styles.user}
          onPress={() => router.push("/(tabs)/profile")}
        >
          <Image
            source={
              userData.avatarUrl
                ? { uri: userData.avatarUrl }
                : require("../../assets/images/profile-img.png")
            }
            style={styles.avatar}
          />
          <Text style={styles.userName}>{userData?.name?.split(" ")[0] ?? "User"}</Text>
        </Pressable>

        {/* Drawer toggle */}
        <Pressable onPress={toggleDrawer} style={{ paddingRight: 20 }}>
          <MaterialIcons name="menu" size={30} color="#fff" />
        </Pressable>
      </LinearGradient>

      {/* Animated drawer */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ translateX: slideX }], zIndex: 20 },
        ]}
      >
        <CustomDrawer />
      </Animated.View>

      {/* Tab stack */}
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingTop: 95, paddingHorizontal: 20 },
  menuBar: {
    ...StyleSheet.absoluteFillObject,
    height: 90,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 5,
    paddingTop: 30,
    zIndex: 30,
  },
  logo: { width: 120, height: 110 },
  user: { flexDirection: "row", alignItems: "center", marginRight: 10 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 6 },
  userName: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
