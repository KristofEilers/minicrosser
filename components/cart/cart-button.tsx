"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/contexts/cart-context";
import Link from "next/link";

export default function CartButton() {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <Button asChild className="relative">
      <Link href="/dashboard/order-overview">
        <ShoppingCart className="w-4 h-4 mr-2" />
        Bestellübersicht
        {totalItems > 0 && (
          <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
            {totalItems}
          </Badge>
        )}
      </Link>
    </Button>
  );
}