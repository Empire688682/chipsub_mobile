import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import Toast from "react-native-toast-message";
import axios from 'axios';
import { useGlobalContext } from '../lib/GlobalContext';
import Wallet from './components/Wallet';
import {applyMarkup} from "../utils/helper";
import ToastUi from '../utils/ToastUi';

const BuyData = () => {
  const { apiUrl, setPinModal, dataPlan, fetchUserTransactionData, mobileUserId } = useGlobalContext();
  const [form, setForm] = useState({
    network: "",
    plan: "",
    planId: "",
    amount: "",
    number: "",
    pin: "",
  });

  const [availablePlans, setAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(false);

    // State to store profit configuration for pricing (type and value)
  const [profitConfig, setProfitConfig] = useState({
    type: "percentage", 
    value: 3.5,          
  });

  // Helper function for your rounding rule (nearest 10, rounding .5 and up)
  function roundToNearestTen(num) {
    const remainder = num % 10;
    if (remainder >= 5) {
      return num + (10 - remainder); // round up
    } else {
      return num - remainder; // round down
    }
  }

  const handleNetworkChange = (selected) => {
    setForm({ ...form, network: selected, plan: "", amount: "" });

    const plans = dataPlan?.MOBILE_NETWORK?.[selected]?.[0]?.PRODUCT || [];

    const enhancedPlans = plans.map((item) => {
      const basePrice = Number(item.PRODUCT_AMOUNT);
      const priceWithMarkup = applyMarkup(
        basePrice,
        profitConfig.type,
        profitConfig.value
      );
      const roundedPrice = roundToNearestTen(priceWithMarkup);

      return {
        name: item.PRODUCT_NAME,
        code: item.PRODUCT_ID,
        price: basePrice,
        sellingPrice: roundedPrice,
      };
    });

    setAvailablePlans(enhancedPlans);
  };

  const handlePlanChange = (selected) => {
    const plan = availablePlans.find((p) => p.name === selected);
    if (plan) {
      setForm({
        ...form,
        plan: selected,
        planId: plan.code,
        amount: plan.sellingPrice.toString(),
      });
    }
  };

  const handleInputChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  // Enhanced toast function with custom styling
  const showToast = (type, message) => {
    Toast.show({
      type: type,
      text1: type === "success" ? "Success!" : "Error!",
      text2: message,
      position: "top",
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 60,
    });
  };

  const handleSubmit = async () => {
    if (!form.network) return showToast("error", "Please select a network");
    if (!form.plan) return showToast("error", "Please choose a data plan");
    if (!/^\d{11}$/.test(form.number))
      return showToast("error", "Enter a valid 11-digit phone number");
    if (form.pin.length < 4)
      return showToast("error", "PIN must be 4 digits");

    try {
      setLoading(true);
      const postData = {...form, mobileUserId}
      const res = await axios.post(`${apiUrl}api/provider/data-provider`, postData);

      if (res.data.success) {
        fetchUserTransactionData();
        showToast("success", "Data purchase successful!");

        setForm({
          network: "",
          plan: "",
          planId: "",
          amount: "",
          number: "",
          pin: "",
        });
        setAvailablePlans([]);
      }
    } catch (error) {
      console.log("Error:", error);
      showToast(
        "error",
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!dataPlan) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading.....</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Wallet />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Buy your Data</Text>

        {/* Network Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Network</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.network}
              onValueChange={handleNetworkChange}
              style={styles.picker}
            >
              <Picker.Item label="-- Choose Network --" value="" />
              {Object.keys(dataPlan?.MOBILE_NETWORK || {}).map((net, i) => (
                <Picker.Item label={net} value={net} key={i} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Data Plan Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Choose Data Plan</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.plan}
              onValueChange={handlePlanChange}
              style={styles.picker}
              enabled={availablePlans.length > 0}
            >
              <Picker.Item label="-- Choose Plan --" value="" />
              {availablePlans.map((p, i) => (
                <Picker.Item
                  key={i}
                  label={`${p.name} - ₦${p.sellingPrice}`}
                  value={p.name}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Amount (readonly) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={form.amount}
            editable={false}
            placeholder="Amount will appear here"
          />
        </View>

        {/* Phone Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={form.number}
            onChangeText={(value) => handleInputChange("number", value)}
            placeholder="e.g. 08012345678"
            keyboardType="phone-pad"
            maxLength={11}
          />
        </View>

        {/* PIN */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Enter PIN</Text>
          <TextInput
            style={styles.input}
            value={form.pin}
            onChangeText={(value) => handleInputChange("pin", value)}
            placeholder="4 digit PIN"
            secureTextEntry
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Buy Now</Text>
          )}
        </TouchableOpacity>
        <Toast config={ToastUi} />
      </View>

      {/* <DataHelp data={form} /> */}
    </ScrollView>
  );
};

// Main component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#64748b",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    shadowColor: "#000",
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
    fontWeight: "bold",
    textAlign: "center",
    color: "#1d4ed8",
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  readOnlyInput: {
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default BuyData;