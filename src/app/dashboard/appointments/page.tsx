import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

const appointments = [
  { id: 1, date: '25 de Julio, 2024', time: '10:30', service: 'Corte de pelo', status: 'approved' },
  { id: 2, date: '28 de Julio, 2024', time: '15:00', service: 'Corte y barba', status: 'pending' },
  { id: 3, date: '15 de Julio, 2024', time: '11:00', service: 'Afeitado clásico', status: 'rejected' },
  { id: 4, date: '10 de Julio, 2024', time: '16:30', service: 'Corte de pelo', status: 'approved' },
];

const statusConfig = {
  approved: { label: 'Aprobado', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800', icon: <CheckCircle2 className="mr-2 h-4 w-4" /> },
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800', icon: <Clock className="mr-2 h-4 w-4" /> },
  rejected: { label: 'Rechazado', color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800', icon: <XCircle className="mr-2 h-4 w-4" /> },
}

export default function AppointmentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mis Turnos</h1>
      <Card>
        <CardHeader>
          <CardTitle>Historial de Turnos</CardTitle>
          <CardDescription>Aquí puedes ver tus turnos pasados y futuros.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appt) => {
              const config = statusConfig[appt.status as keyof typeof statusConfig];
              return (
                <div key={appt.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div>
                    <p className="font-semibold">{appt.service}</p>
                    <p className="text-sm text-muted-foreground">{appt.date} - {appt.time}</p>
                  </div>
                  <Badge className={`flex items-center ${config.color}`} variant="outline">
                    {config.icon}
                    {config.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
