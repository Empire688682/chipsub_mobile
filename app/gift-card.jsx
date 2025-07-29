import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Button, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useGlobalContext } from '../lib/GlobalContext';
import Wallet from './components/Wallet';

const Crypto = () => {
  const { apiUrl, setPinModal, getUserRealTimeData, mobileUserId } = useGlobalContext();
  const [data, setData] = useState({
    network: "",
    amount: "",
    number: "",
    pin: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setData({ ...data, [name]: value });
  };

  const showError = (message) => {
    Alert.alert("Error", message);
  };

  const handleFormSubmission = () => {
    if (!data.network) return showError("Please select a network");
    Alert.alert("Success", "Please select a network");
    if (!data.amount || parseInt(data.amount) < 50) return showError("Amount must be at least ₦50");
    if (!/^\d{11}$/.test(data.number)) return showError("Enter a valid 11-digit phone number");
    if (data.pin.length < 4) return showError("PIN must be at least 4 digits");

    if (data.pin === "1234") {
      showError("1234 is not allowed");
      setTimeout(() => setPinModal(true), 2000);
      return;
    }

    Crypto();
  };

  const Crypto = async () => {
    setLoading(true);
    const postData = data;
    postData.mobileUserId = mobileUserId;
    try {
      const response = await axios.post(`${apiUrl}api/provider/airtime-provider`, 
        { data: postData });
        console.log("Airtime Response:", response.data);
      if (response.data.success) {
        getUserRealTimeData();
        Alert.alert("Success", response.data.message);
        setData({ network: "", amount: "", number: "", pin: "" });
      }
    } catch (error) {
      showError(error?.response?.data?.message || "An error occurred");
      console.log("Airtime error:", error);
      if (
        error?.response?.data?.message === "1234 is not allowed" ||
        error?.response?.data?.message === "Pin not activated yet!"
      ) {
        setTimeout(() => setPinModal(true), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Wallet />

      <Text style={styles.title}>Buy Airtime</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Select Network</Text>
        <Picker
          selectedValue={data.network}
          onValueChange={(value) => handleChange('network', value)}
          style={styles.input}
        >
          <Picker.Item label="-- Choose Network --" value="" />
          <Picker.Item label="MTN" value="01" />
          <Picker.Item label="GLO" value="02" />
          <Picker.Item label="Airtel" value="04" />
          <Picker.Item label="9Mobile" value="03" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={data.amount}
          keyboardType="numeric"
          onChangeText={(val) => handleChange("amount", val)}
          placeholder="Enter Amount (min ₦50)"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={data.number}
          keyboardType="phone-pad"
          maxLength={11}
          onChangeText={(val) => handleChange("number", val)}
          placeholder="e.g. 09154358139"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>PIN</Text>
        <TextInput
          style={styles.input}
          value={data.pin}
          onChangeText={(val) => handleChange("pin", val)}
          secureTextEntry
          maxLength={4}
          keyboardType="number-pad"
          placeholder="Enter your PIN"
        />
      </View>

      <TouchableOpacity
        onPress={handleFormSubmission}
        disabled={loading}
        style={styles.button}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Buy Now</Text>
        )}
      </TouchableOpacity>

      {/* <AirtimeHelp data={data} /> */}
    </View>
  );
};

export default Crypto;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1D4ED8',
    marginVertical: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
