'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
// --- MODIFICADO: Importar la nueva función de actualización ---
import { getAppointmentsSubscription, Appointment, deleteAppointment, updateAppointmentCustomerName } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type GroupedAppointments = {
  [key: string]: Appointment[];
};

const INCORRECT_NAMES = ['Usuario sin nombre', 'Nombre no encontrado'];

export default function AgendaPage() {
  const { userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const [groupedAppointments, setGroupedAppointments] = useState<GroupedAppointments>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!userData || userData.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      const unsubscribe = getAppointmentsSubscription((allAppointments) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // --- MODIFICADO: Añadida la lógica de auto-corrección de nombres ---
        allAppointments.forEach(app => {
          if (INCORRECT_NAMES.includes(app.customerName)) {
            console.log(`Corrigiendo nombre para el turno ${app.id}...`);
            updateAppointmentCustomerName(app.id, app.userId);
          }
        });

        const pastAppointments = allAppointments.filter(app => app.appointmentDate.toDate() < today);
        if (pastAppointments.length > 0) {
          pastAppointments.forEach(app => deleteAppointment(app.id));
        }

        const futureAppointments = allAppointments.filter(app => {
          return app.status === 'approved' && app.appointmentDate.toDate() >= today;
        });

        const grouped = futureAppointments.reduce((acc: GroupedAppointments, current: Appointment) => {
          const date = current.appointmentDate.toDate().toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(current);
          acc[date].sort((a, b) => a.appointmentDate.toMillis() - b.appointmentDate.toMillis());

          return acc;
        }, {});
        
        setGroupedAppointments(grouped);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [userData, authLoading, router]);

  if (loading || authLoading) {
    return <div className="flex justify-center items-center h-full">Cargando y actualizando agenda...</div>;
  }

  const sortedDates = Object.keys(groupedAppointments).sort((a, b) => {
      const dateA = groupedAppointments[a][0].appointmentDate.toDate();
      const dateB = groupedAppointments[b][0].appointmentDate.toDate();
      return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Agenda de Turnos Aprobados</h1>

      {sortedDates.length === 0 ? (
        <p>No hay turnos aprobados para mostrar.</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {sortedDates.map(date => (
            <Card key={date}>
              <CardHeader>
                <CardTitle className="capitalize text-xl">{date}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {groupedAppointments[date].map(app => (
                    <li key={app.id}>
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-lg">                        
                                {app.appointmentDate.toDate().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} hs
                            </span>
                            <Badge variant="outline">{app.service}</Badge>
                        </div>
                        {/* Este campo ahora se actualizará en tiempo real */}
                        <p className="text-muted-foreground text-sm mt-1">{app.customerName}</p>
                      <Separator className="my-4" />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
