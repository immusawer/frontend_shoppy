// components/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../(auth)/auth-context";
import { Button } from "@/components/ui/button";
import { Home, ShoppingBasket, PlusCircle, Settings, Users, Menu, X, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import CreateProductModal from "../products/create products/create-product-modal";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileDialog from "../components/profile-dialog";
import { fetchUserProfile, getProfileImageUrl } from "../profile/client_profile";
import type { UserProfile } from "../profile/client_profile";
import { useRouter } from "next/navigation";
import logout from "../(auth)/logout";

export default function Sidebar() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserProfile();
    }
  }, [isAuthenticated]);

  const loadUserProfile = async () => {
    try {
      const profile = await fetchUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      setUserProfile(null);
    }
  };

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const handleProfileClose = (open: boolean) => {
    setShowProfile(open);
  };

  const handleLogout = () => {
    logout();
    router.push("login");
  };

  if (!isAuthenticated) return null;

  const navItems = [
    { title: "Dashboard", path: "/", icon: <Home className="h-5 w-5" /> },
    { title: "Products", path: "/products", icon: <ShoppingBasket className="h-5 w-5" /> },
    { 
      title: "Create Product", 
      path: "#", 
      icon: <PlusCircle className="h-5 w-5" />,
      onClick: () => setIsCreateModalOpen(true)
    },
    { title: "Users", path: "/users", icon: <Users className="h-5 w-5" /> },
    { title: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <>
      <CreateProductModal 
        open={isCreateModalOpen} 
        handleClose={() => setIsCreateModalOpen(false)} 
      />
      <ProfileDialog open={showProfile} onOpenChange={handleProfileClose} />
      <div 
        className={cn(
          "hidden border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:block transition-all duration-300 shadow-lg",
          isCollapsed ? "w-20" : "w-72",
          isHovered && !isCollapsed && "w-72"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-16 items-center justify-between border-b px-4 lg:h-[70px] lg:px-6">
            {!isCollapsed && (
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <ShoppingBasket className="h-8 w-8 text-primary" />
                <span className="text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Shoppy</span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto hover:bg-muted/50 rounded-full transition-all duration-200 h-10 w-10"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="grid items-start px-3 text-sm font-medium lg:px-4 space-y-2">
              {navItems.map((item) => (
                item.onClick ? (
                  <button
                    key={item.path}
                    onClick={item.onClick}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 transition-all hover:bg-muted/50 w-full text-left group",
                      "text-muted-foreground hover:text-foreground",
                      isCollapsed && "justify-center",
                      "hover:translate-x-1 duration-200"
                    )}
                  >
                    <span className="group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="group-hover:font-medium transition-all duration-200 text-base">{item.title}</span>}
                  </button>
                ) : (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 transition-all hover:bg-muted/50 group",
                      pathname === item.path
                        ? "bg-muted/50 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground",
                      isCollapsed && "justify-center",
                      "hover:translate-x-1 duration-200"
                    )}
                  >
                    <span className="group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="group-hover:font-medium transition-all duration-200 text-base">{item.title}</span>}
                  </Link>
                )
              ))}
            </nav>
          </div>
          <div className="border-t p-4 space-y-4">
            <div className="flex flex-col gap-3">
              <Button 
                variant="ghost" 
                className={cn(
                  "flex items-center gap-3 w-full hover:bg-muted/50 group",
                  isCollapsed && "justify-center"
                )}
                onClick={handleProfileClick}
              >
                <Avatar className="h-12 w-12">
                  {userProfile?.profileImage ? (
                    <AvatarImage 
                      src={getProfileImageUrl(userProfile.profileImage)} 
                      alt={`${userProfile.name || userProfile.username}'s avatar`}
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/avatars/01.png';
                      }}
                    />
                  ) : (
                    <AvatarFallback className="text-lg">
                      {(userProfile?.name || userProfile?.username || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                {!isCollapsed && (
                  <div className="flex flex-col items-start">
                    <span className="text-base font-medium">{userProfile?.name || userProfile?.username || 'User'}</span>
                    <span className="text-sm text-muted-foreground">Admin</span>
                  </div>
                )}
              </Button>

              <Button
                variant="ghost"
                className={cn(
                  "flex items-center gap-3 w-full hover:bg-destructive/10 hover:text-destructive group",
                  isCollapsed && "justify-center"
                )}
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                {!isCollapsed && <span className="text-base">Logout</span>}
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}