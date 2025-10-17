import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Papa from "papaparse";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Institution name normalization mapping
const institutionMapping = {
  "rgukt rkv": "RGUKT RK Valley",
  "rgukt basar": "RGUKT Basar",
  "rgukt nuzvid": "RGUKT Nuzvid",
  "rgukt srikakulam": "RGUKT Srikakulam",
  "rgukt ongole": "RGUKT Ongole",
  "iiit hyderabad": "IIIT Hyderabad",
  "iit bombay": "IIT Bombay",
  "iit delhi": "IIT Delhi",
  "iit madras": "IIT Madras",
};

const normalizeInstitution = (institution) => {
  if (!institution) return "Unknown";
  const normalized = institution.toLowerCase().trim();
  return institutionMapping[normalized] || institution;
};

// Normalize attendance_mode aliases
const normalizeattendance_mode = (attendance_mode) => {
  if (!attendance_mode) return "Unknown";
  const normalized = attendance_mode.toLowerCase().trim();
  if (["offline", "in-person", "in person"].includes(normalized))
    return "In-Person";
  if (["virtual", "online"].includes(normalized)) return "Virtual";
  return "Unknown";
};

// Normalize gender
const normalizeGender = (gender) => {
  if (!gender) return "Not Specified";
  const normalized = gender.toLowerCase().trim();
  if (normalized === "male") return "Male";
  if (normalized === "female") return "Female";
  return "Not Specified";
};

// Check if RGUKTian
const isRGUKTian = (institution) => {
  return institution && institution.toUpperCase().includes("RGUKT");
};

// Get RGUKT Campus
const getRGUKTCampus = (institution) => {
  if (!institution) return null;
  const normalized = institution.toLowerCase().trim();
  if (normalized.includes("rkv") || normalized.includes("rk valley"))
    return "RGUKT RK Valley";
  if (normalized.includes("basar")) return "RGUKT Basar";
  if (normalized.includes("nuzvid")) return "RGUKT Nuzvid";
  if (normalized.includes("srikakulam")) return "RGUKT Srikakulam";
  if (normalized.includes("ongole")) return "RGUKT Ongole";
  return null;
};

// ---- Time helpers (IST) ----
const IST_TZ = "Asia/Kolkata";
const toISTParts = (isoString) => {
  const d = new Date(isoString);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: IST_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (type) => parts.find((p) => p.type === type)?.value;
  const yyyy = get("year");
  const mm = get("month");
  const dd = get("day");
  const hr = parseInt(get("hour"), 10);
  return { date: `${yyyy}-${mm}-${dd}`, hour: hr };
};

