'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getEmpleado, Empleado } from '@/services/empleados';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Mail, Phone, User, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { EmpleadoEdit } from '../modales/EmpleadoEdit';
import { useEmpleados } from '../hooks/useEmpleados';

export default function DetalleEmpleadoPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { deleteEmpleado } = useEmpleados();

  const fetchEmpleado = async () => {
    try {
      setIsLoading(true);
      const data = await getEmpleado(id);
      setEmpleado(data);
    } catch (error) {
      toast.error('No se pudo cargar la información del empleado');
      router.push('/empleados');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEmpleado();
  }, [id, router]);

  const handleDelete = async () => {
    try {
      await deleteEmpleado(empleado!.id);
      toast.success("Empleado eliminado correctamente");
      router.push('/empleados');
    } catch (error) {
      toast.error("Error al eliminar el empleado");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-neutral-500">Cargando detalles...</div>;
  }

  if (!empleado) {
    return <div className="p-8 text-center text-red-500">Empleado no encontrado</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push('/empleados')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Perfil del Empleado
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              Detalles completos de {empleado.nombre} {empleado.apellido}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive"
                className="flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro de que deseas eliminar este empleado?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará permanentemente a {empleado.nombre} {empleado.apellido} del sistema.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Sí, eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 shadow-sm transition-all hover:shadow-md bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit className="h-4 w-4" />
            Editar Empleado
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
          <CardHeader className="bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-neutral-500" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Nombres</p>
              <p className="text-lg font-medium">{empleado.nombre}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Apellidos</p>
              <p className="text-lg font-medium">{empleado.apellido}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Tipo y Número de Documento</p>
              <div className="flex items-center gap-2">
                <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-sm font-semibold">
                  {empleado.tipo_documento}
                </span>
                <p className="text-lg font-medium">{empleado.documento}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
          <CardHeader className="bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-neutral-500" />
              Información de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-neutral-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Correo Electrónico</p>
                <a href={`mailto:${empleado.correo}`} className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  {empleado.correo}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-neutral-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Teléfono</p>
                <a href={`tel:${empleado.telefono}`} className="text-lg font-medium hover:underline">
                  {empleado.telefono}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <EmpleadoEdit
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        empleado={empleado as any}
        onUpdated={() => {
          setIsEditModalOpen(false);
          fetchEmpleado(); // Refrescar los datos de la vista después de editar
        }}
      />
    </div>
  );
}
