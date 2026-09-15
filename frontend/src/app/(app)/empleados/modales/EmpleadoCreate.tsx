"use client";

import { useState } from "react";
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
import { TIPOS_DOCUMENTOS, EmpleadoFormData } from "../types/empleado.types";
import { useEmpleados } from "../hooks/useEmpleados";

interface EmpleadoCreateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
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
          <label htmlFor="nombre" className="text-sm font-medium">Nombre *</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            value={form.nombre}
            onChange={(e) => onFormChange("nombre", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md"
            placeholder="Ej: Juan"
          />
        </div>

        <div className="md:col-span-1">
          <label htmlFor="apellido" className="text-sm font-medium">Apellido *</label>
          <input
            id="apellido"
            name="apellido"
            type="text"
            required
            value={form.apellido}
            onChange={(e) => onFormChange("apellido", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md"
            placeholder="Ej: Pérez"
          />
        </div>

        <div>
          <label htmlFor="tipo_documento" className="text-sm font-medium">Tipo Doc. *</label>
          <select
            id="tipo_documento"
            name="tipo_documento"
            required
            value={form.tipo_documento}
            onChange={(e) => onFormChange("tipo_documento", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md"
          >
            <option value="">Seleccionar</option>
            {TIPOS_DOCUMENTOS.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="documento" className="text-sm font-medium">Documento *</label>
          <input
            id="documento"
            name="documento"
            type="text"
            required
            value={form.documento}
            onChange={(e) => onFormChange("documento", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md"
            placeholder="Ej: 102030"
          />
        </div>

        <div>
          <label htmlFor="correo" className="text-sm font-medium">Correo *</label>
          <input
            id="correo"
            name="correo"
            type="email"
            required
            value={form.correo}
            onChange={(e) => onFormChange("correo", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div>
          <label htmlFor="telefono" className="text-sm font-medium">Teléfono *</label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            required
            value={form.telefono}
            onChange={(e) => onFormChange("telefono", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md"
            placeholder="Ej: 3001234567"
          />
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : <><Save className="h-4 w-4 mr-2" />Guardar Empleado</>}
        </Button>
      </div>
    </form>
  );
}

export function EmpleadoCreate({ open, onOpenChange, onCreated }: EmpleadoCreateProps) {
  const { createEmpleado } = useEmpleados();
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

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      tipo_documento: "Cédula",
      nombre: "",
      apellido: "",
      documento: "",
      correo: "",
      telefono: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await createEmpleado(form);
      if (result) {
        toast.success("Empleado creado correctamente");
        onCreated();
        onOpenChange(false);
        resetForm();
      }
    } catch (error) {
      toast.error("Error al crear el empleado");
    } finally {
      setLoading(false);
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Empleado</DialogTitle>
            <DialogDescription>
              Agrega un nuevo empleado al sistema. Los campos con * son obligatorios.
            </DialogDescription>
          </DialogHeader>
          <FormContent
            form={form}
            loading={loading}
            onFormChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Crear Nuevo Empleado</DrawerTitle>
          <DrawerDescription>
            Agrega un nuevo empleado al sistema. Los campos con * son obligatorios.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 overflow-y-auto max-h-[70vh]">
          <FormContent
            form={form}
            loading={loading}
            onFormChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
