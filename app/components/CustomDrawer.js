
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Image } from "react-native";
import { usePathname } from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useGlobalContext } from "../../lib/GlobalContext";
import { Pressable } from "react-native";

export default function CustomDrawer() {
    const pathname = usePathname();
    const { toggleDrawer, router, setIsDrawerOpen } = useGlobalContext();

    const menuItems = [
        { name: "Home", path: "/" },
        { name: "Profile", path: "/profile" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "Api Docs", path: "/api_docs" },
        { name: "Fund Wallet", path: "/fund_wallet" },
        { name: "Contact", path: "/contact" },
        { name: "About", path: "/about" },
        { name: "Blog", path: "/blog" },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.menuContainer}>
                <Pressable onPress={() => { router.push("/"); setIsDrawerOpen(false) }}>
                    <Image
                        source={require("../../assets/images/chipsub.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Pressable>
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <TouchableOpacity
                            key={item.path}
                            onPress={() => { router.push(item.path); toggleDrawer() }}
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
            <Pressable
                onPress={() => setIsDrawerOpen(false)}
                style={styles.emptyContainer}
            />
        </View>
    );
}

const { height: screenHeight } = Dimensions.get("window");


const styles = StyleSheet.create({
    container: {
        top: 35,
        width: "100%",
        position: "absolute",
        zIndex: 11,
        flexDirection: "row",
        right: 0,
        left: 0,
    },
    menuContainer: {
        paddingTop: 60,
        width: "65%",
        backgroundColor: "#fff",
        height: screenHeight,
        paddingHorizontal: 10,
    },
    emptyContainer: {
        width: "50%",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        height: screenHeight,
    },
    logo: {
        width: 120,
        height: 110,
        position: "absolute",
        top: -90,
        left: -15
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
        padding: 8,
        alignItems:"center"
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
