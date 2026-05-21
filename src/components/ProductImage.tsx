import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  PLACEHOLDER_IMAGE,
  isPlaceholderImage,
  resolveProductImageUrl,
} from '../api/mappers/productMapper';
import { Product } from '../types/product.types';
import { COLORS } from '../utils/theme';

type ProductImageProps = {
  /** Full product model from API */
  product?: Product;
  /** Direct URI (resolved or raw — will be normalized) */
  uri?: string | null;
  cacheKey?: string | null;
  alt?: string;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ImageStyle>;
};

export function ProductImage({
  product,
  uri,
  cacheKey,
  alt,
  containerStyle,
  style,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  const displayUri = useMemo(() => {
    if (failed) {
      return PLACEHOLDER_IMAGE;
    }
    const raw = uri ?? product?.imageRaw ?? product?.image;
    const key = cacheKey ?? product?.updatedAt ?? null;
    const resolved = resolveProductImageUrl(raw, key);
    if (product?.hasImage === false && !product?.imageRaw) {
      return PLACEHOLDER_IMAGE;
    }
    return resolved;
  }, [uri, product, cacheKey, failed]);

  const showPlaceholder = failed || isPlaceholderImage(displayUri);

  return (
    <View style={[styles.container, containerStyle]}>
      {loading && !showPlaceholder && (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color={COLORS.burgundy} />
        </View>
      )}

      {showPlaceholder ? (
        <View style={[styles.placeholder, style]}>
          <Text style={styles.placeholderIcon}>👠</Text>
          <Text style={styles.placeholderText}>No image</Text>
        </View>
      ) : (
        <Image
          source={{ uri: displayUri }}
          style={[styles.image, style]}
          resizeMode="cover"
          accessibilityLabel={alt ?? product?.name ?? 'Product image'}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setFailed(true);
            setLoading(false);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.offWhite,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.offWhite,
    zIndex: 1,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    minHeight: 120,
    backgroundColor: COLORS.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  placeholderText: {
    color: COLORS.burgundy,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
});

export default ProductImage;
