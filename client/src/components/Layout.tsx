import { Link, useLocation } from "wouter";
import { FileText, Menu, X, LayoutTemplate } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <img
                  src="/attached_assets/WhatsApp_Image_2026-01-15_at_11.48.13_1768457945767.jpeg"
                  alt="Resume Create Logo"
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <span className="font-display font-bold text-xl tracking-tight text-foreground">
                  RESUME CREATE
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
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
