export const TIPOS_DOCUMENTOS = ["Cédula", "Cédula Extranjería", "NIT", "Pasaporte"] as const;

export type TipoDocumento = typeof TIPOS_DOCUMENTOS[number];

export interface Empleado {
  id: number;
  tipo_documento: TipoDocumento;
  nombre: string;
  apellido: string;
  documento: string;
  correo: string;
  telefono: string;
}

export type EmpleadoFormData = Omit<Empleado, 'id'>;
