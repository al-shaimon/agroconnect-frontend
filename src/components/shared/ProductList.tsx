import { useProducts } from '../../hooks/useProducts';
import ProductCardComponent from './ProductCardComponent';

export default function ProductList() {
  const { products, loading, error } = useProducts();

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {loading
        ? // Show loading skeletons
          Array(8)
            .fill(0)
            .map((_, index) => (
              <ProductCardComponent key={`skeleton-${index}`} isLoading={true} />
            ))
        : // Show actual products
          products.map((product) => (
            <ProductCardComponent
              key={product._id}
              product={product}
              onAddToCart={() => {
                // Handle add to cart here
                console.log('Add to cart:', product);
              }}
            />
          ))}
    </div>
  );
}