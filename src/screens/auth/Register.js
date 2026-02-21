// import { Text, View } from 'react-native';

// const Register = () => {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text style={{ fontSize: 20 }}>Register</Text>
//     </View>
//   );
// };

// export default Register;
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import { ROUTES } from '../../utils';
import { IMAGES } from '../../utils/image';

const Login = () => {
  const [emailAdd, setEmailAdd] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const handleLogin = () => {
    // Check empty fields
    if (emailAdd === '' || password === '') {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    // Check valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAdd)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    // Check password length
    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters.');
      return;
    }

    // All good
    navigation.navigate(ROUTES.HOME);
  };

  return (
    <View style={styles.screen}>

      {/* ── Red Header ── */}
      <View style={styles.header}>
        <View style={[styles.bubble, styles.bubbleLarge]} />
        <View style={[styles.bubble, styles.bubbleMedium]} />
        <View style={[styles.bubble, styles.bubbleSmall]} />

        <View style={styles.menuDots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* Logo centered in header */}
        <View style={styles.logoContainer}>
          <Image
            source={IMAGES.logo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* ── White Card ── */}
      <View style={styles.card}>

        <CustomTextInput
          label="Email Address"
          placeholder="example@gmail.com"
          value={val => setEmailAdd(val)}
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={styles.inputContainer}
          labelStyle={styles.inputLabel}
          textStyle={styles.inputText}
        />

        <CustomTextInput
          label="Password"
          placeholder="••••••••••"
          value={val => setPassword(val)}
          secureTextEntry
          containerStyle={styles.inputContainer}
          labelStyle={styles.inputLabel}
          textStyle={styles.inputText}
        />

        <TouchableOpacity style={styles.forgotRow}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <CustomButton
          label="REGISTER"
          onPress={handleLogin}
          containerStyle={styles.button}
          textStyle={styles.buttonText}
        />
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#072110',
  },

  // header
  header: {
    height: '35%',
    backgroundColor: '#072110',
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 28,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',   // centers logo vertically
    alignItems: 'center',       // centers logo horizontally
  },
  menuDots: {
    position: 'absolute',
    top: 60,
    right: 24,
    flexDirection: 'row',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 2,
  },

  //logo
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 130,
  },

  //bubbles
  bubble: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#71a76ba5',
  },
  bubbleLarge: {
    width: 160,
    height: 160,
    top: -50,
    right: -40,
    opacity: 0.6,
  },
  bubbleMedium: {
    width: 100,
    height: 100,
    top: 50,
    right: 70,
    opacity: 0.35,
  },
  bubbleSmall: {
    width: 65,
    height: 65,
    bottom: 10,
    right: 10,
    opacity: 0.25,
  },

  // white card
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 28,
    paddingTop: 40,
  },

  // inputs
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#072110',
    marginBottom: 8,
  },
  inputText: {
    fontSize: 14,
    color: '#2A0A10',
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: -8,
    marginBottom: 4,
  },
  forgotText: {
    fontSize: 12,
    color: '#A08090',
    textDecorationLine: 'underline',
  },

  // button
  button: {
    marginTop: 24,
    width: '38%',
    alignSelf: 'center',
    backgroundColor: '#074b13',
    borderRadius: 50,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 2,
    textAlign: 'center',
  },

  // footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 32,
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 13,
    color: '#A08090',
  },
  footerLink: {
    fontSize: 13,
    color: '#074b13',
    fontWeight: '800',
  },
});