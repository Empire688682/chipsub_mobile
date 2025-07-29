import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Clipboard,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ApiDocsScreen = () => {
  const [copiedSection, setCopiedSection] = useState(null);

  const copyToClipboard = (text, sectionName) => {
    Clipboard.setString(text);
    setCopiedSection(sectionName);
    Alert.alert('Copied!', `${sectionName} copied to clipboard`);
    
    // Reset copied state after 2 seconds
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const CodeBlock = ({ code, title, copyable = true }) => (
    <View style={styles.codeBlockContainer}>
      {title && (
        <View style={styles.codeHeader}>
          <Text style={styles.codeTitle}>{title}</Text>
          {copyable && (
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => copyToClipboard(code, title)}
            >
              <Text style={styles.copyButtonText}>
                {copiedSection === title ? '✓ Copied' : '📋 Copy'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.codeScrollView}>
        <Text style={styles.codeText}>{code}</Text>
      </ScrollView>
    </View>
  );

  const EndpointCard = ({ method, endpoint, description, requestBody, responseBody }) => (
    <View style={styles.endpointCard}>
      <View style={styles.methodContainer}>
        <View style={[styles.methodBadge, method === 'POST' ? styles.postMethod : styles.getMethod]}>
          <Text style={styles.methodText}>{method}</Text>
        </View>
        <Text style={styles.endpointText}>{endpoint}</Text>
      </View>
      
      <Text style={styles.endpointDescription}>{description}</Text>
      
      {requestBody && (
        <View style={styles.codeSection}>
          <Text style={styles.sectionLabel}>Request Body:</Text>
          <CodeBlock code={requestBody} title="Request Body" />
        </View>
      )}
      
      {responseBody && (
        <View style={styles.codeSection}>
          <Text style={styles.sectionLabel}>Response:</Text>
          <CodeBlock code={responseBody} title="Response" />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Chipsub API Documentation</Text>
          <Text style={styles.subtitle}>
            Welcome to the Chipsub developer docs. Use the endpoints below to integrate airtime, data, wallet, and payment features.
          </Text>
        </View>

        {/* Authentication Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔐 Authentication</Text>
          <Text style={styles.sectionDescription}>
            Use your API key in the header for all requests:
          </Text>
          <CodeBlock 
            code="Authorization: Bearer YOUR_API_KEY"
            title="Authorization Header"
          />
          
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              💡 Keep your API key secure and never expose it in client-side code.
            </Text>
          </View>
        </View>

        {/* Data Purchase Endpoint */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Buy Data</Text>
          <EndpointCard
            method="POST"
            endpoint="/api/v1/data/buy"
            description="Purchase data bundles for any network operator."
            requestBody={`{
  "network": "MTN",
  "phone": "08123456789",
  "plan": "1GB",
  "ref": "unique_transaction_id"
}`}
            responseBody={`{
  "success": true,
  "message": "Data purchase successful",
  "transaction_id": "TXN123456789",
  "balance": 5500.00
}`}
          />
        </View>

        {/* Airtime Purchase Endpoint */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 Buy Airtime</Text>
          <EndpointCard
            method="POST"
            endpoint="/api/v1/airtime/buy"
            description="Purchase airtime for any network operator."
            requestBody={`{
  "network": "GLO",
  "phone": "08123456789",
  "amount": 1000,
  "ref": "unique_transaction_id"
}`}
            responseBody={`{
  "success": true,
  "message": "Airtime purchase successful",
  "transaction_id": "TXN123456790",
  "balance": 4500.00
}`}
          />
        </View>

        {/* Wallet Operations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Wallet Operations</Text>
          
          {/* Fund Wallet */}
          <EndpointCard
            method="POST"
            endpoint="/api/v1/wallet/fund"
            description="Add funds to user wallet via payment gateway."
            requestBody={`{
  "amount": 5000,
  "payment_method": "flutterwave",
  "callback_url": "https://yourapp.com/callback"
}`}
          />

          {/* Check Balance */}
          <View style={styles.endpointSpacing}>
            <EndpointCard
              method="GET"
              endpoint="/api/v1/wallet/balance"
              description="Get current wallet balance."
              responseBody={`{
  "success": true,
  "balance": 12500.00,
  "currency": "NGN"
}`}
            />
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Transaction History</Text>
          <EndpointCard
            method="GET"
            endpoint="/api/v1/transactions?page=1&limit=10"
            description="Retrieve user transaction history with pagination."
            responseBody={`{
  "success": true,
  "transactions": [
    {
      "id": "TXN123456789",
      "type": "data_purchase",
      "amount": 1000,
      "status": "success",
      "date": "2025-06-26T10:30:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_records": 50
  }
}`}
          />
        </View>

        {/* BVN Verification */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛡️ BVN Verification</Text>
          <EndpointCard
            method="POST"
            endpoint="/api/v1/verify/bvn"
            description="Verify user's Bank Verification Number for account security."
            requestBody={`{
  "bvn": "12345678901",
  "phone": "08123456789",
  "date_of_birth": "1990-01-01"
}`}
            responseBody={`{
  "success": true,
  "message": "BVN verification successful",
  "verified": true,
  "user_data": {
    "name": "John Doe",
    "phone": "08123456789"
  }
}`}
          />
        </View>

        {/* Error Codes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Error Codes</Text>
          <View style={styles.errorCodesContainer}>
            <View style={styles.errorCodeItem}>
              <Text style={styles.errorCode}>400</Text>
              <Text style={styles.errorDescription}>Bad Request - Invalid parameters</Text>
            </View>
            <View style={styles.errorCodeItem}>
              <Text style={styles.errorCode}>401</Text>
              <Text style={styles.errorDescription}>Unauthorized - Invalid API key</Text>
            </View>
            <View style={styles.errorCodeItem}>
              <Text style={styles.errorCode}>403</Text>
              <Text style={styles.errorDescription}>Forbidden - Insufficient permissions</Text>
            </View>
            <View style={styles.errorCodeItem}>
              <Text style={styles.errorCode}>429</Text>
              <Text style={styles.errorDescription}>Too Many Requests - Rate limit exceeded</Text>
            </View>
            <View style={styles.errorCodeItem}>
              <Text style={styles.errorCode}>500</Text>
              <Text style={styles.errorDescription}>Internal Server Error</Text>
            </View>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🆘 Need Help?</Text>
          <View style={styles.supportContainer}>
            <Text style={styles.supportText}>
              For API support and integration assistance:
            </Text>
            <Text style={styles.supportEmail}>📧 developers@chipsub.com</Text>
            <Text style={styles.supportText}>
              📚 Check out our SDK and code examples on GitHub
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  codeBlockContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#E5E7EB',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  codeTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  copyButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  copyButtonText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
  },
  codeScrollView: {
    maxHeight: 200,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#1F2937',
    padding: 12,
    minWidth: width - 64,
  },
  endpointCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  Color: '#000',
  Offset: { width: 0, height: 2 },
  Opacity: 0.1,
  Radius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  postMethod: {
    backgroundColor: '#059669',
  },
  getMethod: {
    backgroundColor: '#2563EB',
  },
  methodText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  endpointText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
    flex: 1,
  },
  endpointDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  codeSection: {
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  endpointSpacing: {
    marginTop: 16,
  },
  noteContainer: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    marginTop: 12,
  },
  noteText: {
    fontSize: 14,
    color: '#1E40AF',
    fontStyle: 'italic',
  },
  errorCodesContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  Color: '#000',
  Offset: { width: 0, height: 2 },
  Opacity: 0.05,
  Radius: 8,
    elevation: 2,
  },
  errorCodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  errorCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
    width: 60,
  },
  errorDescription: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  supportContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  Color: '#000',
  Offset: { width: 0, height: 2 },
  Opacity: 0.05,
  Radius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  supportText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  supportEmail: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: 12,
  },
});

export default ApiDocsScreen;