import { Suspense } from "react";
import Link from "next/link";
import { 
  ArrowUpIcon,
  ArrowDownIcon,
  ShoppingCart,
  Package,
  Euro,
  Clock,
  TrendingUp,
  Eye
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data - in einer echten App würde dies aus der API kommen
const dashboardStats = [
  {
    name: "Offene Bestellungen",
    value: "3",
    change: "+2",
    changeType: "increase",
    icon: ShoppingCart,
    href: "/dashboard/orders"
  },
  {
    name: "Diesen Monat bestellt",
    value: "€12,458",
    change: "+15.3%",
    changeType: "increase", 
    icon: Euro,
    href: "/dashboard/orders"
  },
  {
    name: "Verfügbare Artikel",
    value: "1,247",
    change: "+23",
    changeType: "increase",
    icon: Package,
    href: "/dashboard/catalog"
  },
  {
    name: "Letzte Anmeldung",
    value: "Heute",
    change: "09:30",
    changeType: "neutral",
    icon: Clock,
    href: "/dashboard/account"
  }
];

const recentOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    items: 3,
    total: "€245.80",
    status: "shipped",
  },
  {
    id: "ORD-2024-002", 
    date: "2024-01-12",
    items: 1,
    total: "€89.90",
    status: "delivered",
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-10",
    items: 5,
    total: "€567.45",
    status: "processing",
  }
];

const topProducts = [
  {
    name: "Bosch Zündkerzen Set",
    sku: "0242235663",
    views: 127,
    orders: 23,
  },
  {
    name: "BMW Bremsscheiben Vorne",
    sku: "34116794300", 
    views: 98,
    orders: 18,
  },
  {
    name: "Bosch Zündspule",
    sku: "0221504470",
    views: 85,
    orders: 15,
  }
];

function getStatusColor(status: string) {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-yellow-100 text-yellow-800";
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
    default:
      return status;
  }
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Willkommen zurück! Hier ist eine Übersicht über Ihr Konto.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.name} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      <div className="flex items-center mt-1">
                        {stat.changeType === "increase" && (
                          <ArrowUpIcon className="w-4 h-4 text-green-500" />
                        )}
                        {stat.changeType === "decrease" && (
                          <ArrowDownIcon className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ml-1 ${
                          stat.changeType === "increase" ? "text-green-600" :
                          stat.changeType === "decrease" ? "text-red-600" :
                          "text-gray-600"
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Aktuelle Bestellungen</CardTitle>
                <CardDescription>
                  Ihre letzten Bestellungen im Überblick
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/orders">Alle anzeigen</Link>
              </Button>
            </div>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <Link 
                        href={`/dashboard/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {order.id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {new Date(order.date).toLocaleDateString('de-DE')}
                    </TableCell>
                    <TableCell>{order.items} Artikel</TableCell>
                    <TableCell className="font-medium">{order.total}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)} variant="secondary">
                        {getStatusText(order.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Beliebte Artikel</CardTitle>
                <CardDescription>
                  Meistgesuchte Produkte in Ihrem Bereich
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/catalog">Katalog öffnen</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.sku} className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <Link 
                    href={`/catalog/product/${product.sku}`}
                    className="text-sm font-medium text-gray-900 hover:text-blue-600"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-gray-500 font-mono">
                    SKU: {product.sku}
                  </p>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {product.views}
                  </div>
                  <div className="flex items-center">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    {product.orders}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Schnellzugriff</CardTitle>
          <CardDescription>
            Häufig verwendete Funktionen für Ihren Arbeitsalltag
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/dashboard/catalog">
                <Package className="w-6 h-6 mb-2" />
                Produktkatalog durchsuchen
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/dashboard/orders/new">
                <ShoppingCart className="w-6 h-6 mb-2" />
                Neue Bestellung
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/dashboard/quotes">
                <TrendingUp className="w-6 h-6 mb-2" />
                Angebot anfragen
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/dashboard/account">
                <TrendingUp className="w-6 h-6 mb-2" />
                Kontodaten
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const metadata = {
  title: "Dashboard | Händlerportal",
  description: "Übersicht über Ihre Bestellungen, beliebte Produkte und Kontoaktivitäten",
};