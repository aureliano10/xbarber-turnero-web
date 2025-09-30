'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";

// Mock data for available times
const availableTimes = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { toast } = useToast();

  const handleBooking = () => {
    if (date && selectedTime) {
      toast({
        title: "Turno solicitado",
        description: `Tu turno para el ${date.toLocaleDateString('es-ES')} a las ${selectedTime} ha sido solicitado. Recibirás una confirmación por correo.`,
      });
      setSelectedTime(null);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, selecciona una fecha y una hora para tu turno.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Reservar un Turno</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Selecciona Fecha y Hora</CardTitle>
              <CardDescription>Elige un día y luego una hora disponible.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1)) }
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4 text-center">
                  Horas Disponibles para {date?.toLocaleDateString('es-ES') || '...'}
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Resumen de tu Turno</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div>
                <p className="font-medium">Fecha</p>
                <p className="text-muted-foreground">{date ? date.toLocaleDateString('es-ES') : 'No seleccionada'}</p>
              </div>
              <div>
                <p className="font-medium">Hora</p>
                <p className="text-muted-foreground">{selectedTime || 'No seleccionada'}</p>
              </div>
              <div>
                <label htmlFor="notes" className="font-medium">Preferencias o Notas</label>
                <Textarea id="notes" placeholder="Ej: corte degradado, solo barba, etc." className="mt-2"/>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleBooking} disabled={!date || !selectedTime}>
                Solicitar Turno
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
