import { Suspense } from "react";
import Link from "next/link";
import { 
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock order data
const orders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15T10:30:00Z",
    items: 3,
    total: 245.80,
    status: "shipped",
    tracking: "DHL-123456789",
    estimatedDelivery: "2024-01-17",
    products: [
      { name: "Bosch Zündkerzen Set", sku: "0242235663", quantity: 2, price: 8.95 },
      { name: "BMW Luftfilter", sku: "13717521023", quantity: 1, price: 28.90 }
    ]
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-12T14:15:00Z",
    items: 1,
    total: 89.90,
    status: "delivered",
    tracking: "DHL-987654321",
    deliveredDate: "2024-01-14",
    products: [
      { name: "BMW Bremsbeläge Vorne", sku: "34116794300", quantity: 1, price: 89.90 }
    ]
  },
  {
    id: "ORD-2024-003", 
    date: "2024-01-10T09:45:00Z",
    items: 5,
    total: 567.45,
    status: "processing",
    estimatedShipping: "2024-01-16",
    products: [
      { name: "Bosch Zündspulen Set", sku: "0221504470", quantity: 4, price: 68.90 },
      { name: "BMW Ölfilter", sku: "11427566327", quantity: 1, price: 12.85 }
    ]
  },
  {
    id: "ORD-2024-004",
    date: "2024-01-08T16:20:00Z", 
    items: 2,
    total: 156.70,
    status: "cancelled",
    cancelledDate: "2024-01-09",
    cancelReason: "Artikel nicht verfügbar",
    products: [
      { name: "Mercedes Bremsscheiben", sku: "A0004230712", quantity: 2, price: 78.35 }
    ]
  }
];

function getStatusIcon(status: string) {
  switch (status) {
    case "delivered":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "shipped":
      return <Truck className="w-4 h-4 text-blue-500" />;
    case "processing":
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case "cancelled":
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Package className="w-4 h-4 text-gray-500" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "delivered":
      return "Geliefert";
    case "shipped":
      return "Versendet";
    case "processing":
      return "In Bearbeitung";
    case "cancelled":
      return "Storniert";
    default:
      return status;
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Bestellungen</h1>
          <p className="mt-1 text-sm text-gray-500">
            Übersicht über alle Ihre Bestellungen und deren Status
          </p>
        </div>
        <div className="flex space-x-2">
          <Button asChild>
            <Link href="/dashboard/catalog">
              <Package className="w-4 h-4 mr-2" />
              Neue Bestellung
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
                <p className="text-sm font-medium text-gray-600">Offene Bestellungen</p>
                <p className="text-2xl font-semibold text-gray-900">3</p>
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
                <p className="text-sm font-medium text-gray-600">Versandt</p>
                <p className="text-2xl font-semibold text-gray-900">1</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Geliefert</p>
                <p className="text-2xl font-semibold text-gray-900">1</p>
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
                <p className="text-sm font-medium text-gray-600">Monatssumme</p>
                <p className="text-2xl font-semibold text-gray-900">€1,059</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
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
                  placeholder="Bestellnummer oder Artikel suchen..."
                  className="pl-10"
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="processing">In Bearbeitung</SelectItem>
                <SelectItem value="shipped">Versendet</SelectItem>
                <SelectItem value="delivered">Geliefert</SelectItem>
                <SelectItem value="cancelled">Storniert</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Zeitraum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Letzte 7 Tage</SelectItem>
                <SelectItem value="30d">Letzter Monat</SelectItem>
                <SelectItem value="90d">Letzte 3 Monate</SelectItem>
                <SelectItem value="all">Alle</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bestellübersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bestellung</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Artikel</TableHead>
                <TableHead>Gesamt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tracking</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <Link 
                      href={`/dashboard/orders/${order.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {order.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(order.date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-2 text-gray-400" />
                      {order.items} Artikel
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    €{order.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <Badge className={getStatusColor(order.status)} variant="secondary">
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.tracking ? (
                      <div className="text-sm">
                        <div className="font-mono text-xs">{order.tracking}</div>
                        {order.estimatedDelivery && (
                          <div className="text-gray-500">
                            Erw. {new Date(order.estimatedDelivery).toLocaleDateString('de-DE')}
                          </div>
                        )}
                        {order.deliveredDate && (
                          <div className="text-green-600">
                            ✓ {new Date(order.deliveredDate).toLocaleDateString('de-DE')}
                          </div>
                        )}
                      </div>
                    ) : order.estimatedShipping ? (
                      <div className="text-sm text-gray-500">
                        Versand: {new Date(order.estimatedShipping).toLocaleDateString('de-DE')}
                      </div>
                    ) : order.cancelReason ? (
                      <div className="text-sm text-red-600">
                        {order.cancelReason}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/orders/${order.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Details anzeigen
                          </Link>
                        </DropdownMenuItem>
                        {order.tracking && (
                          <DropdownMenuItem>
                            <Truck className="mr-2 h-4 w-4" />
                            Sendung verfolgen
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Rechnung herunterladen
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Package className="mr-2 h-4 w-4" />
                          Erneut bestellen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export const metadata = {
  title: "Bestellungen | Händlerportal",
  description: "Übersicht über alle Ihre Bestellungen mit Tracking und Status-Informationen",
};