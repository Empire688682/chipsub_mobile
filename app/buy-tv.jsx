import React, { useState, useEffect } from "react";
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
import ToastUi from '../utils/ToastUi';

const BuyTv = () => {
  const {fetchUserTransactionData, mobileUserId, apiUrl} = useGlobalContext();
  const allTvPackagesUrl = "https://www.nellobytesystems.com/APICableTVPackagesV2.asp";

  const initialFormState = {
    provider: "",
    smartcardNumber: "",
    tvPackage: "",
    phone: "",
    pin: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [packagesData, setPackagesData] = useState({});
  const [packageAmount, setPackageAmount] = useState(null);
  const [availablePackages, setAvailablePackages] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyingSmartcardNumber, setVerifyingSmartcardNumber] = useState(false);

  const showToast = (type, message) =>{
    Toast.show({
      type: type,
      text1: type === "success" ? "Success!" : type === "error"? "Error!" : "Info!",
      text2: message,
      position: "top",
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 60,
    })
  }

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(allTvPackagesUrl);
        const data = await res.json();
        if (data && data.TV_ID) {
          setPackagesData(data.TV_ID);
        }
      } catch (error) {
        console.error("Failed to fetch packages:", error);
        showToast("error", "Failed to fetch TV packages");
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    if (form.provider) {
      const providerData = packagesData[form.provider];
      if (providerData && providerData[0]?.PRODUCT) {
        setAvailablePackages(providerData[0].PRODUCT);
      } else {
        setAvailablePackages([]);
      }

      // Reset smartcard and package if provider changes
      setForm((prev) => ({ ...prev, smartcardNumber: "", tvPackage: "" }));
      setCustomerName("");
    }
  }, [form.provider, packagesData]);

  useEffect(() => {
    if (!availablePackages.length || !form.tvPackage) return;

    const data = availablePackages.find((pk) => form.tvPackage === pk.PACKAGE_ID);
    if (data) {
      setPackageAmount(data.PACKAGE_AMOUNT);
    }
  }, [form.tvPackage, availablePackages]);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const verifySmartcardNumber = async (smartcardNumber, provider) => {
    setVerifyingSmartcardNumber(true);
    try {
      const response = await axios.post(apiUrl + "/api/verify-uic-tv-number", {
        smartcardNumber,
        provider,
        mobileUserId
      });

      if (response.data.success) {
        setCustomerName(response.data.data);
        return true;
      } else {
        setCustomerName(" ! Verification failed.");
        return false;
      }
    } catch (error) {
      console.error("Verification error:", error);
      setCustomerName(" ! Verification error occurred.");
      return false;
    } finally {
      setVerifyingSmartcardNumber(false);
    }
  };

  const handleSubmit = async () => {
    const { provider, smartcardNumber, tvPackage, phone, pin } = form;

    if (!provider || !smartcardNumber || !phone || !tvPackage || !pin) {
      showToast("error", "Please fill all fields correctly.");
      return;
    }

    const isVerified = await verifySmartcardNumber(smartcardNumber, provider);
    if (!isVerified) {
      showToast("error", "Smartcard verification failed.");
      return;
    }

    try {
      setLoading(true);
      showToast("info", "Processing...");

      const response = await axios.post(apiUrl + "/api/provider/tv-subscribe-provider", {
        provider,
        mobileUserId,
        smartcardNumber,
        amount: packageAmount,
        tvPackage,
        phone,
        pin,
      });

      if (response.data.success) {
        fetchUserTransactionData();
        showToast("success", "TV subscription successful!");
        setForm(initialFormState);
        setCustomerName("");
        setAvailablePackages([]);
      } else {
        showToast("error", response.data.message || "Subscription failed.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      showToast("error", error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Wallet />
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Buy TV Subscription</Text>

          {/* Provider */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>TV Provider</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.provider}
                onValueChange={(value) => handleChange("provider", value)}
                style={styles.picker}
              >
                <Picker.Item label="-- Select Provider --" value="" />
                {Object.keys(packagesData).map((p, i) => (
                  <Picker.Item key={i} label={p} value={p} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Smartcard Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Smartcard Number</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.textInput}
                value={form.smartcardNumber}
                onChangeText={(value) => handleChange("smartcardNumber", value)}
                maxLength={12}
                placeholder="Enter smartcard number"
                keyboardType="numeric"
              />
              {verifyingSmartcardNumber && (
                <ActivityIndicator size="small" color="#2563eb" style={styles.spinner} />
              )}
            </View>
            {customerName ? (
              <Text
                style={[
                  styles.customerName,
                  customerName.includes("!") ? styles.errorText : styles.successText,
                ]}
              >
                {customerName}
              </Text>
            ) : null}
          </View>

          {/* Package */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>TV Package</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.tvPackage}
                onValueChange={(value) => handleChange("tvPackage", value)}
                enabled={availablePackages.length > 0}
                style={styles.picker}
              >
                <Picker.Item label="-- Select Package --" value="" />
                {availablePackages.map((pkg, i) => (
                  <Picker.Item key={i} label={pkg.PACKAGE_NAME} value={pkg.PACKAGE_ID} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Amount */}
          {form.tvPackage && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount</Text>
              <View style={styles.amountContainer}>
                <Text style={styles.amountText}>{packageAmount}</Text>
              </View>
            </View>
          )}

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.textInput}
              value={form.phone}
              onChangeText={(value) => handleChange("phone", value)}
              placeholder="e.g. 08012345678"
              keyboardType="phone-pad"
            />
          </View>

          {/* PIN */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Transaction PIN</Text>
            <TextInput
              style={styles.textInput}
              value={form.pin}
              onChangeText={(value) => handleChange("pin", value)}
              maxLength={4}
              placeholder="4-digit PIN"
              secureTextEntry
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (loading || verifyingSmartcardNumber) && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={loading || verifyingSmartcardNumber}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="white" />
                <Text style={styles.buttonText}>Processing...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Subscribe</Text>
            )}
          </TouchableOpacity>
          <Toast config={ToastUi} />
        </View>

        {/* <TvHelp data={form} /> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginVertical: 16,
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
    marginBottom: 32,
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
  textInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "white",
  },
  inputWithIcon: {
    position: "relative",
  },
  spinner: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    backgroundColor: "white",
  },
  picker: {
    height: 50,
  },
  customerName: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 8,
  },
  errorText: {
    color: "#ef4444",
  },
  successText: {
    color: "#10b981",
  },
  amountContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f9fafb",
  },
  amountText: {
    fontSize: 16,
    color: "#374151",
  },
  submitButton: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

export default BuyTv;