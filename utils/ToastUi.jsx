import { View, Text, StyleSheet } from 'react-native';

const  ToastUi = {
  success: (props) => (
    <View style={toastStyles.successToast}>
      <View style={toastStyles.iconContainer}>
        <Text style={toastStyles.successIcon}>✓</Text>
      </View>
      <View style={toastStyles.textContainer}>
        <Text style={toastStyles.successTitle}>{props.text1}</Text>
        <Text style={toastStyles.successMessage}>{props.text2}</Text>
      </View>
    </View>
  ),
  
  error: (props) => (
    <View style={toastStyles.errorToast}>
      <View style={toastStyles.iconContainer}>
        <Text style={toastStyles.errorIcon}>✕</Text>
      </View>
      <View style={toastStyles.textContainer}>
        <Text style={toastStyles.errorTitle}>{props.text1}</Text>
        <Text style={toastStyles.errorMessage}>{props.text2}</Text>
      </View>
    </View>
  ),
  info: (props) => (
    <View style={toastStyles.infoToast}>
      <View style={toastStyles.iconContainer}>
        <Text style={toastStyles.errorIcon}>✕</Text>
      </View>
      <View style={toastStyles.textContainer}>
        <Text style={toastStyles.errorTitle}>{props.text1}</Text>
        <Text style={toastStyles.errorMessage}>{props.text2}</Text>
      </View>
    </View>
  ),
};

// Toast styles
const toastStyles = StyleSheet.create({
  // Success Toast
  successToast: {
    height: 70,
    width: '90%',
    backgroundColor: '#10b981',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 999,
    zIndex:999,
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
    position:"absolute"
  },
  
  // Error Toast
  errorToast: {
    height: 70,
    width: '90%',
    backgroundColor: '#ef4444',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 999,
    zIndex:999,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
    position: 'absolute'
  },

  // Info Toast
  infoToast: {
    height: 70,
    width: '90%',
    backgroundColor: '#36e0e6ff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 999,
    zIndex:999,
    borderLeftWidth: 4,
    borderLeftColor: '#10dee6ff',
    position: 'absolute'
  },
  
  // Icon containers
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  
  successIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  
  errorIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  
  // Text containers
  textContainer: {
    flex: 1,
  },
  
  successTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  
  successMessage: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  
  errorMessage: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
});

export default ToastUi
