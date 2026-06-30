import { Center, Group, Table, Text, UnstyledButton } from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconSelector } from "@tabler/icons-react";
import { useState } from "react";

type SortDirection = "asc" | "desc";

interface ThProps {
  children: React.ReactNode;
  sortBy: string;
  sortDir: SortDirection;
  existingSort: string;
  onSort: (sortCol: string, sortDir: SortDirection) => void;
  disabled?: boolean;
  align?: "left" | "center" | "right";
  className?: string;
  style?: React.CSSProperties;
}

const Th = ({ children, sortBy, existingSort, sortDir, onSort, disabled = false, align = "left", className, style }: ThProps) => {
  const Icon = sortBy == existingSort ? (sortDir == "asc" ? IconChevronUp : IconChevronDown) : IconSelector;

  const [reverseSortDirection, setReverseSortDirection] = useState<boolean>(false);

  const setSorting = (field: string) => {
    if (disabled) return; // Don't sort if disabled
    const reversed = field === existingSort ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    // setSortBy(field);
    // setSortColumn(field);
    const sortDirection = field == existingSort ? (sortDir == "desc" ? "asc" : "desc") : "asc";
    onSort(field, sortDirection);
  };

  const justify = align === "right" ? "end" : align === "center" ? "center" : "start";

  return (
    <Table.Th
      align={align}
      className={className}
      style={{ textAlign: align, ...style }}
    >
      <UnstyledButton onClick={() => setSorting(sortBy)} disabled={disabled} className="w-full">
        <Group justify={justify} gap={"4px"}>
          <Text
            fw={600}
            fz="sm"
            opacity={disabled ? 0.6 : 1}
            className="text-foreground dark:text-white"
          >
            {children}
          </Text>
          <Center opacity={disabled ? 0.6 : 1}>
            <Icon
              className="size-4 text-v2foreground dark:text-v2primary"
              stroke={2}
            />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
};

export default Th;