// Password Gate Component
const PasswordGate = ({ onAuthenticate }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (password === "dreambig" || password === "you") {
      onAuthenticate();
    } else {
      setError("Invalid password");
      setPassword("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 mt-[90px]">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          🔐 Secret Dashboard
        </h1>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter password"
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Unlock Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

// Dashboard Header Component
const DashboardHeader = ({
  selectedView,
  setSelectedView,
  onRefresh,
  autoRefresh,
  setAutoRefresh,
  lastUpdated,
}) => {
  const views = [
    "Overview",
    "attendance_mode-wise Stats",
    "Gender-wise Stats",
    "RGUKTians vs Non-RGUKTians",
    "RGUKT Campuses Stats",
    "State-wise / Country-wise",
    "Referral Insights",
    "Institution Comparison",
    "Time Trends",
    "Day-wise (Hourly)", // 3-line chart here too
  ];

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 mt-[90px]">
      <h1 className="text-3xl font-bold text-white mb-6">
        📊 Qiskit Fall Fest Dashboard
      </h1>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 max-w-md">
          <label className="text-gray-300 text-sm mb-2 block">
            Select View
          </label>
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {views.map((view) => (
              <option key={view} value={view}>
                {view}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
          >
            🔄 Refresh
          </button>

          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-lg transition-colors font-semibold ${
              autoRefresh
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 hover:bg-gray-700"
            } text-white`}
          >
            {autoRefresh ? "⏸️ Auto-Refresh ON" : "▶️ Auto-Refresh OFF"}
          </button>
        </div>
      </div>

      {lastUpdated && (
        <p className="text-gray-400 text-sm mt-4">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </p>
      )}
    </div>
  );
};

// Stats Cards Component
const StatsCards = ({ stats }) => {
  const cards = [
    {
      label: "Total Registrations",
      value: stats.totalRegistrations,
      icon: "👥",
      color: "blue",
    },
    {
      label: "In-Person",
      value: stats.inPersonCount,
      icon: "🏢",
      color: "green",
    },
    {
      label: "Virtual",
      value: stats.virtualCount,
      icon: "💻",
      color: "purple",
    },
    {
      label: "Unknown Mode",
      value: stats.unknownCount,
      icon: "❓",
      color: "gray",
    },
    {
      label: "RGUKTians",
      value: stats.rguktCount,
      color: "yellow",
      icon: "🎓",
    },
    {
      label: "Non-RGUKTians",
      value: stats.nonRguktCount,
      color: "orange",
      icon: "🌍",
    },
    {
      label: "Total Referrals",
      value: stats.totalReferrals,
      color: "pink",
      icon: "🔗",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    purple: "bg-purple-600",
    yellow: "bg-yellow-600",
    orange: "bg-orange-600",
    pink: "bg-pink-600",
    gray: "bg-gray-600",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-white">{card.value}</p>
            </div>
            <div
              className={`${colorClasses[card.color]} p-3 rounded-lg text-2xl`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Data Table Component
const DataTable = ({ data, columns, title }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
      <h3 className="text-xl font-bold text-white mb-4">📋 {title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              {columns.map((col, index) => (
                <th key={index} className="text-left text-gray-300 py-3 px-4">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
              >
                {Object.values(row).map((value, i) => (
                  <td key={i} className="py-3 px-4 text-white">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// View Section Component
const ViewSection = ({ view, stats }) => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(false);
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, [view]);

  const renderContent = () => {
    switch (view) {
      case "attendance_mode-wise Stats": {
        const attendance_modeTableData = [
          {
            attendance_mode: "In-Person",
            Total: stats.inPersonCount,
            Male:
              stats.attendance_modeGenderDistribution["In-Person"]?.Male || 0,
            Female:
              stats.attendance_modeGenderDistribution["In-Person"]?.Female || 0,
            "Not Specified":
              stats.attendance_modeGenderDistribution["In-Person"]?.[
                "Not Specified"
              ] || 0,
            RGUKTians:
              stats.attendance_modeRguktDistribution["In-Person"]?.rgukt || 0,
            "Non-RGUKTians":
              stats.attendance_modeRguktDistribution["In-Person"]?.nonRgukt ||
              0,
          },
          {
            attendance_mode: "Virtual",
            Total: stats.virtualCount,
            Male: stats.attendance_modeGenderDistribution["Virtual"]?.Male || 0,
            Female:
              stats.attendance_modeGenderDistribution["Virtual"]?.Female || 0,
            "Not Specified":
              stats.attendance_modeGenderDistribution["Virtual"]?.[
                "Not Specified"
              ] || 0,
            RGUKTians:
              stats.attendance_modeRguktDistribution["Virtual"]?.rgukt || 0,
            "Non-RGUKTians":
              stats.attendance_modeRguktDistribution["Virtual"]?.nonRgukt || 0,
          },
          {
            attendance_mode: "Unknown",
            Total: stats.unknownCount,
            Male: stats.attendance_modeGenderDistribution["Unknown"]?.Male || 0,
            Female:
              stats.attendance_modeGenderDistribution["Unknown"]?.Female || 0,
            "Not Specified":
              stats.attendance_modeGenderDistribution["Unknown"]?.[
                "Not Specified"
              ] || 0,
            RGUKTians:
              stats.attendance_modeRguktDistribution["Unknown"]?.rgukt || 0,
            "Non-RGUKTians":
              stats.attendance_modeRguktDistribution["Unknown"]?.nonRgukt || 0,
          },
        ];
        return (
          <DataTable
            data={attendance_modeTableData}
            columns={[
              "attendance_mode",
              "Total",
              "Male",
              "Female",
              "Not Specified",
              "RGUKTians",
              "Non-RGUKTians",
            ]}
            title="attendance_mode-wise Statistics"
          />
        );
      }

      case "Gender-wise Stats": {
        const genderTableData = Object.entries(stats.genderDistribution).map(
          ([gender, count]) => ({ Gender: gender, Count: count })
        );
        return (
          <DataTable
            data={genderTableData}
            columns={["Gender", "Count"]}
            title="Gender-wise Statistics"
          />
        );
      }

      case "RGUKTians vs Non-RGUKTians": {
        const rguktTableData = [
          {
            Category: "RGUKTians",
            Total: stats.rguktCount,
            Male: stats.rguktGenderattendance_mode.rgukt.male,
            Female: stats.rguktGenderattendance_mode.rgukt.female,
            "Not Specified":
              stats.rguktGenderattendance_mode.rgukt.notSpecified,
            "In-Person": stats.rguktGenderattendance_mode.rgukt.inPerson,
            Virtual: stats.rguktGenderattendance_mode.rgukt.virtual,
            Unknown: stats.rguktGenderattendance_mode.rgukt.unknown,
          },
          {
            Category: "Non-RGUKTians",
            Total: stats.nonRguktCount,
            Male: stats.rguktGenderattendance_mode.nonRgukt.male,
            Female: stats.rguktGenderattendance_mode.nonRgukt.female,
            "Not Specified":
              stats.rguktGenderattendance_mode.nonRgukt.notSpecified,
            "In-Person": stats.rguktGenderattendance_mode.nonRgukt.inPerson,
            Virtual: stats.rguktGenderattendance_mode.nonRgukt.virtual,
            Unknown: stats.rguktGenderattendance_mode.nonRgukt.unknown,
          },
        ];
        return (
          <DataTable
            data={rguktTableData}
            columns={[
              "Category",
              "Total",
              "Male",
              "Female",
              "Not Specified",
              "In-Person",
              "Virtual",
              "Unknown",
            ]}
            title="RGUKTians vs Non-RGUKTians Comparison"
          />
        );
      }

      case "RGUKT Campuses Stats": {
        const campusTableData = Object.entries(stats.rguktCampuses)
          .sort((a, b) => b[1].total - a[1].total)
          .map(([campus, data], index) => ({
            Rank: index + 1,
            Campus: campus,
            Total: data.total,
            Male: data.male,
            Female: data.female,
            "Not Specified": data.notSpecified,
            "In-Person": data.inPerson,
            Virtual: data.virtual,
            Unknown: data.unknown,
          }));
        return (
          <DataTable
            data={campusTableData}
            columns={[
              "Rank",
              "Campus",
              "Total",
              "Male",
              "Female",
              "Not Specified",
              "In-Person",
              "Virtual",
              "Unknown",
            ]}
            title="RGUKT Campus-wise Statistics"
          />
        );
      }

      case "Time Trends": {
        // Use IST-grouped daily trends with totals and splits
        const sortedDates = Object.keys(stats.timeTrendsByGroup || {}).sort(
          (a, b) => new Date(a) - new Date(b)
        );

        const totals = sortedDates.map((d) => stats.timeTrendsByGroup[d].total);
        const rgukt = sortedDates.map((d) => stats.timeTrendsByGroup[d].rgukt);
        const nonRgukt = sortedDates.map(
          (d) => stats.timeTrendsByGroup[d].nonRgukt
        );

        const chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: "#fff" } },
            title: {
              display: true,
              text: "Daily Registration Trends (IST): Total vs RGUKT vs Non-RGUKT",
              color: "#fff",
              font: { size: 18 },
            },
            tooltip: { mode: "index", intersect: false },
          },
          scales: {
            x: {
              ticks: { color: "#fff" },
              grid: { color: "rgba(255,255,255,0.1)" },
            },
            y: {
              ticks: { color: "#fff" },
              grid: { color: "rgba(255,255,255,0.1)" },
              beginAtZero: true,
            },
          },
        };

        return (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              📈 Time Trends
            </h3>
            <div className="h-96">
              <Line
                data={{
                  labels: sortedDates.map((d) =>
                    new Date(d).toLocaleDateString()
                  ),
                  datasets: [
                    {
                      label: "Total",
                      data: totals,
                      borderColor: "#22d3ee",
                      backgroundColor: "rgba(34, 211, 238, 0.18)",
                      tension: 0.3,
                    },
                    {
                      label: "RGUKT",
                      data: rgukt,
                      borderColor: "#8b5cf6",
                      backgroundColor: "rgba(139, 92, 246, 0.18)",
                      tension: 0.3,
                    },
                    {
                      label: "Non-RGUKT",
                      data: nonRgukt,
                      borderColor: "#f97316",
                      backgroundColor: "rgba(249, 115, 22, 0.18)",
                      tension: 0.3,
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      className={`transition-opacity duration-500 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      {renderContent()}
    </div>
  );
};

// Referral Table Component
const ReferralTable = ({ topReferrers }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        🏆 Top 10 Referrers
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left text-gray-300 py-3 px-4">Rank</th>
              <th className="text-left text-gray-300 py-3 px-4">Name</th>
              <th className="text-left text-gray-300 py-3 px-4">Email</th>
              <th className="text-right text-gray-300 py-3 px-4">Referrals</th>
            </tr>
          </thead>
          <tbody>
            {topReferrers.map((referrer, index) => (
              <tr
                key={index}
                className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <td className="py-3 px-4 text-white font-semibold">
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : `#${index + 1}`}
                </td>
                <td className="py-3 px-4 text-white">{referrer.name}</td>
                <td className="py-3 px-4 text-gray-400">{referrer.email}</td>
                <td className="py-3 px-4 text-right text-white font-bold">
                  {referrer.count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Export Button Component
const ExportButton = ({
  selectedView,
  stats,
  registrations,
  selectedDay,
  getHourlyGroupCountsForDay,
}) => {
  const handleExport = () => {
    let dataToExport = [];
    let filename = "";

    switch (selectedView) {
      case "Overview":
        dataToExport = [
          { Metric: "Total Registrations", Value: stats.totalRegistrations },
          { Metric: "In-Person", Value: stats.inPersonCount },
          { Metric: "Virtual", Value: stats.virtualCount },
          { Metric: "Unknown Mode", Value: stats.unknownCount },
          { Metric: "RGUKTians", Value: stats.rguktCount },
          { Metric: "Non-RGUKTians", Value: stats.nonRguktCount },
          { Metric: "Total Referrals", Value: stats.totalReferrals },
        ];
        filename = "overview_stats";
        break;

      case "attendance_mode-wise Stats":
        dataToExport = [
          {
            attendance_mode: "In-Person",
            Total: stats.inPersonCount,
            Male:
              stats.attendance_modeGenderDistribution["In-Person"]?.Male || 0,
            Female:
              stats.attendance_modeGenderDistribution["In-Person"]?.Female || 0,
            "Not Specified":
              stats.attendance_modeGenderDistribution["In-Person"]?.[
                "Not Specified"
              ] || 0,
            RGUKTians:
              stats.attendance_modeRguktDistribution["In-Person"]?.rgukt || 0,
            "Non-RGUKTians":
              stats.attendance_modeRguktDistribution["In-Person"]?.nonRgukt ||
              0,
          },
          {
            attendance_mode: "Virtual",
            Total: stats.virtualCount,
            Male: stats.attendance_modeGenderDistribution["Virtual"]?.Male || 0,
            Female:
              stats.attendance_modeGenderDistribution["Virtual"]?.Female || 0,
            "Not Specified":
              stats.attendance_modeGenderDistribution["Virtual"]?.[
                "Not Specified"
              ] || 0,
            RGUKTians:
              stats.attendance_modeRguktDistribution["Virtual"]?.rgukt || 0,
            "Non-RGUKTians":
              stats.attendance_modeRguktDistribution["Virtual"]?.nonRgukt || 0,
          },
          {
            attendance_mode: "Unknown",
            Total: stats.unknownCount,
            Male: stats.attendance_modeGenderDistribution["Unknown"]?.Male || 0,
            Female:
              stats.attendance_modeGenderDistribution["Unknown"]?.Female || 0,
            "Not Specified":
              stats.attendance_modeGenderDistribution["Unknown"]?.[
                "Not Specified"
              ] || 0,
            RGUKTians:
              stats.attendance_modeRguktDistribution["Unknown"]?.rgukt || 0,
            "Non-RGUKTians":
              stats.attendance_modeRguktDistribution["Unknown"]?.nonRgukt || 0,
          },
        ];
        filename = "attendance_mode_wise_stats";
        break;

      case "Gender-wise Stats":
        dataToExport = Object.entries(stats.genderDistribution).map(
          ([gender, count]) => ({ Gender: gender, Count: count })
        );
        filename = "gender_wise_stats";
        break;

      case "RGUKTians vs Non-RGUKTians":
        dataToExport = [
          {
            Category: "RGUKTians",
            Total: stats.rguktCount,
            Male: stats.rguktGenderattendance_mode.rgukt.male,
            Female: stats.rguktGenderattendance_mode.rgukt.female,
            "Not Specified":
              stats.rguktGenderattendance_mode.rgukt.notSpecified,
            "In-Person": stats.rguktGenderattendance_mode.rgukt.inPerson,
            Virtual: stats.rguktGenderattendance_mode.rgukt.virtual,
          },
          {
            Category: "Non-RGUKTians",
            Total: stats.nonRguktCount,
            Male: stats.rguktGenderattendance_mode.nonRgukt.male,
            Female: stats.rguktGenderattendance_mode.nonRgukt.female,
            "Not Specified":
              stats.rguktGenderattendance_mode.nonRgukt.notSpecified,
            "In-Person": stats.rguktGenderattendance_mode.nonRgukt.inPerson,
            Virtual: stats.rguktGenderattendance_mode.nonRgukt.virtual,
          },
        ];
        filename = "rgukt_comparison";
        break;

      case "RGUKT Campuses Stats":
        dataToExport = Object.entries(stats.rguktCampuses)
          .sort((a, b) => b[1].total - a[1].total)
          .map(([campus, data], index) => ({
            Rank: index + 1,
            Campus: campus,
            Total: data.total,
            Male: data.male,
            Female: data.female,
            "Not Specified": data.notSpecified,
            "In-Person": data.inPerson,
            Virtual: data.virtual,
          }));
        filename = "rgukt_campuses_stats";
        break;

      case "State-wise / Country-wise":
        dataToExport = Object.entries(stats.stateDistribution)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([state, count], index) => ({
            Rank: index + 1,
            State: state,
            Count: count,
          }));
        filename = "state_wise_stats";
        break;

      case "Referral Insights":
        dataToExport = stats.topReferrers.map((referrer, index) => ({
          Rank: index + 1,
          Name: referrer.name,
          Email: referrer.email,
          Referrals: referrer.count,
        }));
        filename = "referral_leaderboard";
        break;

      case "Institution Comparison":
        dataToExport = Object.entries(stats.institutionDistribution)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([institution, count], index) => ({
            Rank: index + 1,
            Institution: institution,
            Count: count,
          }));
        filename = "institution_comparison";
        break;

      case "Time Trends": {
        const rows = Object.keys(stats.timeTrendsByGroup || {})
          .sort((a, b) => new Date(a) - new Date(b))
          .map((date) => ({
            Date: date,
            Total: stats.timeTrendsByGroup[date].total,
            RGUKT: stats.timeTrendsByGroup[date].rgukt,
            "Non-RGUKT": stats.timeTrendsByGroup[date].nonRgukt,
          }));
        dataToExport = rows;
        filename = "time_trends_3lines";
        break;
      }

      case "Day-wise (Hourly)": {
        if (selectedDay && getHourlyGroupCountsForDay) {
          const { hours, total, rgukt, nonRgukt } =
            getHourlyGroupCountsForDay(selectedDay);
          dataToExport = hours.map((h, i) => ({
            Hour: `${String(h).padStart(2, "0")}:00`,
            Total: total[i],
            RGUKT: rgukt[i],
            "Non-RGUKT": nonRgukt[i],
          }));
          filename = `hourly_3lines_${selectedDay}`;
        } else {
          dataToExport = [];
          filename = "hourly_3lines";
        }
        break;
      }

      default:
        dataToExport = registrations;
        filename = "all_registrations";
    }

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filename}_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.click();
  };

  return (
    <button
      onClick={handleExport}
      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
    >
      📥 Export {selectedView} CSV
    </button>
  );
};

// ---- Day-wise (Hourly) View with 3 lines ----
const DayHourlyView = ({
  selectedDay,
  setSelectedDay,
  getHourlyGroupCountsForDay,
}) => {
  const { hours, total, rgukt, nonRgukt } = getHourlyGroupCountsForDay(
    selectedDay || ""
  );

  const labels = hours.map((h) => `${String(h).padStart(2, "0")}:00`);
  const totalSum = total.reduce((a, b) => a + b, 0);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#fff" } },
      title: {
        display: true,
        text: `Hourly registrations for ${selectedDay} (IST): Total vs RGUKT vs Non-RGUKT`,
        color: "#fff",
        font: { size: 18 },
      },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } },
      y: {
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" },
        beginAtZero: true,
        suggestedMax: Math.max(5, ...total, ...rgukt, ...nonRgukt),
      },
    },
  };

  const exportCSV = () => {
    const rows = labels.map((label, i) => ({
      Hour: label,
      Total: total[i],
      RGUKT: rgukt[i],
      "Non-RGUKT": nonRgukt[i],
    }));
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `hourly_3lines_${selectedDay}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-end md:justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              🕒 Day-wise Hourly Projection (IST)
            </h3>
            <p className="text-gray-400 text-sm">
              Pick a day to see per-hour registrations by group.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">
                Select Day
              </label>
              <input
                type="date"
                value={selectedDay || ""}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
            >
              📥 Export CSV
            </button>
          </div>
        </div>

        <div className="mt-6 h-96">
          <Line
            data={{
              labels,
              datasets: [
                {
                  label: "Total",
                  data: total,
                  borderColor: "#22d3ee",
                  backgroundColor: "rgba(34, 211, 238, 0.15)",
                  tension: 0.3,
                },
                {
                  label: "RGUKT",
                  data: rgukt,
                  borderColor: "#8b5cf6",
                  backgroundColor: "rgba(139, 92, 246, 0.15)",
                  tension: 0.3,
                },
                {
                  label: "Non-RGUKT",
                  data: nonRgukt,
                  borderColor: "#f97316",
                  backgroundColor: "rgba(249, 115, 22, 0.15)",
                  tension: 0.3,
                },
              ],
            }}
            options={chartOptions}
          />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold">📋 Hourly Breakdown</h4>
          <span className="text-sm text-gray-300">
            Total: <span className="text-white font-bold">{totalSum}</span>
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-300 py-3 px-4">
                  Hour (IST)
                </th>
                <th className="text-right text-gray-300 py-3 px-4">Total</th>
                <th className="text-right text-gray-300 py-3 px-4">RGUKT</th>
                <th className="text-right text-gray-300 py-3 px-4">
                  Non-RGUKT
                </th>
              </tr>
            </thead>
            <tbody>
              {labels.map((label, i) => (
                <tr
                  key={label}
                  className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  <td className="py-3 px-4 text-white">{label}</td>
                  <td className="py-3 px-4 text-right text-white">
                    {total[i]}
                  </td>
                  <td className="py-3 px-4 text-right text-white">
                    {rgukt[i]}
                  </td>
                  <td className="py-3 px-4 text-right text-white">
                    {nonRgukt[i]}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="py-3 px-4 text-white font-semibold">Total</td>
                <td className="py-3 px-4 text-right text-white font-bold">
                  {totalSum}
                </td>
                <td className="py-3 px-4 text-right text-white font-bold">
                  {rgukt.reduce((a, b) => a + b, 0)}
                </td>
                <td className="py-3 px-4 text-right text-white font-bold">
                  {nonRgukt.reduce((a, b) => a + b, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const SecretDashboard = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedView, setSelectedView] = useState("Overview");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null); // default set after fetch
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    inPersonCount: 0,
    virtualCount: 0,
    unknownCount: 0,
    rguktCount: 0,
    nonRguktCount: 0,
    totalReferrals: 0,
    genderDistribution: {},
    stateDistribution: {},
    institutionDistribution: {},
    timeTrends: {}, // kept for backward-compat (totals only)
    timeTrendsByGroup: {}, // NEW: { [date]: { total, rgukt, nonRgukt } }  (IST)
    topReferrers: [],
    attendance_modeGenderDistribution: {},
    attendance_modeRguktDistribution: {},
    rguktCampuses: {},
    rguktGenderattendance_mode: {
      rgukt: {
        male: 0,
        female: 0,
        notSpecified: 0,
        inPerson: 0,
        virtual: 0,
        unknown: 0,
      },
      nonRgukt: {
        male: 0,
        female: 0,
        notSpecified: 0,
        inPerson: 0,
        virtual: 0,
        unknown: 0,
      },
    },
  });

  // Fetch data from Supabase
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let allRegistrations = [];
      let from = 0;
      const batchSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from("registrations")
          .select("*")
          .range(from, from + batchSize - 1);

        if (error) throw error;

        if (data && data.length > 0) {
          allRegistrations = [...allRegistrations, ...data];
          from += batchSize;
          hasMore = data.length === batchSize;
        } else {
          hasMore = false;
        }
      }

      setRegistrations(allRegistrations);
      computeStats(allRegistrations);
      setLastUpdated(new Date());

      // default selected day = latest IST day with data
      const trendDates = Object.keys(
        allRegistrations.reduce((acc, r) => {
          if (r.created_at) {
            const { date } = toISTParts(r.created_at);
            acc[date] = (acc[date] || 0) + 1;
          }
          return acc;
        }, {})
      );
      if (trendDates.length) {
        const latest = trendDates
          .sort((a, b) => new Date(a) - new Date(b))
          .pop();
        setSelectedDay((prev) => prev ?? latest);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Compute statistics
  const computeStats = (data) => {
    const stats = {
      totalRegistrations: data.length,
      inPersonCount: 0,
      virtualCount: 0,
      unknownCount: 0,
      rguktCount: 0,
      nonRguktCount: 0,
      totalReferrals: 0,
      genderDistribution: { Male: 0, Female: 0, "Not Specified": 0 },
      stateDistribution: {},
      institutionDistribution: {},
      timeTrends: {}, // totals daily
      timeTrendsByGroup: {}, // totals + rgukt + non (IST)
      topReferrers: [],
      attendance_modeGenderDistribution: {
        "In-Person": { Male: 0, Female: 0, "Not Specified": 0 },
        Virtual: { Male: 0, Female: 0, "Not Specified": 0 },
        Unknown: { Male: 0, Female: 0, "Not Specified": 0 },
      },
      attendance_modeRguktDistribution: {
        "In-Person": { rgukt: 0, nonRgukt: 0 },
        Virtual: { rgukt: 0, nonRgukt: 0 },
        Unknown: { rgukt: 0, nonRgukt: 0 },
      },
      rguktCampuses: {},
      rguktGenderattendance_mode: {
        rgukt: {
          male: 0,
          female: 0,
          notSpecified: 0,
          inPerson: 0,
          virtual: 0,
          unknown: 0,
        },
        nonRgukt: {
          male: 0,
          female: 0,
          notSpecified: 0,
          inPerson: 0,
          virtual: 0,
          unknown: 0,
        },
      },
    };

    const referralCounts = {};

    data.forEach((reg) => {
      // attendance_mode
      const attendance_mode = normalizeattendance_mode(reg.attendance_mode);
      if (attendance_mode === "In-Person") stats.inPersonCount++;
      else if (attendance_mode === "Virtual") stats.virtualCount++;
      else stats.unknownCount++;

      // Gender
      const gender = normalizeGender(reg.gender);
      stats.genderDistribution[gender]++;

      // attendance_mode-wise Gender Distribution
      stats.attendance_modeGenderDistribution[attendance_mode][gender]++;

      // Institution
      const institution = normalizeInstitution(reg.institution);
      stats.institutionDistribution[institution] =
        (stats.institutionDistribution[institution] || 0) + 1;

      // RGUKT membership
      const isR = isRGUKTian(reg.institution);

      // attendance_mode-wise RGUKT Distribution
      if (isR) stats.attendance_modeRguktDistribution[attendance_mode].rgukt++;
      else stats.attendance_modeRguktDistribution[attendance_mode].nonRgukt++;

      if (isR) {
        stats.rguktCount++;
        if (gender === "Male") stats.rguktGenderattendance_mode.rgukt.male++;
        if (gender === "Female")
          stats.rguktGenderattendance_mode.rgukt.female++;
        if (gender === "Not Specified")
          stats.rguktGenderattendance_mode.rgukt.notSpecified++;
        if (attendance_mode === "In-Person")
          stats.rguktGenderattendance_mode.rgukt.inPerson++;
        else if (attendance_mode === "Virtual")
          stats.rguktGenderattendance_mode.rgukt.virtual++;
        else stats.rguktGenderattendance_mode.rgukt.unknown++;

        // RGUKT Campus Stats
        const campus = getRGUKTCampus(reg.institution);
        if (campus) {
          if (!stats.rguktCampuses[campus]) {
            stats.rguktCampuses[campus] = {
              total: 0,
              male: 0,
              female: 0,
              notSpecified: 0,
              inPerson: 0,
              virtual: 0,
              unknown: 0,
            };
          }
          stats.rguktCampuses[campus].total++;
          if (gender === "Male") stats.rguktCampuses[campus].male++;
          if (gender === "Female") stats.rguktCampuses[campus].female++;
          if (gender === "Not Specified")
            stats.rguktCampuses[campus].notSpecified++;
          if (attendance_mode === "In-Person")
            stats.rguktCampuses[campus].inPerson++;
          else if (attendance_mode === "Virtual")
            stats.rguktCampuses[campus].virtual++;
          else stats.rguktCampuses[campus].unknown++;
        }
      } else {
        stats.nonRguktCount++;
        if (gender === "Male") stats.rguktGenderattendance_mode.nonRgukt.male++;
        if (gender === "Female")
          stats.rguktGenderattendance_mode.nonRgukt.female++;
        if (gender === "Not Specified")
          stats.rguktGenderattendance_mode.nonRgukt.notSpecified++;
        if (attendance_mode === "In-Person")
          stats.rguktGenderattendance_mode.nonRgukt.inPerson++;
        else if (attendance_mode === "Virtual")
          stats.rguktGenderattendance_mode.nonRgukt.virtual++;
        else stats.rguktGenderattendance_mode.nonRgukt.unknown++;
      }

      // State
      if (reg.state) {
        stats.stateDistribution[reg.state] =
          (stats.stateDistribution[reg.state] || 0) + 1;
      }

      // Daily Time trends (IST) with splits
      if (reg.created_at) {
        // keep UTC daily totals for backward-compat if you want:
        const dateUTC = new Date(reg.created_at).toISOString().split("T")[0];
        stats.timeTrends[dateUTC] = (stats.timeTrends[dateUTC] || 0) + 1;

        // IST-grouped totals + splits (for charts)
        const { date: dateIST } = toISTParts(reg.created_at);
        if (!stats.timeTrendsByGroup[dateIST]) {
          stats.timeTrendsByGroup[dateIST] = {
            total: 0,
            rgukt: 0,
            nonRgukt: 0,
          };
        }
        stats.timeTrendsByGroup[dateIST].total += 1;
        if (isR) stats.timeTrendsByGroup[dateIST].rgukt += 1;
        else stats.timeTrendsByGroup[dateIST].nonRgukt += 1;
      }

      // Referrals
      if (reg.referred_by) {
        stats.totalReferrals++;
        referralCounts[reg.referred_by] =
          (referralCounts[reg.referred_by] || 0) + 1;
      }
    });

    // Top referrers
    const referrerIds = Object.keys(referralCounts);
    const topReferrers = referrerIds
      .map((id) => {
        const referrer = data.find((r) => r.id === id);
        return {
          id,
          name: referrer?.fullName || "Unknown",
          email: referrer?.email || "Unknown",
          count: referralCounts[id],
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    stats.topReferrers = topReferrers;
    setStats(stats);
  };

  // Compute hourly data for a day (IST) with splits
  const getHourlyGroupCountsForDay = (dayYYYYMMDD) => {
    const hours = Array.from({ length: 24 }, (_, h) => h);
    const total = Array(24).fill(0);
    const rgukt = Array(24).fill(0);
    const nonRgukt = Array(24).fill(0);

    registrations.forEach((r) => {
      if (!r.created_at) return;
      const { date, hour } = toISTParts(r.created_at);
      if (date === dayYYYYMMDD && hour >= 0 && hour <= 23) {
        total[hour]++;
        if (isRGUKTian(r.institution)) rgukt[hour]++;
        else nonRgukt[hour]++;
      }
    });

    return { hours, total, rgukt, nonRgukt };
  };

  // Auto-refresh + initial load
  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
  }, [authenticated, fetchData]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchData, 5 * 60 * 1000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchData]);

  if (!authenticated) {
    return <PasswordGate onAuthenticate={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          onRefresh={fetchData}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
          lastUpdated={lastUpdated}
        />

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            {selectedView === "Overview" && <StatsCards stats={stats} />}

            {selectedView === "Referral Insights" ? (
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-2">Total Referrals</h3>
                  <p className="text-4xl font-bold text-blue-500">
                    {stats.totalReferrals}
                  </p>
                </div>
                <ReferralTable topReferrers={stats.topReferrers} />
              </div>
            ) : selectedView === "Day-wise (Hourly)" ? (
              <DayHourlyView
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                getHourlyGroupCountsForDay={getHourlyGroupCountsForDay}
              />
            ) : (
              selectedView !== "Overview" && (
                <ViewSection view={selectedView} stats={stats} />
              )
            )}

            <div className="mt-6 flex justify-end">
              <ExportButton
                selectedView={selectedView}
                stats={stats}
                registrations={registrations}
                selectedDay={selectedDay}
                getHourlyGroupCountsForDay={getHourlyGroupCountsForDay}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SecretDashboard;
