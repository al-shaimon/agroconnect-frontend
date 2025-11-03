import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buyerService } from '../../services/buyerService';
// import { useCartStore } from '../../store/cartStore';
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
import { Search, Filter, ChevronLeft, ChevronRight, AlertCircle, Package } from 'lucide-react';
import type { Product } from '../../types';
import { toast } from 'react-toastify';

export const Marketplace = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // const cartItemCount = useCartStore((state) => state.getTotalItems());

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

      // Build query parameters
      const params: any = {};
      if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedQuality && selectedQuality !== 'all') params.quality = selectedQuality;
      if (priceRange.min) params.minPrice = parseFloat(priceRange.min);
      if (priceRange.max) params.maxPrice = parseFloat(priceRange.max);
      if (searchTerm) params.search = searchTerm;
      if (sortBy) params.sortBy = sortBy;

      const response = await buyerService.getProducts(params);
      console.log('Products response:', response);
      if (response.success && response.data) {
        console.log('Setting products:', response.data.length);
        // Only show products that have at least one farmer offering
        const availableProducts = response.data.filter((p) => p.farmersCount && p.farmersCount > 0);
        setProducts(availableProducts);
        setFilteredProducts(availableProducts);
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
  }, [selectedCategory, selectedQuality, priceRange, searchTerm, sortBy]);

  // Filter and sort products - now handled by backend, just use the data directly
  useEffect(() => {
    console.log('Setting filtered products:', products.length);
    setFilteredProducts(products);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products]);

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

  return (
    <div className="space-y-6">
      {/* Alert */}
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

      {/* Sleek Search Bar */}
      <div className="relative">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search fresh products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-11 text-base border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 bg-white shadow-md rounded-2xl transition-all"
            />
          </div>

          {/* Filter Toggle Button */}
          <Button
            variant={showFilters ? 'default' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            className="h-10 px-5 rounded-2xl shadow-md transition-all"
            style={showFilters ? { backgroundColor: COLORS.primary } : {}}
          >
            <Filter className="h-5 w-5 md:mr-2" />
            <span className="hidden md:inline">Filters</span>
          </Button>

          {/* Cart Button */}
          {/* <Button
            onClick={() => navigate('/buyer/cart')}
            className="h-14 px-5 rounded-2xl shadow-md relative hidden sm:flex"
            style={{ backgroundColor: COLORS.primary }}
          >
            <ShoppingCart className="h-5 w-5 md:mr-2" />
            <span className="hidden md:inline">Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                {cartItemCount}
              </span>
            )}
          </Button> */}
        </div>

        {/* Collapsible Filter Panel */}
        {showFilters && (
          <div className="mt-4 bg-white rounded-2xl shadow-lg border border-gray-100 p-5 animate-in slide-in-from-top-5 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Refine Your Search
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-red-600"
              >
                Reset
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Category */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-11 w-full md:w-[180px] rounded-xl">
                  <SelectValue placeholder="All Categories" />
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

              {/* Quality */}
              <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                <SelectTrigger className="h-11 w-full md:w-[140px] rounded-xl">
                  <SelectValue placeholder="All Quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Quality</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Organic">Organic</SelectItem>
                </SelectContent>
              </Select>

              {/* Min Price */}
              <Input
                type="number"
                placeholder="Min ৳"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="h-11 w-full md:w-[110px] rounded-xl px-3"
              />

              {/* Max Price */}
              <Input
                type="number"
                placeholder="Max ৳"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="h-11 w-full md:w-[110px] rounded-xl px-3"
              />

              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11 w-full md:w-[160px] rounded-xl">
                  <SelectValue placeholder="Latest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Latest</SelectItem>
                  <SelectItem value="price-low">Price: Low → High</SelectItem>
                  <SelectItem value="price-high">Price: High → Low</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filter Pills */}
            {/* {(searchTerm ||
              selectedCategory !== 'all' ||
              selectedQuality !== 'all' ||
              priceRange.min ||
              priceRange.max) && (
              <div className="flex items-center gap-2 flex-wrap mt-4 pt-4 border-t">
                {searchTerm && (
                  <Badge className="gap-1.5 rounded-full px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200">
                    {searchTerm.substring(0, 15)}
                    {searchTerm.length > 15 && '...'}
                    <X
                      className="h-3.5 w-3.5 cursor-pointer hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchTerm('');
                      }}
                    />
                  </Badge>
                )}
                {selectedCategory && selectedCategory !== 'all' && (
                  <Badge className="gap-1.5 rounded-full px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200">
                    {selectedCategory}
                    <X
                      className="h-3.5 w-3.5 cursor-pointer hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCategory('all');
                      }}
                    />
                  </Badge>
                )}
                {selectedQuality && selectedQuality !== 'all' && (
                  <Badge className="gap-1.5 rounded-full px-3 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200">
                    {selectedQuality}
                    <X
                      className="h-3.5 w-3.5 cursor-pointer hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedQuality('all');
                      }}
                    />
                  </Badge>
                )}
                {(priceRange.min || priceRange.max) && (
                  <Badge className="gap-1.5 rounded-full px-3 py-1 bg-orange-100 text-orange-700 hover:bg-orange-200">
                    ৳{priceRange.min || '0'} - ৳{priceRange.max || '∞'}
                    <X
                      className="h-3.5 w-3.5 cursor-pointer hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPriceRange({ min: '', max: '' });
                      }}
                    />
                  </Badge>
                )}
              </div>
            )} */}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-medium text-gray-700">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              Loading...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" />
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </span>
          )}
        </span>
        {totalPages > 1 && (
          <span className="text-sm text-gray-500">
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
              return (
                <Card
                  key={product._id}
                  className="hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  {/* Product Image */}
                  {product.images && product.images.length > 0 && (
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {!product.available && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-bold">No Farmers Available</span>
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
                      {product.farmersCount && product.farmersCount > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {product.farmersCount} {product.farmersCount === 1 ? 'Farmer' : 'Farmers'}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

                    <div className="space-y-2">
                      {/* Price Range */}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Price:</span>
                        <span className="text-xl font-bold" style={{ color: COLORS.primary }}>
                          {product.minPrice === product.maxPrice
                            ? `৳${product.minPrice}`
                            : `৳${product.minPrice} - ৳${product.maxPrice}`}
                          {product.unit && `/${product.unit}`}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Available from:</span>
                        <span className="font-medium">
                          {product.farmersCount} {product.farmersCount === 1 ? 'farmer' : 'farmers'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1"
                        onClick={() => navigate(`/buyer/product/${product._id}`)}
                        style={{ backgroundColor: COLORS.primary }}
                        disabled={!isVerified}
                      >
                        {!isVerified ? 'Verify First' : 'View Offers'}
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
