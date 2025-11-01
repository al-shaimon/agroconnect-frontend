import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Edit, Trash2, Search, Plus, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { COLORS } from '../../constants/theme';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

interface GlobalProduct {
  _id: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  images: string[];
  isActive: boolean;
}

interface FarmerProduct {
  _id: string;
  globalProductId: {
    _id: string;
    name: string;
    category: string;
    unit: string;
    images: string[];
  };
  farmerId: string;
  price: number;
  availableQuantity: number;
  quality: string;
  harvestDate?: string;
  isAvailable: boolean;
}

const QUALITY_OPTIONS = ['Premium', 'Standard', 'Organic'];

export const ProductList = () => {
  const { user } = useAuth();
  const [myProducts, setMyProducts] = useState<FarmerProduct[]>([]);
  const [globalProducts, setGlobalProducts] = useState<GlobalProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FarmerProduct | null>(null);
  const [selectedGlobalProduct, setSelectedGlobalProduct] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    price: '',
    availableQuantity: '',
    quality: 'Standard',
    harvestDate: '',
  });

  const isVerified = user?.verificationStatus === 'approved';

  const fetchMyProducts = async () => {
    try {
      const response = await api.get('/products/farmer/my-products');
      setMyProducts(response.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch your products');
    }
  };

  const fetchGlobalProducts = async () => {
    try {
      const response = await api.get('/products/farmer/available-products');
      setGlobalProducts(response.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch available products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
    fetchGlobalProducts();
  }, []);

  const handleOpenDialog = (product?: FarmerProduct) => {
    if (product) {
      setEditingProduct(product);
      setSelectedGlobalProduct(product.globalProductId._id);
      setFormData({
        price: product.price.toString(),
        availableQuantity: product.availableQuantity.toString(),
        quality: product.quality,
        harvestDate: product.harvestDate
          ? new Date(product.harvestDate).toISOString().split('T')[0]
          : '',
      });
    } else {
      setEditingProduct(null);
      setSelectedGlobalProduct('');
      setFormData({
        price: '',
        availableQuantity: '',
        quality: 'Standard',
        harvestDate: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setSelectedGlobalProduct('');
    setFormData({
      price: '',
      availableQuantity: '',
      quality: 'Standard',
      harvestDate: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGlobalProduct) {
      toast.error('Please select a product');
      return;
    }

    if (!formData.price || !formData.availableQuantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const data = {
        globalProductId: selectedGlobalProduct,
        price: parseFloat(formData.price),
        availableQuantity: parseFloat(formData.availableQuantity),
        quality: formData.quality,
        harvestDate: formData.harvestDate || undefined,
      };

      if (editingProduct) {
        await api.put(`/products/farmer/my-products/${editingProduct._id}`, data);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products/farmer/my-products', data);
        toast.success('Product added successfully');
      }

      fetchMyProducts();
      fetchGlobalProducts();
      handleCloseDialog();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product from your inventory?')) return;

    try {
      await api.delete(`/products/farmer/my-products/${id}`);
      toast.success('Product removed successfully');
      fetchMyProducts();
      fetchGlobalProducts();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete product');
    }
  };

  const filteredMyProducts = myProducts.filter(
    (product) =>
      product.globalProductId &&
      product.globalProductId.name &&
      product.globalProductId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get available global products (not already added by farmer)
  const availableGlobalProducts = globalProducts.filter(
    (gp) =>
      gp.isActive &&
      (!editingProduct ||
        (editingProduct.globalProductId && gp._id === editingProduct.globalProductId._id)) &&
      !myProducts.some((mp) => mp.globalProductId && mp.globalProductId._id === gp._id)
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <CardTitle style={{ color: COLORS.primary }}>My Products</CardTitle>
              <Button
                onClick={() => handleOpenDialog()}
                style={{ backgroundColor: COLORS.primary }}
                disabled={!isVerified || availableGlobalProducts.length === 0}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>

            {/* Verification Alert */}
            {!isVerified && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You must be verified by admin before you can add or update products. Please upload
                  your verification documents in the Profile section and wait for admin approval.
                </AlertDescription>
              </Alert>
            )}

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMyProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {myProducts.length === 0
                ? 'No products yet. Add your first product from admin catalog!'
                : 'No products found matching your search.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMyProducts.map((product) => {
                    if (!product.globalProductId) return null;
                    return (
                      <TableRow key={product._id}>
                        <TableCell>
                          {product.globalProductId.images &&
                          product.globalProductId.images.length > 0 ? (
                            <img
                              src={product.globalProductId.images[0]}
                              alt={product.globalProductId.name}
                              className="h-12 w-12 object-cover rounded"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {product.globalProductId.name}
                        </TableCell>
                        <TableCell>{product.globalProductId.category}</TableCell>
                        <TableCell>
                          ৳{product.price}/{product.globalProductId.unit}
                        </TableCell>
                        <TableCell>
                          {product.availableQuantity} {product.globalProductId.unit}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.quality}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={product.isAvailable ? 'default' : 'secondary'}
                            style={
                              product.isAvailable ? { backgroundColor: COLORS.primary } : undefined
                            }
                          >
                            {product.isAvailable ? 'Available' : 'Unavailable'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDialog(product)}
                              disabled={!isVerified}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(product._id)}
                              disabled={!isVerified}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="product">Select Product *</Label>
              <Select
                value={selectedGlobalProduct}
                onValueChange={setSelectedGlobalProduct}
                disabled={!!editingProduct}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose from admin catalog" />
                </SelectTrigger>
                <SelectContent>
                  {editingProduct ? (
                    <SelectItem value={editingProduct.globalProductId._id}>
                      {editingProduct.globalProductId.name}
                    </SelectItem>
                  ) : (
                    availableGlobalProducts.map((product) => (
                      <SelectItem key={product._id} value={product._id}>
                        {product.name} ({product.category})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {!editingProduct && availableGlobalProducts.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  All available products have been added. Contact admin to add more products.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (৳) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Enter price per unit"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Available Quantity *
                  {selectedGlobalProduct && (
                    <span className="text-sm text-gray-500 ml-2">
                      (in {globalProducts.find((p) => p._id === selectedGlobalProduct)?.unit})
                    </span>
                  )}
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.availableQuantity}
                  onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })}
                  placeholder={
                    selectedGlobalProduct
                      ? `Enter quantity in ${
                          globalProducts.find((p) => p._id === selectedGlobalProduct)?.unit
                        }`
                      : 'Enter quantity'
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quality">Quality</Label>
                <Select
                  value={formData.quality}
                  onValueChange={(value) => setFormData({ ...formData, quality: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUALITY_OPTIONS.map((quality) => (
                      <SelectItem key={quality} value={quality}>
                        {quality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="harvestDate">Harvest Date (Optional)</Label>
                <Input
                  id="harvestDate"
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                style={{ backgroundColor: COLORS.primary }}
              >
                {submitting ? 'Saving...' : editingProduct ? 'Update' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
