'use client'
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarTrigger, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

const avatarImage = PlaceHolderImages.find((img) => img.id === "avatar-1");

// Usuario simulado para la demo del cliente
const mockClientUser = {
    name: "Cliente Demo",
    email: "cliente@example.com",
};

function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt="User Avatar" />}
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{mockClientUser.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {mockClientUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <User className="mr-2 h-4 w-4" />
          <span>Mi Cuenta</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Salir</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar defaultCollapsed={false} side="left">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Icons.logo className="size-6 text-sidebar-primary-foreground" />
            <span className="text-lg font-semibold text-sidebar-primary-foreground">
              XBARBER
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard">
                  <User className="size-4"/>
                  <span className="ml-2">Reservar Turno</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
            <SidebarMenuItem>
              {/* Se reemplaza el Link por un botón que muestra una alerta */}
              <SidebarMenuButton 
                onClick={() => alert('Acceso denegado: Solo los administradores pueden acceder a esta vista.')}
                className="opacity-60 cursor-not-allowed">
                  <Settings className="size-4"/>
                  <span className="ml-2">Vista Admin</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <SidebarTrigger />
          <div className="w-full flex-1">
            {/* Can add a search bar here if needed */}
          </div>
          <UserNav />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
