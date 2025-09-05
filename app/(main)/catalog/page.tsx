import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_QUERY } from "@/sanity/queries/product/product";
import { ROOT_CATEGORIES_QUERY } from "@/sanity/queries/catalog/categories";
import { MANUFACTURERS_QUERY } from "@/sanity/queries/catalog/manufacturers";
import ProductGrid from "@/components/catalog/product-grid";
import SearchBar from "@/components/catalog/search-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

async function getProductsData() {
  const [products, categories, manufacturers] = await Promise.all([
    client.fetch(PRODUCTS_QUERY, { start: 0, end: 11 }),
    client.fetch(ROOT_CATEGORIES_QUERY),
    client.fetch(MANUFACTURERS_QUERY),
  ]);

  return { products, categories, manufacturers };
}

export default async function CatalogPage() {
  const { products, categories, manufacturers } = await getProductsData();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Product Catalog</h1>
        <p className="text-xl text-gray-600 mb-6">
          Find the right parts for your vehicle from our extensive catalog
        </p>
        
        {/* Search Bar */}
        <Suspense fallback={<div className="h-12 bg-gray-200 animate-pulse rounded"></div>}>
          <SearchBar showSuggestions={true} />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category: any) => (
                    <Link
                      key={category._id}
                      href={`/catalog/category/${category.slug.current}`}
                      className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm font-medium">{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.productCount}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Manufacturers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Manufacturers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {manufacturers.slice(0, 8).map((manufacturer: any) => (
                    <Link
                      key={manufacturer._id}
                      href={`/catalog/manufacturer/${manufacturer.slug.current}`}
                      className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm font-medium">{manufacturer.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {manufacturer.productCount}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Featured Products</h2>
              <p className="text-gray-600">
                Showing {products.length} products
              </p>
            </div>
          </div>

          <Suspense fallback={<ProductGrid products={[]} loading={true} />}>
            <ProductGrid products={products} />
          </Suspense>

          {/* Load More / Pagination could go here */}
          <div className="mt-8 text-center">
            <Link
              href="/catalog/search"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Product Catalog | Parts Dealer",
  description: "Browse our extensive catalog of automotive parts and accessories from top manufacturers.",
};