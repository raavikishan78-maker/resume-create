import { Link, useLocation } from "wouter";
import { FileText, Menu, X, LayoutTemplate, LogOut, LogIn, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoading, isAuthenticated } = useAuth();

  const isActive = (path: string) => location === path;

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "U"
    : "U";

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="Resume Create Logo"
                  className="w-8 h-8 rounded-sm object-contain"
                />
                <span className="font-display font-bold text-xl tracking-tight text-foreground">
                  RESUME CREATE
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {isAuthenticated && (
                <>
                  <Link href="/">
                    <span className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${isActive("/") ? "text-primary" : "text-muted-foreground"}`}>
                      Dashboard
                    </span>
                  </Link>
                  <Link href="/templates">
                    <span className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer flex items-center gap-1.5 ${isActive("/templates") ? "text-primary" : "text-muted-foreground"}`}>
                      <LayoutTemplate className="w-4 h-4" />
                      Templates
                    </span>
                  </Link>
                  <Link href="/create">
                    <Button size="sm" className="font-semibold shadow-md shadow-primary/20">
                      <FileText className="w-4 h-4 mr-2" />
                      Create Resume
                    </Button>
                  </Link>
                </>
              )}

              {/* Auth section */}
              {!isLoading && (
                isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" data-testid="button-user-menu">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.profileImageUrl ?? ""} alt={initials} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="px-3 py-2">
                        <p className="text-sm font-semibold text-foreground">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <a href="/api/logout" className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive" data-testid="button-logout">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </a>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <a href="/api/login">
                    <Button size="sm" variant="outline" data-testid="button-login">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </a>
                )
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background p-4 space-y-3">
            {isAuthenticated && (
              <>
                <Link href="/">
                  <span className={`block text-sm font-medium py-2 ${isActive("/") ? "text-primary" : "text-muted-foreground"}`}>
                    Dashboard
                  </span>
                </Link>
                <Link href="/templates">
                  <span className={`flex items-center gap-2 text-sm font-medium py-2 ${isActive("/templates") ? "text-primary" : "text-muted-foreground"}`}>
                    <LayoutTemplate className="w-4 h-4" />
                    Templates
                  </span>
                </Link>
                <Link href="/create">
                  <Button className="w-full justify-start" variant="default">
                    <FileText className="w-4 h-4 mr-2" />
                    Create Resume
                  </Button>
                </Link>
              </>
            )}

            {!isLoading && (
              isAuthenticated ? (
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-3 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImageUrl ?? ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <a href="/api/logout">
                    <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </a>
                </div>
              ) : (
                <a href="/api/login">
                  <Button className="w-full" variant="default">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </a>
              )
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-muted/30 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} RESUME CREATE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
