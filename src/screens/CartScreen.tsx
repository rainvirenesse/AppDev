import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '../components/AppHeader';
import ProductImage from '../components/ProductImage';
import {
  removeCartApi,
  syncCart,
  updateCartApi,
} from '../app/actions';
import { ShopState } from '../app/reducers/shop';
import { CartItem } from '../types/product.types';
import { ROUTES } from '../utils';
import { COLORS, formatPrice } from '../utils/theme';

const CartScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { cart, cartLoading, cartError } = useSelector(
    (state: { shop: ShopState }) => state.shop,
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(syncCart());
    }, [dispatch]),
  );

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = cart.length > 0 ? 150 : 0;
  const total = subtotal + shipping;

  const changeQuantity = (item: CartItem, nextQty: number) => {
    if (nextQty <= 0) {
      if (item.lineId) {
        dispatch(
          removeCartApi({
            lineId: item.lineId,
            productId: item.productId,
            size: item.size,
          }),
        );
      }
      return;
    }

    const maxStock =
      item.product.sizes.find(s => s.size === item.size)?.stock ?? 99;

    if (nextQty > maxStock) {
      Alert.alert('Stock Limit', 'No more stock available for this item.');
      return;
    }

    if (item.lineId) {
      dispatch(
        updateCartApi({
          lineId: item.lineId,
          productId: item.productId,
          size: item.size,
          quantity: nextQty,
        }),
      );
    }
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.item}>
      <ProductImage
        product={item.product}
        containerStyle={styles.thumbWrap}
        style={styles.thumb}
      />
      <View style={styles.itemBody}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={styles.itemMeta}>
          Size {item.size} · {formatPrice(item.product.price)} each
        </Text>
        <View style={styles.itemFooter}>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => changeQuantity(item, item.quantity - 1)}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qty}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => changeQuantity(item, item.quantity + 1)}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.lineTotal}>
            {formatPrice(item.product.price * item.quantity)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (item.lineId) {
              dispatch(
                removeCartApi({
                  lineId: item.lineId,
                  productId: item.productId,
                  size: item.size,
                }),
              );
            }
          }}
        >
          <Text style={styles.remove}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <AppHeader title="My Cart" onBack={() => navigation.goBack()} />

      {cartError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{cartError}</Text>
        </View>
      )}

      {cart.length === 0 ? (
        <View style={styles.empty}>
          {cartLoading && (
            <ActivityIndicator size="small" color={COLORS.burgundy} />
          )}
          <Text style={styles.emptyIcon}>🛍️</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>
            Browse our collection and add your favorite pairs
          </Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.navigate(ROUTES.PRODUCTS as never)}
          >
            <Text style={styles.shopBtnText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={item =>
              item.lineId
                ? `line-${item.lineId}`
                : `${item.productId}-${item.size}`
            }
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>{formatPrice(shipping)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => navigation.navigate(ROUTES.CHECKOUT as never)}
            >
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
    paddingBottom: 8,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  thumbWrap: {
    width: 88,
    height: 88,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumb: {
    width: 88,
    height: 88,
    borderRadius: 8,
  },
  itemBody: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.burgundy,
  },
  itemMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.burgundy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: '600',
  },
  qty: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.burgundy,
    minWidth: 20,
    textAlign: 'center',
  },
  lineTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.burgundy,
  },
  remove: {
    fontSize: 12,
    color: COLORS.danger,
    marginTop: 6,
  },
  summary: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.burgundy,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gold,
  },
  checkoutBtn: {
    backgroundColor: COLORS.burgundy,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  errorBanner: {
    margin: 12,
    padding: 12,
    backgroundColor: '#fdecea',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  errorBannerText: {
    color: COLORS.danger,
    fontSize: 13,
    textAlign: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    marginTop: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.burgundy,
  },
  emptySub: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  shopBtn: {
    marginTop: 24,
    backgroundColor: COLORS.gold,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
  },
  shopBtnText: {
    color: COLORS.burgundy,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

export default CartScreen;
