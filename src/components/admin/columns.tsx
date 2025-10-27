'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Appointment, AppointmentStatus } from '@/lib/data';

// --- Definición de las Columnas de la Tabla ---
export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: 'customerName',
    header: 'Cliente',
    cell: ({ row }) => {
      const name = row.original.customerName || 'Sin nombre';
      const email = row.original.email || 'Sin email';
      
      return (
        <div className="font-medium">
          {name}
          <div className="text-xs text-muted-foreground truncate max-w-[120px]">{email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'service',
    header: 'Servicio',
    // Esta celda se oculta en pantallas pequeñas (tablets) y se muestra en medianas y grandes.
    cell: ({ row }) => <div className="hidden sm:block">{row.original.service}</div>,
  },
  {
    accessorKey: 'appointmentDate',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="hidden md:flex" // Se oculta en tablets y se muestra en desktop
      >
        Fecha y Hora
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      if (!row.original.appointmentDate?.toDate) return "Fecha inválida";
      const date = row.original.appointmentDate.toDate();
      const formattedDate = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const formattedTime = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      // Ocultamos esta celda en móvil, pero la mostramos a partir de tablets (md)
      return <div className="hidden md:block">{`${formattedDate} a las ${formattedTime}`}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as AppointmentStatus;
      const statusClasses = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || ''}`}>
          {status ? status.charAt(0).toUpperCase() + status.slice(1) : ''}
        </span>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const appointmentId = row.original.id;
      const currentStatus = row.original.status;
      
      const { updateStatus, deleteAppointment } = table.options.meta as {
        updateStatus: (id: string, status: AppointmentStatus) => void;
        deleteAppointment: (id: string) => void;
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            {currentStatus !== 'approved' && (
              <DropdownMenuItem onClick={() => updateStatus(appointmentId, 'approved')}>
                Aprobar
              </DropdownMenuItem>
            )}
            {currentStatus !== 'rejected' && (
              <DropdownMenuItem onClick={() => updateStatus(appointmentId, 'rejected')}>
                Rechazar
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => deleteAppointment(appointmentId)}
            >
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
