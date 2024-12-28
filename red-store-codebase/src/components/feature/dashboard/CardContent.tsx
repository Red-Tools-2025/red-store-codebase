import React, { useState, useEffect } from "react";

interface Product {
  product_id: number;
  total_sales: number;
  revenue: number;
  stock: number;
  status: string;
}

interface CardContentProps {
  storeId: number | undefined; // Prop to receive store ID from parent component
}

const CardFirst: React.FC<{ product: Product | null; loading: boolean }> = ({
  product,
  loading,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center space-x-2 space-y-5">
        <div className="w-2.5 h-2.5 hidden rounded-full bg-black animate-bounce"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-black animate-bounce"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-black animate-bounce"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-black animate-bounce"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 w-full flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  const revenuePerUnit = product.revenue / product.total_sales;
  const totalRevenuePotential = product.stock * revenuePerUnit;
  const progressPercentage = (
    (product.revenue / totalRevenuePotential) *
    100
  ).toFixed(2);
  const progressWidth = Math.min(parseFloat(progressPercentage), 100);

  return (
    <div className="bg-white shadow-md rounded-lg ml-4 p-6 w-full">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold font-inter">
            Product Name {product.product_id}
          </h2>
          <p className="text-sm font-inter text-gray-500">
            Revenue: ${product.revenue}
          </p>
        </div>
      </div>

      <div>
        <p className="text-sm font-inter text-gray-500">
          {progressPercentage}% target achieved
        </p>
        <div className="h-3 font-inter rounded-full bg-gray-200 mt-2 overflow-hidden">
          <div
            className="h-3 font-inter rounded-full bg-black"
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const TopProductsTable: React.FC<CardContentProps> = ({ storeId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/inventory/timeseries/metrics/top-ten-revenue-stock?store_id_input=${storeId}`
        );
        const data = await response.json();
        setProducts(data.data);
        if (data.data.length > 0) {
          setSelectedProduct(data.data[0]);
        } else {
          setSelectedProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setProducts([]);
        setSelectedProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchProducts();
    } else {
      setProducts([]);
      setSelectedProduct(null);
    }
  }, [storeId]);

  const handleRowClick = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="flex space-x-8 border    ">
      {/* Card Section */}
      <div className="w-1/3">
        <CardFirst product={selectedProduct} loading={loading} />
      </div>

      {/* Table Section */}
      <div className="w-2/3 pl-3 border border-white   h-40  overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center space-x-2 space-y-5">
            <div className="w-2.5 h-2.5 hidden rounded-full bg-black animate-bounce"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-black animate-bounce"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-black animate-bounce"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-black animate-bounce"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center text-center mt-5 justify-center text-gray-500">
            No data available
          </div>
        ) : (
          <table className="min-w-full text-left border-collapse border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  Product
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  Sales
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  Revenue
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  Stock
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="">
              {products.map((product, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(product)}
                  className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-3 px-4 text-gray-700">
                    {product.product_id}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {product.total_sales} pcs
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    ${product.revenue}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{product.stock}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-sm font-medium py-1 px-3 rounded-full ${
                        product.status === "In Stock"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TopProductsTable;
