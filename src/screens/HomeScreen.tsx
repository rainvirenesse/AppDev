import  { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../utils';
import React from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
// import { resetLogin } from '../app/reducers/auth';
import { resetLogin } from '../app/actions';
import CustomCom from '../components/CustomCom';

const BRAND = '#35051d';
const GOLD  = '#C9A96E';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch   = useDispatch();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND} />

      {/* ── Hero ── */}
      <View style={styles.hero}>
        <Image
          source={require('../assets/RAIN_logo_transparent.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Fashion At Your Feet</Text>
      </View>

      {/* ── Bottom Buttons ── */}
      <View style={styles.bottom}>
        {/* <TouchableOpacity
          style={styles.btnPrimary}
          activeOpacity={0.85}
          onPress={() => navigation.navigate(ROUTES.REGISTER)}
        >
          <Text style={styles.btnPrimaryText}>Get Started</Text>
        </TouchableOpacity> */}

        <CustomCom
          label="Shop Now"
          onPress={() => navigation.navigate(ROUTES.PRODUCTS as never)}
          loading={false}
        />

        <TouchableOpacity
          style={styles.btnSecondary}
          activeOpacity={0.75}
          onPress={() => navigation.navigate(ROUTES.PROFILE as never)}
        >
          <Text style={styles.btnSecondaryText}>My Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          activeOpacity={0.75}
          onPress={() => dispatch(resetLogin())}
        >
          <Text style={styles.btnSecondaryText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND,
  },

  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
  },

  logoImage: {
    width: 100,
    height: 180,
  },

  bottom: {
    paddingHorizontal: 28,
    paddingBottom: 48,
    gap: 12,
  },

  btnPrimary: {
    backgroundColor: GOLD,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: BRAND,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  btnSecondary: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  tagline: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '300',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 200,
  }
});

export default HomeScreen;