import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { getLogoURL } from "@/lib/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings } from "lucide-react";

export default function DesktopNav() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const url = await getLogoURL();
        console.log("Logo URL loaded:", url);
        setLogoUrl(url);
      } catch (error) {
        console.error("Failed to load logo:", error);
      }
    };
    
    fetchLogo();
  }, []);

  const navItems = [
    { name: "הפרופיל שלי", href: "/profile" },
    { name: "משתמשים", href: "/users" },
    { name: "בתי עסק", href: "/businesses" },
    { name: "בית", href: "/" },
  ];

  return (
    <nav className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30 shadow-sm px-4">
      <div className="container mx-auto flex flex-col items-center justify-center">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center space-x-2 text-primary-500 cursor-pointer mb-1">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="ShareIt Logo" 
                className="h-8 w-auto ml-2" 
              />
            ) : (
              <svg 
                className="w-8 h-8 ml-2 text-primary-500" 
                fill="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
              </svg>
            )}
            <span className="text-xl font-semibold">ShareIt</span>
          </div>
        </Link>

        {/* Desktop Navigation Links - Right-aligned */}
        <div className="flex items-center space-x-0 space-x-reverse space-x-12 mx-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={`text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-500 font-medium cursor-pointer px-4 py-1 text-lg ${
                  location === item.href
                    ? "text-primary-600 dark:text-primary-500 font-bold border-b-2 border-primary-500"
                    : ""
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Left side controls - moved from right */}
        <div className="absolute left-4 top-0 h-16 flex items-center space-x-4">
          <ThemeToggle variant="ghost" size="icon" />

          {user ? (
            <>
              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={user.photoURL || ""} />
                      <AvatarFallback>
                        {user.displayName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">
                          {user.displayName}
                        </span>
                        {user.isAdmin && (
                          <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                            מנהל
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        @{user.displayName?.toLowerCase().replace(/\s+/g, "") || "user"}
                      </span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>החשבון שלי</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem>
                      <User className="ml-2 h-4 w-4" />
                      <span>פרופיל</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/saved-offers">
                    <DropdownMenuItem>
                      <Settings className="ml-2 h-4 w-4" />
                      <span>הצעות שמורות</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="ml-2 h-4 w-4" />
                    <span>התנתקות</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/login">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition duration-300">
                התחברות
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}