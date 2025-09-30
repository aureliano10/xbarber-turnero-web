import { appointments, Appointment } from "@/lib/data"
import { columns } from "@/components/admin/columns"
import { DataTable } from "@/components/admin/data-table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Panel de Administración</h1>
       <Card>
        <CardHeader className="text-center">
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
