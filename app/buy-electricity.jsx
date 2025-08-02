import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useGlobalContext } from '../lib/GlobalContext';
import Wallet from './components/Wallet';
import Toast from "react-native-toast-message";
import ToastUi from '../utils/ToastUi';

const BuyElectricity = () => {
  const { fetchUserTransactionData, apiUrl, mobileUserId } = useGlobalContext();
  const [electricityCompany, setElectricityCompany] = useState({});
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [verifyingMeter, setVerifyingMeter] = useState(false);
  const [purchasedToken, setPurchasedToken] = useState(null);

  const electricityUrl = "https://www.nellobytesystems.com/APIElectricityDiscosV1.asp";

  useEffect(() => {
    const getElectricityCompany = async () => {
      try {
        const response = await fetch(electricityUrl, {
          method: "GET",
        });
        const data = await response.json();

        if (data?.ELECTRIC_COMPANY) {
          setElectricityCompany(data.ELECTRIC_COMPANY);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getElectricityCompany();
  }, []);

  const [formData, setFormData] = useState({
    disco: '',
    meterNumber: '',
    meterType: '',
    amount: '',
    phone: '',
    pin: '',
  });

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showToast = (type, message) => {
    Toast.show({
      type: type,
      text1: type === "success" ? "Success!" : type === "error" ? "Error!" : "Info!" ,
      text2: message,
      position: "top",
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 60,
    });
  };
  const verifyMeterNumber = async (meterNumber, disco) => {
    if (meterNumber.length && disco) {
      setVerifyingMeter(true);
      try {
        const response = await axios.post(apiUrl + '/api/verify-meter-number',
          { meterNumber, disco },
        );

        if (response.data.success) {
          setCustomerName(response.data.data);
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.log("Verify Meter Number Error:", error);
        setCustomerName("Invalid provider or meter number");
      } finally {
        setVerifyingMeter(false);
      }
    }
  };

  const handleSubmit = async () => {
    const { disco, meterNumber, meterType, amount, phone, pin } = formData;

    if (!disco || !meterNumber || !meterType || !amount || !phone || !pin || !mobileUserId) {
      return showToast("error", "All fields are required!");
    }

    if (parseInt(amount, 10) < 1000) {
      return showToast("error", "Minimum amount is ₦1000");
    }

    if (pin.length < 4) {
      return showToast("error", "Pin must be 4 digits");
    }

    const isMeterVerified = await verifyMeterNumber(meterNumber, disco);

    if (!isMeterVerified) {
      return showToast("error", "Meter verification failed");
    }

    setLoading(true);
    showToast("info", "Processing...");
    const postData = {...formData, mobileUserId}

    try {
      const response = await axios.post( apiUrl + "/api/provider/flutterwaveElect-provider", postData);
      console.log("Response:", response);
      if (response.data.success) {
        fetchUserTransactionData();
        console.log("Response:", response.data.data);
        setPurchasedToken(response.data.data);
        showToast("success", "Electricity purchase successful!");
        // Reset form
        setFormData({
          disco: '',
          meterNumber: '',
          meterType: '',
          amount: '',
          phone: '',
          pin: '',
        });
        setCustomerName("");
      }
    } catch (error) {
      console.log("Elect-Error:", error);
      showToast("error", error?.response?.data?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Wallet />

        <View style={styles.formContainer}>
          <Text style={styles.title}>Buy Electricity</Text>

          {/* Disco Selection */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Select Provider</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.disco}
                onValueChange={(value) => handleChange('disco', value)}
                style={styles.picker}
              >
                <Picker.Item label="-- Choose Provider --" value="" />
                {Object.keys(electricityCompany).map((merchant, id) => (
                  <Picker.Item key={id} label={merchant} value={merchant} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Meter Type Selection */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Select Meter Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.meterType}
                onValueChange={(value) => handleChange('meterType', value)}
                style={styles.picker}
              >
                <Picker.Item label="-- Choose Meter Type --" value="" />
                <Picker.Item label="Prepaid" value="Prepaid" />
                <Picker.Item label="Postpaid" value="Postpaid" />
              </Picker>
            </View>
          </View>

          {/* Meter Number */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Meter Number</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={formData.meterNumber}
                onChangeText={(value) => handleChange('meterNumber', value)}
                placeholder="e.g. 1234567890"
                maxLength={11}
                keyboardType="numeric"
              />
              {verifyingMeter && (
                <View style={styles.spinner}>
                  <ActivityIndicator size="small" color="#1D4ED8" />
                </View>
              )}
            </View>
            {customerName && (
              <Text style={[
                styles.customerName,
                customerName === "Invalid provider or meter number"
                  ? styles.errorText
                  : styles.successText
              ]}>
                {customerName}
              </Text>
            )}
          </View>

          {/* Amount */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Amount (₦)</Text>
            <TextInput
              style={styles.input}
              value={formData.amount}
              onChangeText={(value) => handleChange('amount', value)}
              placeholder="Minimum ₦1000"
              keyboardType="numeric"
            />
          </View>

          {/* Phone Number */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(value) => handleChange('phone', value)}
              placeholder="e.g. 08012345678"
              keyboardType="phone-pad"
              maxLength={11}
            />
          </View>

          {/* PIN */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Transaction PIN</Text>
            <TextInput
              style={styles.input}
              value={formData.pin}
              onChangeText={(value) => handleChange('pin', value)}
              placeholder="Enter your PIN"
              secureTextEntry
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, (loading || verifyingMeter) && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading || verifyingMeter}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Buy Now</Text>
            )}
          </TouchableOpacity>
          <Toast config={ToastUi} />
        </View>

        {/* <ElectricityHelp data={formData} /> */}
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
    padding: 16,
    paddingBottom: 30,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D4ED8',
    textAlign: 'center',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  spinner: {
    position: 'absolute',
    right: 16,
    top: 15,
  },
  customerName: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  errorText: {
    color: '#EF4444',
  },
  successText: {
    color: '#10B981',
  },
  button: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BuyElectricity;