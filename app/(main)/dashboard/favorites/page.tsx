"use client";

import { useState } from "react";
import { 
  Heart,
  ShoppingCart,
  Package,
  Search,
  Trash2,
  Grid,
  List,
  Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCart } from "@/lib/contexts/cart-context";

type ViewMode = 'list' | 'grid';

export default function FavoritesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    state, 
    addToCart, 
    removeFromFavorites,
    getTotalItems 
  } = useCart();

  const filteredFavorites = state.favorites.filter(item =>
    !searchTerm || 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.manufacturer && item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      sku: item.sku,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      manufacturer: item.manufacturer,
      inStock: item.inStock
    });
  };

  const handleAddAllToCart = () => {
    filteredFavorites.forEach(item => {
      if (item.inStock) {
        handleAddToCart(item);
      }
    });
  };

  const handleClearFavorites = () => {
    if (window.confirm('Möchten Sie wirklich alle Favoriten entfernen?')) {
      filteredFavorites.forEach(item => {
        removeFromFavorites(item.id);
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Meine Favoriten</h1>
          <p className="mt-1 text-sm text-gray-500">
            {state.favorites.length} gespeicherte Artikel
          </p>
        </div>
        
        <div className="flex space-x-2">
          {filteredFavorites.length > 0 && (
            <>
              <Button 
                variant="outline"
                onClick={handleAddAllToCart}
                disabled={!filteredFavorites.some(item => item.inStock)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Alle verfügbaren hinzufügen
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Liste exportieren
              </Button>
              <Button 
                variant="outline"
                onClick={handleClearFavorites}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Alle entfernen
              </Button>
            </>
          )}
        </div>
      </div>

      {state.favorites.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Noch keine Favoriten
            </h3>
            <p className="text-gray-500 mb-4">
              Fügen Sie Produkte zu Ihren Favoriten hinzu, um sie später schnell zu finden.
            </p>
            <Button asChild>
              <a href="/dashboard/catalog">
                <Package className="w-4 h-4 mr-2" />
                Produkte durchsuchen
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Search and View Toggle */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Favoriten durchsuchen..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
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
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {filteredFavorites.length} von {state.favorites.length} Favoriten
            </span>
            {searchTerm && (
              <Badge variant="outline">
                Suche: "{searchTerm}"
              </Badge>
            )}
          </div>

          {/* Favorites Display */}
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
                    {filteredFavorites.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                        </TableCell>
                        <TableCell>
                          {item.manufacturer || '-'}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.sku}
                        </TableCell>
                        <TableCell className="font-medium">
                          €{item.price.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge className={item.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {item.inStock ? 'Verfügbar' : 'Nicht verfügbar'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromFavorites(item.id)}
                              className="p-2 text-red-600 hover:text-red-700"
                            >
                              <Heart className="w-4 h-4 fill-current" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAddToCart(item)}
                              disabled={!item.inStock}
                              className="px-3"
                            >
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              {item.inStock ? 'Hinzufügen' : 'N/A'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFavorites.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium line-clamp-2 flex-1">
                          {item.name}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromFavorites(item.id)}
                          className="p-1 ml-2 text-red-600 hover:text-red-700"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </Button>
                      </div>
                      
                      {item.manufacturer && (
                        <p className="text-sm text-gray-500">
                          {item.manufacturer}
                        </p>
                      )}
                      
                      <p className="text-xs font-mono text-gray-400">
                        SKU: {item.sku}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-semibold">
                            €{item.price.toFixed(2)}
                          </p>
                          <Badge className={item.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {item.inStock ? 'Verfügbar' : 'Nicht verfügbar'}
                          </Badge>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.inStock}
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          {item.inStock ? '+' : 'N/A'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredFavorites.length === 0 && searchTerm && (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Keine Favoriten gefunden
                </h3>
                <p className="text-gray-500">
                  Keine Favoriten entsprechen Ihrer Suche nach "{searchTerm}".
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

