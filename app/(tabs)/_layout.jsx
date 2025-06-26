import { Stack } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CustomDrawer from "../components/CustomDrawer";
import { LinearGradient } from "expo-linear-gradient";
import { useGlobalContext } from "../../lib/GlobalContext";

export default function RootLayout() {
  const { toggleDrawer, isDrawerOpen, router, setIsDrawerOpen } = useGlobalContext();
  return (
    <SafeAreaView style={styles.safe}>
      {/* Gradient header bar */}
      <LinearGradient
        colors={["#3b82f6", "#34d399"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.menuBar}
      >
        <Pressable onPress={()=>{router.push("/"); setIsDrawerOpen(false)}}>
          <Image
            source={require("../../assets/images/chipsub.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Pressable>

        {/* make icon tappable */}
        <Pressable onPress={toggleDrawer} style={{paddingRight:20}}>
          <MaterialIcons name="menu" size={30} color="#fff" />
        </Pressable>
      </LinearGradient>

      {
        //Side drawer & app content
        isDrawerOpen && <CustomDrawer />
      }
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingTop: 95,
    paddingHorizontal:20
  },
  menuBar: {
    ...StyleSheet.absoluteFillObject,
    height: 90,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 5,
    paddingTop: 30,
    zIndex: 10,
  },
  logo: {
    width: 120,
    height: 110,
  },
});
