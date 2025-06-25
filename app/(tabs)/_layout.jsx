import { Tabs, Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import CustomDrawer from "../components/CustomDrawer";


export default function RootLayout(){
    return <SafeAreaView>
        <CustomDrawer />
        <Stack />
    </SafeAreaView>
}