
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
      customerName: userData.name || 'Usuario sin nombre',
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

  // --- Renderizado del componente ---
  if (authLoading || !userData) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  return (
    // Contenedor principal para centrar y limitar el ancho
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Solicitar un Nuevo Turno</CardTitle>
            <CardDescription>Completa el formulario para agendar tu próximo servicio.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    {/* Campo de Servicio */}
                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Servicio</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Elige un servicio" /></SelectTrigger>
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Campo de Fecha */}
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha</FormLabel>
                            <FormControl>
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0)) || date.getDay() === 0}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Campo de Hora */}
                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hora</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Elige una hora" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {/* Horarios de ejemplo. */}
                                    {Array.from({ length: 8 }, (_, i) => `${i + 9}:00`).map(time => (
                                        <SelectItem key={time} value={time}>{time}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                </div>

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
