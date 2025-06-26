import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data to replace useGlobalContext
const mockUserData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  number: '+1234567890',
  bvnVerify: false,
};

const mockTransactionHistory = [
  {
    _id: 'TXN001',
    type: 'Credit Transfer',
    amount: '$500.00',
    date: '2025-06-25',
    status: 'success',
  },
  {
    _id: 'TXN002',
    type: 'Bill Payment',
    amount: '$75.50',
    date: '2025-06-24',
    status: 'success',
  },
  {
    _id: 'TXN003',
    type: 'ATM Withdrawal',
    amount: '$200.00',
    date: '2025-06-23',
    status: 'failed',
  },
  {
    _id: 'TXN004',
    type: 'Online Purchase',
    amount: '$120.99',
    date: '2025-06-22',
    status: 'success',
  },
  {
    _id: 'TXN005',
    type: 'Bank Transfer',
    amount: '$1000.00',
    date: '2025-06-21',
    status: 'success',
  },
];

const ProfileScreen = () => {
  const [notify, setNotify] = useState(true);
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [userData] = useState(mockUserData);

  const [pwdForm, setPwdForm] = useState({
    currentPwd: '',
    newPwd: '',
    repeatPwd: '',
  });

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      setTransactionHistory(mockTransactionHistory);
      setLoading(false);
    }, 1500);
  }, []);

  const user = {
    name: userData.name || '',
    email: userData.email || '',
    phone: userData.number || '',
    bvnVerified: userData.bvnVerify,
    avatar: require('../../assets/images/profile-img.png'), // You'll need to add this image to your assets
  };

  const handleOnchange = (name, value) => {
    setPwdForm((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = (message, type = 'info') => {
    Alert.alert(
      type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Info',
      message
    );
  };

  const handlePasswordChange = async () => {
    const { currentPwd, newPwd, repeatPwd } = pwdForm;
    
    if (!currentPwd || !newPwd || !repeatPwd) {
      showToast('All fields required', 'error');
      return;
    }

    if (newPwd.length < 8) {
      showToast('Password too short', 'error');
      return;
    }

    if (newPwd !== repeatPwd) {
      showToast('Password did not match', 'error');
      return;
    }

    setPostLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      showToast('Password updated!', 'success');
      setPwdForm({
        currentPwd: '',
        newPwd: '',
        repeatPwd: '',
      });
    } catch (error) {
      showToast('Failed to update password', error);
    } finally {
      setPostLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => showToast('Logged out successfully') },
      ]
    );
  };

  const handleSetPin = () => {
    showToast('Set PIN feature coming soon...');
  };

  const handleVerifyBVN = () => {
    showToast('BVN verification coming soon...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Overview Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Image source={user.avatar} style={styles.avatar} />
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>

            <View style={styles.bvnContainer}>
              {user.bvnVerified ? (
                <View style={styles.verifiedContainer}>
                  <Text style={styles.verifiedText}>✅ BVN Verified</Text>
                </View>
              ) : (
                <View style={styles.notVerifiedContainer}>
                  <Text style={styles.notVerifiedText}>⚠️ BVN Not Verified</Text>
                  <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyBVN}>
                    <Text style={styles.verifyButtonText}>Verify Now</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>🚪 Logout</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.setPinButton} onPress={handleSetPin}>
                <Text style={styles.buttonText}>✏️ Set Pin</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Settings and Password Change Card */}
          <View style={styles.settingsCard}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Settings</Text>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>🔔 Notifications</Text>
                <Switch value={notify} onValueChange={setNotify} />
              </View>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>🌙 Dark Mode</Text>
                <View style={styles.comingSoonButton}>
                  <Text style={styles.comingSoonText}>Coming soon</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Change Password</Text>
              <Text style={styles.passwordHint}>
                If not set before enter 123456789 as Current Password
              </Text>
              
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                secureTextEntry
                value={pwdForm.currentPwd}
                onChangeText={(value) => handleOnchange('currentPwd', value)}
              />
              
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={pwdForm.newPwd}
                onChangeText={(value) => handleOnchange('newPwd', value)}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Repeat Password"
                secureTextEntry
                value={pwdForm.repeatPwd}
                onChangeText={(value) => handleOnchange('repeatPwd', value)}
              />
              
              <TouchableOpacity
                style={styles.updatePasswordButton}
                onPress={handlePasswordChange}
                disabled={postLoading}
              >
                {postLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.updatePasswordText}>Update Password</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Transaction History Card */}
          <View style={styles.transactionCard}>
            <Text style={styles.sectionTitle}>📋 Transaction History</Text>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : (
              <ScrollView style={styles.transactionList} nestedScrollEnabled>
                {transactionHistory.map((tx, index) => (
                  <View key={index} style={styles.transactionItem}>
                    <View style={styles.transactionLeft}>
                      <Text style={styles.transactionType}>{tx.type}</Text>
                      <View style={styles.transactionDetails}>
                        <Text style={styles.transactionAmount}>{tx.amount}</Text>
                        <Text style={styles.transactionDate}>{tx.date}</Text>
                      </View>
                    </View>
                    <View style={styles.transactionRight}>
                      <Text
                        style={[
                          styles.transactionStatus,
                          { color: tx.status === 'success' ? '#10B981' : '#EF4444' },
                        ]}
                      >
                        {tx.status}
                      </Text>
                      <Text style={styles.transactionId}>Id: {tx._id}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
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
  content: {
    padding: 16,
    gap: 16,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D4ED8',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  bvnContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  verifiedContainer: {
    alignItems: 'center',
  },
  verifiedText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
  },
  notVerifiedContainer: {
    alignItems: 'center',
    gap: 8,
  },
  notVerifiedText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
  },
  verifyButton: {
    backgroundColor: '#FCD34D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  verifyButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  setPinButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  settingsCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 14,
    color: '#374151',
  },
  comingSoonButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  comingSoonText: {
    fontSize: 12,
    color: '#6B7280',
  },
  passwordHint: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 16,
  },
  updatePasswordButton: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updatePasswordText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  transactionCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxHeight: 400,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 14,
  },
  transactionList: {
    maxHeight: 300,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  transactionLeft: {
    flex: 1,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 16,
  },
  transactionAmount: {
    fontSize: 12,
    color: '#6B7280',
  },
  transactionDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionStatus: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionId: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default ProfileScreen;