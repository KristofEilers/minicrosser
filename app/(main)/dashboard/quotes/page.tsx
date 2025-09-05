"use client";

import { useState, useEffect } from "react";
import { 
  FileText,
  Clock,
  Check,
  X,
  Eye,
  Download,
  Mail,
  Calendar,
  Package,
  Euro,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  Plus
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

interface Quote {
  id: string;
  items: any[];
  totalItems: number;
  estimatedValue: number;
  requestDate: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  customerInfo: {
    company: string;
    contact: string;
    email: string;
  };
  response?: {
    finalPrice: number;
    validUntil: string;
    deliveryTime: string;
    notes: string;
    respondedAt: string;
  };
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    // Load quotes from localStorage
    const savedQuotes = localStorage.getItem('dealer-quotes');
    if (savedQuotes) {
      setQuotes(JSON.parse(savedQuotes));
    }
  }, []);

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = !searchTerm || 
      quote.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customerInfo.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || quote.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Wartend</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800"><FileText className="w-3 h-3 mr-1" />In Bearbeitung</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Abgeschlossen</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><X className="w-3 h-3 mr-1" />Abgelehnt</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Meine Angebote</h1>
          <p className="mt-1 text-sm text-gray-500">
            Übersicht über alle Ihre Angebotsanfragen und deren Status
          </p>
        </div>
        <div className="flex space-x-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/catalog">
              <Plus className="w-4 h-4 mr-2" />
              Neue Anfrage
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Wartende Angebote</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {quotes.filter(q => q.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Bearbeitung</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {quotes.filter(q => q.status === 'processing').length}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Abgeschlossen</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {quotes.filter(q => q.status === 'completed').length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gesamtwert</p>
                <p className="text-2xl font-semibold text-gray-900">
                  €{quotes.reduce((sum, q) => sum + q.estimatedValue, 0).toFixed(0)}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Euro className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Angebotsnummer oder Firma suchen..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="pending">Wartend</SelectItem>
                <SelectItem value="processing">In Bearbeitung</SelectItem>
                <SelectItem value="completed">Abgeschlossen</SelectItem>
                <SelectItem value="rejected">Abgelehnt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quotes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Angebotsübersicht</CardTitle>
          <CardDescription>
            {filteredQuotes.length} von {quotes.length} Angeboten
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredQuotes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {quotes.length === 0 ? 'Noch keine Angebote' : 'Keine Angebote gefunden'}
              </h3>
              <p className="text-gray-500 mb-4">
                {quotes.length === 0 
                  ? 'Stellen Sie Ihre erste Angebotsanfrage über den Produktkatalog.'
                  : 'Versuchen Sie, Ihre Suchkriterien anzupassen.'
                }
              </p>
              {quotes.length === 0 && (
                <Button asChild>
                  <Link href="/dashboard/catalog">
                    <Package className="w-4 h-4 mr-2" />
                    Zum Produktkatalog
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Angebotsnummer</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Artikel</TableHead>
                  <TableHead>Geschätzter Wert</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {quote.id}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(quote.requestDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-2 text-gray-400" />
                        {quote.totalItems} Artikel
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      €{quote.estimatedValue.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(quote.status)}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedQuote(quote)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Angebot {quote.id}</DialogTitle>
                            <DialogDescription>
                              Angefragt am {formatDate(quote.requestDate)}
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedQuote && (
                            <div className="space-y-4">
                              {/* Quote Details */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Kunde</h4>
                                  <p className="text-sm text-gray-600">{selectedQuote.customerInfo.company}</p>
                                  <p className="text-sm text-gray-600">{selectedQuote.customerInfo.contact}</p>
                                  <p className="text-sm text-gray-600">{selectedQuote.customerInfo.email}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Status</h4>
                                  {getStatusBadge(selectedQuote.status)}
                                  <p className="text-sm text-gray-600 mt-2">
                                    {selectedQuote.totalItems} Artikel • €{selectedQuote.estimatedValue.toFixed(2)}
                                  </p>
                                </div>
                              </div>

                              {/* Items */}
                              <div>
                                <h4 className="font-medium mb-2">Angefragte Artikel</h4>
                                <div className="border rounded-lg">
                                  {selectedQuote.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 border-b last:border-b-0">
                                      <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                                        {item.manufacturer && (
                                          <p className="text-sm text-gray-500">{item.manufacturer}</p>
                                        )}
                                      </div>
                                      <div className="text-right">
                                        <p className="font-medium">€{item.price.toFixed(2)}</p>
                                        <p className="text-sm text-gray-500">{item.quantity}x</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Response if available */}
                              {selectedQuote.response && (
                                <div className="bg-green-50 p-4 rounded-lg">
                                  <h4 className="font-medium text-green-900 mb-2">Angebot erhalten</h4>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="font-medium">Finaler Preis:</p>
                                      <p className="text-green-700">€{selectedQuote.response.finalPrice.toFixed(2)}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Gültig bis:</p>
                                      <p className="text-green-700">{formatDate(selectedQuote.response.validUntil)}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Lieferzeit:</p>
                                      <p className="text-green-700">{selectedQuote.response.deliveryTime}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Angebot vom:</p>
                                      <p className="text-green-700">{formatDate(selectedQuote.response.respondedAt)}</p>
                                    </div>
                                  </div>
                                  {selectedQuote.response.notes && (
                                    <div className="mt-3">
                                      <p className="font-medium">Anmerkungen:</p>
                                      <p className="text-green-700">{selectedQuote.response.notes}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}