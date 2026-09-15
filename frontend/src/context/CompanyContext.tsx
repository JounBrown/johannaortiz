'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CompanyContextType {
  selectedCompany: string;
  setSelectedCompany: (company: string) => void;
  companies: { id: string; name: string }[];
  isLoading: boolean;
}

export const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

const AVAILABLE_COMPANIES = [
  { id: 'egl', name: 'EGL' },
  { id: 'empresa2', name: 'Brooklyn' },
];

const STORAGE_KEY = 'selectedCompany';
const COOKIE_KEY = 'selectedCompany';

function setCompanyCookie(company: string) {
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(company)}; path=/; samesite=lax`;
}

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [selectedCompany, setSelectedCompanyState] = useState('egl');
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar empresa seleccionada de la cookie al montar
  useEffect(() => {
    // Leer cookie en el cliente
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${COOKIE_KEY}=`))
      ?.split('=')[1];
    
    const stored = cookieValue ? decodeURIComponent(cookieValue) : null;
    
    if (stored && AVAILABLE_COMPANIES.some(c => c.id === stored)) {
      setSelectedCompanyState(stored);
    } else {
      // Si no hay empresa guardada, guardar la por defecto
      setCompanyCookie('egl');
    }
    setMounted(true);
    setIsLoading(false);
  }, []);

  const setSelectedCompany = (company: string) => {
    // Validar que la empresa existe
    if (AVAILABLE_COMPANIES.some(c => c.id === company)) {
      setSelectedCompanyState(company);
      setCompanyCookie(company);
    }
  };

  // No renderizar hasta que esté montado en el cliente
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <CompanyContext.Provider
      value={{
        selectedCompany,
        setSelectedCompany,
        companies: AVAILABLE_COMPANIES,
        isLoading,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);

  // Return default values if context is not available (e.g., during SSR)
  if (context === undefined) {
    return {
      selectedCompany: 'egl',
      setSelectedCompany: () => {},
      companies: [
        { id: 'egl', name: 'EGL' },
        { id: 'empresa2', name: 'Brooklyn' },
      ],
      isLoading: true,
    };
  }

  return context;
}
