"use client";

import { useState } from "react";
import { 
  ShoppingCart,
  Package,
  CreditCard,
  Truck,
  Check,
  ArrowLeft,
  Plus,
  Minus,
  X
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/lib/contexts/cart-context";
import Link from "next/link";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [orderNotes, setOrderNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('invoice');
  
  const { 
    state, 
    updateQuantity, 
    removeFromCart,
    getTotalItems, 
    getTotalPrice,
    clearCart 
  } = useCart();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleSubmitOrder = () => {
    // Hier würde normalerweise die Bestellung an das Backend gesendet
    alert('Bestellung erfolgreich aufgegeben! Sie erhalten eine Bestätigungs-E-Mail.');
    clearCart();
    // Weiterleitung zur Bestellbestätigung
    window.location.href = '/dashboard/orders';
  };

  const deliveryFee = deliveryMethod === 'express' ? 19.90 : 0;
  const totalPrice = getTotalPrice() + deliveryFee;

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
          <h1 className="text-2xl font-semibold text-gray-900">Checkout</h1>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ihr Warenkorb ist leer
            </h3>
            <p className="text-gray-500 mb-4">
              Fügen Sie Produkte zum Warenkorb hinzu, um eine Bestellung aufzugeben.
            </p>
            <Button asChild>
              <Link href="/dashboard/catalog">
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
      <div className="flex items-center space-x-4">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/catalog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zum Katalog
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">Checkout</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNumber 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {step > stepNumber ? <Check className="w-4 h-4" /> : stepNumber}
            </div>
            {stepNumber < 3 && (
              <div className={`w-16 h-0.5 mx-2 ${
                step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Warenkorb überprüfen
                </CardTitle>
                <CardDescription>
                  Überprüfen Sie Ihre Artikel und Mengen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
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
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      {item.manufacturer && (
                        <p className="text-sm text-gray-500">{item.manufacturer}</p>
                      )}
                      <p className="text-sm text-gray-400 font-mono">SKU: {item.sku}</p>
                      <p className="text-sm font-medium">€{item.price.toFixed(2)} / Stück</p>
                    </div>
                    
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
                      <p className="font-semibold">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                <Button 
                  className="w-full" 
                  onClick={() => setStep(2)}
                >
                  Weiter zur Lieferung
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Lieferung & Zahlung
                </CardTitle>
                <CardDescription>
                  Wählen Sie Lieferart und Zahlungsmethode
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="delivery">Lieferart</Label>
                  <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        Standardversand (3-5 Werktage) - Kostenlos
                      </SelectItem>
                      <SelectItem value="express">
                        Expressversand (1-2 Werktage) - €19,90
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="payment">Zahlungsmethode</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invoice">
                        Kauf auf Rechnung (Zahlungsziel 30 Tage)
                      </SelectItem>
                      <SelectItem value="transfer">
                        Vorkasse (Banküberweisung)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="notes">Anmerkungen zur Bestellung (optional)</Label>
                  <Textarea 
                    id="notes"
                    placeholder="Besondere Lieferwünsche, Nachfragen, etc..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                  />
                </div>
                
                <div className="flex space-x-4">
                  <Button 
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Zurück
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={() => setStep(3)}
                  >
                    Weiter zur Bestätigung
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  Bestellung bestätigen
                </CardTitle>
                <CardDescription>
                  Überprüfen Sie alle Angaben vor der Bestellung
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Lieferart</h4>
                  <p className="text-sm text-gray-600">
                    {deliveryMethod === 'standard' 
                      ? 'Standardversand (3-5 Werktage) - Kostenlos'
                      : 'Expressversand (1-2 Werktage) - €19,90'
                    }
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Zahlungsmethode</h4>
                  <p className="text-sm text-gray-600">
                    {paymentMethod === 'invoice' 
                      ? 'Kauf auf Rechnung (Zahlungsziel 30 Tage)'
                      : 'Vorkasse (Banküberweisung)'
                    }
                  </p>
                </div>

                {orderNotes && (
                  <div>
                    <h4 className="font-medium mb-2">Anmerkungen</h4>
                    <p className="text-sm text-gray-600">{orderNotes}</p>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Bestellte Artikel ({getTotalItems()} Stück)</h4>
                  <div className="space-y-2">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>€{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button 
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    Zurück
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={handleSubmitOrder}
                  >
                    Bestellung verbindlich aufgeben
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Bestellübersicht</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Zwischensumme ({getTotalItems()} Artikel)</span>
                  <span>€{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Versandkosten</span>
                  <span>{deliveryFee > 0 ? `€${deliveryFee.toFixed(2)}` : 'Kostenlos'}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Gesamt (zzgl. MwSt.)</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500">
                  zzgl. 19% MwSt. (€{(totalPrice * 0.19).toFixed(2)})
                </p>
                <p className="text-sm font-medium">
                  <strong>Gesamtbetrag: €{(totalPrice * 1.19).toFixed(2)}</strong>
                </p>
              </div>

              <Separator />

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Sichere Bestellung</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Kostenlose Stornierung bis Versand</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Originalteile & Garantie</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

