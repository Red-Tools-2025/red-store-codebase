/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inventory } from "@prisma/client";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  Row,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table";
import { useState } from "react";
import { getPaginationRowModel } from "@tanstack/react-table";

interface InventoryTableHookProps {
  data: Inventory[];
  columns: ColumnDef<Inventory>[];
}

const useInventoryTableHook = ({ columns, data }: InventoryTableHookProps) => {
  // Global filter for searching by name or brand
  const globalSearchFilter: FilterFn<Inventory> = (
    row: Row<Inventory>,
    _columnId: string,
    filterValue: string
  ) => {
    const name = row.original.invItem?.toLowerCase() || "";
    const brand = row.original.invItemBrand?.toLowerCase() || "";
    const search = filterValue.toLowerCase();
    return name.includes(search) || brand.includes(search);
  };

  const [sorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      rowSelection: selectedRows,
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setSelectedRows,
    globalFilterFn: globalSearchFilter,
    enableRowSelection: true,
  });

  const totalPages = table.getPageCount();

  return {
    table,
    sorting,
    columnFilters,
    setColumnFilters,
    globalFilter,
    selectedRows,
    setGlobalFilter,
    totalPages,
  };
};

export default useInventoryTableHook;
