export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
  message: string;
  error?: string;
}

/** Raw product shape returned by Symfony API Platform */
export interface ApiProductSize {
  size?: string;
  label?: string;
  stock?: number;
  quantity?: number;
}

export interface ApiProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  status?: string;
  category?: string;
  stock?: number;
  image?: string;
  imageUrl?: string;
  imagePath?: string | null;
  sizes?: ApiProductSize[];
  productSizes?: ApiProductSize[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}
