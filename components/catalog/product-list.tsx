"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search,
  Filter,
  Grid,
  List,
  Heart,
  ShoppingCart,
  Package,
  Plus,
  Minus,
  Star,
  Check
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCart } from "@/lib/contexts/cart-context";

interface Product {
  _id: string;
  name: string;
  productNumber: string;
  slug: { current: string };
  manufacturer?: {
    name: string;
    code: string;
  };
  variants?: Array<{
    sku: string;
    basePrice: number;
    stockStatus: string;
    images?: Array<{ asset: { url: string } }>;
  }>;
  category?: {
    name: string;
    slug: { current: string };
  };
  shortDescription?: string;
  images?: Array<{ asset: { url: string } }>;
}

interface ProductListProps {
  products: Product[];
  loading?: boolean;
}

type ViewMode = 'list' | 'grid';
type SortOption = 'name' | 'price-asc' | 'price-desc' | 'manufacturer' | 'stock';

export default function ProductList({ products = [], loading = false }: ProductListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('all');
  const [selectedStock, setSelectedStock] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  
  const { addToCart, addToFavorites, removeFromFavorites, isFavorite, getTotalItems } = useCart();

  // Extract unique categories and manufacturers
  const categories = useMemo(() => {
    const cats = products
      .map(p => p.category)
      .filter(Boolean)
      .reduce((acc: any[], cat) => {
        if (cat && !acc.find(c => c.slug.current === cat.slug.current)) {
          acc.push(cat);
        }
        return acc;
      }, []);
    return cats;
  }, [products]);

  const manufacturers = useMemo(() => {
    const mfgs = products
      .map(p => p.manufacturer)
      .filter(Boolean)
      .reduce((acc: any[], mfg) => {
        if (mfg && !acc.find(m => m.code === mfg.code)) {
          acc.push(mfg);
        }
        return acc;
      }, []);
    return mfgs;
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.manufacturer?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        product.category?.slug.current === selectedCategory;
      
      const matchesManufacturer = selectedManufacturer === 'all' || 
        product.manufacturer?.code === selectedManufacturer;
      
      const matchesStock = selectedStock === 'all' || 
        (selectedStock === 'in-stock' && product.variants?.some(v => v.stockStatus === 'in-stock')) ||
        (selectedStock === 'low-stock' && product.variants?.some(v => v.stockStatus === 'low-stock')) ||
        (selectedStock === 'out-of-stock' && product.variants?.some(v => v.stockStatus === 'out-of-stock'));
      
      return matchesSearch && matchesCategory && matchesManufacturer && matchesStock;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-asc':
          return (a.variants?.[0]?.basePrice || 0) - (b.variants?.[0]?.basePrice || 0);
        case 'price-desc':
          return (b.variants?.[0]?.basePrice || 0) - (a.variants?.[0]?.basePrice || 0);
        case 'manufacturer':
          return (a.manufacturer?.name || '').localeCompare(b.manufacturer?.name || '');
        case 'stock':
          const getStockPriority = (product: Product) => {
            const stockStatus = product.variants?.[0]?.stockStatus;
            if (stockStatus === 'in-stock') return 0;
            if (stockStatus === 'low-stock') return 1;
            return 2;
          };
          return getStockPriority(a) - getStockPriority(b);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, selectedManufacturer, selectedStock, sortBy]);

  const handleAddToCart = (product: Product, variant?: any) => {
    const mainVariant = variant || product.variants?.[0];
    
    // Fallback if no variant exists
    if (!mainVariant) {
      addToCart({
        id: product._id,
        sku: product.productNumber,
        name: product.name,
        price: 0, // Default price if no variant
        quantity: 1,
        image: product.images?.[0]?.asset?.url,
        manufacturer: product.manufacturer?.name,
        inStock: true
      });
      return;
    }

    addToCart({
      id: `${product._id}-${mainVariant.sku}`,
      sku: mainVariant.sku,
      name: product.name,
      price: mainVariant.basePrice || 0,
      quantity: 1,
      image: mainVariant.images?.[0]?.asset?.url || product.images?.[0]?.asset?.url,
      manufacturer: product.manufacturer?.name,
      inStock: mainVariant.stockStatus === 'in-stock'
    });
  };

  const handleToggleFavorite = (product: Product) => {
    const productId = product._id;
    const mainVariant = product.variants?.[0];
    
    if (isFavorite(productId)) {
      removeFromFavorites(productId);
    } else {
      addToFavorites({
        id: productId,
        sku: mainVariant?.sku || product.productNumber,
        name: product.name,
        price: mainVariant?.basePrice || 0,
        image: mainVariant?.images?.[0]?.asset?.url || product.images?.[0]?.asset?.url,
        manufacturer: product.manufacturer?.name,
        inStock: mainVariant?.stockStatus === 'in-stock' || false
      });
    }
  };

  const getStockBadge = (stockStatus: string) => {
    switch (stockStatus) {
      case 'in-stock':
        return <Badge className="bg-green-100 text-green-800">Verfügbar</Badge>;
      case 'low-stock':
        return <Badge className="bg-yellow-100 text-yellow-800">Wenige verfügbar</Badge>;
      case 'out-of-stock':
        return <Badge className="bg-red-100 text-red-800">Nicht verfügbar</Badge>;
      default:
        return <Badge variant="outline">Unbekannt</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Produktname, Artikelnummer oder Hersteller..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Kategorien</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.slug.current} value={cat.slug.current}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedManufacturer} onValueChange={setSelectedManufacturer}>
                <SelectTrigger>
                  <SelectValue placeholder="Hersteller" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Hersteller</SelectItem>
                  {manufacturers.map((mfg) => (
                    <SelectItem key={mfg.code} value={mfg.code}>
                      {mfg.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStock} onValueChange={setSelectedStock}>
                <SelectTrigger>
                  <SelectValue placeholder="Verfügbarkeit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="in-stock">Verfügbar</SelectItem>
                  <SelectItem value="low-stock">Wenige verfügbar</SelectItem>
                  <SelectItem value="out-of-stock">Nicht verfügbar</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sortierung" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-asc">Preis aufsteigend</SelectItem>
                  <SelectItem value="price-desc">Preis absteigend</SelectItem>
                  <SelectItem value="manufacturer">Hersteller</SelectItem>
                  <SelectItem value="stock">Verfügbarkeit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle and Results Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">
            {filteredProducts.length} Artikel gefunden
          </span>
          {searchTerm && (
            <Badge variant="outline">
              Suche: "{searchTerm}"
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4 mr-2" />
            Liste
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4 mr-2" />
            Karten
          </Button>
        </div>
      </div>

      {/* Product Display */}
      {viewMode === 'list' ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Produkt</TableHead>
                  <TableHead>Hersteller</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Preis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-32">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const mainVariant = product.variants?.[0];
                  return (
                    <TableRow key={product._id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                          {mainVariant?.images?.[0] ? (
                            <img 
                              src={mainVariant.images[0].asset.url} 
                              alt={product.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Link 
                            href={`/catalog/product/${product.slug.current}`}
                            className="font-medium hover:text-blue-600"
                          >
                            {product.name}
                          </Link>
                          {product.shortDescription && (
                            <p className="text-sm text-gray-500 mt-1">
                              {product.shortDescription}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.manufacturer?.name || '-'}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {mainVariant?.sku || product.productNumber}
                      </TableCell>
                      <TableCell className="font-medium">
                        {mainVariant?.basePrice ? `€${mainVariant.basePrice.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell>
                        {mainVariant?.stockStatus ? 
                          getStockBadge(mainVariant.stockStatus) : 
                          <Badge variant="outline">Unbekannt</Badge>
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFavorite(product)}
                            className="p-2"
                          >
                            <Heart 
                              className={`w-4 h-4 ${
                                isFavorite(product._id) 
                                  ? 'fill-red-500 text-red-500' 
                                  : 'text-gray-400'
                              }`} 
                            />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            disabled={mainVariant?.stockStatus === 'out-of-stock'}
                            className="px-3"
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            {mainVariant?.stockStatus === 'out-of-stock' ? 'N/A' : 'Hinzufügen'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const mainVariant = product.variants?.[0];
            return (
              <Card key={product._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    {mainVariant?.images?.[0] ? (
                      <img 
                        src={mainVariant.images[0].asset.url} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <Link 
                        href={`/catalog/product/${product.slug.current}`}
                        className="font-medium hover:text-blue-600 line-clamp-2"
                      >
                        {product.name}
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFavorite(product)}
                        className="p-1 ml-2"
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            isFavorite(product._id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </Button>
                    </div>
                    
                    {product.manufacturer && (
                      <p className="text-sm text-gray-500">
                        {product.manufacturer.name}
                      </p>
                    )}
                    
                    <p className="text-xs font-mono text-gray-400">
                      SKU: {mainVariant?.sku || product.productNumber}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        {mainVariant?.basePrice && (
                          <p className="font-semibold">
                            €{mainVariant.basePrice.toFixed(2)}
                          </p>
                        )}
                        {mainVariant?.stockStatus && getStockBadge(mainVariant.stockStatus)}
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={mainVariant?.stockStatus === 'out-of-stock'}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        {mainVariant?.stockStatus === 'out-of-stock' ? 'N/A' : '+'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Keine Produkte gefunden
            </h3>
            <p className="text-gray-500">
              Versuchen Sie, Ihre Suchkriterien zu ändern oder Filter zu entfernen.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}