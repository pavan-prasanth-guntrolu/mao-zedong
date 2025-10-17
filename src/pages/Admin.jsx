import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Download, Search, ChevronUp, ChevronDown, Filter } from "lucide-react";

const ALLOWED_EMAILS = ["qff@new", "you", "admin@11"];

const TABLES = {
  accommodation: "Accommodation",
  ambassador_applications: "Ambassador Applications",
  contact_messages: "Contact Messages",
  guest_speaker_applications: "Guest Speaker Applications",
  registrations: "Registrations",
  sponsorship_form_submissions: "Sponsorship Submissions",
};

const HIDDEN_COLUMNS = ["created_at", "user_id"];

const AdminDashboard = () => {
  const [email, setEmail] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [columnFilters, setColumnFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(50);
  const [loadingProgress, setLoadingProgress] = useState({
    current: 0,
    total: 0,
  });

  const handleEmailSubmit = () => {
    if (ALLOWED_EMAILS.includes(email.toLowerCase().trim())) {
      setAuthenticated(true);
    } else {
      alert("Access Denied: You don't have permission to access this page.");
    }
  };

  const fetchTableData = async (tableName) => {
    setLoading(true);
    try {
      // First get the total count
      const { count: totalCount, error: countError } = await supabase
        .from(tableName)
        .select("*", { count: "exact", head: true });

      if (countError) {
        console.error("Supabase count error:", countError);
        throw new Error(
          `${countError.message}\n\nHint: ${
            countError.hint || "Check RLS policies"
          }\nCode: ${countError.code || "N/A"}`
        );
      }

      console.log(`📊 Total records in ${tableName}: ${totalCount}`);
      setLoadingProgress({ current: 0, total: totalCount });

      // Fetch ALL data using pagination (no limit)
      let allData = [];
      const pageSize = 1000;
      let page = 0;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) {
          console.error("Supabase error:", error);
          throw new Error(
            `${error.message}\n\nHint: ${
              error.hint || "Check RLS policies"
            }\nCode: ${error.code || "N/A"}`
          );
        }

        allData = [...allData, ...data];
        hasMore = data.length === pageSize;
        page++;

        setLoadingProgress({ current: allData.length, total: totalCount });
        console.log(`Fetched ${allData.length} / ${totalCount} rows...`);
      }

      console.log(`✅ Fetched all ${allData.length} records from ${tableName}`);

      if (allData.length > 0) {
        const cols = Object.keys(allData[0]).filter(
          (col) => !HIDDEN_COLUMNS.includes(col)
        );
        setColumns(cols);
        setTableData(allData);
      } else {
        setColumns([]);
        setTableData([]);
      }
      setCurrentPage(1);
      setSearchTerm("");
      setColumnFilters({});
      setSortConfig({ key: null, direction: null });
    } catch (error) {
      console.error("Error fetching table data:", error);
      alert(
        "Error loading data:\n\n" +
          error.message +
          "\n\nCheck console for more details."
      );
      setTableData([]);
      setColumns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (e) => {
    const table = e.target.value;
    setSelectedTable(table);
    if (table) {
      fetchTableData(table);
    } else {
      setTableData([]);
      setColumns([]);
    }
  };

  const handleSort = (columnKey) => {
    let direction = "asc";
    if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleColumnFilter = (column, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
    setCurrentPage(1);
  };

  const getFilteredAndSortedData = () => {
    let filtered = [...tableData];

    // Global search
    if (searchTerm) {
      filtered = filtered.filter((row) =>
        columns.some((col) => {
          const value = row[col];
          return value
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        })
      );
    }

    // Column filters
    Object.keys(columnFilters).forEach((col) => {
      const filterValue = columnFilters[col];
      if (filterValue) {
        filtered = filtered.filter((row) => {
          const value = row[col];
          return value
            ?.toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        });
      }
    });

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        const aStr = aVal.toString().toLowerCase();
        const bStr = bVal.toString().toLowerCase();

        if (sortConfig.direction === "asc") {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      });
    }

    return filtered;
  };

  const getPaginatedData = () => {
    const filtered = getFilteredAndSortedData();
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const exportToCSV = () => {
    const filtered = getFilteredAndSortedData();
    if (filtered.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = columns.join(",");
    const rows = filtered.map((row) =>
      columns
        .map((col) => {
          const value = row[col];
          if (value === null || value === undefined) return "";
          const str = value.toString().replace(/"/g, '""');
          return `"${str}"`;
        })
        .join(",")
    );

    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTable}_export_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(getFilteredAndSortedData().length / rowsPerPage);
  const paginatedData = getPaginatedData();

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-96">
          <h1 className="text-3xl font-bold mb-6 text-center">Admin Access</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Enter Acess Code
              </label>
              <input
                type="password"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleEmailSubmit()}
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Enter Code here"
              />
            </div>
            <button
              onClick={handleEmailSubmit}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Access Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium mb-2">
                Select Table
              </label>
              <select
                value={selectedTable}
                onChange={handleTableChange}
                className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="">-- Select a table --</option>
                {Object.entries(TABLES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {selectedTable && (
              <>
                <div className="flex-1 min-w-64">
                  <label className="block text-sm font-medium mb-2">
                    Search All Columns
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                      placeholder="Search..."
                    />
                  </div>
                </div>

                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded flex items-center gap-2 transition"
                >
                  <Download className="h-5 w-5" />
                  Export CSV
                </button>
              </>
            )}
          </div>

          {selectedTable && !loading && (
            <div className="mt-4 text-sm text-gray-400">
              Showing {paginatedData.length} of{" "}
              {getFilteredAndSortedData().length} records
              {getFilteredAndSortedData().length !== tableData.length && (
                <span className="ml-2 text-blue-400">
                  (filtered from {tableData.length} total)
                </span>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-400">Loading data...</p>
            {loadingProgress.total > 0 && (
              <div className="mt-2 text-sm text-blue-400">
                {loadingProgress.current} / {loadingProgress.total} records
                loaded
                <div className="w-64 bg-gray-700 rounded-full h-2 mx-auto mt-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (loadingProgress.current / loadingProgress.total) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ) : selectedTable && tableData.length > 0 ? (
          <>
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      {columns.map((col) => (
                        <th key={col} className="px-4 py-3 text-left">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSort(col)}
                                className="flex items-center gap-1 hover:text-blue-400 transition"
                              >
                                <span className="font-semibold">{col}</span>
                                {sortConfig.key === col &&
                                  (sortConfig.direction === "asc" ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  ))}
                              </button>
                            </div>
                            <div className="relative">
                              <Filter className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Filter..."
                                value={columnFilters[col] || ""}
                                onChange={(e) =>
                                  handleColumnFilter(col, e.target.value)
                                }
                                className="w-full pl-8 pr-2 py-1 text-sm rounded bg-gray-600 border border-gray-500 focus:border-blue-500 focus:outline-none"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-t border-gray-700 hover:bg-gray-750"
                      >
                        {columns.map((col) => (
                          <td key={col} className="px-4 py-3 text-sm">
                            {row[col] !== null && row[col] !== undefined ? (
                              typeof row[col] === "boolean" ? (
                                row[col] ? (
                                  "✓"
                                ) : (
                                  "✗"
                                )
                              ) : Array.isArray(row[col]) ? (
                                row[col].join(", ")
                              ) : (
                                row[col].toString()
                              )
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition"
                >
                  Previous
                </button>
                <span className="text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : selectedTable ? (
          <div className="text-center py-12 text-gray-400">
            No data available in this table
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AdminDashboard;
