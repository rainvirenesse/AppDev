import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '../components/AppHeader';
import { clearCart, fetchOrders, fetchProducts, syncCart } from '../app/actions';
import { clearServerCart } from '../api/cart';
import { ApiRequestError } from '../api/client';
import { createOrderFromCart } from '../api/orders';
import { processPayment } from '../api/payments';
import { ShopState } from '../app/reducers/shop';
import { ROUTES } from '../utils';
import { COLORS, formatPrice } from '../utils/theme';

const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { cart } = useSelector((state: { shop: ShopState }) => state.shop);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = cart.length > 0 ? 150 : 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      Alert.alert('Missing Information', 'Please fill in all delivery details.');
      return;
    }
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Add items to your cart before checkout.');
      return;
    }

    const deliveryNotes = [
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      `Address: ${address.trim()}`,
      `City: ${city.trim()}`,
    ].join('\n');

    setPlacing(true);
    try {
      const order = await createOrderFromCart(deliveryNotes);
      await processPayment(order.id, paymentMethod, phone.trim());
      await clearServerCart();
      dispatch(clearCart());
      dispatch(syncCart());
      dispatch(fetchProducts());
      dispatch(fetchOrders());

      Alert.alert(
        'Order Placed',
        `Thank you, ${name.trim()}! Order #${order.orderNumber} totaling ${formatPrice(order.totalPrice)} has been confirmed.`,
        [
          {
            text: 'Continue Shopping',
            onPress: () => navigation.navigate(ROUTES.PRODUCTS as never),
          },
        ],
      );
    } catch (error: unknown) {
      const message =
        error instanceof ApiRequestError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Checkout failed. Please try again.';
      Alert.alert('Checkout Failed', message);
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader title="Checkout" onBack={() => navigation.goBack()} />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No items to checkout</Text>
          <TouchableOpacity
            style={styles.backShop}
            onPress={() => navigation.navigate(ROUTES.PRODUCTS as never)}
          >
            <Text style={styles.backShopText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <AppHeader title="Checkout" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Jane Doe"
            placeholderTextColor={COLORS.textMuted}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="09XX XXX XXXX"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Street Address</Text>
          <TextInput
            style={[styles.input, styles.inputMulti]}
            value={address}
            onChangeText={setAddress}
            placeholder="House no., street, barangay"
            placeholderTextColor={COLORS.textMuted}
            multiline
          />

          <Text style={styles.label}>City / Province</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="Manila, Metro Manila"
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cart.map(item => (
            <View key={`${item.productId}-${item.size}`} style={styles.orderLine}>
              <Text style={styles.orderName} numberOfLines={1}>
                {item.product.name} × {item.quantity}
              </Text>
              <Text style={styles.orderMeta}>Size {item.size}</Text>
              <Text style={styles.orderPrice}>
                {formatPrice(item.product.price * item.quantity)}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text>{formatPrice(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping</Text>
            <Text>{formatPrice(shipping)}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={styles.grandLabel}>Total</Text>
            <Text style={styles.grandValue}>{formatPrice(total)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {(['COD', 'GCASH', 'CARD'] as const).map(method => (
            <TouchableOpacity
              key={method}
              style={[
                styles.paymentOption,
                paymentMethod === method && styles.paymentOptionActive,
              ]}
              onPress={() => setPaymentMethod(method)}
            >
              <Text
                style={[
                  styles.paymentOptionText,
                  paymentMethod === method && styles.paymentOptionTextActive,
                ]}
              >
                {method === 'COD'
                  ? 'Cash on Delivery'
                  : method === 'GCASH'
                    ? 'GCash'
                    : 'Card'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.placeBtn, placing && styles.placeBtnDisabled]}
          onPress={handlePlaceOrder}
          disabled={placing}
        >
          <Text style={styles.placeBtnText}>
            {placing ? 'Placing Order...' : `Place Order · ${formatPrice(total)}`}
          </Text>
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
  scroll: {
    padding: 16,
    paddingBottom: 24,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.burgundy,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.burgundy,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textDark,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputMulti: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  orderLine: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  orderName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.burgundy,
  },
  orderMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  orderPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gold,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  totalLabel: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  grandTotal: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  grandLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.burgundy,
  },
  grandValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gold,
  },
  paymentOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  paymentOptionActive: {
    borderColor: COLORS.burgundy,
    backgroundColor: COLORS.burgundy,
  },
  paymentOptionText: {
    fontSize: 14,
    color: COLORS.burgundy,
    fontWeight: '500',
  },
  paymentOptionTextActive: {
    color: COLORS.gold,
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  placeBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  placeBtnDisabled: {
    opacity: 0.7,
  },
  placeBtnText: {
    color: COLORS.burgundy,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 15,
  },
  backShop: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.burgundy,
    borderRadius: 24,
  },
  backShopText: {
    color: COLORS.gold,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontSize: 12,
  },
});

export default CheckoutScreen;
