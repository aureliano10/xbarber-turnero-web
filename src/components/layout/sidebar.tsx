'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, LogOut, Calendar, Shield } from 'lucide-react'; // Eliminado el ícono de History
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// --- Items del menú de navegación (MODIFICADO) ---
const navItems = [
  { href: '/dashboard', label: 'Nuevo Turno', icon: Calendar },
  // Se eliminó el item de 'Mi Historial'
];

// --- Componente principal del Sidebar ---
export function Sidebar() {
  const { userData, logout } = useAuth();

  const getInitials = (name: string | undefined | null) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-background">
      {/* --- Perfil de Usuario (Visible en Desktop) --- */}
      {userData && (
        <div className="flex items-center p-4 border-b">
          <Avatar className="h-10 w-10 mr-4">
            <AvatarImage src={userData.photoURL || ''} alt={userData.displayName || 'Usuario'} />
            <AvatarFallback>{getInitials(userData.displayName)}</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="font-semibold text-sm truncate">{userData.displayName || 'Usuario'}</p>
            <p className="text-xs text-muted-foreground truncate">{userData.email}</p>
          </div>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
        ))}
        {userData?.role === 'admin' && (
          <NavItem href="/admin" label="Admin Panel" icon={Shield} />
        )}
      </nav>

      <div className="p-4 border-t">
        <Button onClick={logout} variant="ghost" className="w-full justify-start">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  );
}

// --- Componente para la Navegación Móvil (Menú Hamburguesa) ---
export function MobileNav() {
  const { userData, logout } = useAuth();
  
  const getInitials = (name: string | undefined | null) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col w-64 p-0">
        {/* Título y Descripción para accesibilidad */}
        <SheetHeader>
          <SheetTitle className="sr-only">Menú Principal</SheetTitle>
          <SheetDescription className="sr-only">Navega por las secciones de la aplicación.</SheetDescription>
        </SheetHeader>

        {/* Perfil de Usuario (Móvil) */}
        {userData && (
          <div className="flex items-center p-4 border-b">
            <Avatar className="h-10 w-10 mr-4">
              <AvatarImage src={userData.photoURL || ''} alt={userData.displayName || 'Usuario'} />
              <AvatarFallback>{getInitials(userData.displayName)}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm truncate">{userData.displayName || 'Usuario'}</p>
              <p className="text-xs text-muted-foreground truncate">{userData.email}</p>
            </div>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
          ))}
          {userData?.role === 'admin' && (
            <NavItem href="/admin" label="Admin Panel" icon={Shield} />
          )}
        </nav>

        <div className="p-4 border-t">
          <Button onClick={logout} variant="ghost" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// --- Componente de un solo item de navegación ---
function NavItem({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} passHref>
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className="w-full justify-start"
      >
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Button>
    </Link>
  );
}
