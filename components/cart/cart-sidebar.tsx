"use client";

import { 
  ShoppingCart,
  Plus,
  Minus,
  X,
  Package,
  ArrowRight,
  FileText,
  Mail,
  Calculator,
  Calendar,
  Building,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/contexts/cart-context";
import Link from "next/link";
import { useState } from "react";

export default function CartSidebar() {
  const [isRequestingQuote, setIsRequestingQuote] = useState(false);
  
  const { 
    state, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    getTotalItems, 
    getTotalPrice,
    toggleCart 
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
      // Hier würde normalerweise ein API-Call gemacht werden
      const quoteData = {
        id: `QUO-${Math.floor(Math.random() * 1000000)}`,
        items: state.items,
        totalItems: getTotalItems(),
        estimatedValue: getTotalPrice(),
        requestDate: new Date().toISOString(),
        status: 'pending',
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
      toggleCart(false);
      
      alert('Angebotsanfrage erfolgreich gesendet! Sie erhalten eine E-Mail-Bestätigung.');
      
      // Optional: Redirect to quotes page
      window.location.href = '/dashboard/quotes';
      
    } catch (error) {
      alert('Fehler beim Senden der Angebotsanfrage. Bitte versuchen Sie es erneut.');
    } finally {
      setIsRequestingQuote(false);
    }
  };

  return (
    <Sheet open={state.isOpen} onOpenChange={toggleCart}>
      <SheetTrigger asChild>
        <Button className="relative">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Warenkorb
          {getTotalItems() > 0 && (
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5" />
              Bestellübersicht
            </div>
            {state.items.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearCart}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4 mr-1" />
                Zurücksetzen
              </Button>
            )}
          </SheetTitle>
          <SheetDescription>
            {state.items.length === 0 
              ? "Keine Artikel ausgewählt" 
              : `${getTotalItems()} Artikel • Geschätzte Summe: €${getTotalPrice().toFixed(2)}`
            }
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {state.items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Artikel ausgewählt</h3>
                <p className="text-gray-500 mb-4">
                  Fügen Sie Artikel hinzu, um eine Angebotsanfrage zu stellen oder direkt zu bestellen.
                </p>
                <Button onClick={() => toggleCart(false)} asChild>
                  <Link href="/dashboard/catalog">
                    <Package className="w-4 h-4 mr-2" />
                    Zum Produktkatalog
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 py-6 space-y-4 overflow-y-auto">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-2">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {item.name}
                          </h3>
                          {item.manufacturer && (
                            <p className="text-xs text-gray-500 mt-1">
                              {item.manufacturer}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 font-mono mt-1">
                            SKU: {item.sku}
                          </p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 h-auto text-gray-400 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            €{(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            €{item.price.toFixed(2)} / Stück
                          </p>
                        </div>
                      </div>
                      
                      {!item.inStock && (
                        <Badge variant="outline" className="mt-2 text-xs bg-red-50 text-red-700">
                          Nicht verfügbar
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Order Summary */}
              <div className="py-4 space-y-4">
                {/* Company Info */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Building className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Mustermann Autoteile GmbH</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-blue-700">
                    <User className="w-3 h-3" />
                    <span>Max Mustermann</span>
                    <span>•</span>
                    <Calendar className="w-3 h-3" />
                    <span>Heute</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Artikelanzahl</span>
                    <span className="font-medium">{getTotalItems()} Stück</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Geschätzter Wert</span>
                    <span className="font-medium">€{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Rabatte & Konditionen</span>
                    <span>nach Anfrage</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Basis-Summe (zzgl. MwSt.)</span>
                    <span>€{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    onClick={handleQuoteRequest}
                    disabled={isRequestingQuote}
                  >
                    {isRequestingQuote ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Angebot wird angefragt...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Angebot anfragen
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => toggleCart(false)}
                    asChild
                  >
                    <Link href="/dashboard/checkout">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Direkt bestellen
                    </Link>
                  </Button>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Mail className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div className="text-xs text-gray-600">
                      <p className="font-medium mb-1">Bei Angebotsanfrage erhalten Sie:</p>
                      <ul className="space-y-0.5">
                        <li>• Individuelle Händlerpreise</li>
                        <li>• Verfügbarkeitsprüfung</li>
                        <li>• Lieferzeit-Angaben</li>
                        <li>• E-Mail-Bestätigung</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}