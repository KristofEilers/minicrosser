"use client"

import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { signOut } from "@/lib/auth-client";
import Logo from "@/components/logo";
import MobileNav from "@/components/header/mobile-nav";
import DesktopNav from "@/components/header/desktop-nav";
import { ModeToggle } from "@/components/menu-toggle";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export default function Header() {
  const { user, isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <header className="sticky top-0 w-full border-border/40 bg-background/95 z-50">
      <div className="container flex items-center justify-between h-14">
        <Link href="/" aria-label="Home page">
          {/* Mock Logo for now */}
          <div className="font-bold">AutoParts</div>
        </Link>
        <div className="hidden xl:flex gap-7 items-center justify-between">
          {/* Mock Navigation for now */}
          <nav className="flex items-center space-x-6">
            <Link href="/dashboard" className="text-sm hover:text-primary">Dashboard</Link>
            <Link href="/dashboard/catalog" className="text-sm hover:text-primary">Katalog</Link>
            <Link href="/dashboard/quotes" className="text-sm hover:text-primary">Angebote</Link>
          </nav>
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard/account">
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    {user?.email}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm">Anmelden</Button>
              </Link>
            )}
            <ModeToggle />
          </div>
        </div>
        <div className="flex items-center xl:hidden">
          <ModeToggle />
          {/* Mock Mobile Nav for now */}
          <div className="ml-2">Menu</div>
        </div>
      </div>
    </header>
  );
}
