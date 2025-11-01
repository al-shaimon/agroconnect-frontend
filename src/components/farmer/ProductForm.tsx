import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { farmerService } from '../../services/farmerService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import {
  PRODUCT_CATEGORIES,
  PRODUCT_QUALITIES,
  PRODUCT_UNITS,
  COLORS,
} from '../../constants/theme';
import { X } from 'lucide-react';
import type { ProductFormData } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface ProductFormProps {
  onSuccess?: () => void;
  initialData?: ProductFormData & { _id?: string; imageUrl?: string };
}

export const ProductForm = ({ onSuccess, initialData }: ProductFormProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.imageUrl || '');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: initialData,
  });

  const isVerified = user?.verificationStatus === 'approved';

  // Format harvest date for the date input field
  useEffect(() => {
    if (initialData?.harvestDate) {
      // Convert ISO date to YYYY-MM-DD format for input[type="date"]
      const date = new Date(initialData.harvestDate);
      const formattedDate = date.toISOString().split('T')[0];
      setValue('harvestDate', formattedDate);
    }
  }, [initialData, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Only JPEG, JPG, PNG, and WebP images are allowed');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    const input = document.getElementById('productImage') as HTMLInputElement;
    if (input) input.value = '';
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!isVerified) {
      toast.error('You must be verified by admin before adding or updating products.');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('category', data.category);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('unit', data.unit);
      formData.append('availableQuantity', data.availableQuantity.toString());
      formData.append('quality', data.quality);
      if (data.harvestDate) {
        formData.append('harvestDate', data.harvestDate);
      }
      if (data.location) {
        formData.append('location', data.location);
      }
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (initialData?._id) {
        await farmerService.updateProduct(initialData._id, formData);
        toast.success('Product updated successfully!');
      } else {
        await farmerService.createProduct(formData);
        toast.success('Product created successfully!');
      }
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="Fresh Tomatoes"
                {...register('name', { required: 'Product name is required' })}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                onValueChange={(value) => setValue('category', value)}
                defaultValue={initialData?.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (৳/unit) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="60"
                {...register('price', { required: 'Price is required', min: 0 })}
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Unit *</Label>
              <Select
                onValueChange={(value) => setValue('unit', value)}
                defaultValue={initialData?.unit || 'kg'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableQuantity">Available Quantity *</Label>
              <Input
                id="availableQuantity"
                type="number"
                placeholder="100"
                {...register('availableQuantity', { required: 'Quantity is required', min: 0 })}
              />
              {errors.availableQuantity && (
                <p className="text-sm text-red-500">{errors.availableQuantity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Quality *</Label>
              <Select
                onValueChange={(value) =>
                  setValue('quality', value as (typeof PRODUCT_QUALITIES)[number])
                }
                defaultValue={initialData?.quality}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_QUALITIES.map((q) => (
                    <SelectItem key={q} value={q}>
                      {q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your product..."
              rows={3}
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="productImage">Product Image</Label>
            <div className="space-y-2">
              <Input
                id="productImage"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500">Max size: 5MB. Formats: JPEG, JPG, PNG, WebP</p>
              {imagePreview && (
                <div className="relative w-full max-w-xs mt-2">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="harvestDate">Harvest Date</Label>
            <Input id="harvestDate" type="date" {...register('harvestDate')} />
          </div>

          <Button type="submit" disabled={isLoading} style={{ backgroundColor: COLORS.primary }}>
            {isLoading ? 'Saving...' : initialData?._id ? 'Update Product' : 'Create Product'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
