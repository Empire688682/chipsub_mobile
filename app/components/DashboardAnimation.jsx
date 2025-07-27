import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import { useGlobalContext } from '../../lib/GlobalContext';

const { width } = Dimensions.get('window');

const DashboardAnimation = () => {
  const { allData } = useGlobalContext();
const scrollX = new Animated.Value(0);

  // Animate the scrolling text
  useEffect(() => {
    const animateScroll = () => {
      Animated.loop(
        Animated.timing(scrollX, {
          toValue: -width,
          duration: 15000,
          useNativeDriver: true,
        })
      ).start();
    };

    if (Object.keys(allData).length > 0) {
      animateScroll();
    }
  }, [allData, scrollX]);

  const scrollingText = `👥 Active Users: ${allData.users || 0} • 📱 Airtime Purchases: ${allData.airtime || 0} • 📶 Data Purchases: ${allData.data || 0} • 📺 TV Subscriptions: ${allData.tv || 0} • ⚡ Electricity Tokens: ${allData.electricity || 0} • 💰 Wallet Fundings: ₦${allData.walletsTotal || 0} • 🎁 Commissions Paid: ₦${allData.totalReward || 0}`;

  return (
    <SafeAreaView style={styles.container}>
          {/* Animated Scrolling Banner */}
          <View style={styles.bannerContainer}>
            <View style={styles.banner}>
              <Animated.View
                style={[
                  styles.scrollingTextContainer,
                  {
                    transform: [{ translateX: scrollX}],
                  },
                ]}
              >
                <Text style={styles.scrollingText}>{scrollingText}</Text>
              </Animated.View>
            </View>
          </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  bannerContainer: {
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  banner: {
    overflow: 'hidden',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  scrollingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollingText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    minWidth: width * 2, // Ensure text is wide enough to scroll
  },
});

export default DashboardAnimation;