import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useGlobalContext } from "../lib/GlobalContext";

// ───────────────────────────────────────────────────────────
// MOCKED INITIAL STATE ─ replace later with context or redux
// ───────────────────────────────────────────────────────────
const initialData = {
  name: "",
  email: "",
  number: "",
  password: "",
  refId: "",
};

export default function AuthScreen() {
  // authType could come from route params; mocked here
  const { apiUrl, getLocalStorageUser, isAuthenticated, setAuthChecked } = useGlobalContext();
  const [authType, setAuthType] = useState("login");
  const [data, setData] = useState(initialData);
  const [refHostId] = useState("okay");      // mocked; replace as needed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleOnChange = (name, value) =>
    setData((prev) => ({ ...prev, [name]: value }));

  const baseUrl =
    authType === "login"
      ? `${apiUrl}api/auth/login`
      : authType === "register"
        ? `${apiUrl}api/auth/register`
        : "";

  console.log("isAuthenticated:", isAuthenticated);

  // ────────── CORE AUTH HANDLER ──────────
  const userAuthHandler = async () => {
    if (authType === "reset password") return handlePasswordReset();

    setLoading(true);
    try {
      const res = await axios.post(baseUrl, { ...data, refId: refHostId });
      const { success, message, token, finalUserData } = res.data;
      console.log("res.data:", res.data)

      if (!success || !res.data?.finalUserData) {
        setError(message || "Authentication failed");
        return;
      };

      Toast.show({ type: "success", text1: "Success!", text2: message, text1Style: { fontWeight: "bold", color: "green" } });
      // Store user data with token
      const userDataToStore = { ...finalUserData, token };
      await AsyncStorage.setItem("userData", JSON.stringify(userDataToStore));
      console.log("User data stored:", userDataToStore);

      setData(initialData);
      await getLocalStorageUser();
    } catch (error) {
      console.log("error:", error)
      setError(error?.response?.data.message || error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmission = () => {
    if (!data.email || !data.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (authType === "register" && (!data.name || !data.number)) {
      setError("Please fill in all required fields");
      return;
    }

    userAuthHandler();
  };

  const handlePasswordReset = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${apiUrl}api/auth/forgottenPwd`, { email: data.email });
      if (res.data.success) {
        Toast.show({ type: "success", text1: "Reset link sent" });
        setAuthType("login");
      }
    } catch {
      Toast.show({ type: "error", text1: "Failed to send reset email" });
    } finally {
      setLoading(false);
    }
  };

  // show toast for explicit `error`
  useEffect(() => {
    if (error) {
      console.log("error:", error)
      Toast.show({ type: "error", text1: error });
      const t = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(t);
    }
  }, [error]);

  // ────────── RENDER ──────────
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.container}>
        <MaterialIcons
          name="arrow-back"
          size={26}
          color="#666"
          style={{ alignSelf: "flex-start" }}
          onPress={() => setAuthType("login")} // or navigation.goBack()
        />

        <Text style={styles.title}>
          {authType === "register"
            ? "Create Account"
            : authType === "login"
              ? "Login to Chipsub"
              : "Reset Password"}
        </Text>

        {authType === "register" && (
          <TextInput
            placeholder="Full Name"
            style={styles.input}
            value={data.name}
            onChangeText={(v) => handleOnChange("name", v)}
          />
        )}

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          style={styles.input}
          value={data.email}
          onChangeText={(v) => handleOnChange("email", v)}
        />

        {authType === "register" && (
          <TextInput
            placeholder="Phone"
            style={styles.input}
            keyboardType="phone-pad"
            value={data.number}
            onChangeText={(v) => handleOnChange("number", v)}
          />
        )}

        {authType !== "reset password" && (
          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              style={[styles.input, { paddingRight: 40 }]}
              value={data.password}
              onChangeText={(v) => handleOnChange("password", v)}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword((prev) => !prev)}
            >
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        )}

        {authType === "login" && (
          <Text
            onPress={() => setAuthType("reset password")}
            style={styles.linkText}
          >
            Forgot Password?
          </Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleFormSubmission}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : (
            <Text style={styles.buttonText}>{authType}</Text>
          )}
        </TouchableOpacity>

        {authType === "register" && (
          <Text style={styles.centerText}>
            Already have an account?{" "}
            <Text style={styles.linkText} onPress={() => setAuthType("login")}>
              Login
            </Text>
          </Text>
        )}

        {authType !== "reset password" && (
          <>
            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity style={styles.googleBtn}>
              <AntDesign name="google" size={22} color="black" />
              <Text style={{ marginLeft: 8 }}>Continue with Google</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <Toast />
    </ScrollView>
  );
}

// ────────── STYLES ──────────
const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 16,
  },
  container: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  passwordWrapper: {
  position: "relative",
  justifyContent: "center",
},
eyeIcon: {
  position: "absolute",
  right: 12,
  top: 12,
  zIndex: 1,
},

  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  linkText: {
    color: "#2563eb",
    textDecorationLine: "underline",
    textAlign: "center",
    marginVertical: 8,
  },
  centerText: {
    textAlign: "center",
    marginTop: 12,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#999",
  },
  orText: {
    marginHorizontal: 10,
    color: "#999",
  },
  googleBtn: {
    borderColor: "#999",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
});
