import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buyerService } from '../../services/buyerService';
import { useCartStore } from '../../store/cartStore';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { COLORS, PRODUCT_CATEGORIES } from '../../constants/theme';
import {
  Search,
  ShoppingCart,
  MapPin,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Package,
} from 'lucide-react';
import type { Product } from '../../types';
import { toast } from 'react-toastify';

export const Marketplace = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const cartItemCount = useCartStore((state) => state.getTotalItems());

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedQuality, setSelectedQuality] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 12;

  const isVerified = user?.verificationStatus === 'approved';

  console.log('Marketplace rendering, products:', products.length, 'isLoading:', isLoading);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching products...');
      const response = await buyerService.getProducts();
      console.log('Products response:', response);
      if (response.success && response.data) {
        console.log('Setting products:', response.data.length);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } else {
        console.error('Invalid response:', response);
        toast.error('Failed to load products');
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Marketplace mounted, fetching products');
    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    console.log('Filtering products, total:', products.length);
    let result = [...products];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((product) => product.category === selectedCategory);
    }

    // Filter by quality
    if (selectedQuality && selectedQuality !== 'all') {
      result = result.filter((product) => product.quality === selectedQuality);
    }

    // Filter by price range
    if (priceRange.min) {
      result = result.filter((product) => product.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      result = result.filter((product) => product.price <= parseFloat(priceRange.max));
    }

    // Filter only available products
    result = result.filter((product) => product.isAvailable && product.availableQuantity > 0);

    // Sort products
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    console.log('Filtered products:', result.length);
    setFilteredProducts(result);
    setCurrentPage(1);
  }, [products, searchTerm, selectedCategory, selectedQuality, sortBy, priceRange]);

  const handleAddToCart = (product: Product) => {
    if (!isVerified) {
      toast.error('Please complete verification to purchase products');
      navigate('/profile');
      return;
    }
    addItem(product, 1);
    toast.success('Added to cart!');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedQuality('all');
    setPriceRange({ min: '', max: '' });
    setSortBy('date');
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  console.log(
    'Rendering marketplace, total:',
    products.length,
    'filtered:',
    filteredProducts.length,
    'current:',
    currentProducts.length,
    'loading:',
    isLoading
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600 mt-1">Browse fresh products from local farmers</p>
        </div>
        <Button onClick={() => navigate('/buyer/cart')} variant="outline" className="relative">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Cart
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </Button>
      </div>

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

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search and Mobile Filter Toggle */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Filters */}
            <div
              className={`grid grid-cols-1 md:grid-cols-5 gap-4 ${
                showFilters ? '' : 'hidden md:grid'
              }`}
            >
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                <SelectTrigger>
                  <SelectValue placeholder="Quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Quality</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Organic">Organic</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Min Price"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              />

              <Input
                type="number"
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              />

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Latest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            {(searchTerm ||
              selectedCategory ||
              selectedQuality ||
              priceRange.min ||
              priceRange.max) && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchTerm}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm('')} />
                  </Badge>
                )}
                {selectedCategory && selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCategory}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedCategory('all')}
                    />
                  </Badge>
                )}
                {selectedQuality && selectedQuality !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedQuality}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedQuality('all')}
                    />
                  </Badge>
                )}
                {(priceRange.min || priceRange.max) && (
                  <Badge variant="secondary" className="gap-1">
                    ৳{priceRange.min || '0'} - ৳{priceRange.max || '∞'}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setPriceRange({ min: '', max: '' })}
                    />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 text-xs">
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{isLoading ? 'Loading...' : `${filteredProducts.length} products found`}</span>
        {totalPages > 1 && (
          <span>
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              {products.length === 0
                ? 'No products available at the moment'
                : 'No products match your filters'}
            </p>
            {(searchTerm ||
              selectedCategory ||
              selectedQuality ||
              priceRange.min ||
              priceRange.max) && (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentProducts.map((product) => {
              const farmer = typeof product.farmerId === 'object' ? product.farmerId : null;

              return (
                <Card
                  key={product._id}
                  className="hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  {/* Product Image */}
                  {product.imageUrl && (
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {!product.isAvailable && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-bold">Out of Stock</span>
                        </div>
                      )}
                    </div>
                  )}

                  <CardHeader className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                    </div>
                    <div className="flex gap-2 flex-wrap mt-2">
                      <Badge style={{ backgroundColor: COLORS.primary }} className="text-xs">
                        {product.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {product.quality}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Price:</span>
                        <span className="text-xl font-bold" style={{ color: COLORS.primary }}>
                          ৳{product.price}/{product.unit}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Stock:</span>
                        <span
                          className={
                            product.availableQuantity < 10 ? 'text-orange-600 font-semibold' : ''
                          }
                        >
                          {product.availableQuantity} {product.unit}
                        </span>
                      </div>

                      {product.harvestDate && (
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>Harvested:</span>
                          <span>{new Date(product.harvestDate).toLocaleDateString()}</span>
                        </div>
                      )}

                      {farmer && (
                        <div className="pt-2 border-t">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Farmer:</span>
                            <span className="font-medium">{farmer.name}</span>
                          </div>
                          {farmer.location && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <MapPin className="h-3 w-3" />
                              <span>
                                {farmer.location.area}, {farmer.location.city}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleAddToCart(product)}
                        style={{ backgroundColor: COLORS.primary }}
                        disabled={
                          !product.isAvailable || product.availableQuantity === 0 || !isVerified
                        }
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {!isVerified ? 'Verify First' : 'Add to Cart'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/buyer/product/${product._id}`)}
                      >
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of{' '}
                    {filteredProducts.length} products
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            style={
                              currentPage === pageNum
                                ? { backgroundColor: COLORS.primary }
                                : undefined
                            }
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
