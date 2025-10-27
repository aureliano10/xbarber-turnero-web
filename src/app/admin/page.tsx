'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { mockAppointments } from "@/lib/mock-data"
import { columns, Appointment } from "@/components/admin/columns"
import { DataTable } from "@/components/admin/data-table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function AdminPage() {
  const { userData, loading } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)

  // Protección: Solo admins pueden acceder
  useEffect(() => {
    if (!loading && (!userData || userData.role !== 'admin')) {
      router.push('/dashboard')
    }
  }, [userData, loading, router])

  // Mostrar loading mientras se verifica
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    )
  }

  // Si no es admin, no mostrar nada (mientras redirige)
  if (!userData || userData.role !== 'admin') {
    return null
  }

  // Simulación de la eliminación de un turno
  const deleteAppointment = async (appointmentId: string) => {
    console.log(`Simulando eliminación del turno: ${appointmentId}`)
    setAppointments(prev => prev.filter(app => app.id !== appointmentId))
  }

  // Simulación de la actualización del estado de un turno
  const updateAppointmentStatus = async (appointmentId: string, newStatus: 'approved' | 'rejected') => {
    console.log(`Simulando actualización del turno ${appointmentId} a ${newStatus}`)
    setAppointments(prev => 
      prev.map(app => 
        app.id === appointmentId ? { ...app, status: newStatus } : app
      )
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-center">Panel de Administración</h1>
       <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle>Turnos Pendientes y Recientes</CardTitle>
          <CardDescription>
            Gestiona las solicitudes de turnos de tus clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
           <DataTable 
             columns={columns} 
             data={appointments} 
             meta={{
               deleteAppointment,
               updateAppointmentStatus
             }}
           />
        </CardContent>
      </Card>
    </div>
  )
}