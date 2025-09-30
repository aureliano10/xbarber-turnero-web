"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function AccountPage() {
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Cuenta actualizada",
      description: "Tus datos han sido guardados exitosamente.",
    })
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mi Cuenta</h1>
      <Card>
        <CardHeader>
          <CardTitle>Información del Perfil</CardTitle>
          <CardDescription>
            Actualiza tu información personal aquí.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" defaultValue="Juan Perez" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" defaultValue="juan.perez@example.com" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="current-password">Contraseña Actual</Label>
              <Input id="current-password" type="password" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <Input id="new-password" type="password" />
            </div>
            <Button type="submit">Guardar Cambios</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
