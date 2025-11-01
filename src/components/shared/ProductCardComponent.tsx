import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface Product {
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

interface ProductCardProps {
  product?: Product;
  isLoading?: boolean;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCardComponent({
  product,
  isLoading = false,
  onAddToCart,
}: ProductCardProps) {
  if (isLoading) {
    return (
      <Card className="w-full max-w-sm overflow-hidden">
        <CardContent className="p-0">
          <Skeleton className="h-48 w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
            <div className="flex justify-between items-center mt-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BDT',
  }).format(product.price);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <Card className="w-full max-w-sm overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative h-48 w-full">
          {/* Using a plain img tag since this is a Vite React app (not Next.js) */}
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <p className="text-white font-semibold text-lg">Out of Stock</p>
            </div>
          )}
          {product.availableQuantity <= 5 && product.availableQuantity > 0 && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-warning text-warning-foreground rounded text-xs">
              Only {product.availableQuantity} left
            </div>
          )}
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
              {product.category}
            </span>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
              {product.quality}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm text-muted-foreground">
              Harvest Date: {new Date(product.harvestDate).toLocaleDateString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Available: {product.availableQuantity} {product.unit}
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div>
              <p className="font-semibold text-lg">{formattedPrice}</p>
              <p className="text-sm text-muted-foreground">per {product.unit}</p>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={!product.isAvailable || product.availableQuantity === 0}
              className="gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
