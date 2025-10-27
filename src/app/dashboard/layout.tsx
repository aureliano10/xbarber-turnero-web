'use client'
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarTrigger, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // 1. Importar el hook de autenticación

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // 2. Obtener los datos del usuario y el estado de carga
  const { userData, loading } = useAuth();

  return (
    <SidebarProvider>
      <Sidebar defaultCollapsed={false} side="left">
        <SidebarHeader>
          <div className="flex items-center justify-center py-2">
            <span className="font-semibold text-sidebar-primary-foreground text-2xl">
              <span className='font-black text-4xl'>X</span>BARBER
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
            
            {/* 3. Renderizado condicional del botón de Admin */}
            {!loading && userData?.role === 'admin' && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin">
                    <Settings className="size-4"/>
                    <span className="ml-2">Vista Admin</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Salir</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <SidebarTrigger />
          <div className="w-full flex-1">
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
