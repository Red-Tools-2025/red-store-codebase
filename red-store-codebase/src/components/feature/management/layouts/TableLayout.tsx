import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableLayoutProps {
  TableColumnValues: string[];
  children: React.ReactNode;
}

const TableLayout: React.FC<TableLayoutProps> = ({
  TableColumnValues,
  children,
}) => {
  return (
    <Table>
      <TableHeader className="border ">
        {TableColumnValues.map((col, index) => {
          return (
            <TableCell
              key={index}
              className="px-3 py-4 text-sm font-semibold text-gray-500"
            >
              {col}
            </TableCell>
          );
        })}
      </TableHeader>
      {/*Ensure Table body content is a map of all table rows to properly fit to child components*/}
      <TableBody>{children}</TableBody>
    </Table>
  );
};

export default TableLayout;
