"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CompanyBanner } from "@/components/CompanyBanner";
import { RippleButton, RippleButtonRipples } from "@/components/animate-ui/components/buttons/ripple";

const DashboardPage = React.memo(function DashboardPage() {
  const router = useRouter();
  useEffect(() => {
    document.title = "Dashboard | EGL";
  }, []);

  return (
    <div className="space-y-6  max-w-full">
      {/* Company Banner */}
      <CompanyBanner showAlways={true} />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min w-full">
        {/* Acceso a Empleados */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-6 w-6" style={{ color: "var(--primary)" }} />
              Gestión de Empleados
            </CardTitle>
            <CardDescription>
              Administra los registros, perfiles y datos de contacto de todo el personal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RippleButton
              variant="default"
              className="w-full"
              onClick={() => router.push('/empleados')}
            >
              Ir a Empleados
              <RippleButtonRipples />
            </RippleButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

// Wrap with ErrorBoundary for better error handling
function DashboardPageWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <DashboardPage />
    </ErrorBoundary>
  );
}

export default DashboardPageWithErrorBoundary;

