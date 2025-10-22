'use client'

import { useState } from "react"
import { ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Extended Appointment type to include Firestore document ID and user details
export interface Appointment {
  id: string; // Firestore document ID
  userId: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
  user: {
    displayName: string | null;
    email: string | null;
  };
}

// --- Dialog for Appointment Details ---
function TurnDetailsDialog({ appointment, isOpen, onOpenChange }: { appointment: Appointment; isOpen: boolean, onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalles del Turno</DialogTitle>
          <DialogDescription>
            Información del turno de {appointment.user.displayName || appointment.user.email}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">Servicio:</span> {appointment.service}
            </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// --- Actions Cell with Delete Functionality ---
function ActionsCell({ row, table }: { row: Row<Appointment>; table: any }) {
  const appointment = row.original
  const { toast } = useToast()
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Using the meta object from the table to call backend functions
  const { deleteAppointment, updateAppointmentStatus } = table.options.meta

  const handleDelete = () => {
    deleteAppointment(appointment.id);
    toast({
      title: "Turno Eliminado",
      description: `El turno ha sido eliminado exitosamente.`,
      variant: "destructive"
    });
  };

  const handleStatusUpdate = (action: 'approved' | 'rejected') => {
    updateAppointmentStatus(appointment.id, action);
    toast({
      title: `Turno ${action === 'approved' ? 'aprobado' : 'rechazado'}`,
      description: `El turno de ${appointment.user.displayName || appointment.user.email} ha sido ${action === 'approved' ? 'aprobado' : 'rechazado'}.`,
    })
  }


  return (
    <>
      <TurnDetailsDialog appointment={appointment} isOpen={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setIsDetailsOpen(true)}>
            Ver detalles
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleStatusUpdate('approved')}>Aprobar</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusUpdate('rejected')}>Rechazar</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive focus:bg-destructive/10">
            Eliminar turno
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

// --- Column Definitions ---
export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "user",
    header: "Cliente",
    cell: ({ row }: { row: Row<Appointment> }) => {
      const user = row.original.user;
      return <div>{user.displayName || user.email}</div>;
    },
  },
  {
    accessorKey: "service",
    header: "Servicio",
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const date = new Date(row.getValue("date"))
        const formatted = new Intl.DateTimeFormat("es-ES", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC' // Keep UTC to avoid timezone shifts from server
        }).format(date)
        return <div className="font-medium">{formatted}</div>
    }
  },
  {
    accessorKey: "time",
    header: "Hora",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const statusConfig: { [key: string]: { text: string; variant: "secondary" | "default" | "destructive" }; } = {
        pending: { text: "Pendiente", variant: "secondary" },
        approved: { text: "Aprobado", variant: "default" },
        rejected: { text: "Rechazado", variant: "destructive" },
      };
      const { text, variant } = statusConfig[status] ?? { text: "Desconocido", variant: "default"};
      return <Badge variant={variant}>{text}</Badge>
    },
  },
  {
    id: "actions",
    cell: ActionsCell,
  },
]
