'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";

export default function DemoHomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md mx-4">
        <div className="flex items-center justify-center mb-6">
          <Icons.logo className="h-8 w-8 text-primary" />
          <span className="ml-2 text-2xl font-semibold text-primary">XBARBER</span>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Bienvenido a la Demostración</CardTitle>
            <CardDescription>
              Selecciona el rol con el que deseas ingresar a la aplicación.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button asChild size="lg">
                <Link href="/dashboard">Entrar como Cliente</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/admin">Entrar como Administrador</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
         <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>El inicio de sesión ha sido desactivado para esta demostración.</p>
        </div>
      </div>
    </div>
  );
}
