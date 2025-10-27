
'use client'

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getUserAppointments, Appointment } from '@/lib/data';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

// --- Configuración visual para cada estado de turno ---
const statusConfig = {
  approved: { label: 'Aprobado', color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle2 className="mr-2 h-4 w-4" /> },
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock className="mr-2 h-4 w-4" /> },
  rejected: { label: 'Rechazado', color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="mr-2 h-4 w-4" /> },
};

// --- Componente de la página de Historial ---
export default function HistoryPage() {
  const { userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Carga inicial de datos ---
  useEffect(() => {
    if (!authLoading) {
      if (!userData) {
        router.push('/login');
        return;
      }

      const fetchAppointments = async () => {
        setIsLoading(true);
        const userAppointments = await getUserAppointments(userData.uid);
        setAppointments(userAppointments);
        setIsLoading(false);
      };

      fetchAppointments();
    }
  }, [userData, authLoading, router]);

  // --- Renderizado del componente ---
  if (authLoading || isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando turnos...</div>;
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Historial de Turnos</CardTitle>
            <CardDescription>Aquí puedes ver el historial y el estado de tus solicitudes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((appt) => {
                  const config = statusConfig[appt.status];
                  const aDate = appt.appointmentDate.toDate();
                  return (
                    <div key={appt.id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg border bg-card gap-4 text-center sm:text-left">
                      <div>
                        <p className="font-semibold">{appt.service}</p>
                        <p className="text-sm text-muted-foreground">
                          {aDate.toLocaleDateString()} - {aDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <Badge className={`flex items-center ${config.color}`} variant="outline">
                        {config.icon}
                        {config.label}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-muted-foreground">No tienes turnos agendados.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
