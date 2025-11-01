import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buyerService } from '../../services/buyerService';
import { useCartStore } from '../../store/cartStore';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { COLORS } from '../../constants/theme';
import { ShoppingCart, MapPin, Star, ArrowLeft, Package, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import type { Product, FarmerProduct } from '../../types';
import { toast } from 'react-toastify';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [farmerProducts, setFarmerProducts] = useState<FarmerProduct[]>([]);
  const [stats, setStats] = useState<{
    totalFarmers: number;
    minPrice: number | null;
    maxPrice: number | null;
    avgPrice: number | null;
  } | null>(null);
  const [selectedFarmerProduct, setSelectedFarmerProduct] = useState<FarmerProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'quantity'>('price');
  const [isLoading, setIsLoading] = useState(true);

  const isVerified = user?.verificationStatus === 'approved';

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, sortBy]);

  const fetchProductDetails = async () => {
    try {
      setIsLoading(true);
      const response = await buyerService.getProduct(id!);
      if (response.success && response.data) {
        setProduct(response.data.product);
        setFarmerProducts(response.data.farmers);
        setStats(response.data.stats);
        // Auto-select the cheapest farmer product
        if (response.data.farmers.length > 0) {
          setSelectedFarmerProduct(response.data.farmers[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch product', error);
      toast.error('Failed to load product details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isVerified) {
      toast.error('Please complete verification to purchase products');
      navigate('/profile');
      return;
    }

    if (!selectedFarmerProduct) {
      toast.error('Please select a farmer to buy from');
      return;
    }

    if (quantity > selectedFarmerProduct.availableQuantity) {
      toast.error(`Only ${selectedFarmerProduct.availableQuantity} units available`);
      return;
    }

    // Add farmer product to cart
    const cartProduct = {
      _id: selectedFarmerProduct._id,
      name: product?.name || '',
      description: product?.description || '',
      category: product?.category || '',
      price: selectedFarmerProduct.price,
      unit: product?.unit || '',
      availableQuantity: selectedFarmerProduct.availableQuantity,
      quality: selectedFarmerProduct.quality,
      harvestDate: selectedFarmerProduct.harvestDate,
      isAvailable: selectedFarmerProduct.isAvailable,
      imageUrl: product?.images?.[0],
      farmerId: selectedFarmerProduct.farmerId,
      createdAt: selectedFarmerProduct.createdAt,
      updatedAt: selectedFarmerProduct.updatedAt,
    };

    addItem(cartProduct, quantity);
    toast.success(`Added ${quantity} ${product?.unit} to cart!`);
    navigate('/buyer/cart');
  };

  const getSortedFarmers = () => {
    const sorted = [...farmerProducts];
    sorted.sort((a, b) => {
      if (sortBy === 'price') {
        return a.price - b.price;
      } else if (sortBy === 'rating') {
        return (b.farmerId.rating || 0) - (a.farmerId.rating || 0);
      } else if (sortBy === 'quantity') {
        return b.availableQuantity - a.availableQuantity;
      }
      return 0;
    });
    return sorted;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Product not found</p>
        <Button onClick={() => navigate('/buyer/marketplace')} className="mt-4">
          Back to Marketplace
        </Button>
      </div>
    );
  }

  const sortedFarmers = getSortedFarmers();

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">
      <Button variant="outline" onClick={() => navigate('/buyer/marketplace')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Marketplace
      </Button>

      {/* Verification Alert */}
      {!isVerified && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You must be verified to purchase products. Please upload your verification documents in{' '}
            <button onClick={() => navigate('/profile')} className="underline font-semibold">
              Profile
            </button>{' '}
            and wait for admin approval.
          </AlertDescription>
        </Alert>
      )}

      {/* Product Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Product Image */}
          {product.images && product.images.length > 0 && (
            <div className="w-full md:w-1/3">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-auto rounded-lg object-contain"
              />
            </div>
          )}

          {/* Product Info */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Price Stats */}
            <div className="flex gap-8 items-center">
              <div>
                <div className="text-sm text-gray-600">Lowest Price</div>
                <div className="text-3xl font-bold text-green-600">
                  ৳{stats?.minPrice || 0}
                  <span className="text-base text-gray-500">/{product.unit}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Highest Price</div>
                <div className="text-3xl font-bold text-orange-600">
                  ৳{stats?.maxPrice || 0}
                  <span className="text-base text-gray-500">/{product.unit}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Unit</div>
                <div className="text-2xl font-semibold">1 {product.unit}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Farmers List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Available from {farmerProducts.length} Farmers</h2>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as 'price' | 'rating' | 'quantity')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Price: Low to High</SelectItem>
              <SelectItem value="rating">Rating: High to Low</SelectItem>
              <SelectItem value="quantity">Stock: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {sortedFarmers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>No farmers are currently offering this product</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedFarmers.map((farmerProduct) => {
              const isSelected = selectedFarmerProduct?._id === farmerProduct._id;
              const farmer = farmerProduct.farmerId;

              return (
                <Card
                  key={farmerProduct._id}
                  onClick={() => setSelectedFarmerProduct(farmerProduct)}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-green-600' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      {/* Farmer Avatar & Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-2xl font-semibold text-gray-600">
                            {farmer.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{farmer.name}</h3>
                          {farmer.location && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {farmer.location.area}, {farmer.location.city}
                              </span>
                            </div>
                          )}
                          {farmer.rating !== undefined && (
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(farmer.rating || 0)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-center px-6">
                        <div className="text-sm text-gray-600">Price</div>
                        <div className="text-3xl font-bold" style={{ color: COLORS.primary }}>
                          ৳{farmerProduct.price}
                        </div>
                        <div className="text-sm text-gray-500">per {product.unit}</div>
                      </div>

                      {/* Unit */}
                      <div className="text-center px-6">
                        <div className="text-sm text-gray-600">Unit</div>
                        <div className="text-2xl font-semibold">1 {product.unit}</div>
                      </div>

                      {/* Add to Cart Button */}
                      <div className="pl-6">
                        <Button
                          size="lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFarmerProduct(farmerProduct);
                          }}
                          style={{ backgroundColor: COLORS.primary }}
                          disabled={!isVerified}
                          className="w-24 h-24 rounded-full"
                        >
                          <ShoppingCart className="h-8 w-8" />
                        </Button>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="flex gap-4 mt-4 pt-4 border-t text-sm">
                      <div>
                        <span className="text-gray-600">Quality: </span>
                        <Badge variant="outline">{farmerProduct.quality}</Badge>
                      </div>
                      <div>
                        <span className="text-gray-600">Available: </span>
                        <span className="font-semibold">
                          {farmerProduct.availableQuantity} {product.unit}
                        </span>
                      </div>
                      {farmerProduct.harvestDate && (
                        <div>
                          <span className="text-gray-600">Harvested: </span>
                          <span>{new Date(farmerProduct.harvestDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {farmerProduct.price === stats?.minPrice && (
                        <Badge className="bg-green-600">Lowest Price</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Purchase Dialog */}
      {selectedFarmerProduct && (
        <Card className="sticky bottom-4 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1">
                <div className="text-sm text-gray-600">Buying from</div>
                <div className="text-xl font-bold">{selectedFarmerProduct.farmerId.name}</div>
                <div className="text-lg" style={{ color: COLORS.primary }}>
                  ৳{selectedFarmerProduct.price}/{product.unit}
                </div>
              </div>

              <div className="w-32">
                <Label className="text-sm">Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  max={selectedFarmerProduct.availableQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="text-center text-lg"
                />
                <div className="text-xs text-gray-500 text-center mt-1">
                  Max: {selectedFarmerProduct.availableQuantity}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-600">Subtotal</div>
                <div className="text-3xl font-bold" style={{ color: COLORS.primary }}>
                  ৳{(selectedFarmerProduct.price * quantity).toFixed(2)}
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleAddToCart}
                style={{ backgroundColor: COLORS.primary }}
                disabled={!isVerified || selectedFarmerProduct.availableQuantity === 0}
                className="px-8"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
