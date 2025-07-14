import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useTable, useBlockLayout, CellProps } from "react-table";
import { tasks as initialTasks } from "./data/task";
import "./index.css";

type TableRow = Record<string, string>;

const statusStyles: Record<string, string> = {
  "In-process": "bg-yellow-200 text-yellow-800",
  "Need to start": "bg-blue-200 text-blue-800",
  "Complete": "bg-green-200 text-green-800",
  Blocked: "bg-red-200 text-red-800",
};

const DEFAULT_ROW: TableRow = {
  job: "",
  submitted: "",
  status: "",
  submitter: "",
  url: "",
  assigned: "",
  priority: "",
  dueDate: "",
  value: "",
};

function App() {
  const [activeStatus, setActiveStatus] = useState("All Orders");
  const [rowsToShow, setRowsToShow] = useState(20);
  const [tableData, setTableData] = useState<TableRow[]>(initialTasks);
  const [customCols, setCustomCols] = useState<string[]>([]);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const filteredData = useMemo(() => {
    return activeStatus === "All Orders"
      ? tableData
      : tableData.filter((task) => task.status === activeStatus);
  }, [activeStatus, tableData]);

  const extendedData = useMemo(() => {
    const filled = [...filteredData];
    while (filled.length < rowsToShow) {
      filled.push({ ...DEFAULT_ROW });
    }
    return filled;
  }, [rowsToShow, filteredData]);

  const handleCellChange = useCallback((rowIndex: number, columnId: string, value: string) => {
    setTableData((prevData) => {
      const updated = [...prevData];
      if (!updated[rowIndex]) updated[rowIndex] = { ...DEFAULT_ROW };
      updated[rowIndex] = { ...updated[rowIndex], [columnId]: value };
      return updated;
    });
  }, []);

  const columns = useMemo(() => {
    const baseKeys = [
      "job",
      "submitted",
      "status",
      "submitter",
      "url",
      "assigned",
      "priority",
      "dueDate",
      "value",
    ];

    const allKeys = [...baseKeys, ...customCols];

    const dynamicColumns = allKeys.map((key) => {
      const maxLength = Math.max(...extendedData.map((row) => (row[key] || "").toString().length));
      const estimatedWidth = Math.max(100, maxLength * 8 + 40);

      return {
        Header: (
          <div
            className={`px-4 py-2 ${
              key === "priority" || key === "dueDate"
                ? "bg-purple-100"
                : key === "value"
                ? "bg-orange-100"
                : "bg-gray-200"
            }`}
          >
            {key === "value" ? "Est. Value" : key[0].toUpperCase() + key.slice(1)}
          </div>
        ),
        accessor: key,
        width: estimatedWidth,
        Cell: ({ value, row, column }: CellProps<TableRow>) => {
          const index = row.index;
          const columnId = column.id;

          if (columnId === "status" && value) {
            return (
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  statusStyles[value] || "bg-gray-200 text-gray-800"
                }`}
              >
                {value}
              </span>
            );
          }

          if (columnId === "priority") {
            const color =
              value === "High"
                ? "text-red-600"
                : value === "Medium"
                ? "text-yellow-900"
                : "text-blue-600";

            return (
              <input
                className={`w-full bg-transparent focus:outline-none ${color}`}
                defaultValue={value}
                onBlur={(e) => {
                  if (e.target.value !== value) {
                    handleCellChange(index, columnId, e.target.value);
                  }
                }}
              />
            );
          }

          return (
            <input
              className="w-full bg-transparent focus:outline-none"
              defaultValue={value || ""}
              onBlur={(e) => {
                if (e.target.value !== value) {
                  handleCellChange(index, columnId, e.target.value);
                }
              }}
            />
          );
        },
      };
    });

    return [
      {
        Header: <div className="bg-gray-200 px-4 py-2 text-center">#</div>,
        id: "rowNumber",
        width: 50,
        Cell: ({ row }: CellProps<TableRow>) => (
          <div className="text-center">{row.index + 1}</div>
        ),
      },
      ...dynamicColumns,
      {
        Header: (
          <button
            className="w-full h-full bg-gray-300 text-black font-bold"
            onClick={() => {
              const newColName = prompt("Enter new column name:");
              if (newColName && newColName.trim()) {
                const trimmed = newColName.trim();
                setCustomCols((prev) => [...prev, trimmed]);
                console.log("Added new column:", trimmed);
              }
            }}
          >
            +
          </button>
        ),
        id: "addColumn",
        width: 60,
        Cell: () => null,
      },
    ];
  }, [extendedData, handleCellChange, customCols]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data: extendedData,
    },
    useBlockLayout
  );

  useEffect(() => {
    const handleScroll = () => {
      if (!tableContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setRowsToShow((prev) => prev + 10);
      }
    };

    const container = tableContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  const footerTabs = ["All Orders", "In-process", "Need to start", "Complete", "Blocked"];

  return (
    <div className="p-6 flex flex-col h-screen">
      <div
        ref={tableContainerRef}
        className="flex-1 overflow-auto border border-gray-300 rounded"
      >
        <table {...getTableProps()} className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 border-b border-gray-400">
            {headerGroups.map((headerGroup) => {
              const { key, ...rest } = headerGroup.getHeaderGroupProps();
              return (
                <tr key={key} {...rest}>
                  {headerGroup.headers.map((column) => {
                    const { key: colKey, ...colProps } = column.getHeaderProps();
                    return (
                      <th
                        key={colKey}
                        {...colProps}
                        className="border-r border-gray-400 last:border-r-0"
                        style={{ width: column.width }}
                      >
                        {column.render("Header")}
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              const { key, ...rest } = row.getRowProps();
              return (
                <tr key={key} {...rest} className="border-t">
                  {row.cells.map((cell) => {
                    const { key: cellKey, ...cellProps } = cell.getCellProps();
                    return (
                      <td
                        key={cellKey}
                        {...cellProps}
                        className="px-4 py-2 border-r border-gray-400 last:border-r-0"
                        style={{ width: cell.column.width }}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Tabs */}
      <div className="mt-4 flex justify-start gap-2 border-t pt-4">
        {footerTabs.map((status) => (
          <button
            key={status}
            onClick={() => {
              console.log("Clicked:", status);
              setActiveStatus(status);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeStatus === status
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
