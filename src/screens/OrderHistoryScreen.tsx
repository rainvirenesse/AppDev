import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '../components/AppHeader';
import { fetchOrders } from '../app/actions';
import { OrdersState } from '../app/reducers/orders';
import { Order } from '../api/orders';
import { COLORS, formatPrice } from '../utils/theme';

const OrderHistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { items, isLoading, isError, errorMessage } = useSelector(
    (state: { orders: OrdersState }) => state.orders,
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchOrders());
    }, [dispatch]),
  );

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderNumber}>#{item.orderNumber}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
      <Text style={styles.meta}>
        {new Date(item.orderedAt).toLocaleDateString()} · Payment:{' '}
        {item.paymentStatus}
      </Text>
      <Text style={styles.total}>{formatPrice(item.totalPrice)}</Text>
      {item.items && item.items.length > 0 && (
        <View style={styles.items}>
          {item.items.map(line => (
            <Text key={line.id} style={styles.lineItem}>
              {line.name} × {line.quantity} — {formatPrice(line.lineTotal)}
            </Text>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <AppHeader title="Order History" onBack={() => navigation.goBack()} />

      <FlatList
        data={items}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => dispatch(fetchOrders())}
            tintColor={COLORS.burgundy}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            {isLoading ? (
              <ActivityIndicator size="large" color={COLORS.burgundy} />
            ) : isError ? (
              <>
                <Text style={styles.errorText}>{errorMessage}</Text>
                <TouchableOpacity
                  style={styles.retryBtn}
                  onPress={() => dispatch(fetchOrders())}
                >
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.emptyText}>No orders yet</Text>
            )}
          </View>
        }
        renderItem={renderOrder}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  list: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.burgundy,
  },
  status: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.gold,
    textTransform: 'uppercase',
  },
  meta: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 6,
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.burgundy,
    marginTop: 8,
  },
  items: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  lineItem: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  empty: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: COLORS.burgundy,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryText: {
    color: COLORS.gold,
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: 12,
  },
});

export default OrderHistoryScreen;
