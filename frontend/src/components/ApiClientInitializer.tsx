'use client';

import { useEffect, useContext } from 'react';
import { CompanyContext } from '@/context/CompanyContext';
import { apiClient } from '@/lib/api-client';

/**
 * Componente que inicializa el apiClient con el getter de companyId.
 */
export function ApiClientInitializer({ children }: { children: React.ReactNode }) {
  const context = useContext(CompanyContext);

  useEffect(() => {
    if (context) {
      // Configurar el getter de empresa en el apiClient si el contexto está disponible
      apiClient.setCompanyIdGetter(() => context.selectedCompany);
    } else {
      // Fallback a empresa por defecto
      apiClient.setCompanyIdGetter(() => 'egl');
    }
  }, [context?.selectedCompany]); // ← CAMBIO: Monitorear solo selectedCompany

  return <>{children}</>;
}
