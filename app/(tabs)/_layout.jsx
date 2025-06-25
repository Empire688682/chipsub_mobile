import { Stack } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CustomDrawer from "../components/CustomDrawer";
import { LinearGradient } from "expo-linear-gradient";

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.safe}>
      {/* Gradient header bar */}
      <LinearGradient
        colors={["#3b82f6", "#34d399"]}  
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.menuBar}
      >
        <MaterialIcons style={{cursor:"pointer"}} name="menu-open" size={30} color="#fff" />
      </LinearGradient>

      {/* Side drawer & app content */}
      <CustomDrawer />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,           // makes the SafeAreaView fill the screen
  },
  menuBar: {
    position: "absolute",
    zIndex: 11,
    right: 0,
    top: 0,
    width: "100%",
    height: 40,    
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems:"flex-end"
  },
});
