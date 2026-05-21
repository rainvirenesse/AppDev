import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '../components/AppHeader';
import ProductImage from '../components/ProductImage';
import { addToCartApi, fetchProduct, toggleFavorite } from '../app/actions';
import { ProductsState } from '../app/reducers/products';
import { ShopState } from '../app/reducers/shop';
import { ROUTES } from '../utils';
import { getTotalStock } from '../utils/productHelpers';
import { COLORS, formatPrice } from '../utils/theme';

type Params = { productId: string };

const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<Record<string, object | undefined>>>();
  const route = useRoute<RouteProp<Record<string, Params>, string>>();
  const dispatch = useDispatch();
  const productId = route.params.productId;

  const { cart, favorites, cartError, lastCartMessage } = useSelector(
    (state: { shop: ShopState }) => state.shop,
  );
  const { items, selectedProduct, isDetailLoading, isError, errorMessage } =
    useSelector((state: { products: ProductsState }) => state.products);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const product =
    selectedProduct?.id === productId
      ? selectedProduct
      : items.find(p => p.id === productId);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProduct(productId));
      setSelectedSize(null);
      setQuantity(1);
    }, [dispatch, productId]),
  );

  if (isDetailLoading && !product) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader title="Product" onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.burgundy} />
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader title="Product" onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Text style={styles.error}>
            {isError ? errorMessage : 'Product not found'}
          </Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => dispatch(fetchProduct(productId))}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isFavorite = favorites.includes(product.id);
  const sizeEntry = product.sizes.find(s => s.size === selectedSize);
  const maxQty = sizeEntry?.stock ?? 0;
  const totalStock = getTotalStock(product);

  const lastMessageRef = React.useRef<string | null>(null);

  useEffect(() => {
    if (lastCartMessage && lastCartMessage !== lastMessageRef.current) {
      lastMessageRef.current = lastCartMessage;
      Alert.alert('Added to Cart', lastCartMessage);
    }
  }, [lastCartMessage]);

  useEffect(() => {
    if (cartError) {
      Alert.alert('Cart Error', cartError);
    }
  }, [cartError]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      Alert.alert('Select Size', 'Please choose a size before adding to cart.');
      return;
    }
    if (maxQty === 0) {
      Alert.alert('Out of Stock', 'This size is currently unavailable.');
      return;
    }
    dispatch(
      addToCartApi({
        product,
        size: selectedSize,
        quantity,
      }),
    );
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      Alert.alert('Select Size', 'Please choose a size to continue.');
      return;
    }
    dispatch(addToCartApi({ product, size: selectedSize, quantity }));
    navigation.navigate(ROUTES.CART as never);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <AppHeader
        title={product.category}
        onBack={() => navigation.goBack()}
        onCartPress={() => navigation.navigate(ROUTES.CART as never)}
        cartCount={cartCount}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrap}>
          <ProductImage
            key={`${product.id}-${product.updatedAt ?? ''}`}
            product={product}
            style={styles.image}
          />
          <TouchableOpacity
            style={styles.favBtn}
            onPress={() => dispatch(toggleFavorite(product.id))}
          >
            <Text style={styles.favIcon}>{isFavorite ? '♥' : '♡'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Text style={styles.stockLine}>
            {totalStock > 0
              ? `${totalStock} units in stock`
              : 'Currently out of stock'}
          </Text>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <Text style={styles.sectionTitle}>Select Size</Text>
          <View style={styles.sizeRow}>
            {product.sizes.map(({ size, stock }) => {
              const active = selectedSize === size;
              const disabled = stock === 0;
              return (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeChip,
                    active && styles.sizeChipActive,
                    disabled && styles.sizeChipDisabled,
                  ]}
                  onPress={() => {
                    if (!disabled) {
                      setSelectedSize(size);
                      setQuantity(1);
                    }
                  }}
                  disabled={disabled}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      active && styles.sizeTextActive,
                      disabled && styles.sizeTextDisabled,
                    ]}
                  >
                    {size}
                  </Text>
                  <Text style={styles.sizeStock}>
                    {stock > 0 ? `${stock} left` : '—'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(q => Math.max(1, q - 1))}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() =>
                setQuantity(q => (maxQty > 0 ? Math.min(maxQty, q + 1) : q))
              }
              disabled={!selectedSize || quantity >= maxQty}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
            {selectedSize && (
              <Text style={styles.qtyHint}>Max: {maxQty}</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
          <Text style={styles.cartBtnText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow}>
          <Text style={styles.buyBtnText}>Buy Now</Text>
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  error: {
    textAlign: 'center',
    color: COLORS.textMuted,
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
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  imageWrap: {
    backgroundColor: COLORS.white,
    aspectRatio: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  favIcon: {
    fontSize: 24,
    color: COLORS.burgundy,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.burgundy,
    lineHeight: 28,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.gold,
    marginTop: 8,
  },
  stockLine: {
    fontSize: 13,
    color: COLORS.success,
    marginTop: 6,
    marginBottom: 8,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.burgundy,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textMuted,
  },
  sizeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sizeChip: {
    minWidth: 56,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  sizeChipActive: {
    borderColor: COLORS.burgundy,
    backgroundColor: COLORS.burgundy,
  },
  sizeChipDisabled: {
    opacity: 0.4,
  },
  sizeText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.burgundy,
  },
  sizeTextActive: {
    color: COLORS.gold,
  },
  sizeTextDisabled: {
    color: COLORS.textMuted,
  },
  sizeStock: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.burgundy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    color: COLORS.gold,
    fontSize: 20,
    fontWeight: '600',
  },
  qtyValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.burgundy,
    minWidth: 32,
    textAlign: 'center',
  },
  qtyHint: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cartBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: COLORS.burgundy,
    alignItems: 'center',
  },
  cartBtnText: {
    color: COLORS.burgundy,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  buyBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 28,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
  },
  buyBtnText: {
    color: COLORS.burgundy,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

export default ProductDetailScreen;
