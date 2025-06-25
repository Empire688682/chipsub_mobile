
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { useRouter, usePathname } from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function CustomDrawer() {
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Api Docs", path: "/api_docs" },
        { name: "Blog", path: "/blog" },
        { name: "Contact", path: "/contact" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "Fund Wallet", path: "/fund_wallet" },
        { name: "Profile", path: "/profile" },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.menuContainer}>
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <TouchableOpacity
                            key={item.path}
                            onPress={() => router.push(item.path)}
                            style={[styles.linkBase, isActive ? styles.activeLink : styles.link]}
                        >
                            <Text style={isActive ? styles.activeText : styles.text}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
                <TouchableOpacity
                    style={[styles.logoutBtn]}
                >
                    <MaterialIcons style={styles.logoutBtnIcon} name="logout" size={24} color="black" />
                    <Text style={styles.logoutBtnText}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.emptyContainer}>
                <Text>Hello</Text>
            </View>
        </View>
    );
}

const { height: screenHeight } = Dimensions.get("window");


const styles = StyleSheet.create({
    container: {
        width: "100%",
        position: "absolute",
        zIndex: 10,
        flexDirection:"row",
        right:0,
        left:0
    },
    menuContainer:{
        width: "50%",
        backgroundColor: "#fff",
        height: screenHeight, 
        paddingHorizontal:10
    },
    emptyContainer:{
        width: "50%",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        height: screenHeight, 
    },
    menuBar: {
        cursor: "pointer",
        position: "absolute",
        right: 0,
        marginRight: 10,
        top: 0,
        marginTop: 15
    },
    // shared button shape
    linkBase: {
        marginVertical: 10,
        padding: 8,
        borderRadius: 4,
    },
    // inactive button
    link: {
        backgroundColor: "transparent",
    },
    // active button
    activeLink: {
        backgroundColor: "blue",
    },
    // text styles
    text: {
        fontWeight: "700",
        color: "gray",
    },
    activeText: {
        fontWeight: "700",
        color: "#fff",
    },
    logoutBtn: {
        fontWeight: "700",
        color: "gray",
        flexDirection: "row",
        padding: 8
    },
    logoutBtnIcon: {
        fontWeight: "700",
        color: "gray",
        paddingRight: 5
    },
    logoutBtnText: {
        fontWeight: "700",
        color: "gray",
    }
});
