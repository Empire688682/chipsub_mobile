import { View, Text, ScrollView, StyleSheet } from "react-native";
import DashboardScreen from "./dashboard";

const Index = () => {
  const today = new Date().toLocaleDateString();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Welcome back 👋</Text>
      <Text style={styles.subtext}>Today is {today}</Text>

      <View style={styles.dashboardWrapper}>
        <DashboardScreen />
      </View>
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#111827",
  },
  subtext: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  dashboardWrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },
});
