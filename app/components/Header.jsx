import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useGlobalContext } from "../../lib/GlobalContext";

const Header = () => {
  const { userData, router } = useGlobalContext();

  return (
    <View style={styles.container}>
      {/* Custom Opay-like Header */}
      <LinearGradient
        colors={["#3b82f6", "#34d399"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.menuBar}
      >
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
          <Text style={styles.userName}>Hi, {userData?.name?.split(" ")[0]}</Text>
        </Pressable>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable onPress={() => router.push("/notifications")}>
            <MaterialIcons name="notifications-on" size={24} color="white" />
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  menuBar: {
    height: 90,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 35,
    paddingHorizontal: 20,
    zIndex: 100,
  },
  user: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 6 },
  userName: { color: "#fff", fontSize: 14, fontWeight: "600" },
});


export default Header
