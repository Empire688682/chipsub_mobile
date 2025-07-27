import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  MaterialIcons,
  Ionicons,
  Feather,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { useGlobalContext } from "../../lib/GlobalContext";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const {allData} = useGlobalContext()
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  console.log("allData", allData);

  // Animation refs
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(100)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  // Dynamic greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Complex animation sequence
  useEffect(() => {
    const animationSequence = Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideUp, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
    ]);

    // Continuous rotation animation
    const rotateAnimation = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );

    // Pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    animationSequence.start();
    rotateAnimation.start();
    pulseAnimation.start();

    return () => {
      rotateAnimation.stop();
      pulseAnimation.stop();
    };
  }, []);


  const stats = [
    { label: "Active Services", value: allData?.users, icon: "trending-up" },
    { label: "This Month", value: "₦45,230", icon: "credit-card" },
    { label: "Saved", value: "₦8,940", icon: "savings" },
  ];

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Animated Background Elements */}
      <Animated.View
        style={[
          styles.backgroundOrb1,
          { transform: [{ rotate: rotateInterpolate }] }
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundOrb2,
          { transform: [{ rotate: rotateInterpolate }] }
        ]}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={["#3b82f6", "#60a5fa"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.heroSection}
        >
          <Animated.View
            style={[
              styles.heroContent,
              {
                opacity: fadeIn,
                transform: [
                  { translateY: slideUp },
                  { scale: scale }
                ]
              }
            ]}
          >
            {/* Logo with pulse animation */}
            <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulse }] }]}>
              <Image
                source={require("../../assets/images/chipsub.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <View style={styles.logoGlow} />
            </Animated.View>

            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.welcomeText}>Welcome to ChipSub</Text>
            <Text style={styles.subtitle}>Your digital wallet companion</Text>

            {/* Live Time Display */}
            <View style={styles.timeContainer}>
              <Feather name="clock" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.timeText}>{formatTime()}</Text>
              <Text style={styles.dateText}>{formatDate()}</Text>
            </View>
          </Animated.View>

          {/* Floating elements */}
          <Animated.View style={[styles.floatingElement1, { opacity: fadeIn }]}>
            <MaterialCommunityIcons name="wallet" size={24} color="rgba(255,255,255,0.3)" />
          </Animated.View>
          <Animated.View style={[styles.floatingElement2, { opacity: fadeIn }]}>
            <Ionicons name="card" size={20} color="rgba(255,255,255,0.2)" />
          </Animated.View>
          <Animated.View style={[styles.floatingElement3, { opacity: fadeIn }]}>
            <MaterialIcons name="trending-up" size={28} color="rgba(255,255,255,0.25)" />
          </Animated.View>
        </LinearGradient>

        {/* Quick Stats */}
        <Animated.View
          style={[
            styles.statsContainer,
            {
              opacity: fadeIn,
              transform: [{ translateY: slideUp }]
            }
          ]}
        >
          {stats.map((stat, index) => (
            <Animated.View
              key={index}
              style={[
                styles.statCard,
                {
                  transform: [{
                    scale: fadeIn.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    })
                  }]
                }
              ]}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.7)"]}
                style={styles.statCardGradient}
              >
                <MaterialIcons name={stat.icon} size={24} color="#667eea" />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </LinearGradient>
            </Animated.View>
          ))}
        </Animated.View>
        <Animated.View
          style={[
            styles.ctaContainer,
            {
              opacity: fadeIn,
              transform: [{ translateY: slideUp }]
            }
          ]}
        >
          <Pressable
            style={styles.mainCta}
            onPress={() => router.push("/(tabs)/dashboard")}
            android_ripple={{ color: "rgba(255,255,255,0.2)" }}
          >
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <MaterialIcons name="dashboard" size={24} color="#fff" />
              <Text style={styles.ctaText}>Open Dashboard</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </Pressable>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Background elements
  backgroundOrb1: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    zIndex: -1,
  },
  backgroundOrb2: {
    position: "absolute",
    bottom: -150,
    left: -150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(240, 147, 251, 0.1)",
    zIndex: -1,
  },

  // Hero section
  heroSection: {
    height: height * 0.55,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  heroContent: {
    alignItems: "center",
    zIndex: 2,
  },
  logoContainer: {
    position: "relative",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  logoGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    zIndex: -1,
  },
  greeting: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "600",
    color: "rgba(255,255,255,0.95)",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 20,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  timeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    marginRight: 12,
  },
  dateText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },

  // Floating elements
  floatingElement1: {
    position: "absolute",
    top: 100,
    right: 30,
  },
  floatingElement2: {
    position: "absolute",
    top: 200,
    left: 40,
  },
  floatingElement3: {
    position: "absolute",
    bottom: 80,
    right: 50,
  },

  // Stats section
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: -30,
    zIndex: 3,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  statCardGradient: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },

  // CTA section
  ctaContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  mainCta: {
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  ctaText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 12,
  },
});