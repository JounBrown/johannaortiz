export interface Empleado {
  id: number;
  tipo_documento: string;
  nombre: string;
  apellido: string;
  documento: string;
  correo: string;
  telefono: string;
}

export type EmpleadoFormData = Omit<Empleado, 'id'>;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const EMPLEADOS_ENDPOINT = `${API_URL}/empleados`;

export async function getEmpleados(): Promise<Empleado[]> {
  const response = await fetch(EMPLEADOS_ENDPOINT, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error('Error al obtener los empleados');
  }
  
  return response.json();
}

export async function getEmpleado(id: string | number): Promise<Empleado> {
  const response = await fetch(`${EMPLEADOS_ENDPOINT}/${id}`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error('Error al obtener el empleado');
  }
  
  return response.json();
}

export async function createEmpleado(data: EmpleadoFormData): Promise<Empleado> {
  const response = await fetch(EMPLEADOS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Error al crear el empleado');
  }
  
  return response.json();
}

export async function updateEmpleado(id: string | number, data: Partial<EmpleadoFormData>): Promise<Empleado> {
  const response = await fetch(`${EMPLEADOS_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Error al actualizar el empleado');
  }
  
  return response.json();
}

export async function deleteEmpleado(id: string | number): Promise<void> {
  const response = await fetch(`${EMPLEADOS_ENDPOINT}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Error al eliminar el empleado');
  }
}
