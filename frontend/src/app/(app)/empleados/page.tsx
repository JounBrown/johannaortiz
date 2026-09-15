import { Suspense } from "react";
import { EmpleadosPageClient } from "./components/EmpleadosPageClient";

function EmpleadosPageSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="h-10 w-1/3 bg-muted animate-pulse rounded-lg" />
      <div className="h-8 w-2/3 bg-muted animate-pulse rounded" />
      <div className="h-40 bg-muted animate-pulse rounded-lg" />
      <div className="border rounded-lg">
        <div className="h-12 bg-muted animate-pulse rounded-t-lg" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 border-t bg-muted/50 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export const metadata = {
  title: "Empleados | EGL",
  description: "Gestión de empleados - Sistema de Inventario EGL",
};

export default function Page() {
  return (
    <div className="p-4 md:p-8">
      <Suspense fallback={<EmpleadosPageSkeleton />}>
        <EmpleadosPageClient />
      </Suspense>
    </div>
  );
}
