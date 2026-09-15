"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { ColumnFiltersState, SortingState, RowSelectionState, PaginationState } from "@tanstack/react-table";
import { useReactToPrint } from "react-to-print";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RippleButton, RippleButtonRipples } from "@/components/animate-ui/components/buttons/ripple";

import type { Empleado } from "../types/empleado.types";
import { useEmpleados } from "../hooks/useEmpleados";
import { getColumns } from "../table/columns";
import { EmpleadosTable } from "../table/EmpleadosTable";
import { EmpleadoCreate } from "../modales/EmpleadoCreate";
import { EmpleadoEdit } from "../modales/EmpleadoEdit";
import { EmpleadoDeleteSelected } from "../modales/EmpleadoDeleteSelected";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Printer } from "lucide-react";

export function EmpleadosPageClient() {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // --- ESTADO Y HOOKS ---
  const {
    data: empleados,
    loading,
    error,
    refetch,
  } = useEmpleados({});

  // Estado para la tabla y filtros
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  // Estado para modales
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);

  // --- MANEJADORES DE EVENTOS ---
  const handleEdit = useCallback((empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    setEditModalOpen(true);
  }, []);

  const handleNavigateToDetail = useCallback((id: number) => {
    router.push(`/empleados/${id}`); // Aún podemos dejar el ver detalles si quieres, o eliminarlo luego si no hace falta
  }, [router]);

  const { deleteEmpleado } = useEmpleados();

  const handleDelete = useCallback(async (empleado: Empleado) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar a ${empleado.nombre} ${empleado.apellido}?`)) {
      try {
        await deleteEmpleado(empleado.id);
        // deleteEmpleado ya hace refetch internamente si es exitoso
      } catch (error) {
        console.error("Error deleting empleado:", error);
      }
    }
  }, [deleteEmpleado]);

  const handleRefetch = useCallback(async () => {
    await Promise.resolve(refetch());
  }, [refetch]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Empleados",
  });

  // --- DEFINICIÓN DE COLUMNAS ---
  const columns = useMemo(
    () => getColumns({
      onEdit: handleEdit,
      onNavigateToDetail: handleNavigateToDetail,
      onDelete: handleDelete,
    }),
    [handleEdit, handleNavigateToDetail, handleDelete]
  );

  const selectedRowsData = useMemo(() => {
    return Object.keys(rowSelection)
      .map(id => empleados.find(e => e.id.toString() === id))
      .filter(Boolean) as Empleado[];
  }, [rowSelection, empleados]);

  return (
    <div className="space-y-4 px-2 sm:px-0">
      {/* SECCIÓN DE TÍTULO */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Gestión de Empleados</h1>
      </div>

      {/* SECCIÓN DE CONTROLES Y BÚSQUEDA */}
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Input
            placeholder="Buscar empleado..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-10 w-full sm:w-auto sm:min-w-[240px] lg:min-w-[280px]"
          />

          {(columnFilters.length > 0 || globalFilter) && (
            <Button variant="ghost" size="sm" onClick={() => { setColumnFilters([]); setGlobalFilter(""); }}>
              Limpiar Búsqueda
            </Button>
          )}
        </div>
        
        <div className="w-full flex flex-col sm:flex-row sm:flex-wrap xl:flex-nowrap sm:justify-end sm:items-center gap-2">
          <RippleButton
            variant="outline"
            size="lg"
            onClick={handlePrint}
            className="w-full sm:w-auto whitespace-nowrap"
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
            <RippleButtonRipples />
          </RippleButton>
          
          <EmpleadoDeleteSelected
            selected={selectedRowsData}
            fetchData={handleRefetch}
            clearSelection={() => setRowSelection({})}
          />
          
          <RippleButton
            variant="default"
            size="lg"
            onClick={() => setCreateModalOpen(true)}
            className="w-full sm:w-auto whitespace-nowrap"
          >
            Crear Empleado
            <RippleButtonRipples />
          </RippleButton>
        </div>
      </div>

      {/* TABLA DE DATOS */}
      <EmpleadosTable
        columns={columns}
        data={empleados}
        loading={loading}
        error={error as Error | null}
        state={{ columnFilters, globalFilter, sorting, rowSelection, pagination }}
        onGlobalFilterChange={setGlobalFilter}
        onColumnFiltersChange={setColumnFilters}
        onSortingChange={setSorting}
        onRowSelectionChange={setRowSelection}
        onPaginationChange={setPagination}
        printRef={printRef}
      />

      {/* MODALES */}
      <EmpleadoCreate
        open={isCreateModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreated={async () => {
          await refetch();
        }}
      />

      {selectedEmpleado && (
        <EmpleadoEdit
          open={isEditModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedEmpleado(null);
          }}
          empleado={selectedEmpleado}
          onUpdated={async () => {
            await refetch();
            setEditModalOpen(false);
            setSelectedEmpleado(null);
          }}
        />
      )}
    </div>
  );
}
