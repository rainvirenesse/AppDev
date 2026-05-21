import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '../components/AppHeader';
import { fetchProfile } from '../api/profile';
import { ApiRequestError } from '../api/client';
import type { CustomerProfile } from '../api/profile';
import { resetLogin } from '../app/actions';
import { LoginResponse } from '../types/api.types';
import { ROUTES } from '../utils';
import { COLORS } from '../utils/theme';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const auth = useSelector(
    (state: { auth: { data: LoginResponse | null } }) => state.auth,
  );

  const [profile, setProfile] = React.useState<CustomerProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProfile();
      setProfile(data);
    } catch (err: unknown) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Failed to load profile';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <AppHeader title="My Account" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.burgundy} />
        ) : error ? (
          <>
            <Text style={styles.error}>{error}</Text>
            <TouchableOpacity style={styles.btn} onPress={loadProfile}>
              <Text style={styles.btnText}>Retry</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>
              {profile?.email ?? auth.data?.user?.email ?? '—'}
            </Text>

            <Text style={styles.label}>Username</Text>
            <Text style={styles.value}>{profile?.username ?? '—'}</Text>

            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>{profile?.status ?? '—'}</Text>
          </>
        )}

        <TouchableOpacity
          style={[styles.btn, styles.btnGold]}
          onPress={() => navigation.navigate(ROUTES.ORDERS as never)}
        >
          <Text style={[styles.btnText, styles.btnTextDark]}>Order History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnOutline]}
          onPress={() => navigation.navigate(ROUTES.PRODUCTS as never)}
        >
          <Text style={styles.btnTextOutline}>Continue Shopping</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnDanger]}
          onPress={() => dispatch(resetLogin())}
        >
          <Text style={styles.btnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  content: {
    padding: 24,
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.gold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 16,
  },
  value: {
    fontSize: 16,
    color: COLORS.burgundy,
    marginTop: 4,
    fontWeight: '500',
  },
  error: {
    color: COLORS.danger,
    marginBottom: 16,
    textAlign: 'center',
  },
  btn: {
    marginTop: 20,
    backgroundColor: COLORS.burgundy,
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnGold: {
    backgroundColor: COLORS.gold,
    marginTop: 32,
  },
  btnOutline: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.burgundy,
  },
  btnDanger: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  btnText: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  btnTextDark: {
    color: COLORS.burgundy,
  },
  btnTextOutline: {
    color: COLORS.burgundy,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

export default ProfileScreen;
