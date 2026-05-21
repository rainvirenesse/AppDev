import { API_BASE_URL } from '../client';
import { ApiProduct, ApiProductSize } from '../../types/api.types';
import { Product, SizeStock } from '../../types/product.types';

export const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd1?w=600&q=80';

const DEFAULT_SIZES = ['5', '6', '7', '8', '9'];

/** Collect image path/URL from Symfony API (dashboard uploads vary by field name). */
export function extractRawImageSource(apiProduct: ApiProduct): string | null {
  const record = apiProduct as ApiProduct & Record<string, unknown>;
  const candidates = [
    apiProduct.imageUrl,
    apiProduct.image,
    apiProduct.imagePath,
    record.thumbnail as string | undefined,
    record.picture as string | undefined,
    record.photo as string | undefined,
  ];

  const media = record.media as { url?: string; contentUrl?: string } | undefined;
  if (media?.contentUrl) {
    candidates.unshift(media.contentUrl);
  }
  if (media?.url) {
    candidates.unshift(media.url);
  }

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim() !== '') {
      return value.trim();
    }
  }
  return null;
}

/**
 * Build a loadable image URL for React Native Image.
 * Supports absolute URLs, site-relative paths, and /uploads/ paths from Symfony.
 */
export function resolveProductImageUrl(
  raw?: string | null,
  cacheKey?: string | null,
): string {
  if (!raw || raw.trim() === '') {
    return PLACEHOLDER_IMAGE;
  }

  const trimmed = raw.trim();
  let url: string;

  if (/^https?:\/\//i.test(trimmed)) {
    url = trimmed;
  } else if (trimmed.startsWith('//')) {
    url = `http:${trimmed}`;
  } else {
    const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    const base = API_BASE_URL.replace(/\/$/, '');
    url = `${base}${path}`;
  }

  if (cacheKey) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}v=${encodeURIComponent(cacheKey)}`;
  }

  return url;
}

export function isPlaceholderImage(url: string): boolean {
  return !url || url === PLACEHOLDER_IMAGE;
}

function mapApiSizes(apiProduct: ApiProduct): SizeStock[] {
  const raw = apiProduct.sizes ?? apiProduct.productSizes ?? [];

  if (raw.length > 0) {
    return raw.map(entry => ({
      size: String(entry.size ?? entry.label ?? 'Standard'),
      stock: Number(entry.stock ?? entry.quantity ?? 0),
    }));
  }

  const stock = Number(apiProduct.stock ?? 0);
  if (stock > 0) {
    return [{ size: 'Standard', stock }];
  }

  return DEFAULT_SIZES.map(size => ({ size, stock: 0 }));
}

export function mapApiProductToProduct(apiProduct: ApiProduct): Product {
  const rawImage = extractRawImageSource(apiProduct);
  const cacheKey = apiProduct.updatedAt ?? apiProduct.createdAt ?? null;

  return {
    id: String(apiProduct.id),
    name: apiProduct.name,
    description: apiProduct.description ?? '',
    price: Number(apiProduct.price ?? 0),
    category: apiProduct.category ?? 'General',
    image: resolveProductImageUrl(rawImage, cacheKey),
    imageRaw: rawImage,
    hasImage: Boolean(rawImage),
    updatedAt: apiProduct.updatedAt,
    status: apiProduct.status,
    sizes: mapApiSizes(apiProduct),
  };
}

export function normalizeProductList(payload: unknown): ApiProduct[] {
  if (Array.isArray(payload)) {
    return payload as ApiProduct[];
  }
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record['hydra:member'])) {
      return record['hydra:member'] as ApiProduct[];
    }
    if (Array.isArray(record.member)) {
      return record.member as ApiProduct[];
    }
  }
  return [];
}
