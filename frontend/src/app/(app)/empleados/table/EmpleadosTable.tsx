"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface WithId {
  id: number;
}

interface EmpleadosTableProps<TData extends WithId, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
  error: Error | null;
  state: {
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
    globalFilter: string;
    rowSelection: RowSelectionState;
    pagination: PaginationState;
  };
  onSortingChange: (sorting: SortingState) => void;
  onColumnFiltersChange: (filters: ColumnFiltersState) => void;
  onGlobalFilterChange: (filter: string) => void;
  onRowSelectionChange: (selection: RowSelectionState) => void;
  onPaginationChange: (pagination: PaginationState) => void;
  printRef?: React.RefObject<HTMLDivElement | null>;
}

export function EmpleadosTable<TData extends WithId, TValue>({
  columns,
  data,
  loading,
  error,
  state,
  onSortingChange,
  onColumnFiltersChange,
  onGlobalFilterChange,
  onRowSelectionChange,
  onPaginationChange,
  printRef,
}: EmpleadosTableProps<TData, TValue>) {

  const getPrintHeaderLabel = (columnId: string) => {
    switch (columnId) {
      case "tipo_documento": return "Tipo Doc.";
      case "documento": return "Documento";
      case "nombreCompleto": return "Nombre";
      case "correo": return "Correo";
      case "telefono": return "Teléfono";
      default: return columnId;
    }
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    const newSorting = typeof updaterOrValue === 'function' 
      ? updaterOrValue(state.sorting)
      : updaterOrValue;
    onSortingChange(newSorting);
  };

  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updaterOrValue) => {
    const newFilters = typeof updaterOrValue === 'function' 
      ? updaterOrValue(state.columnFilters)
      : updaterOrValue;
    onColumnFiltersChange(newFilters);
  };

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (updaterOrValue) => {
    const newSelection = typeof updaterOrValue === 'function' 
      ? updaterOrValue(state.rowSelection)
      : updaterOrValue;
    onRowSelectionChange(newSelection);
  };

  const handlePaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
    const newPagination = typeof updaterOrValue === 'function'
      ? updaterOrValue(state.pagination)
      : updaterOrValue;
    onPaginationChange(newPagination);
  };

  const table = useReactTable({
    data,
    columns,
    state,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onGlobalFilterChange,
    onRowSelectionChange: handleRowSelectionChange,
    onPaginationChange: handlePaginationChange,
    manualPagination: false,
    manualFiltering: false,
    manualSorting: false,
    autoResetPageIndex: false,
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = String(filterValue ?? "").toLowerCase().trim();
      if (!search) return true;

      const nombre = String(row.getValue("nombreCompleto") ?? "").toLowerCase();
      const tipoDocumento = String(row.getValue("tipo_documento") ?? "").toLowerCase();
      const documento = String(row.getValue("documento") ?? "").toLowerCase();
      const correo = String(row.getValue("correo") ?? "").toLowerCase();

      return nombre.includes(search) || tipoDocumento.includes(search) || documento.includes(search) || correo.includes(search);
    },
    getRowId: (row) => row.id.toString(),
  });

  return (
    <>
      <div ref={printRef} className="hidden print:block print:px-6 print:pt-6">
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-gray-900">Empleados</h1>
          <p className="text-xs text-gray-500">
            Fecha: {new Date().toLocaleDateString("es-CO")}
          </p>
        </div>
        <table className="w-full border-collapse text-xs">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers
                  .filter(
                    (header) =>
                      header.column.id !== "select" &&
                      header.column.id !== "actions"
                  )
                  .map((header) => (
                    <th
                      key={header.id}
                      className="border border-gray-300 bg-gray-100 px-2 py-1 text-left font-medium text-gray-700"
                    >
                      {header.isPlaceholder
                        ? null
                        : getPrintHeaderLabel(header.column.id)}
                    </th>
                  ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getFilteredRowModel().rows.length ? (
              table.getFilteredRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row
                    .getVisibleCells()
                    .filter(
                      (cell) =>
                        cell.column.id !== "select" &&
                        cell.column.id !== "actions"
                    )
                    .map((cell) => (
                      <td
                        key={cell.id}
                        className="border border-gray-300 px-2 py-1 text-gray-800"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="border border-gray-300 px-2 py-2 text-center text-gray-500"
                  colSpan={Math.max(columns.length - 2, 1)}
                >
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-md border print:hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">Cargando datos...</TableCell></TableRow>
            ) : error ? (
              <TableRow><TableCell colSpan={columns.length} className="h-24 text-center text-red-500">Error al cargar datos.</TableCell></TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">No se encontraron resultados.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 px-2 py-4 sm:gap-2 print:hidden">
        <div className="flex flex-col gap-3 sm:hidden">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
            </div>
            <div className="text-sm font-medium">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </div>
          </div>
          
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium whitespace-nowrap">Filas por página</p>
              <Select
                value={String(table.getState().pagination.pageSize)}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[78px]">
                  <SelectValue>
                    {table.getState().pagination.pageSize}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={String(pageSize)}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-1">
              <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                <span className="sr-only">Ir a la primera página</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <span className="sr-only">Ir a la página anterior</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <span className="sr-only">Ir a la página siguiente</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                <span className="sr-only">Ir a la última página</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center justify-between w-full">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium whitespace-nowrap">Filas por página</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger className="h-8 w-[78px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm font-medium">   
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </div>

            <div className="flex items-center space-x-1">
              <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
