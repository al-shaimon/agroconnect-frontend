import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../services/api';

export interface Product {
  _id: string;
  farmerId: string;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  availableQuantity: number;
  imageUrl: string;
  cloudinaryPublicId: string;
  quality: string;
  harvestDate: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/products');
        setProducts(response.data.data || []);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
        toast.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
  };
}