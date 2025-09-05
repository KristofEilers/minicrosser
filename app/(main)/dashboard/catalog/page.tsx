import { Suspense } from "react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_QUERY } from "@/sanity/queries/product/product";
import { ROOT_CATEGORIES_QUERY } from "@/sanity/queries/catalog/categories";
import { MANUFACTURERS_QUERY } from "@/sanity/queries/catalog/manufacturers";
import { 
  Package,
  Download,
  Heart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProductList from "@/components/catalog/product-list";
import CartButton from "@/components/cart/cart-button";

async function getCatalogData() {
  const [products, categories, manufacturers] = await Promise.all([
    client.fetch(PRODUCTS_QUERY, { start: 0, end: 50 }),
    client.fetch(ROOT_CATEGORIES_QUERY),
    client.fetch(MANUFACTURERS_QUERY),
  ]);

  return { products, categories, manufacturers };
}

function DashboardCatalogContent({ products }: { products: any[] }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Produktkatalog</h1>
          <p className="mt-1 text-sm text-gray-500">
            Durchsuchen Sie unser komplettes Sortiment und bestellen Sie direkt
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/favorites">
              <Heart className="w-4 h-4 mr-2" />
              Meine Favoriten
            </Link>
          </Button>
          <CartButton />
        </div>
      </div>

      {/* Products List with Search, Filter, and Cart functionality */}
      <ProductList products={products} />

      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Schnellbestellung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                CSV-Import
              </Button>
              <Button variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Artikelliste hochladen
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/order-overview">
                  <Heart className="w-4 h-4 mr-2" />
                  Zur Bestellübersicht
                </Link>
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Laden Sie eine CSV-Datei mit Artikelnummern hoch oder erstellen Sie eine Wunschliste für zukünftige Bestellungen.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function DashboardCatalogPage() {
  const { products } = await getCatalogData();
  
  return <DashboardCatalogContent products={products} />;
}