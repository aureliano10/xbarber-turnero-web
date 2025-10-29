'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import {
  getUserAppointments,
  Appointment,
} from "@/lib/data"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

// Define los posibles estados que se mostrarán en la UI
type DisplayStatus = 'pending' | 'approved' | 'rejected' | 'expired' | 'completed';

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const { service, appointmentDate, status } = appointment;

  const appointmentDateTime = appointmentDate?.toDate();

  // Comprueba si la fecha del turno es estrictamente anterior al día de hoy.
  const isPast = (() => {
    if (!appointmentDateTime) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Establece la hora a las 00:00:00 del día actual
    return appointmentDateTime < today;
  })();

  // Determina el estado a mostrar en la tarjeta
  let displayStatus: DisplayStatus = status;
  if (isPast) {
    if (status === 'pending') {
      displayStatus = 'expired';
    } else if (status === 'approved') {
      displayStatus = 'completed';
    }
  }

  // Formatea fecha y hora para la visualización
  const formattedDate = appointmentDateTime
    ? appointmentDateTime.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
    : "Fecha inválida";

  const formattedTime = appointmentDateTime
    ? appointmentDateTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    : "Hora inválida";

  // Define las etiquetas y estilos para cada estado
  const statusInfo: Record<DisplayStatus, { label: string; classes: string }> = {
    pending: { label: 'Pendiente', classes: 'bg-yellow-100 text-yellow-800' },
    approved: { label: 'Aprobado', classes: 'bg-green-100 text-green-800' },
    rejected: { label: 'Rechazado', classes: 'bg-red-100 text-red-800' },
    expired: { label: 'Expirado', classes: 'bg-gray-200 text-gray-800' },
    completed: { label: 'Finalizado', classes: 'bg-blue-100 text-blue-800' },
  };

  // --- ESTILO VISUAL SUTIL ---_V2
  // Aplica un fondo negro con 5% de opacidad para un efecto de gris muy sutil.
  const cardClassName = `w-full mb-4 ${isPast ? 'bg-black/5' : ''}`;

  return (
    <Card className={cardClassName}>
      <CardHeader>
        <CardTitle className="text-lg">{service}</CardTitle>
        <CardDescription>{`${formattedDate} a las ${formattedTime}`}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm">
        <div>
          <strong>Estado:</strong>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${statusInfo[displayStatus].classes}`}>
            {statusInfo[displayStatus].label}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}


export default function HistoryPage() {
  const { userData, loading: authLoading } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      if (!userData) {
        router.push('/login');
      } else {
        const fetchAppointments = async () => {
          setDataLoading(true);
          const fetchedAppointments = await getUserAppointments(userData.uid);
          // Ordena los turnos por fecha, del más reciente al más antiguo
          fetchedAppointments.sort((a, b) => {
            const dateA = a.appointmentDate?.toDate()?.getTime() || 0;
            const dateB = b.appointmentDate?.toDate()?.getTime() || 0;
            return dateB - dateA;
          });
          setAppointments(fetchedAppointments);
          setDataLoading(false);
        };
        fetchAppointments();
      }
    }
  }, [userData, authLoading, router]);
  
  if (authLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <p>Cargando historial de turnos...</p>
      </div>
    )
  }

  if (!userData) {
    return null; 
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Historial de Turnos</h1>
        <p className="text-muted-foreground">Aquí puedes ver todos los turnos que has solicitado.</p>
      </div>

      <div>
        {appointments.length > 0 ? (
          appointments.map(appointment => (
            <AppointmentCard 
              key={appointment.id} 
              appointment={appointment} 
            />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No has solicitado ningún turno todavía.</p>
          </div>
        )}
      </div>
    </div>
  )
}
