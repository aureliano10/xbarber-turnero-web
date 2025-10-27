
'use client'

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  addAppointment,
  NewAppointmentData,
} from '@/lib/data';

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

// --- Helpers para la lógica de la semana ---
const getWeekRange = (date: Date) => {
  const today = new Date(date);
  today.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay(); // Sunday = 0, Saturday = 6
  
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return { start: startOfWeek, end: endOfWeek };
};

// --- Schema de validación para el formulario ---
const formSchema = z.object({
  service: z.string({ required_error: "Por favor, selecciona un servicio." }),
  date: z.date({ required_error: "Por favor, selecciona una fecha." }),
  time: z.string({ required_error: "Por favor, selecciona una hora." }),
});


// --- Componente principal de la página de dashboard ---
export default function DashboardPage() {
  const { userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- MODIFICADO: Estado para almacenar el rango de la semana actual ---
  const [currentWeek, setCurrentWeek] = useState(getWeekRange(new Date()));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service: undefined,
      date: undefined,
      time: undefined,
    }
  });

  // --- Redirección si no está autenticado ---
  useEffect(() => {
    if (!authLoading && !userData) {
      router.push('/login');
    }
  }, [userData, authLoading, router]);

  // --- Manejador para el envío del formulario ---
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userData) {
      alert("Error: No se pudieron obtener los datos del usuario. Por favor, intenta iniciar sesión de nuevo.");
      return;
    }
    setIsSubmitting(true);

    const [hours, minutes] = values.time.split(':').map(Number);
    const appointmentDate = new Date(values.date);
    appointmentDate.setHours(hours, minutes);

    const newAppointment: NewAppointmentData = {
      userId: userData.uid,
      customerName: userData.displayName || 'Usuario sin nombre',
      email: userData.email || '',
      service: values.service,
      appointmentDate: Timestamp.fromDate(appointmentDate),
    };

    const newId = await addAppointment(newAppointment);

    if (newId) {
      alert(`¡Turno solicitado con éxito para el ${appointmentDate.toLocaleDateString()} a las ${values.time}!`);
      form.reset();
    } else {
      alert("Hubo un problema al solicitar tu turno. Por favor, inténtalo de nuevo.");
    }
    setIsSubmitting(false);
  }

  if (authLoading || !userData) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">Cargando...</div>;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-2xl px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Solicitar un Nuevo Turno</CardTitle>
            <CardDescription>Los turnos solo están disponibles para la semana en curso.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>1. Elige un servicio</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Selecciona el tipo de corte" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Corte de Pelo">Corte de Pelo</SelectItem>
                          <SelectItem value="Corte y Barba">Corte y Barba</SelectItem>
                          <SelectItem value="Solo Barba">Solo Barba</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormLabel className="mb-2">2. Selecciona una fecha</FormLabel>
                      <FormControl>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          month={currentWeek.start} // Fija la vista en el mes donde empieza la semana
                          showOutsideDays={true} // Muestra días de otros meses para completar la semana
                          disabled={(date) =>
                            date < today || // Días pasados
                            date > currentWeek.end || // Días fuera de la semana actual
                            date.getDay() === 0 || // Domingos
                            date.getDay() === 1      // Lunes
                          }
                          className="border rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>3. Elige una hora</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!form.watch('date')}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Primero selecciona un día" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 8 }, (_, i) => `${i + 9}:00`).map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Agendando...' : 'Agendar Turno'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
