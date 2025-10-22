
import { type Appointment } from "@/components/admin/columns";

// Esta es una lista estática de turnos para simular los datos de la base de datos.
// Esto te permite mostrar la funcionalidad del panel de administrador sin una conexión real a Firebase.
export const mockAppointments: Appointment[] = [
  {
    id: "app_001",
    userId: "user_juan",
    service: "Corte de Pelo",
    date: "2024-08-15",
    time: "10:00",
    status: "pending",
    user: {
      displayName: "Juan Pérez",
      email: "juan.perez@example.com",
    },
  },
  {
    id: "app_002",
    userId: "user_carlos",
    service: "Afeitado Clásico",
    date: "2024-08-15",
    time: "11:30",
    status: "approved",
    user: {
      displayName: "Carlos Gómez",
      email: "carlos.gomez@example.com",
    },
  },
  {
    id: "app_003",
    userId: "user_luis",
    service: "Corte y Barba",
    date: "2024-08-16",
    time: "14:00",
    status: "rejected",
    user: {
      displayName: "Luis Fernández",
      email: "luis.fernandez@example.com",
    },
  },
    {
    id: "app_004",
    userId: "user_miguel",
    service: "Corte de Pelo",
    date: "2024-08-17",
    time: "09:00",
    status: "pending",
    user: {
      displayName: "Miguel Ángel",
      email: "miguel.angel@example.com",
    },
  },
   {
    id: "app_005",
    userId: "user_pedro",
    service: "Diseño de Barba",
    date: "2024-08-18",
    time: "16:00",
    status: "approved",
    user: {
      displayName: "Pedro Morales",
      email: "pedro.morales@example.com",
    },
  },
];
