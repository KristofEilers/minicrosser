import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { PRODUCT_QUERY, PRODUCTS_SLUGS_QUERY } from "@/sanity/queries/product/product";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  FileText, 
  Car, 
  Package, 
  Info, 
  CheckCircle,
  AlertCircle,
  XCircle 
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

const stockStatusConfig = {
  inStock: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  lowStock: { icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-100" },
  outOfStock: { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
  discontinued: { icon: XCircle, color: "text-gray-600", bg: "bg-gray-100" },
  preOrder: { icon: Info, color: "text-blue-600", bg: "bg-blue-100" },
};

export async function generateStaticParams() {
  const slugs = await client.fetch(PRODUCTS_SLUGS_QUERY);
  return slugs.map((item: any) => ({ slug: item.slug.current }));
}

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const product = await client.fetch(PRODUCT_QUERY, { slug: params.slug });
  
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | ${product.manufacturer.name}`,
    description: product.shortDescription || product.seoDescription || `${product.name} by ${product.manufacturer.name}`,
  };
}

export default async function ProductPage(props: Props) {
  const params = await props.params;
  const product = await client.fetch(PRODUCT_QUERY, { slug: params.slug });

  if (!product) {
    notFound();
  }

  const mainVariant = product.variants[0];
  const mainImage = mainVariant?.images?.[0];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-blue-600">Catalog</Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
            {mainImage ? (
              <Image
                src={mainImage.asset.url}
                alt={mainImage.alt || product.name}
                width={600}
                height={600}
                className="w-full h-full object-contain p-8"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <Package className="w-24 h-24" />
              </div>
            )}
          </div>

          {/* Thumbnail gallery */}
          {mainVariant?.images && mainVariant.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {mainVariant.images.slice(0, 4).map((image: any, index: number) => (
                <div key={index} className="aspect-square bg-gray-50 rounded overflow-hidden">
                  <Image
                    src={image.asset.url}
                    alt={image.alt || `${product.name} view ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.manufacturer.logo && (
                <Image
                  src={product.manufacturer.logo.asset.url}
                  alt={product.manufacturer.name}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              )}
              <span className="text-sm text-gray-600">{product.manufacturer.name}</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline">Part #: {product.productNumber}</Badge>
              {mainVariant?.sku !== product.productNumber && (
                <Badge variant="outline">SKU: {mainVariant?.sku}</Badge>
              )}
              {product.categories.map((category: any) => (
                <Badge key={category._id} variant="secondary">
                  {category.name}
                </Badge>
              ))}
            </div>

            {product.shortDescription && (
              <p className="text-lg text-gray-700">{product.shortDescription}</p>
            )}
          </div>

          {/* Pricing and Stock */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    €{mainVariant?.basePrice?.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Base price (excl. VAT)</div>
                </div>
                
                <div className="flex items-center gap-2">
                  {(() => {
                    const config = stockStatusConfig[mainVariant?.stockStatus as keyof typeof stockStatusConfig];
                    if (!config) return null;
                    const Icon = config.icon;
                    return (
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${config.bg}`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                        <span className={`text-sm font-medium ${config.color}`}>
                          {mainVariant?.stockStatus === 'inStock' ? 'In Stock' :
                           mainVariant?.stockStatus === 'lowStock' ? 'Low Stock' :
                           mainVariant?.stockStatus === 'outOfStock' ? 'Out of Stock' :
                           mainVariant?.stockStatus === 'discontinued' ? 'Discontinued' :
                           mainVariant?.stockStatus === 'preOrder' ? 'Pre-Order' : 'Unknown'}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full" size="lg">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                
                <Button variant="outline" className="w-full" size="lg">
                  Request Quote
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          {product.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {Array.isArray(product.description) ? (
                    product.description.map((block: any, index: number) => (
                      <p key={index} className="mb-4">{block.children?.[0]?.text}</p>
                    ))
                  ) : (
                    <p>{product.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Vehicle Compatibility */}
          {product.compatibleVehicles && product.compatibleVehicles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Compatible Vehicles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {product.compatibleVehicles.slice(0, 5).map((compatibility: any) => (
                    <div key={compatibility._id} className="text-sm">
                      <div className="font-medium">
                        {compatibility.vehicle.manufacturer.name} {compatibility.vehicle.model}
                      </div>
                      <div className="text-gray-600">
                        {compatibility.vehicle.generation} ({compatibility.vehicle.productionYearFrom}-{compatibility.vehicle.productionYearTo || "present"})
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          {product.documents && product.documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {product.documents.map((doc: any) => (
                    <div key={doc._id} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{doc.title}</div>
                        <div className="text-xs text-gray-600">
                          {doc.type} • {doc.fileSize}MB
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={doc.file.asset.url} target="_blank">
                          Download
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}