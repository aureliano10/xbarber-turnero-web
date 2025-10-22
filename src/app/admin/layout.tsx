'use client'

import { useState } from 'react'; // Mantener useState para el estado del sidebar
import { useRouter } from "next/navigation"; // Puede ser útil mantenerlo
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { AreaChart, LayoutGrid, LogOut, User } from "lucide-react";
import Link from "next/link";

// Objeto de usuario simulado para la demo
const mockAdminUser = {
  email: "admin@demo.com",
};

// Componente de navegación simplificado para la demo
function AdminNav({ user }: { user: { email: string | null } }) {
  const router = useRouter();

  const handleSignOut = () => {
    // Simplemente redirigir a la página de inicio
    router.push("/");
  };

  const getInitials = (email: string | null) => {
    if (!email) return 'AD';
    return email.substring(0, 2).toUpperCase();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Admin (Demo)</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Salir</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Layout principal sin lógica de autenticación
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas" side="left">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Icons.logo className="size-6 text-sidebar-primary-foreground" />
            <span className="text-lg font-semibold text-sidebar-primary-foreground">
              XBARBER (Admin)
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin">
                  <LayoutGrid />
                  Turnos
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <SidebarMenuButton asChild>
                <Link href="#" onClick={(e) => { e.preventDefault(); alert('Página de estadísticas en construcción.'); }}>
                  <AreaChart />
                  Estadísticas
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard">
                  <User/>
                  Vista Cliente
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <SidebarTrigger />
          <div className="w-full flex-1" />
          <AdminNav user={mockAdminUser} />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
