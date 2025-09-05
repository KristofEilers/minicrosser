"use client";

import { useState } from "react";
import { 
  ShoppingCart,
  Plus,
  Minus,
  X,
  Package,
  ArrowLeft,
  FileText,
  Mail,
  Calculator,
  Calendar,
  Building,
  User,
  Truck,
  Clock,
  Euro,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCart } from "@/lib/contexts/cart-context";
import Link from "next/link";

export default function OrderOverviewPage() {
  const [isRequestingQuote, setIsRequestingQuote] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  
  const { 
    state, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    getTotalItems, 
    getTotalPrice 
  } = useCart();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleQuoteRequest = async () => {
    setIsRequestingQuote(true);
    
    try {
      const quoteData = {
        id: `QUO-${Math.floor(Math.random() * 1000000)}`,
        items: state.items,
        totalItems: getTotalItems(),
        estimatedValue: getTotalPrice(),
        requestDate: new Date().toISOString(),
        status: 'pending',
        notes: orderNotes,
        customerInfo: {
          company: 'Mustermann Autoteile GmbH',
          contact: 'Max Mustermann',
          email: 'max@mustermann-gmbh.de'
        }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store in localStorage for demo purposes
      const existingQuotes = JSON.parse(localStorage.getItem('dealer-quotes') || '[]');
      existingQuotes.unshift(quoteData);
      localStorage.setItem('dealer-quotes', JSON.stringify(existingQuotes));
      
      // Clear cart after successful quote request
      clearCart();
      
      alert('Angebotsanfrage erfolgreich gesendet! Sie erhalten eine E-Mail-Bestätigung.');
      
      // Redirect to quotes page
      window.location.href = '/dashboard/quotes';
      
    } catch (error) {
      alert('Fehler beim Senden der Angebotsanfrage. Bitte versuchen Sie es erneut.');
    } finally {
      setIsRequestingQuote(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/catalog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zum Katalog
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Bestellübersicht</h1>
        </div>
        
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Keine Artikel ausgewählt
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Fügen Sie Artikel aus dem Produktkatalog hinzu, um eine Angebotsanfrage zu stellen 
              oder direkt zu bestellen.
            </p>
            <Button size="lg" asChild>
              <Link href="/dashboard/catalog">
                <Package className="w-5 h-5 mr-2" />
                Zum Produktkatalog
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/catalog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zum Katalog
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Bestellübersicht</h1>
            <p className="text-gray-500">
              {getTotalItems()} Artikel • Geschätzter Wert: €{getTotalPrice().toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            <Clock className="w-3 h-3 mr-1" />
            Heute
          </Badge>
          <Button variant="outline" onClick={clearCart} className="text-red-600 hover:text-red-700">
            <X className="w-4 h-4 mr-1" />
            Alle entfernen
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content - Articles */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Kundeninformationen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Unternehmen</h4>
                  <p className="text-gray-600">Mustermann Autoteile GmbH</p>
                  <p className="text-sm text-gray-500">Kundennummer: HD-2024-001</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Ansprechpartner</h4>
                  <p className="text-gray-600">Max Mustermann</p>
                  <p className="text-sm text-gray-500">max@mustermann-gmbh.de</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Articles Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Artikel ({getTotalItems()} Stück)
                </div>
                <Badge variant="secondary">
                  {state.items.length} verschiedene Artikel
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16"></TableHead>
                      <TableHead>Artikel</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Einzelpreis</TableHead>
                      <TableHead className="w-32">Menge</TableHead>
                      <TableHead>Gesamtpreis</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            {item.manufacturer && (
                              <p className="text-sm text-gray-500">{item.manufacturer}</p>
                            )}
                            <div className="flex items-center mt-1">
                              {item.inStock ? (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verfügbar
                                </Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800 text-xs">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Nicht verfügbar
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{item.sku}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">€{item.price.toFixed(2)}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                              className="w-16 text-center h-8"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">
                            €{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Anmerkungen zur Bestellung
              </CardTitle>
              <CardDescription>
                Besondere Wünsche, Liefertermine oder technische Anfragen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Beispiel: Eilauftrag bis Freitag benötigt, bevorzugte Lieferzeit 8-12 Uhr, technische Beratung zu Artikel XY erwünscht..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-2">
                Diese Informationen werden an unseren Vertrieb weitergeleitet
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Zusammenfassung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Artikelanzahl</span>
                    <span className="font-medium">{getTotalItems()} Stück</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Listenwert</span>
                    <span className="font-medium">€{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Händlerrabatt</span>
                    <span>nach Anfrage</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Staffelpreise</span>
                    <span>nach Anfrage</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Lieferkosten</span>
                    <span>nach Anfrage</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Geschätzter Wert</span>
                    <span>€{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    * Endpreis nach individueller Kalkulation
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <Button 
                  className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700" 
                  onClick={handleQuoteRequest}
                  disabled={isRequestingQuote}
                >
                  {isRequestingQuote ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Angebot wird angefragt...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Angebot anfragen
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-lg"
                  asChild
                >
                  <Link href="/dashboard/checkout">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Direkt bestellen
                  </Link>
                </Button>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">
                        Bei Angebotsanfrage erhalten Sie:
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                          Individuelle Händlerpreise
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                          Aktuelle Verfügbarkeit
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                          Präzise Lieferzeiten
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                          E-Mail-Bestätigung
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Process Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Nächste Schritte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Angebot anfordern</p>
                    <p className="text-xs text-gray-500">Automatischer E-Mail-Versand</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-gray-400">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bearbeitung</p>
                    <p className="text-xs text-gray-500">Binnen 24h Werktag</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-gray-400">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Angebot erhalten</p>
                    <p className="text-xs text-gray-500">Per E-Mail & Portal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}