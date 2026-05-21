import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProductImage from './ProductImage';
import { Product } from '../types/product.types';
import { getTotalStock } from '../utils/productHelpers';
import { COLORS, formatPrice } from '../utils/theme';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onPress: () => void;
  onFavoritePress: () => void;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  onPress,
  onFavoritePress,
  onAddToCart,
}) => {
  const totalStock = getTotalStock(product);
  const availableSizes = product.sizes
    .filter(s => s.stock > 0)
    .map(s => s.size)
    .join(', ');

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.92}>
      <View style={styles.imageWrap}>
        <ProductImage
          key={`${product.id}-${product.updatedAt ?? ''}`}
          product={product}
          style={styles.image}
        />
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={onFavoritePress}
          hitSlop={8}
        >
          <Text style={styles.heart}>{isFavorite ? '♥' : '♡'}</Text>
        </TouchableOpacity>
        {totalStock <= 3 && totalStock > 0 && (
          <View style={styles.lowStock}>
            <Text style={styles.lowStockText}>Low Stock</Text>
          </View>
        )}
        {totalStock === 0 && (
          <View style={styles.soldOut}>
            <Text style={styles.soldOutText}>Sold Out</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <Text style={styles.sizes} numberOfLines={1}>
          Sizes: {availableSizes || '—'}
        </Text>
        <Text style={styles.stock}>
          {totalStock > 0 ? `${totalStock} in stock` : 'Out of stock'}
        </Text>
        <Text style={styles.desc} numberOfLines={2}>
          {product.description}
        </Text>

        <TouchableOpacity
          style={[styles.addBtn, totalStock === 0 && styles.addBtnDisabled]}
          onPress={onAddToCart}
          disabled={totalStock === 0}
          activeOpacity={0.85}
        >
          <Text style={styles.addBtnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    margin: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: COLORS.burgundy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  imageWrap: {
    aspectRatio: 1,
    backgroundColor: COLORS.offWhite,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: {
    fontSize: 18,
    color: COLORS.burgundy,
  },
  lowStock: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: COLORS.gold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  lowStockText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.burgundy,
    textTransform: 'uppercase',
  },
  soldOut: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(53,5,29,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldOutText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  body: {
    padding: 10,
  },
  category: {
    fontSize: 10,
    color: COLORS.gold,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.burgundy,
    marginTop: 2,
    lineHeight: 18,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.burgundy,
    marginTop: 4,
  },
  sizes: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  stock: {
    fontSize: 11,
    color: COLORS.success,
    marginTop: 2,
    fontWeight: '500',
  },
  desc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
    lineHeight: 15,
  },
  addBtn: {
    marginTop: 8,
    backgroundColor: COLORS.burgundy,
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addBtnDisabled: {
    backgroundColor: COLORS.textMuted,
    opacity: 0.5,
  },
  addBtnText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default ProductCard;
