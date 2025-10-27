
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import {
  getAppointments,
  updateAppointmentStatus as apiUpdateAppointmentStatus, // Renombrar para evitar conflicto
  deleteAppointment as apiDeleteAppointment, // Renombrar para evitar conflicto
  Appointment, // Importar el tipo
} from "@/lib/data"
import { columns } from "@/components/admin/columns"
import { DataTable } from "@/components/admin/data-table"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

export default function AdminPage() {
  const { userData, loading } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isDataLoading, setIsDataLoading] = useState(true)

  // Protección de ruta y carga de datos inicial
  useEffect(() => {
    if (!loading) {
      if (!userData || userData.role !== 'admin') {
        console.log('❌ ACCESO DENEGADO - Redirigiendo a dashboard');
        router.push('/dashboard');
      } else {
        // Usuario es admin, cargar los datos
        const fetchAppointments = async () => {
          setIsDataLoading(true);
          console.log('Fetching appointments for admin...');
          const fetchedAppointments = await getAppointments();
          // Convertir Timestamps a string para que sea compatible con la tabla
          const formattedAppointments = fetchedAppointments.map(app => ({
            ...app,
            date: new Date(app.appointmentDate.seconds * 1000).toLocaleDateString(),
            time: new Date(app.appointmentDate.seconds * 1000).toLocaleTimeString(),
          }));
          setAppointments(formattedAppointments as any); // 'any' para evitar problemas de tipo con el objeto formateado
          setIsDataLoading(false);
          console.log('Appointments loaded:', formattedAppointments);
        };
        fetchAppointments();
      }
    }
  }, [userData, loading, router]);


  // Función para eliminar un turno (ahora interactúa con la API)
  const deleteAppointment = async (appointmentId: string) => {
    console.log(`Iniciando eliminación del turno: ${appointmentId}`);
    const success = await apiDeleteAppointment(appointmentId);
    if (success) {
      console.log(`Turno ${appointmentId} eliminado con éxito.`);
      setAppointments(prev => prev.filter(app => app.id !== appointmentId));
    } else {
      console.error(`Error al eliminar el turno ${appointmentId}.`);
      // Aquí podrías mostrar una notificación al usuario
    }
  };

  // Función para actualizar el estado de un turno (ahora interactúa con la API)
  const updateAppointmentStatus = async (appointmentId: string, newStatus: 'approved' | 'rejected') => {
    console.log(`Iniciando actualización del turno ${appointmentId} a ${newStatus}`);
    const success = await apiUpdateAppointmentStatus(appointmentId, newStatus);
    if (success) {
      console.log(`Turno ${appointmentId} actualizado a ${newStatus}.`);
      setAppointments(prev =>
        prev.map(app =>
          app.id === appointmentId ? { ...app, status: newStatus } : app
        )
      );
    } else {
      console.error(`Error al actualizar el turno ${appointmentId}.`);
       // Aquí podrías mostrar una notificación al usuario
    }
  };
  
  // Mientras se valida el usuario, muestra un loader
  if (loading || isDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando y validando...</p>
      </div>
    )
  }

  // Si la protección de ruta falla, no renderiza nada mientras redirige
  if (!userData || userData.role !== 'admin') {
    return null;
  }

  // Si el usuario es admin, renderiza la página
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-center">Panel de Administración</h1>
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle>Gestión de Turnos</CardTitle>
          <CardDescription>
            Aquí puedes ver, aprobar, rechazar y eliminar los turnos solicitados.
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
