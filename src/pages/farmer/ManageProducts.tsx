import { ProductList } from '../../components/farmer/ProductList';

export const ManageProducts = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-600">Manage Products</h1>
        <p className="text-gray-600">View and manage all your products</p>
      </div>

      <ProductList />
    </div>
  );
};
