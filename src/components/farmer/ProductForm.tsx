import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { farmerService } from '../../services/farmerService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PRODUCT_CATEGORIES, PRODUCT_QUALITIES, COLORS } from '../../constants/theme';
import type { ProductFormData } from '../../types';

interface ProductFormProps {
  onSuccess?: () => void;
  initialData?: ProductFormData & { _id?: string };
}

export const ProductForm = ({ onSuccess, initialData }: ProductFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: initialData,
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    try {
      if (initialData?._id) {
        await farmerService.updateProduct(initialData._id, data);
        toast.success('Product updated successfully!');
      } else {
        await farmerService.createProduct(data);
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
      <CardHeader>
        <CardTitle style={{ color: COLORS.primary }}>
          {initialData?._id ? 'Edit Product' : 'Add New Product'}
        </CardTitle>
      </CardHeader>
      <CardContent>
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
              <Label htmlFor="unit">Unit *</Label>
              <Input
                id="unit"
                placeholder="kg"
                {...register('unit', { required: 'Unit is required' })}
              />
              {errors.unit && <p className="text-sm text-red-500">{errors.unit.message}</p>}
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
