import { View, Text, StyleSheet } from "react-native";
import { useGlobalContext } from "../../lib/GlobalContext";


const Wallet = () => {
    const {userTransactionData} = useGlobalContext()
    return (
        <View style={styles.bigCard}>
            <Text style={styles.label}>Wallet Balance</Text>
            <Text style={styles.bigMoney}>₦{userTransactionData?.walletBalance}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  bigCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  label: { color: "#6b7280", fontSize: 13 },
  bigMoney: { fontWeight: "700", fontSize: 20, marginTop: 4 },
})

export default Wallet
