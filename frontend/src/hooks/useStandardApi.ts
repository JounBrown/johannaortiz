/**
 * Standardized API client utilities
 * 
 * This file provides utilities and patterns for consistent API usage
 * across the application using the useApi hook.
 */

import { useApi } from "@/hooks/useApi";
import { useCallback, useState, useEffect, useRef, useContext } from "react";
import { toast } from "sonner";
import { CompanyContext } from "@/context/CompanyContext";

/**
 * Standard hook for CRUD operations on a resource
 * 
 * @param endpoint - The API endpoint (e.g., "/insumos")
 * @param options - Configuration options
 */
export function useResource<T>(
  endpoint: string,
  options: {
    showErrorToast?: boolean;
    autoFetch?: boolean;
  } = {}
) {
  const { showErrorToast = true, autoFetch = true } = options;
  const api = useApi({ showErrorToast });
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchingRef = useRef(false); // Para prevenir peticiones concurrentes
  const lastFetchRef = useRef(0); // Para rate limiting

  // Obtener la empresa actual del contexto (si está disponible)
  const context = useContext(CompanyContext);
  const selectedCompany = context?.selectedCompany;
  const isLoading = context?.isLoading ?? true;

  const fetchData = useCallback(async () => {
    // No hacer fetch si el contexto está cargando
    if (isLoading) {
      return;
    }

    // Prevenir peticiones concurrentes
    if (fetchingRef.current) {
      console.log('Fetch already in progress, skipping...');
      return;
    }

    // Rate limiting: esperar al menos 1 segundo entre peticiones
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchRef.current;
    if (timeSinceLastFetch < 1000) {
      console.log('Rate limiting: waiting before next fetch...');
      setTimeout(() => fetchData(), 1000 - timeSinceLastFetch);
      return;
    }

    fetchingRef.current = true;
    setLoading(true);
    lastFetchRef.current = now;

    try {
      const result = await api.get(endpoint);
      if (result) {
        setData(Array.isArray(result) ? result : []);
      }
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [api, endpoint, selectedCompany, isLoading]);

  const create = useCallback(async (item: Partial<T>) => {
    const result = await api.post(endpoint, item);
    if (result) {
      toast.success("Elemento creado con éxito");
      return result;
    }
    return null;
  }, [api, endpoint]);

  const update = useCallback(async (id: string | number, item: Partial<T>) => {
    const result = await api.put(`${endpoint}/${id}`, item);
    if (result) {
      toast.success("Elemento actualizado con éxito");
      return result;
    }
    return null;
  }, [api, endpoint]);

  const remove = useCallback(async (id: string | number) => {
    const result = await api.delete(`${endpoint}/${id}`);
    if (result) {
      toast.success("Elemento eliminado con éxito");
      return result;
    }
    return null;
  }, [api, endpoint]);

  const bulkDelete = useCallback(async (ids: (string | number)[]) => {
    const result = await api.post(`${endpoint}/bulk-delete`, { ids });
    if (result) {
      toast.success(`${ids.length} elementos eliminados con éxito`);
      return result;
    }
    return null;
  }, [api, endpoint]);

  useEffect(() => {
    if (autoFetch && !isLoading) {
      // Delay inicial para evitar conflictos con SSR
      const timer = setTimeout(() => {
        fetchData();
      }, 100);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch, selectedCompany, isLoading]);

  return {
    data,
    loading: loading || api.loading,
    error: api.error,
    refetch: fetchData,
    create,
    update,
    remove,
    bulkDelete,
    api,
  };
}


