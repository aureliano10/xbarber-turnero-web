export type Appointment = {
  id: string
  customerName: string
  email: string
  date: string
  time: string
  status: "pending" | "approved" | "rejected"
  service: string
  preferences: string
}

export const appointments: Appointment[] = [
  {
    id: "APP-728ed52f",
    customerName: "Carlos Santana",
    email: "carlos.s@example.com",
    date: "2024-08-01",
    time: "10:00",
    status: "pending",
    service: "Corte y Barba",
    preferences: "Fade en los costados, barba bien recortada y perfilada.",
  },
  {
    id: "APP-489e1d42",
    customerName: "Pedro Martinez",
    email: "pedro.m@example.com",
    date: "2024-08-01",
    time: "11:30",
    status: "pending",
    service: "Corte de pelo",
    preferences: "Clásico, con tijera. Nada de máquina en la parte de arriba.",
  },
  {
    id: "APP-f6e3c8a1",
    customerName: "Sofia Vergara",
    email: "sofia.v@example.com",
    date: "2024-08-02",
    time: "14:00",
    status: "approved",
    service: "Coloración",
    preferences: "Solo retoque de raíces, mismo color de siempre.",
  },
  {
    id: "APP-bc7a4e8d",
    customerName: "Luis Rodriguez",
    email: "luis.r@example.com",
    date: "2024-08-02",
    time: "16:00",
    status: "rejected",
    service: "Afeitado Clásico",
    preferences: "Piel sensible, usar productos sin alcohol.",
  },
  {
    id: "APP-9d5b7c6f",
    customerName: "Ana de Armas",
    email: "ana.da@example.com",
    date: "2024-08-03",
    time: "09:30",
    status: "approved",
    service: "Corte de pelo",
    preferences: "Un cambio de look, corte bob.",
  },
   {
    id: "APP-3a9c8b5e",
    customerName: "Javier Bardem",
    email: "javier.b@example.com",
    date: "2024-08-04",
    time: "12:00",
    status: "pending",
    service: "Tratamiento capilar",
    preferences: "Hidratación profunda. Tengo el pelo algo seco últimamente.",
  },
];
