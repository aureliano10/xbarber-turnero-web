import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md mx-4">
        <Link href="/" className="flex items-center justify-center mb-6" prefetch={false}>
          <Icons.logo className="h-8 w-8 text-primary" />
          <span className="ml-2 text-2xl font-semibold text-primary">BarberFlow</span>
        </Link>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tu correo electrónico para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" asChild>
                <Link href="/dashboard">Iniciar Sesión</Link>
              </Button>
              <Button variant="outline" className="w-full">
                Iniciar Sesión con Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              ¿No tienes una cuenta?{" "}
              <Link href="#" className="underline">
                Regístrate
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
