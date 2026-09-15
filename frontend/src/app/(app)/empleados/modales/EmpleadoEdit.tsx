"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Save } from "lucide-react";
import { TIPOS_DOCUMENTOS, EmpleadoFormData, Empleado } from "../types/empleado.types";
import { useEmpleados } from "../hooks/useEmpleados";

interface EmpleadoEditProps {
  open: boolean;
  onClose: () => void;
  empleado: Empleado;
  onUpdated: () => void;
}

function FormContent({
  form,
  loading,
  onFormChange,
  onSubmit,
  onCancel,
}: {
  form: EmpleadoFormData;
  loading: boolean;
  onFormChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="md:col-span-1">
          <label htmlFor="nombre-edit" className="text-sm font-medium">Nombre *</label>
          <input
            id="nombre-edit"
            name="nombre"
            type="text"
            required
            value={form.nombre}
            onChange={(e) => onFormChange("nombre", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md"
          />
        </div>

        <div className="md:col-span-1">
          <label htmlFor="apellido-edit" className="text-sm font-medium">Apellido *</label>
          <input
            id="apellido-edit"
            name="apellido"
            type="text"
            required
            value={form.apellido}
            onChange={(e) => onFormChange("apellido", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md"
          />
        </div>

        <div>
          <label htmlFor="tipo_documento-edit" className="text-sm font-medium">Tipo Doc. *</label>
          <select
            id="tipo_documento-edit"
            name="tipo_documento"
            required
            value={form.tipo_documento}
            onChange={(e) => onFormChange("tipo_documento", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md"
          >
            {TIPOS_DOCUMENTOS.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="documento-edit" className="text-sm font-medium">Documento *</label>
          <input
            id="documento-edit"
            name="documento"
            type="text"
            required
            value={form.documento}
            onChange={(e) => onFormChange("documento", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md"
          />
        </div>

        <div>
          <label htmlFor="correo-edit" className="text-sm font-medium">Correo *</label>
          <input
            id="correo-edit"
            name="correo"
            type="email"
            required
            value={form.correo}
            onChange={(e) => onFormChange("correo", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md"
          />
        </div>

        <div>
          <label htmlFor="telefono-edit" className="text-sm font-medium">Teléfono *</label>
          <input
            id="telefono-edit"
            name="telefono"
            type="tel"
            required
            value={form.telefono}
            onChange={(e) => onFormChange("telefono", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md"
          />
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Actualizando..." : <><Save className="h-4 w-4 mr-2" />Actualizar Empleado</>}
        </Button>
      </div>
    </form>
  );
}

export function EmpleadoEdit({ open, onClose, empleado, onUpdated }: EmpleadoEditProps) {
  const { updateEmpleado } = useEmpleados();
  const [loading, setLoading] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [form, setForm] = useState<EmpleadoFormData>({
    tipo_documento: "Cédula",
    nombre: "",
    apellido: "",
    documento: "",
    correo: "",
    telefono: "",
  });

  useEffect(() => {
    if (empleado && open) {
      setForm({
        tipo_documento: empleado.tipo_documento,
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        documento: empleado.documento,
        correo: empleado.correo,
        telefono: empleado.telefono,
      });
    }
  }, [empleado, open]);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await updateEmpleado(empleado.id, form);
      if (result) {
        toast.success("Empleado actualizado correctamente");
        onUpdated();
      }
    } catch (error) {
      toast.error("Error al actualizar el empleado");
    } finally {
      setLoading(false);
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Empleado</DialogTitle>
            <DialogDescription>
              Modifique los datos del empleado.
            </DialogDescription>
          </DialogHeader>
          <FormContent
            form={form}
            loading={loading}
            onFormChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Editar Empleado</DrawerTitle>
          <DrawerDescription>
            Modifique los datos del empleado.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 overflow-y-auto max-h-[70vh]">
          <FormContent
            form={form}
            loading={loading}
            onFormChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
