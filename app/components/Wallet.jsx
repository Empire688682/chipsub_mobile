import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useGlobalContext } from "../../lib/GlobalContext";


const Wallet = () => {
    const {userTransactionData, router} = useGlobalContext()
    return (
        <View style={styles.bigCard}>
           <View>
             <Text style={styles.label}>Wallet Balance</Text>
            <Text style={styles.bigMoney}>₦{userTransactionData?.walletBalance}</Text>
           </View>
           <TouchableOpacity style={styles.btn} onPress={() => router.push("/fund-wallet")}>
                         <Feather name="corner-right-up" size={18} color="#fff" />
                         <Text style={styles.btnText}>Fund</Text>
                       </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
  bigCard: {
    backgroundColor: "#fff",
    minWidth: "50%",
    flexDirection:"row",
    flexWrap:"wrap",
    alignItems:"center",
    justifyContent:"space-between",
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  btn:{ 
    flexDirection: "row",
    backgroundColor: "#2563eb",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
    marginLeft: 8,
    flexWrap:"wrap",
  },
  btnText: { color: "#fff", marginLeft: 4, fontSize: 15, fontWeight: "600" },
  label: { color: "#6b7280", fontSize: 13 },
  bigMoney: { fontWeight: "700", fontSize: 20, marginTop: 4 },
})

export default Wallet
