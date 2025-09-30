"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Sparkles, Loader2 } from "lucide-react"

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
import { Appointment } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { getTurnSummary } from "@/app/actions"


function TurnDetailsDialog({ appointment, isOpen, onOpenChange }: { appointment: Appointment; isOpen: boolean, onOpenChange: (open: boolean) => void }) {
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateSummary = async () => {
    setIsLoading(true)
    setError(null)
    setSummary(null)
    const result = await getTurnSummary(
      appointment.customerName,
      `Turno para ${appointment.service} el ${new Date(appointment.date).toLocaleDateString('es-ES', { timeZone: 'UTC' })} a las ${appointment.time}`,
      appointment.preferences
    )
    setIsLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      setSummary(result.summary)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Detalles del Turno</DialogTitle>
          <DialogDescription>
            Resumen del turno para {appointment.customerName}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-start gap-4">
            <span className="text-right font-medium">Cliente</span>
            <span className="col-span-3">{appointment.customerName}</span>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <span className="text-right font-medium">Servicio</span>
            <span className="col-span-3">{appointment.service}</span>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <span className="text-right font-medium">Preferencias</span>
            <p className="col-span-3 text-sm">{appointment.preferences}</p>
          </div>
          <DropdownMenuSeparator />
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Resumen IA</h4>
              <Button onClick={handleGenerateSummary} disabled={isLoading} size="sm" variant="outline">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generar
              </Button>
            </div>
            {isLoading && <p className="text-sm text-muted-foreground flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generando resumen...</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
            {summary && <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">{summary}</div>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ActionsCell({ row }: { row: { original: Appointment } }) {
  const appointment = row.original
  const { toast } = useToast()
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const handleAction = (action: 'approve' | 'reject') => {
    toast({
      title: `Turno ${action === 'approve' ? 'aprobado' : 'rechazado'}`,
      description: `El turno de ${appointment.customerName} ha sido ${action === 'approve' ? 'aprobado' : 'rechazado'}.`,
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
            Ver detalles y resumir (IA)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleAction('approve')}>Aprobar</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction('reject')} className="text-destructive focus:text-destructive focus:bg-destructive/10">Rechazar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}


export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "customerName",
    header: "Cliente",
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
            timeZone: 'UTC'
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
      const variant = {
        pending: "secondary",
        approved: "default",
        rejected: "destructive",
      }[status] ?? "default"

      const statusText = {
        pending: "Pendiente",
        approved: "Aprobado",
        rejected: "Rechazado",
      }[status] ?? "Desconocido"
      
      return <Badge variant={variant as any}>{statusText}</Badge>
    },
  },
  {
    id: "actions",
    cell: ActionsCell,
  },
]
