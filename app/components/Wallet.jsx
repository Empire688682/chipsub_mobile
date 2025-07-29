import { View, Text, StyleSheet, Pressable } from "react-native";
import { useGlobalContext } from "../../lib/GlobalContext";


const Wallet = () => {
    const {userTransactionData, router} = useGlobalContext()
    return (
        <View style={styles.bigCard}>
           <View>
             <Text style={styles.label}>Wallet Balance</Text>
            <Text style={styles.bigMoney}>₦{userTransactionData?.walletBalance}</Text>
           </View>
           <Pressable 
           style={styles.btn}
            onPress={() => router.push("/fund-wallet")}>
            Fund +
           </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
  bigCard: {
    backgroundColor: "#fff",
    flex: 1,
    flexDirection:"row",
    gap:10,
    alignItems:"center",
    justifyContent:"space-between",
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
  btn:{ 
    flexDirection: "row",
    color: "#fff",
    backgroundColor: "#2563eb",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
    marginLeft: 8,
    flexWrap:"wrap",
  },
  label: { color: "#6b7280", fontSize: 13 },
  bigMoney: { fontWeight: "700", fontSize: 20, marginTop: 4 },
})

export default Wallet
