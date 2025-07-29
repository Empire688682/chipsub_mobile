// DashboardScreen.tsx  (or .js)

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard"; 
import Wallet from "../components/Wallet";
import { useGlobalContext } from "../../lib/GlobalContext";
import DashboardAnimation from "../components/DashboardAnimation";

export default function DashboardScreen({ navigation }) {
  /* STATE */
  const {userTransactionData, userData, router} = useGlobalContext();
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [index, setIndex] = useState(5);

  const firstName = userData?.name?.split(" ")[0];
  const referralLink = `https://chipsub.vercel.app?ref=${userData?.userId}`;

  /* ACTIONS */
  const handleCopy = async () => {
    await Clipboard.setStringAsync(referralLink);
    Alert.alert("Copied!", "Referral link copied to clipboard ✅");
  };

  /* RENDER */
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}  contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Greeting + notification */}
      <DashboardAnimation />
      <View style={styles.rowBetween}>
        <Text style={styles.greet}>
          <Feather name="heart" size={16} color="#2563eb" /> Welcome back,&nbsp;
          <Text style={styles.bold}>{firstName}</Text>
        </Text>
      </View>

      {/* Wallet & Commission */}
      <View style={styles.cardRow}>
        <Wallet />
        <View style={styles.bigCard}>
          <Text style={styles.label}>Commission</Text>
          <View style={styles.rowBetween}>
            {withdrawLoading ? (
              <ActivityIndicator size="small" />
            ) : (
              <Text style={styles.bigMoney}>₦{userTransactionData?.commisionBalance?.toFixed(2)}</Text>
            )}
            <TouchableOpacity style={styles.withdrawBtn}>
              <Feather name="corner-right-up" size={18} color="#fff" />
              <Text style={styles.withdrawText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Referral */}
      <View style={styles.card}>
        <Text style={styles.label}>Referral Link</Text>
        <View style={styles.rowBetween}>
          <Text style={[styles.refText]} numberOfLines={1}>
            {referralLink}
          </Text>
          <TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
            <Feather name="copy" size={14} color="#fff" />
            <Text style={styles.copyText}>Copy</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* QUICK LINKS */}
      <Text style={styles.sectionTitle}>Quick Links</Text>
      <View style={styles.quickGrid}>
        {quickLinks.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.quickItem}
            onPress={() => router.push(`/${item.route}`)}
          >
            <item.Icon name={item.iconName} size={28} color="#2563eb" />
            <Text style={styles.quickLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* TRANSACTIONS */}
      <Text style={styles.sectionTitle}>Transaction History</Text>
      <View style={styles.card}>
        <FlatList
          data={userTransactionData?.transactions?.reverse().slice(0, index)}
          keyExtractor={(t) => t._id}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <View style={styles.transRow}>
              <View>
                <Text style={styles.transDate}>
                  {new Date(item.createdAt).toISOString().replace("T", " ").split(".")[0]}
                </Text>
                <Text style={styles.transDesc}>{item.description}</Text>
              </View>
              <View style={styles.transRight}>
                <Text style={[styles.transAmt, statusColor(item.status)]}>
                  ₦{item.amount}
                </Text>
                <Text style={[styles.transAmt, statusColor(item.status)]}>{item.type}</Text>
                <Text style={[styles.statusTag, statusBg(item.status)]}>
                  {item.status}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <Text style={{ color: "#6b7280", textAlign: "center" }}>
              No transaction history found.
            </Text>
          )}
        />
        {userTransactionData?.transactions?.length > 5 && (
          <TouchableOpacity style={{ alignSelf: "center", marginTop: 12 }} onPress={() => router.push("/transaction-history")}>
            <Text style={{ color: "#2563eb", fontWeight: "600" }}>See More →</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

/* QUICK LINK DATA */
const quickLinks = [
  { label: "Fund Wallet", iconName: "credit-card", Icon: Feather, route: "fund-wallet" },
  { label: "Buy Airtime", iconName: "phone-call", Icon: Feather, route: "buy-airtime" },
  { label: "Buy Data", iconName: "wifi", Icon: Feather, route: "buy-data" },
  { label: "Electricity", iconName: "zap", Icon: Feather, route: "buy-electricity" },
  { label: "TV Subscription", iconName: "monitor", Icon: Feather, route: "buy-tv" },
  { label: "Gift Card", iconName: "gift", Icon: Feather, route: "gift-card" },
  { label: "Crypto", iconName: "trending-down", Icon: Feather, route: "crypto" },
];

/* STYLE HELPERS */
const statusColor = (stat) => ({
  color:
    stat === "success" ? "#16a34a" : stat === "pending" ? "#f59e0b" : "#dc2626",
});
const statusBg = (stat) => ({
  backgroundColor:
    stat === "success"
      ? "#dcfce7"
      : stat === "pending"
      ? "#fef3c7"
      : "#fee2e2",
});

/* STYLES */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f3f4f6", padding: 16 },
  rowBetween: { flexDirection: "row", flexWrap:"wrap", justifyContent: "space-between", alignItems: "center" },
  greet: { fontSize: 15, color: "#374151" },
  bold: { fontWeight: "700" },

  /* Cards */
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  bigCard: {
    backgroundColor: "#fff",
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
    marginRight: 4,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRow: { 
    flexDirection: "row",
    marginHorizontal: -4, 
    marginBottom: 4 ,
    justifyContent:"space-between"
  },

  label: { color: "#6b7280", fontSize: 13 },
  bigMoney: { fontWeight: "700", fontSize: 20, marginTop: 4 },

  /* Commission withdraw button */
  withdrawBtn: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
    marginLeft: 8,
    flexWrap:"wrap",
  },
  withdrawText: { color: "#fff", marginLeft: 4, fontSize: 12 },

  /* Referral link */
  refText: { flex: 1, color: "#374151", fontSize: 12 },
  copyBtn: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
  },
  copyText: { color: "#fff", fontSize: 12, marginLeft: 4 },

  /* Sections */
  sectionTitle: { fontWeight: "600", fontSize: 15, marginVertical: 12 },

  /* Quick links */
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickItem: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickLabel: { marginTop: 4, fontSize: 12, fontWeight: "500", textAlign: "center" },

  /* Transactions */
  transRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  transDate: { fontSize: 11, color: "#6b7280" },
  transDesc: { fontWeight: "500", fontSize: 13 },
  transRight: { alignItems: "flex-end" },
  transAmt: { fontSize: 12 },
  statusTag: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    textTransform: "capitalize",
    overflow: "hidden",
  },
});
