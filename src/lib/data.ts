export type Appointment = {
  id: string
  customerName: string
  email: string
  date: string
  time: string
  status: "pending" | "approved" | "rejected"
  service: string
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
  },
  {
    id: "APP-489e1d42",
    customerName: "Pedro Martinez",
    email: "pedro.m@example.com",
    date: "2024-08-01",
    time: "11:30",
    status: "pending",
    service: "Corte",
  },
  {
    id: "APP-f6e3c8a1",
    customerName: "Sofia Vergara",
    email: "sofia.v@example.com",
    date: "2024-08-02",
    time: "14:00",
    status: "approved",
    service: "Corte",
  },
  {
    id: "APP-bc7a4e8d",
    customerName: "Luis Rodriguez",
    email: "luis.r@example.com",
    date: "2024-08-02",
    time: "16:00",
    status: "rejected",
    service: "Solo Barba",
  },
  {
    id: "APP-9d5b7c6f",
    customerName: "Ana de Armas",
    email: "ana.da@example.com",
    date: "2024-08-03",
    time: "09:30",
    status: "approved",
    service: "Corte y Barba",
  },
   {
    id: "APP-3a9c8b5e",
    customerName: "Javier Bardem",
    email: "javier.b@example.com",
    date: "2024-08-04",
    time: "12:00",
    status: "pending",
    service: "Corte y Barba",
  },
];
