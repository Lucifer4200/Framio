import { Paper, ScrollArea, Table } from "@mantine/core";
import type { PaperProps, ScrollAreaProps, TableProps } from "@mantine/core";
import type { ReactNode, CSSProperties } from "react";
import Th from "@/components/table/Th";
import NoTableData from "@/components/table/NoTableData";
import TableLoader from "@/components/table/TableLoader";

type SortDirection = "asc" | "desc";

type TableAccessor<T> = keyof T | string | ((row: T) => ReactNode);

export interface DynamicTableColumn<T> {
  id: string;
  label: React.ReactNode;
  accessor: TableAccessor<T>;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  className?: string;
  style?: CSSProperties;
  headerClassName?: string;
  headerStyle?: CSSProperties;
}

export interface DynamicTableProps<T> {
  columns: DynamicTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  loadingRows?: number;
  tableProps?: TableProps;
  paperProps?: PaperProps;
  scrollAreaProps?: ScrollAreaProps;
  sortColumn?: string;
  sortDir?: SortDirection;
  onSort?: (sortBy: string, sortDir: SortDirection) => void;
  renderRow?: (item: T, index: number) => React.ReactNode;
  rowKey?: (item: T, index: number) => string;
  rowClassName?: (item: T, index: number) => string | undefined;
}

const getNestedValue = (obj: any, path: string) => {
  if (!obj || typeof path !== "string") return undefined;
  return path.split(".").reduce((current, key) => {
    if (current === undefined || current === null) return undefined;
    return current[key];
  }, obj);
};

const DynamicTable = <T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No data available yet!",
  loadingRows = 8,
  tableProps,
  paperProps,
  scrollAreaProps,
  sortColumn = "",
  sortDir = "asc",
  onSort,
  renderRow,
  rowKey,
  rowClassName,
}: DynamicTableProps<T>) => {
  const defaultRowKey = (item: T, index: number) => {
    if ((item as any)?.id !== undefined) {
      return String((item as any).id);
    }
    if ((item as any)?.key !== undefined) {
      return String((item as any).key);
    }
    return `row-${index}`;
  };

  const renderCell = (row: T, accessor: TableAccessor<T>) => {
    if (typeof accessor === "function") {
      return accessor(row);
    }
    if (typeof accessor === "string") {
      return accessor.includes(".")
        ? getNestedValue(row, accessor)
        : row[accessor as keyof T];
    }
    return null;
  };

  const colSpan = columns.length || 1;

  return (
    <ScrollArea type="auto" {...scrollAreaProps}>
      <Table {...tableProps}>
        <Table.Thead>
          <Table.Tr>
            {columns.map((column) => {
              const headerContent = <span>{column.label}</span>;

              if (column.sortable && onSort) {
                return (
                  <Th
                    key={column.id}
                    sortBy={column.id}
                    existingSort={sortColumn}
                    sortDir={sortDir}
                    onSort={onSort}
                    align={column.align}
                    className={column.headerClassName}
                    style={column.headerStyle}
                  >
                    {headerContent}
                  </Th>
                );
              }

              return (
                <Table.Th
                  key={column.id}
                  align={column.align}
                  className={column.headerClassName}
                  style={{ textAlign: column.align, ...column.headerStyle }}
                >
                  {headerContent}
                </Table.Th>
              );
            })}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {isLoading ? (
            <TableLoader rows={loadingRows} columns={colSpan} />
          ) : data.length > 0 ? (
            data.map((item, index) => (
              <Table.Tr
                key={rowKey ? rowKey(item, index) : defaultRowKey(item, index)}
                className={rowClassName?.(item, index)}
              >
                {renderRow
                  ? renderRow(item, index)
                  : columns.map((column) => (
                      <Table.Td
                        key={`${column.id}-${index}`}
                        align={column.align}
                        className={column.className}
                        style={{ textAlign: column.align, ...column.style }}
                      >
                        {renderCell(item, column.accessor)}
                      </Table.Td>
                    ))}
              </Table.Tr>
            ))
          ) : (
            <NoTableData colSpan={colSpan} title={emptyMessage} />
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
};

export default DynamicTable;
