import React, { useEffect, useState } from 'react';
// import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import { ROUTES } from '../../utils';
import { IMAGES } from '../../utils/image';

import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../../app/actions';


import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { _signInWithGoogle } from '../../utils/firebase';
import { userGoogleLogin } from '../../app/api/auth';
import { USER_LOGIN_COMPLETED } from '../../app/actions';

// const Login = () => {
const Login: React.FC = () => {
  const [emailAdd, setEmailAdd] = useState('');
  const [password, setPassword] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  // const { isLoading, isError, errorMessage, data } = useSelector((state: any) => state.auth);
  const { isLoading, isError, errorMessage, data } = useSelector((state: { auth: { isLoading: boolean; isError: boolean; errorMessage: string; data: any } }) => state.auth);
  // const { isLoading, isError, errorMessage, data } = useSelector(state => state.auth);
  

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isError && errorMessage) {
      Alert.alert('Login Failed', errorMessage || 'Email or password is incorrect.');
    }
  }, [isError, errorMessage]);

  useEffect(() => {
    if (data) {
      navigation.navigate(ROUTES.HOME as never);
    }
  }, [data]);

  const handleLogin = () => {
    const email = emailAdd.trim();

    if (email === '' || password === '') {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    dispatch(userLogin({ email, password }));
  };

  // const handleGoogleSignIn = async () => {
  //   const result = await _signInWithGoogle();
  //   if (result?.userInfo) {
  //     dispatch(userLogin({ email: result.userInfo.email, password: '' }));
  //   } else {
  //     Alert.alert('Google Sign-In Failed', 'Please try again.');
  //    }
  // };

 

const handleGoogleSignIn = async () => {
  try {
    setGoogleLoading(true);
    const result = await _signInWithGoogle();

    const idToken = result?.userInfo?.idToken;  // ✅ correct path
    const email = result?.userInfo?.user?.email;

    if (!idToken || !email) {
      Alert.alert('Google Sign-In Failed', 'No token received.');
      return;
    }

    const data = await userGoogleLogin({ idToken });
    console.log('Google login response:', JSON.stringify(data));

    if (data.error) {
      Alert.alert('Login Failed', data.error);
      return;
    }

    dispatch({ type: USER_LOGIN_COMPLETED, payload: data });

  } catch (error: any) {
    Alert.alert('Google Sign-In Error', error?.message || 'Something went wrong.');
  } finally {
    setGoogleLoading(false);
  }
};

  return (
    <View style={styles.screen}>

      <View style={styles.header}>
        {/* <View style={[styles.bubble, styles.bubbleLarge]} />
        <View style={[styles.bubble, styles.bubbleMedium]} />
        <View style={[styles.bubble, styles.bubbleSmall]} /> */}

        <View style={styles.menuDots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <View style={styles.logoContainer}>
          <Image
            source={IMAGES.logo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.card}>

        <CustomTextInput
          label="Email Address"
          placeholder="example@gmail.com"
          value={emailAdd}
          onChangeText={setEmailAdd}
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={styles.inputContainer}
          labelStyle={styles.inputLabel}
          textStyle={styles.inputText}
        />

        <CustomTextInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          containerStyle={styles.inputContainer}
          labelStyle={styles.inputLabel}
          textStyle={styles.inputText}
        />

        <TouchableOpacity style={styles.forgotRow}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <CustomButton
          label="LOGIN"
          onPress={handleLogin}
          containerStyle={styles.button}
          textStyle={styles.buttonText}
          loading={isLoading}
          disabled={googleLoading}
        />

        <View style={styles.googleButtonWrap}>
          <GoogleSigninButton
            style={styles.googleNativeButton}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={handleGoogleSignIn}
            disabled={isLoading || googleLoading}
          />
          {googleLoading ? (
            <View style={styles.googleLoadingOverlay} pointerEvents="auto">
              <ActivityIndicator size="small" color="#35051d" />
            </View>
          ) : null}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.REGISTER as never)}>
            <Text style={styles.footerLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // backgroundColor: '#072110',
    backgroundColor: '#35051d',
  },
  header: {
    height: '35%',
    // backgroundColor: '#072110',
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 28,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
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
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 130,
  },
  // bubble: {
  //   position: 'absolute',
  //   borderRadius: 999,
  //   backgroundColor: '#71a76ba5',
  // },
  // bubbleLarge: {
  //   width: 160,
  //   height: 160,
  //   top: -50,
  //   right: -40,
  //   opacity: 0.6,
  // },
  // bubbleMedium: {
  //   width: 100,
  //   height: 100,
  //   top: 50,
  //   right: 70,
  //   opacity: 0.35,
  // },
  // bubbleSmall: {
  //   width: 65,
  //   height: 65,
  //   bottom: 10,
  //   right: 10,
  //   opacity: 0.25,
  // },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 28,
    paddingTop: 40,
  },
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
  button: {
    marginTop: 24,
    width: '88%',
    maxWidth: 360,
    alignSelf: 'center',
    // backgroundColor: '#074b13',
    backgroundColor: '#35051d',
    borderRadius: 50,
    height: 48,
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
    // color: '#074b13',
    color: '#35051d',
    fontWeight: '800',
  },
  /** White pill shell — same brand tint as LOGIN button (#35051d) for border/spinner. */
  googleButtonWrap: {
    marginTop: 16,
    width: '88%',
    maxWidth: 360,
    alignSelf: 'center',
    height: 48,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(53, 5, 29, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleNativeButton: {
    width: '100%',
    height: 48,
  },
  googleLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
});