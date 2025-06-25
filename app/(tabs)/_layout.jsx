import { Tabs } from "expo-router";


export default function RootLayout(){
    return <Tabs
    screenOptions={{
        headerTitleAlign:"center",
        headerShadowVisible:false,
        headerTitleStyle:{
            fontWeight:"bold",
            color:"gray"
        }
    }}
    >
        <Tabs.Screen name="index" options={{title:"Home"}}/>
        <Tabs.Screen name="about" options={{title:"About"}}/>
        <Tabs.Screen name="api_docs" options={{title:"Api docs"}}/>
        <Tabs.Screen name="blog" options={{title:"Blog"}}/>
        <Tabs.Screen name="contact" options={{title:"Contact"}}/>
        <Tabs.Screen name="dashboard" options={{title:"Dashboard"}}/>
        <Tabs.Screen name="fund_wallet" options={{title:"Fund Wallet"}}/>
        <Tabs.Screen name="profile" options={{title:"Profile"}}/>
    </Tabs>
}