
import { Sidebar, MobileNav } from "@/components/layout/sidebar";

// Este es el layout para la sección de Administración.
// Es una copia exacta del layout del Dashboard para mantener la consistencia visual.

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      {/* Menú lateral (Sidebar) consistente en toda la aplicación */}
      <Sidebar />

      <div className="flex flex-col flex-1">
        {/* Encabezado para la vista móvil con menú de hamburguesa */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
          <MobileNav />
        </header>

        {/* Contenido principal de la página de Admin */}
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
