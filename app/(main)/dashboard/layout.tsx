"use client";

import { Suspense } from "react";
import Link from "next/link";
import { 
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  User,
  Search,
  Bell,
  LogOut,
  BarChart3,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CartProvider } from "@/lib/contexts/cart-context";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    current: true,
  },
  {
    name: "Produktkatalog",
    href: "/dashboard/catalog",
    icon: Package,
    current: false,
  },
  {
    name: "Bestellungen",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    current: false,
    badge: "3",
  },
  {
    name: "Favoriten",
    href: "/dashboard/favorites",
    icon: Heart,
    current: false,
  },
  {
    name: "Angebote",
    href: "/dashboard/quotes",
    icon: FileText,
    current: false,
  },
  {
    name: "Analysen",
    href: "/dashboard/analytics",
    icon: BarChart3,
    current: false,
  },
  {
    name: "Konto",
    href: "/dashboard/account",
    icon: User,
    current: false,
  },
  {
    name: "Einstellungen",
    href: "/dashboard/settings",
    icon: Settings,
    current: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Händlerportal
              </span>
            </Link>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      "group flex items-center pl-2 py-2 text-sm font-medium border-l-4"
                    )}
                  >
                    <Icon
                      className={classNames(
                        item.current
                          ? "text-blue-500"
                          : "text-gray-400 group-hover:text-gray-500",
                        "mr-3 h-5 w-5"
                      )}
                    />
                    {item.name}
                    {item.badge && (
                      <Badge className="ml-auto" variant="secondary">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>
            
            {/* Homepage Link at Bottom */}
            <div className="flex-shrink-0 px-2 pb-4">
              <Link
                href="/"
                className="group flex items-center pl-2 py-2 text-sm font-medium border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <LayoutDashboard
                  className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                />
                Zur Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Suspense fallback={<div>Loading...</div>}>
                {children}
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </div>
    </CartProvider>
  );
}