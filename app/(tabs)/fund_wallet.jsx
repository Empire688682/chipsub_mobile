import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock user data to replace useGlobalContext
const mockUserData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
};

const FundWalletScreen = () => {
  const [userData] = useState(mockUserData);
  const [form, setForm] = useState({ amount: '' });
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = 'info') => {
    Alert.alert(
      type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Info',
      message
    );
  };

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const openPaymentLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        showToast('Cannot open payment link', 'error');
      }
    } catch (error) {
      showToast('Failed to open payment link', 'error');
    }
  };

  const handleSubmit = async () => {
    const amount = parseInt(form.amount);

    if (!form.amount || isNaN(amount) || amount < 100) {
      return showToast('Enter a valid amount (min ₦100)', 'error');
    }

    setLoading(true);
    showToast('Initializing payment...');

    try {
      // Simulate API call to initiate payment
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful payment initiation
      const mockResponse = {
        success: true,
        link: 'https://checkout.flutterwave.com/v3/hosted/pay/mock-payment-link',
        message: 'Payment initialized successfully'
      };

      console.log('Payment response:', mockResponse);

      if (mockResponse.success && mockResponse.link) {
        showToast('Redirecting to Flutterwave...', 'success');
        
        // In a real app, you would open the payment link
        // For demo purposes, we'll just show a success message
        Alert.alert(
          'Payment Redirect',
          'In a real app, this would redirect to Flutterwave payment page.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open Payment Link',
              onPress: () => openPaymentLink(mockResponse.link),
            },
          ]
        );
        
        // Reset form after successful initiation
        setForm({ amount: '' });
      } else {
        showToast(mockResponse.message || 'Payment failed', 'error');
      }
    } catch (err) {
      console.error('Payment error:', err);
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openSupportEmail = () => {
    const email = 'support@chipsub.com';
    const subject = 'Wallet Funding Support';
    const body = 'Hello, I need help with wallet funding.';
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.canOpenURL(mailtoUrl).then((supported) => {
      if (supported) {
        Linking.openURL(mailtoUrl);
      } else {
        Alert.alert('Email not supported', `Please contact us at: ${email}`);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Top-Up Form</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Amount (₦)</Text>
              <TextInput
                style={styles.input}
                value={form.amount}
                onChangeText={(value) => handleChange('amount', value)}
                placeholder="Minimum ₦100"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="white" size="small" />
                  <Text style={styles.buttonText}>Processing...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Proceed to Payment</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Fund Your Wallet</Text>
            <Text style={styles.infoDescription}>
              Easily top-up your Chipsub wallet using Flutterwave. Your wallet allows you to buy airtime, data, electricity, and more — all in one place.
            </Text>
            
            <View style={styles.securityNotice}>
              <Text style={styles.securityText}>
                🔐 All transactions are secured using end-to-end encryption.
              </Text>
            </View>
            
            <View style={styles.supportContainer}>
              <Text style={styles.supportText}>
                Need help? Reach out to{' '}
                <Text style={styles.supportLink} onPress={openSupportEmail}>
                  support@chipsub.com
                </Text>
              </Text>
            </View>
          </View>

          {/* Additional Features Info */}
          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>What you can do with your wallet:</Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>📱 Buy airtime for all networks</Text>
              <Text style={styles.featureItem}>📶 Purchase data bundles</Text>
              <Text style={styles.featureItem}>💡 Pay electricity bills</Text>
              <Text style={styles.featureItem}>📺 Subscribe to cable TV</Text>
              <Text style={styles.featureItem}>💳 Quick and secure payments</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF6FF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  content: {
    gap: 24,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 48,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  infoTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D4ED8',
    marginBottom: 16,
  },
  infoDescription: {
    color: '#374151',
    lineHeight: 20,
    fontSize: 14,
    marginBottom: 24,
  },
  securityNotice: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    marginBottom: 24,
  },
  securityText: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '500',
  },
  supportContainer: {
    marginTop: 16,
  },
  supportText: {
    fontSize: 14,
    color: '#6B7280',
  },
  supportLink: {
    color: '#2563EB',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  featuresCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});

export default FundWalletScreen;