import { appointments, Appointment } from "@/lib/data"
import { columns } from "@/components/admin/columns"
import { DataTable } from "@/components/admin/data-table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function AdminPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
       <Card>
        <CardHeader>
          <CardTitle>Turnos Pendientes y Recientes</CardTitle>
          <CardDescription>
            Gestiona las solicitudes de turnos de tus clientes.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <DataTable columns={columns} data={appointments} />
        </CardContent>
      </Card>
    </div>
  )
}
