import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const About = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:support@chipsub.com');
  };

  const features = [
    'Instant airtime & data delivery',
    'Reliable electricity token generation',
    'Affordable prices with cashback commissions',
    'Secure wallet for easy transactions',
    'Excellent user support',
  ];

  const teamMembers = [
    {
      name: 'Juwon Asehinde',
      role: 'Founder & CEO',
      source: require("../../assets/images/team-1.png"),
    },
    {
      name: 'Jane Smith',
      role: 'Co-Founder & CTO',
      source: require("../../assets/images/team-2.png"),
    },
    {
      name: 'Tobi Ojo',
      role: 'Customer Success',
      source: require("../../assets/images/team-3.png")
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.title}>About ChipSub</Text>
          <Text style={styles.heroSubtitle}>
            ChipSub is a trusted digital platform helping users buy airtime, data, electricity, and more—seamlessly and securely.
          </Text>
        </View>

        {/* Mission & Vision */}
        <View style={styles.missionVisionContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Our Mission</Text>
            <Text style={styles.cardText}>
              To empower Nigerians with simple, fast, and reliable digital services for everyday utility purchases.
            </Text>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Our Vision</Text>
            <Text style={styles.cardText}>
              To become the leading one-stop digital service provider in Africa, delivering convenience with every tap.
            </Text>
          </View>
        </View>

        {/* Why Choose Us */}
        <View style={[styles.card, styles.whyChooseUsCard]}>
          <Text style={styles.sectionTitle}>Why Choose ChipSub?</Text>
          <View style={styles.featuresList}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Our Team */}
        <View style={[styles.card, styles.teamCard]}>
          <Text style={styles.sectionTitle}>Meet the Team</Text>
          <View style={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <View key={index} style={styles.teamMember}>
                <Image
                  source={member.source}
                  style={styles.teamImage}
                  resizeMode="cover"
                />
                <Text style={styles.teamName}>{member.name}</Text>
                <Text style={styles.teamRole}>{member.role}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact CTA */}
        <View style={styles.contactCTA}>
          <Text style={styles.ctaTitle}>Want to reach us?</Text>
          <View style={styles.ctaContent}>
            <Text style={styles.ctaText}>Email us at </Text>
            <TouchableOpacity onPress={handleEmailPress}>
              <Text style={styles.ctaEmail}>support@chipsub.com</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 20,
    paddingTop: 50,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: width * 0.9,
  },
  missionVisionContainer: {
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  whyChooseUsCard: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 20,
    textAlign: 'center',
  },
  featuresList: {
    alignSelf: 'stretch',
    maxWidth: 320,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  teamCard: {
    alignItems: 'center',
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  teamMember: {
    alignItems: 'center',
    width: width > 600 ? (width - 80) / 3 : (width - 60) / 2,
    minWidth: 140,
    marginBottom: 20,
  },
  teamImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  teamName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  teamRole: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  contactCTA: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 16,
    color: '#6B7280',
  },
  ctaEmail: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default About;