import { useState, useCallback, useRef, useEffect } from "react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { toast } from "sonner";
import { useContext } from "react";
import { CompanyContext } from "@/context/CompanyContext";

interface UseApiOptions {
  showErrorToast?: boolean;
  timeout?: number;
}

interface ApiError {
  message: string;
  status?: number;
  data?: any; // Guardar toda la respuesta del error
}

export function useApi<T = unknown>(options: UseApiOptions = {}) {
  const { showErrorToast = true, timeout = 10000 } = options;
  const context = useContext(CompanyContext);
  const selectedCompany = context?.selectedCompany || 'egl';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const lastErrorRef = useRef<ApiError | null>(null);
  const request = useCallback(
    async (url: string, config: AxiosRequestConfig = {}): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const finalHeaders = {
          "Content-Type": "application/json",
          "X-Company-Id": selectedCompany,
          ...config.headers,
        };

        // Solo log en desarrollo y para errores
        if (process.env.NODE_ENV === 'development') {
          console.log(`📡 [useApi] ${config.method || 'GET'} ${url}`, {
            companyId: selectedCompany,
          });
        }

        const response = await axios({
          url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
          timeout,
          headers: finalHeaders,
          ...config,
        });

        return response.data;
      } catch (err) {
        const apiError: ApiError = {
          message: "Error desconocido",
          status: undefined,
          data: undefined,
        };

        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError;
          const responseData = axiosError.response?.data as {
            error?: string;
            message?: string;
            details?: string | { message?: string };
          } | undefined;
          
          // Guardar toda la respuesta del error
          apiError.data = responseData;
          
          // Manejar details como objeto o string
          let detailsMessage = '';
          if (typeof responseData?.details === 'string') {
            detailsMessage = responseData.details;
          } else if (responseData?.details && typeof responseData.details === 'object') {
            detailsMessage = responseData.details.message || '';
          }
          
          apiError.message =
            responseData?.error ||
            detailsMessage ||
            responseData?.message ||
            axiosError.message;
          apiError.status = axiosError.response?.status;
        } else if (err instanceof Error) {
          apiError.message = err.message;
        }

        lastErrorRef.current = apiError;
        setError(apiError);

        if (showErrorToast) {
          toast.error(apiError.message);
        }

        console.error("API Error:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showErrorToast, timeout, selectedCompany]
  );

  const get = useCallback(
    <R = T>(url: string, config?: AxiosRequestConfig): Promise<R | null> =>
      request(url, { ...config, method: "GET" }) as Promise<R | null>,
    [request]
  );

  const post = useCallback(
    <R = T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<R | null> =>
      request(url, { ...config, method: "POST", data }) as Promise<R | null>,
    [request]
  );

  const put = useCallback(
    <R = T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<R | null> =>
      request(url, { ...config, method: "PUT", data }) as Promise<R | null>,
    [request]
  );

  const del = useCallback(
    <R = T>(url: string, config?: AxiosRequestConfig): Promise<R | null> =>
      request(url, { ...config, method: "DELETE" }) as Promise<R | null>,
    [request]
  );

  const getLastError = useCallback(() => lastErrorRef.current, []);

  return {
    loading,
    error,
    lastError: lastErrorRef.current,
    getLastError,
    request,
    get,
    post,
    put,
    delete: del,
  };
}
