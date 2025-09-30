import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Icons } from "@/components/icons";

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-image");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <Icons.logo className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-semibold text-primary">BarberFlow</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button asChild variant="ghost">
            <Link href="/login" prefetch={false}>
              Iniciar Sesión
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">
              Registrarse
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    La gestión de turnos, simplificada.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    BarberFlow es la solución moderna para que tus clientes reserven su próximo corte de pelo de forma fácil y rápida.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/dashboard" prefetch={false}>
                      Reservar Ahora
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary">
                    <Link href="#" prefetch={false}>
                      Saber Más
                    </Link>
                  </Button>
                </div>
              </div>
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  width={600}
                  height={400}
                  alt={heroImage.description}
                  data-ai-hint={heroImage.imageHint}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                />
              )}
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Funcionalidades Clave</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Todo lo que necesitas</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Desde la reserva hasta la gestión, BarberFlow tiene todo cubierto con una interfaz profesional y amigable.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1 text-center">
                <h3 className="text-xl font-bold">Calendario Interactivo</h3>
                <p className="text-muted-foreground">Tus clientes eligen fecha y hora con disponibilidad en tiempo real.</p>
              </div>
              <div className="grid gap-1 text-center">
                <h3 className="text-xl font-bold">Gestión de Turnos</h3>
                <p className="text-muted-foreground">Aprueba o rechaza solicitudes desde un panel de administrador simple.</p>
              </div>
              <div className="grid gap-1 text-center">
                <h3 className="text-xl font-bold">Notificaciones Automáticas</h3>
                <p className="text-muted-foreground">Clientes y administradores reciben confirmaciones por email al instante.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 BarberFlow. Todos los derechos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Términos de Servicio
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacidad
          </Link>
        </nav>
      </footer>
    </div>
  );
}
