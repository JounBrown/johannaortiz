import { useMemo, useCallback } from 'react';
import { useResource } from '@/hooks/useStandardApi';
import type { Empleado } from "../types/empleado.types";

interface UseEmpleadosOptions {
  initialData?: Empleado[];
}

interface UseEmpleadosReturn {
  data: Empleado[];
  loading: boolean;
  error: unknown;
  createEmpleado: (data: Partial<Empleado>) => Promise<Empleado | false>;
  updateEmpleado: (id: string | number, data: Partial<Empleado>) => Promise<Empleado | false>;
  deleteEmpleado: (id: string | number) => Promise<void>;
  deleteMultipleEmpleados: (ids: string[]) => Promise<unknown>;
  refetch: () => void;
}

export function useEmpleados({ initialData = [] }: UseEmpleadosOptions = {}): UseEmpleadosReturn {
  const hasInitialData = initialData.length > 0;

  const {
    data,
    loading,
    error,
    create,
    update,
    remove,
    bulkDelete,
    refetch,
  } = useResource<Empleado>('/empleados', {
    autoFetch: true,
    showErrorToast: true,
  });

  const effectiveData: Empleado[] = useMemo(() => {
    if (data !== null && data !== undefined) {
      return data;
    }
    return initialData;
  }, [data, initialData]);

  const createEmpleado = useCallback(async (data: Partial<Empleado>): Promise<Empleado | false> => {
    try {
      const result = await create(data);
      if (result) {
        setTimeout(() => refetch(), 300);
        return result as Empleado;
      }
      return false;
    } catch (error) {
      console.error('Error creating empleado:', error);
      throw error;
    }
  }, [create, refetch]);

  const updateEmpleado = useCallback(async (id: string | number, data: Partial<Empleado>): Promise<Empleado | false> => {
    try {
      const result = await update(id.toString(), data);
      if (result) {
        setTimeout(() => refetch(), 300);
        return result as Empleado;
      }
      return false;
    } catch (error) {
      console.error('Error updating empleado:', error);
      throw error;
    }
  }, [update, refetch]);

  const deleteEmpleado = useCallback(async (id: string | number): Promise<void> => {
    try {
      await remove(id.toString());
      setTimeout(() => refetch(), 300);
    } catch (error) {
      console.error('Error deleting empleado:', error);
      throw error;
    }
  }, [remove, refetch]);

  const deleteMultipleEmpleados = useCallback(async (ids: string[]) => {
    try {
      const promises = ids.map(id => remove(id.toString()));
      await Promise.all(promises);
      
      setTimeout(() => refetch(), 300);
      return true;
    } catch (error) {
      console.error('Error deleting empleados:', error);
      throw error;
    }
  }, [remove, refetch]);

  return {
    data: effectiveData,
    loading: !hasInitialData ? loading : false,
    error,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
    deleteMultipleEmpleados,
    refetch,
  };
}
