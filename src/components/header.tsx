'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gamepad2, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'transition-colors hover:text-primary',
        isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
      )}
    >
      {children}
    </Link>
  );
};

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
          : "border-transparent bg-background"
      )}
    >
      <div
        className={cn(
          "container flex items-center transition-all duration-300 h-16"
        )}
      >
        <Link href="/" className="mr-6 flex items-center space-x-2">
            <Gamepad2 className="h-6 w-6 text-fuchsia-800" />
            <span className="font-bold sm:inline-block">
              <span className="text-blue-900">CHARLY</span><span className="text-fuchsia-900">GAMES</span>
            </span>
        </Link>
        <div className="flex-1 md:hidden"></div>
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            <NavLink href="/">Catálogo</NavLink>
            <NavLink href="/contact">Contacto</NavLink>
            <NavLink href="/admin">Admin</NavLink>
        </nav>
        
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium p-4">
                  <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                      <Gamepad2 className="h-6 w-6 text-primary" />
                       <span className="font-bold">
                         <span className="text-primary">CHARLY</span><span className="text-accent">GAMES</span>
                       </span>
                  </Link>
                  <Link href="/" className="text-muted-foreground hover:text-foreground">Catálogo</Link>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">Contacto</Link>
                  <Link href="/admin" className="text-muted-foreground hover:text-foreground">Admin</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
