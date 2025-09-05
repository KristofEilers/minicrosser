import ProductCard from "./product-card";

type ProductGridProps = {
  products: Array<{
    _id: string;
    name: string;
    slug: { current: string };
    productNumber: string;
    manufacturer: {
      name: string;
      code: string;
      logo?: {
        asset: {
          url: string;
          metadata?: {
            lqip?: string;
          };
        };
      };
    };
    categories?: Array<{
      name: string;
      code: string;
    }>;
    shortDescription?: string;
    variants: Array<{
      sku: string;
      basePrice: number;
      stockStatus: string;
      images?: Array<{
        asset: {
          url: string;
          metadata?: {
            lqip?: string;
            dimensions?: {
              width: number;
              height: number;
            };
          };
        };
        alt?: string;
      }>;
    }>;
  }>;
  loading?: boolean;
};

export default function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <svg
          className="w-16 h-16 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
          />
        </svg>
        <h3 className="text-lg font-medium mb-2">No products found</h3>
        <p className="text-sm">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} {...product} />
      ))}
    </div>
  );
}