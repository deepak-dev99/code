// src/pages/Dashboard.jsx
import { Dashboarddata, Dropdown } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { ChevronDown, Loader2 } from "lucide-react";

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch dropdown data
  const { data, isLoading } = useQuery({
    queryKey: ["files"],
    queryFn: Dropdown
  });

  // Auto-select first file when data loads
  useEffect(() => {
    if (!isLoading && data?.data?.length > 0 && !selectedFile) {
      setSelectedFile(data.data[0]._id);
    }
  }, [isLoading, data, selectedFile]);

  // Fetch dashboard data based on selected file
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ["dashboard", selectedFile],
    queryFn: Dashboarddata,
    enabled: !!selectedFile
  });

  // Process hazard data for bar chart
  const hazardData = dashboardData?.data?.final_result
    ?.map(item => [
      { name: "Sector A Caution", value: item.sectorA_caution, category: "caution" },
      { name: "Sector A Notice", value: item.sectorA_notice, category: "notice" },
      { name: "Sector A Warning", value: item.sectorA_warning, category: "warning" },
      { name: "Sector B Caution", value: item.sectorB_caution, category: "caution" },
      { name: "Sector B Notice", value: item.sectorB_notice, category: "notice" },
      { name: "Sector B Warning", value: item.sectorB_warning, category: "warning" },
      { name: "Sector C Caution", value: item.sectorC_caution, category: "caution" },
      { name: "Sector C Notice", value: item.sectorC_notice, category: "notice" },
      { name: "Sector C Warning", value: item.sectorC_warning, category: "warning" }
    ])
    .flat() || [];

  // Process RGB data for pie chart
  const rgbData = dashboardData?.data?.final_result2
    ?.map(item =>
      Object.entries(item.masking_areas).map(([key, value]) => ({
        name: key.replace(/_/g, " ").toUpperCase(),
        value
      }))
    )
    .flat() || [];

  const COLORS = {
    caution: "#fbbf24",
    notice: "#3b82f6",
    warning: "#ef4444",
    pie: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]
  };

  const totalSigns = dashboardData?.data?.final_result?.[0]?.total_caution || 0;

  // Custom Bar Chart Component
  const CustomBarChart = ({ data }) => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: "hsl(var(--foreground))" }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            borderColor: "hsl(var(--border))",
            color: "hsl(var(--popover-foreground))"
          }}
          itemStyle={{ color: "hsl(var(--popover-foreground))" }}
        />
        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.category]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <Outlet />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-end mb-4">
            
            {/* File Selector */}
            <div className="relative">
              <select
                className="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                value={selectedFile || ""}
                onChange={(e) => setSelectedFile(e.target.value)}
                disabled={isLoading}
              >
                <option value="">{isLoading ? "Loading..." : "Select file"}</option>
                {data?.data?.map((file) => (
                  <option key={file._id} value={file._id}>
                    {file.filename}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded border border-gray-200 dark:border-neutral-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Signs</div>
            <div className="text-2xl font-semibold">
              {dashboardLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-gray-500 dark:text-gray-400" />
              ) : (
                totalSigns.toLocaleString()
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-800 p-6 rounded border border-gray-200 dark:border-neutral-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</div>
            <div className="text-lg font-medium">
              {dashboardLoading ? "Processing" : "Complete"}
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-800 p-6 rounded border border-gray-200 dark:border-neutral-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">File</div>
            <div className="text-sm font-medium truncate">
              {selectedFile ? data?.data?.find(f => f._id === selectedFile)?.filename : "None selected"}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-white dark:bg-neutral-800 p-6 rounded border border-gray-200 dark:border-neutral-700">
            <h2 className="text-lg font-medium mb-4">Hazard Signs by Sector</h2>
            <div className="h-80">
              {dashboardLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400 dark:text-gray-500" />
                </div>
              ) : hazardData?.length > 0 ? (
                <CustomBarChart data={hazardData} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white dark:bg-neutral-800 p-6 rounded border border-gray-200 dark:border-neutral-700">
            <h2 className="text-lg font-medium mb-4">Zone Coverage</h2>
            <div className="h-80">
              {dashboardLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400 dark:text-gray-500" />
                </div>
              ) : rgbData?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={rgbData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      paddingAngle={2}
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {rgbData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS.pie[index % COLORS.pie.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        borderColor: "hsl(var(--border))",
                        color: "hsl(var(--popover-foreground))"
                      }}
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    />
                    <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;