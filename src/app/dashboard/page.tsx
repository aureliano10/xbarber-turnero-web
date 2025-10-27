'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext'; // Importa el hook
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Clock, Scissors, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";

const morningTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00'];

const getAvailableTimes = (date: Date | undefined): string[] => {
  if (!date) return [];
  const day = date.getDay();
  let afternoonTimes: string[] = [];
  if (day === 0) return [];
  if (day >= 1 && day <= 4) afternoonTimes = ['15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'];
  if (day === 5 || day === 6) afternoonTimes = ['15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'];
  return [...morningTimes, ...afternoonTimes];
};

const services = ['Corte', 'Corte y Barba', 'Solo Barba'];

// --- VISTA PARA CLIENTES ---
const ClientDashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const { toast } = useToast();
  const availableTimes = useMemo(() => getAvailableTimes(date), [date]);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedTime(null);
  };

  const handleBooking = () => {
    if (date && selectedTime && selectedService) {
      toast({ title: "Turno solicitado", description: `Tu turno para ${selectedService.toLowerCase()} el ${date.toLocaleDateString('es-ES')} a las ${selectedTime} ha sido solicitado.` });
      setSelectedTime(null);
      setSelectedService(null);
    } else {
      toast({ variant: "destructive", title: "Error", description: "Por favor, selecciona fecha, hora y servicio." });
    }
  };

  const isDateInCurrentWeek = (d: Date) => {
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    firstDayOfWeek.setHours(0, 0, 0, 0);
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);
    return d >= firstDayOfWeek && d <= lastDayOfWeek;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Selecciona Fecha y Hora</CardTitle>
            <CardDescription>Elige un día y luego una hora disponible.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-8">
             <div className="flex justify-center">
              <Calendar mode="single" selected={date} onSelect={handleDateSelect} className="rounded-md border" disabled={(day) => day.getDay() === 0 || day < new Date(new Date().setDate(new Date().getDate() - 1)) || !isDateInCurrentWeek(day)} />
            </div>
            <div className="w-full max-w-md">
              <h3 className="text-lg font-medium mb-4 text-center">Horas Disponibles para {date?.toLocaleDateString('es-ES') || '...'}</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableTimes.length > 0 ? availableTimes.map((time) => (<Button key={time} variant={selectedTime === time ? "default" : "outline"} onClick={() => setSelectedTime(time)}>{time}</Button>)) : <p>No hay turnos disponibles.</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card>
          <CardHeader className="text-center"><CardTitle>Resumen de tu Turno</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="font-medium flex items-center gap-3"><Scissors className="h-5 w-5 text-muted-foreground" />Servicio</label>
              <Select onValueChange={setSelectedService} value={selectedService || ''}><SelectTrigger><SelectValue placeholder="Selecciona un servicio" /></SelectTrigger><SelectContent>{services.map(service => (<SelectItem key={service} value={service}>{service}</SelectItem>))}</SelectContent></Select>
            </div>
            <div className="flex items-center justify-between rounded-md border px-4 py-3 bg-muted/50"><div className="flex items-center gap-3"><CalendarDays className="h-5 w-5 text-muted-foreground" /><span className="font-medium">Fecha</span></div><span className="text-muted-foreground">{date ? date.toLocaleDateString('es-ES') : '-'}</span></div>
            <div className="flex items-center justify-between rounded-md border px-4 py-3 bg-muted/50"><div className="flex items-center gap-3"><Clock className="h-5 w-5 text-muted-foreground" /><span className="font-medium">Hora</span></div><span className="text-muted-foreground">{selectedTime || '-'}</span></div>
          </CardContent>
          <CardFooter><Button className="w-full" onClick={handleBooking} disabled={!date || !selectedTime || !selectedService}>Solicitar Turno</Button></CardFooter>
        </Card>
      </div>
    </div>
  );
}

// --- VISTA PARA ADMINISTRADORES ---
const AdminDashboard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Panel de Administración</CardTitle>
        <CardDescription>Aquí puedes gestionar turnos, clientes y barberos.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Próximamente: estadísticas, gestión de usuarios y más.</p>
      </CardContent>
    </Card>
  );
}

// --- COMPONENTE PRINCIPAL DEL DASHBOARD ---
export default function DashboardPage() {
  const { user } = useAuth(); // Usa el hook para obtener el usuario

  const handleSignOut = async () => {
    await auth.signOut();
    // La redirección se maneja automáticamente por el AuthProvider
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Hola, {user?.displayName || 'Usuario'}!</h1>
          <p className="text-muted-foreground">Bienvenido a tu dashboard.</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
      
      {/* Renderizado condicional basado en el rol */}
      {user?.role === 'admin' ? <AdminDashboard /> : <ClientDashboard />}
    </div>
  );
}
