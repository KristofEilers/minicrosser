import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type ProductVariant = {
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
};

type Manufacturer = {
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

type Category = {
  name: string;
  code: string;
};

type ProductCardProps = {
  _id: string;
  name: string;
  slug: { current: string };
  productNumber: string;
  manufacturer: Manufacturer;
  categories?: Category[];
  shortDescription?: string;
  variants: ProductVariant[];
};

const stockStatusColors = {
  inStock: "bg-green-100 text-green-800",
  lowStock: "bg-yellow-100 text-yellow-800", 
  outOfStock: "bg-red-100 text-red-800",
  discontinued: "bg-gray-100 text-gray-800",
  preOrder: "bg-blue-100 text-blue-800",
};

const stockStatusLabels = {
  inStock: "In Stock",
  lowStock: "Low Stock",
  outOfStock: "Out of Stock", 
  discontinued: "Discontinued",
  preOrder: "Pre-Order",
};

export default function ProductCard({
  name,
  slug,
  productNumber,
  manufacturer,
  categories,
  shortDescription,
  variants,
}: ProductCardProps) {
  const mainVariant = variants[0];
  const mainImage = mainVariant?.images?.[0];
  const category = categories?.[0];

  return (
    <Link href={`/catalog/product/${slug.current}`}>
      <Card className="group h-full overflow-hidden transition-all duration-200 hover:shadow-lg">
        <div className="aspect-square relative bg-gray-50">
          {mainImage ? (
            <Image
              src={mainImage.asset.url}
              alt={mainImage.alt || name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-200"
              placeholder={mainImage.asset.metadata?.lqip ? "blur" : undefined}
              blurDataURL={mainImage.asset.metadata?.lqip}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </div>
          )}
          
          {/* Manufacturer logo */}
          {manufacturer.logo && (
            <div className="absolute top-2 left-2 bg-white/90 rounded p-1">
              <Image
                src={manufacturer.logo.asset.url}
                alt={manufacturer.name}
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
          )}

          {/* Stock status badge */}
          <div className="absolute top-2 right-2">
            <Badge 
              className={stockStatusColors[mainVariant?.stockStatus as keyof typeof stockStatusColors] || stockStatusColors.outOfStock}
              variant="secondary"
            >
              {stockStatusLabels[mainVariant?.stockStatus as keyof typeof stockStatusLabels] || "Unknown"}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            {/* Category */}
            {category && (
              <Badge variant="outline" className="text-xs">
                {category.name}
              </Badge>
            )}

            {/* Product name */}
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
              {name}
            </h3>

            {/* Manufacturer and part number */}
            <div className="text-xs text-gray-600">
              <div>{manufacturer.name}</div>
              <div className="font-mono">{productNumber}</div>
              {mainVariant?.sku !== productNumber && (
                <div className="font-mono">SKU: {mainVariant?.sku}</div>
              )}
            </div>

            {/* Short description */}
            {shortDescription && (
              <p className="text-xs text-gray-500 line-clamp-2">
                {shortDescription}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="text-lg font-bold text-blue-600">
              €{mainVariant?.basePrice?.toFixed(2)}
            </div>
            
            {variants.length > 1 && (
              <Badge variant="secondary" className="text-xs">
                {variants.length} variants
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}