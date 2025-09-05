import { Suspense } from "react";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpIcon,
  ArrowDownIcon,
  ShoppingCart,
  Package,
  Euro,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

// Mock analytics data
const kpiMetrics = [
  {
    name: "Gesamtumsatz",
    value: "€156,420",
    change: "+12.5%",
    changeType: "increase",
    icon: Euro,
    description: "Letzter Monat"
  },
  {
    name: "Bestellungen",
    value: "127",
    change: "+8.2%", 
    changeType: "increase",
    icon: ShoppingCart,
    description: "Letzter Monat"
  },
  {
    name: "Avg. Bestellwert",
    value: "€1,232",
    change: "-3.1%",
    changeType: "decrease",
    icon: TrendingUp,
    description: "Letzter Monat"
  },
  {
    name: "Kategorien",
    value: "24",
    change: "+2",
    changeType: "increase", 
    icon: Package,
    description: "Aktiv bestellt"
  }
];

const monthlyData = [
  { month: "Jan", orders: 98, revenue: 125420, avgOrder: 1280 },
  { month: "Feb", orders: 115, revenue: 142850, avgOrder: 1242 },
  { month: "Mar", orders: 127, revenue: 156420, avgOrder: 1232 },
  { month: "Apr", orders: 89, revenue: 98750, avgOrder: 1110 },
  { month: "Mai", orders: 134, revenue: 167890, avgOrder: 1253 },
  { month: "Jun", orders: 156, revenue: 198450, avgOrder: 1272 }
];

const topCategories = [
  { name: "Motor & Antrieb", orders: 45, revenue: "€56,780", share: "36.3%" },
  { name: "Bremsen", orders: 32, revenue: "€38,950", share: "24.9%" },
  { name: "Elektrik", orders: 28, revenue: "€32,140", share: "20.6%" },
  { name: "Karosserie", orders: 15, revenue: "€18,650", share: "11.9%" },
  { name: "Innenausstattung", orders: 7, revenue: "€9,900", share: "6.3%" }
];

const topProducts = [
  { 
    name: "Bosch Zündkerzen Set", 
    sku: "0242235663",
    orders: 23,
    revenue: "€2,067",
    margin: "28.5%",
    trend: "up"
  },
  {
    name: "BMW Bremsscheiben Vorne",
    sku: "34116794300", 
    orders: 18,
    revenue: "€4,185",
    margin: "22.1%",
    trend: "up"
  },
  {
    name: "Bosch Zündspule",
    sku: "0221504470",
    orders: 15, 
    revenue: "€3,420",
    margin: "31.2%",
    trend: "down"
  },
  {
    name: "Mercedes Luftfilter",
    sku: "A0004305800",
    orders: 12,
    revenue: "€1,890",
    margin: "25.8%",
    trend: "up" 
  }
];

const seasonalTrends = [
  { period: "Q1 2024", orders: 340, revenue: "€424,720", growth: "+15.2%" },
  { period: "Q4 2023", orders: 295, revenue: "€368,950", growth: "+8.7%" },
  { period: "Q3 2023", orders: 271, revenue: "€339,410", growth: "+12.3%" },
  { period: "Q2 2023", orders: 241, revenue: "€302,180", growth: "+6.1%" }
];

const customerSegments = [
  { segment: "Premium Kunden", count: 12, revenue: "€89,450", avgOrder: "€2,180" },
  { segment: "Standard Kunden", count: 34, revenue: "€54,320", avgOrder: "€1,095" }, 
  { segment: "Neue Kunden", count: 8, revenue: "€12,650", avgOrder: "€890" }
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analysen & Berichte</h1>
          <p className="mt-1 text-sm text-gray-500">
            Einblicke in Ihre Bestellaktivitäten und Geschäftsentwicklung
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="30d">
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Letzte 7 Tage</SelectItem>
              <SelectItem value="30d">Letzter Monat</SelectItem>
              <SelectItem value="90d">Letzte 3 Monate</SelectItem>
              <SelectItem value="12m">Letztes Jahr</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Zeitraum wählen
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpiMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
                    <div className="flex items-center mt-1">
                      {metric.changeType === "increase" && (
                        <ArrowUpIcon className="w-4 h-4 text-green-500" />
                      )}
                      {metric.changeType === "decrease" && (
                        <ArrowDownIcon className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm ml-1 ${
                        metric.changeType === "increase" ? "text-green-600" :
                        metric.changeType === "decrease" ? "text-red-600" :
                        "text-gray-600"
                      }`}>
                        {metric.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {metric.description}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Monatliche Entwicklung
            </CardTitle>
            <CardDescription>
              Umsatz und Bestellungen im Zeitverlauf
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Chart Visualization</p>
                <p className="text-sm text-gray-500">
                  Hier würde ein interaktives Diagramm der monatlichen Entwicklung angezeigt
                </p>
              </div>
            </div>
            
            {/* Data Table */}
            <div className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Monat</TableHead>
                    <TableHead className="text-right">Bestellungen</TableHead>
                    <TableHead className="text-right">Umsatz</TableHead>
                    <TableHead className="text-right">Ø Bestellwert</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyData.slice(-3).map((data) => (
                    <TableRow key={data.month}>
                      <TableCell className="font-medium">{data.month}</TableCell>
                      <TableCell className="text-right">{data.orders}</TableCell>
                      <TableCell className="text-right">€{data.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">€{data.avgOrder}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Top Kategorien
            </CardTitle>
            <CardDescription>
              Meist bestellte Produktkategorien
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-gray-500">{category.orders} Bestellungen</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{category.revenue}</p>
                    <p className="text-sm text-gray-500">{category.share}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Top Produkte
            </CardTitle>
            <CardDescription>
              Meist bestellte Artikel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.sku} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium truncate">{product.name}</p>
                      {product.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-mono">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium">{product.revenue}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-500">{product.orders}x</p>
                      <Badge variant="outline" className="text-xs">
                        {product.margin}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Seasonal Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Quartalsentwicklung</CardTitle>
            <CardDescription>
              Entwicklung der letzten Quartale
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {seasonalTrends.map((trend) => (
                <div key={trend.period} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{trend.period}</p>
                    <p className="text-sm text-gray-500">{trend.orders} Bestellungen</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{trend.revenue}</p>
                    <p className="text-sm text-green-600">{trend.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Segments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Kundensegmente
            </CardTitle>
            <CardDescription>
              Aufschlüsselung nach Kundentypen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerSegments.map((segment) => (
                <div key={segment.segment} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{segment.segment}</p>
                    <p className="text-sm text-gray-500">{segment.count} Kunden</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{segment.revenue}</p>
                    <p className="text-sm text-gray-500">Ø {segment.avgOrder}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Erkenntnisse & Empfehlungen</CardTitle>
          <CardDescription>
            Automatisch generierte Geschäftseinblicke
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Starke Performance</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Ihr Umsatz ist in den letzten 30 Tagen um 12,5% gestiegen. 
                    Besonders Motor & Antrieb Produkte performen gut.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Optimierungsmöglichkeit</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Der durchschnittliche Bestellwert ist gesunken. 
                    Cross-Selling könnte helfen, dies zu verbessern.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Activity className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Saisonaler Hinweis</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Q2 zeigt typische Frühjahrs-Trends. 
                    Klimaanlagen-Teile könnten bald beliebter werden.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const metadata = {
  title: "Analysen & Berichte | Händlerportal",
  description: "Einblicke in Ihre Bestellaktivitäten und Geschäftsentwicklung",
};