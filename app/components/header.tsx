"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBasket, Menu, Home, PlusCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "../(auth)/auth-context";
import { unauthenticated, routes } from "../common/constants/navigation";
import { ThemeToggle } from "./theme-toggle";
import Cookies from 'js-cookie';

export default function Header() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const pages = isAuthenticated ? routes : unauthenticated;

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('access_token');
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 1000);

    return () => clearInterval(interval);
  }, [setIsAuthenticated]);

  if (isLoading) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="mr-4 hidden md:flex">
              <Link href="/" className="flex items-center space-x-4">
                <ShoppingBasket className="h-10 w-10 text-primary" />
                <span className="hidden text-2xl font-bold sm:inline-block">
                  Shoppy
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Menu and Theme Toggle */}
          <div className="flex items-center gap-4">
            {!isAuthenticated && <ThemeToggle />}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="mr-2 px-0 text-base hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                  <Menu className="h-7 w-7" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-3">
                    <ShoppingBasket className="h-8 w-8 text-primary" />
                    <span className="text-xl">Shoppy</span>
                  </SheetTitle>
                </SheetHeader>
                {isAuthenticated ? (
                  <nav className="flex flex-col space-y-4 mt-8">
                    {[
                      { title: "Dashboard", path: "/dashboard", icon: <Home className="mr-2 h-5 w-5" /> },
                      { title: "Products", path: "/products", icon: <ShoppingBasket className="mr-2 h-5 w-5" /> },
                      { title: "Create Product", path: "/products/create", icon: <PlusCircle className="mr-2 h-5 w-5" /> },
                      { title: "Users", path: "/users", icon: <Users className="mr-2 h-5 w-5" /> },
                    ].map((item) => (
                      <Button
                        key={item.path}
                        variant="ghost"
                        className="w-full justify-start text-lg"
                        onClick={() => {
                          setIsOpen(false);
                          router.push(item.path);
                        }}
                      >
                        {item.icon}
                        {item.title}
                      </Button>
                    ))}
                  </nav>
                ) : (
                  <nav className="flex flex-col space-y-4 mt-8">
                    {unauthenticated.map((page) => (
                      <Button
                        key={page.title}
                        variant="ghost"
                        className="w-full justify-start text-lg"
                        onClick={() => {
                          setIsOpen(false);
                          router.push(page.path);
                        }}
                      >
                        {page.title}
                      </Button>
                    ))}
                  </nav>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
