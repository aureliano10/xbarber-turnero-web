'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import {
  getAppointments,
  updateAppointmentStatus as apiUpdateAppointmentStatus,
  deleteAppointment as apiDeleteAppointment,
  Appointment,
  AppointmentStatus,
} from "@/lib/data"
import { columns } from "@/components/admin/columns"
import { DataTable } from "@/components/admin/data-table"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// --- COMPONENTE DE TARJETA PARA LA VISTA MÓVIL ---
function AppointmentCard({ 
  appointment, 
  onUpdateStatus, 
  onDelete 
}: { 
  appointment: Appointment, 
  onUpdateStatus: (id: string, status: AppointmentStatus) => void, 
  onDelete: (id: string) => void 
}) {
  const { id, customerName, email, service, appointmentDate, status } = appointment;

  const formattedDate = appointmentDate?.toDate 
    ? appointmentDate.toDate().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) 
    : "Fecha inválida";
    
  const formattedTime = appointmentDate?.toDate 
    ? appointmentDate.toDate().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) 
    : "Hora inválida";

  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{customerName}</CardTitle>
        <CardDescription>{email}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm">
        <div>
          <strong>Servicio:</strong> {service}
        </div>
        <div>
          <strong>Fecha:</strong> {`${formattedDate} a las ${formattedTime}`}
        </div>
        <div>
          <strong>Estado:</strong> 
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || ''}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {status !== 'approved' && (
          <Button variant="outline" size="sm" onClick={() => onUpdateStatus(id, 'approved')}>Aprobar</Button>
        )}
        {status !== 'rejected' && (
          <Button variant="outline" size="sm" onClick={() => onUpdateStatus(id, 'rejected')}>Rechazar</Button>
        )}
        <Button variant="destructive" size="sm" onClick={() => onDelete(id)}>Eliminar</Button>
      </CardFooter>
    </Card>
  )
}

// --- PÁGINA PRINCIPAL DEL PANEL DE ADMINISTRACIÓN ---
export default function AdminPage() {
  const { userData, loading: authLoading } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      if (!userData || userData.role !== 'admin') {
        router.push('/dashboard');
      } else {
        const fetchAppointments = async () => {
          setDataLoading(true);
          const fetchedAppointments = await getAppointments();
          setAppointments(fetchedAppointments);
          setDataLoading(false);
        };
        fetchAppointments();
      }
    }
  }, [userData, authLoading, router]);

  const deleteAppointmentHandler = async (appointmentId: string) => {
    const success = await apiDeleteAppointment(appointmentId);
    if (success) {
      setAppointments(prev => prev.filter(app => app.id !== appointmentId));
    } else {
      console.error(`Error al eliminar el turno.`);
    }
  };

  const updateAppointmentStatusHandler = async (appointmentId: string, newStatus: AppointmentStatus) => {
    const success = await apiUpdateAppointmentStatus(appointmentId, newStatus);
    if (success) {
      setAppointments(prev =>
        prev.map(app =>
          app.id === appointmentId ? { ...app, status: newStatus } : app
        )
      );
    } else {
      console.error(`Error al actualizar el turno.`);
    }
  };
  
  if (authLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <p>Cargando panel de administrador...</p>
      </div>
    )
  }

  if (!userData || userData.role !== 'admin') {
    return null; // No renderizar mientras redirige
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground">Gestiona los turnos solicitados por los clientes.</p>
      </div>

      {/* --- VISTA DE TABLA PARA ESCRITORIO --- */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={appointments}
          meta={{
            updateStatus: updateAppointmentStatusHandler,
            deleteAppointment: deleteAppointmentHandler,
          }}
        />
      </div>

      {/* --- VISTA DE TARJETAS PARA MÓVIL --- */}
      <div className="block md:hidden">
        {appointments.length > 0 ? (
          appointments.map(appointment => (
            <AppointmentCard 
              key={appointment.id} 
              appointment={appointment} 
              onUpdateStatus={updateAppointmentStatusHandler}
              onDelete={deleteAppointmentHandler}
            />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No hay turnos para mostrar.</p>
          </div>
        )}
      </div>
    </div>
  )
}
