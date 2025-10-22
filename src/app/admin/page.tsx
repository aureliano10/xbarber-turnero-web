'use client'

import { useState } from 'react'
import { mockAppointments } from "@/lib/mock-data" // Importamos los datos falsos
import { columns, Appointment } from "@/components/admin/columns"
import { DataTable } from "@/components/admin/data-table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function AdminPage() {
  // Usamos los datos falsos como estado inicial
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)

  // Simulación de la eliminación de un turno
  const deleteAppointment = async (appointmentId: string) => {
    console.log(`Simulando eliminación del turno: ${appointmentId}`);
    setAppointments(prev => prev.filter(app => app.id !== appointmentId));
  };

  // Simulación de la actualización del estado de un turno
  const updateAppointmentStatus = async (appointmentId: string, newStatus: 'approved' | 'rejected') => {
    console.log(`Simulando actualización del turno ${appointmentId} a ${newStatus}`);
    setAppointments(prev => 
      prev.map(app => 
        app.id === appointmentId ? { ...app, status: newStatus } : app
      )
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-center">Panel de Administración</h1>
       <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle>Turnos Pendientes y Recientes</CardTitle>
          <CardDescription>
            Gestiona las solicitudes de turnos de tus clientes. (Datos de demostración)
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
