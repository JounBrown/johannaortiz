"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import type { Empleado } from "../types/empleado.types";
import { useEmpleados } from "../hooks/useEmpleados";

interface EmpleadoDeleteSelectedProps {
  selected: Empleado[];
  clearSelection: () => void;
  fetchData: () => Promise<void>;
}

export function EmpleadoDeleteSelected({ selected, clearSelection, fetchData }: EmpleadoDeleteSelectedProps) {
  const { deleteMultipleEmpleados } = useEmpleados();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const ids = selected.map(e => e.id.toString());
      const result = await deleteMultipleEmpleados(ids);
      
      if (result) {
        toast.success(`Se eliminaron ${selected.length} empleados exitosamente.`);
        clearSelection();
        await fetchData();
        setOpen(false);
      } else {
        toast.error("Error al eliminar algunos empleados.");
      }
    } catch (error) {
      toast.error("Error al eliminar los empleados seleccionados.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (selected.length === 0) return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="lg" className="w-full sm:w-auto">
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar ({selected.length})
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente {selected.length} 
            {selected.length === 1 ? " empleado" : " empleados"} del sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Eliminando..." : "Sí, eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
