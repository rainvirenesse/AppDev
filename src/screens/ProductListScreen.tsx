import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '../components/AppHeader';
import ProductCard from '../components/ProductCard';
import { fetchProducts, toggleFavorite } from '../app/actions';
import { ProductsState } from '../app/reducers/products';
import { ShopState } from '../app/reducers/shop';
import { Product } from '../types/product.types';
import { ROUTES, buildCategoryFilters } from '../utils';
import { COLORS } from '../utils/theme';

type MainStackParamList = {
  [ROUTES.PRODUCTS]: undefined;
  [ROUTES.PRODUCT_DETAIL]: { productId: string };
  [ROUTES.CART]: undefined;
};

const ProductListScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const dispatch = useDispatch();

  const { cart, favorites } = useSelector(
    (state: { shop: ShopState }) => state.shop,
  );
  const { items, isLoading, isError, errorMessage } = useSelector(
    (state: { products: ProductsState }) => state.products,
  );

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const categories = useMemo(() => buildCategoryFilters(items), [items]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProducts());
    }, [dispatch]),
  );

  const filteredProducts = useMemo(() => {
    return items.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || p.category === category;
      const matchesFavorite = !showFavoritesOnly || favorites.includes(p.id);
      return matchesSearch && matchesCategory && matchesFavorite;
    });
  }, [items, search, category, showFavoritesOnly, favorites]);

  const openDetail = (productId: string) => {
    navigation.navigate(ROUTES.PRODUCT_DETAIL, { productId });
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      isFavorite={favorites.includes(item.id)}
      onPress={() => openDetail(item.id)}
      onFavoritePress={() => dispatch(toggleFavorite(item.id))}
      onAddToCart={() => openDetail(item.id)}
    />
  );

  const listEmpty = () => {
    if (isLoading && items.length === 0) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.burgundy} />
          <Text style={styles.statusText}>Loading products...</Text>
        </View>
      );
    }
    if (isError) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => dispatch(fetchProducts())}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No products found</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={styles.headerBg}>
        <AppHeader
          title="Women's Footwear"
          onBack={() => navigation.goBack()}
          onCartPress={() => navigation.navigate(ROUTES.CART)}
          cartCount={cartCount}
          light
        />
        <Text style={styles.subtitle}>Live catalog from your store</Text>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search shoes..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          style={[styles.favFilter, showFavoritesOnly && styles.favFilterActive]}
          onPress={() => setShowFavoritesOnly(v => !v)}
        >
          <Text
            style={[
              styles.favFilterText,
              showFavoritesOnly && styles.favFilterTextActive,
            ]}
          >
            ♥ Saved
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={categories}
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
        contentContainerStyle={styles.categoriesContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, category === item && styles.chipActive]}
            onPress={() => setCategory(item)}
          >
            <Text
              style={[styles.chipText, category === item && styles.chipTextActive]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => dispatch(fetchProducts())}
            tintColor={COLORS.burgundy}
            colors={[COLORS.burgundy]}
          />
        }
        ListEmptyComponent={listEmpty}
        renderItem={renderProduct}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  headerBg: {
    backgroundColor: COLORS.burgundy,
    paddingBottom: 16,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    textAlign: 'center',
    letterSpacing: 1,
    paddingHorizontal: 24,
    marginTop: -4,
  },
  searchWrap: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 8,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textDark,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  favFilter: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.burgundy,
    backgroundColor: COLORS.white,
  },
  favFilterActive: {
    backgroundColor: COLORS.burgundy,
  },
  favFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.burgundy,
  },
  favFilterTextActive: {
    color: COLORS.gold,
  },
  categories: {
    maxHeight: 48,
    marginTop: 8,
  },
  categoriesContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: COLORS.burgundy,
    borderColor: COLORS.burgundy,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.burgundy,
    fontWeight: '500',
  },
  chipTextActive: {
    color: COLORS.gold,
  },
  list: {
    paddingHorizontal: 6,
    paddingBottom: 24,
    paddingTop: 8,
    flexGrow: 1,
  },
  centered: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  statusText: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginTop: 12,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 14,
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
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontSize: 12,
  },
});

export default ProductListScreen;
