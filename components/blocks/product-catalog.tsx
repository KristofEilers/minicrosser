import { Suspense } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SectionContainer from "@/components/ui/section-container";

type ProductCatalogProps = {
  _type: "product-catalog";
  _key: string;
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  showCategories?: boolean;
  showManufacturers?: boolean;
  productsPerPage?: number;
  featuredCategories?: Array<{ _id: string; name: string; slug: { current: string } }>;
  featuredManufacturers?: Array<{ _id: string; name: string; slug: { current: string } }>;
  padding?: any;
  colorVariant?: string;
};

export default function ProductCatalog({
  title = "Product Catalog",
  subtitle = "Find the right parts for your vehicle",
  showSearch = true,
  showCategories = true,
  showManufacturers = true,
  featuredCategories = [],
  featuredManufacturers = [],
  padding,
  colorVariant,
}: ProductCatalogProps) {

  return (
    <SectionContainer color={colorVariant} padding={padding}>
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-xl text-gray-600 mb-6">{subtitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
                Browse by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Find parts by vehicle system or component type
              </p>
              <Link
                href="/catalog"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                View Categories
              </Link>
            </CardContent>
          </Card>

          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                </svg>
                Search Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Search by part number, product name, or manufacturer
              </p>
              <Link
                href="/catalog"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Start Searching
              </Link>
            </CardContent>
          </Card>

          {/* Manufacturers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zM10 15a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1h-4a1 1 0 01-1-1v-1z" clipRule="evenodd"/>
                </svg>
                Browse by Brand
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Shop products from your favorite manufacturers
              </p>
              <Link
                href="/catalog"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                View Brands
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Featured Categories/Manufacturers */}
        {((featuredCategories?.length || 0) > 0 || (featuredManufacturers?.length || 0) > 0) && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-6 text-center">Quick Access</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {(featuredCategories || []).map((category) => (
                <Link
                  key={category._id}
                  href={`/catalog/category/${category.slug.current}`}
                  className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium text-sm">{category.name}</div>
                </Link>
              ))}
              {(featuredManufacturers || []).map((manufacturer) => (
                <Link
                  key={manufacturer._id}
                  href={`/catalog/manufacturer/${manufacturer.slug.current}`}
                  className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors"
                >
                  <div className="font-medium text-sm">{manufacturer.name}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Link
            href="/catalog"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Full Product Catalog
          </Link>
        </div>
      </div>
    </SectionContainer>
  );
}