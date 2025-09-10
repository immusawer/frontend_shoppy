// components/footer.tsx
"use client";

import Link from "next/link";
import { useAuth } from "../(auth)/auth-context";
import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Github,
  ShoppingBasket
} from "lucide-react";

export default function Footer() {
  const { isAuthenticated } = useAuth();

  const footerLinks = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="h-4 w-4" />, href: "#" },
    { name: "Twitter", icon: <Twitter className="h-4 w-4" />, href: "#" },
    { name: "Instagram", icon: <Instagram className="h-4 w-4" />, href: "#" },
  ];

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-4">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <Button
                key={social.name}
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full text-muted-foreground hover:text-primary"
                asChild
              >
                <Link href={social.href}>
                  {social.icon}
                  <span className="sr-only">{social.name}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Shoppy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}