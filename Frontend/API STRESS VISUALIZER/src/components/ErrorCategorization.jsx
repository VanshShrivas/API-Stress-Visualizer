import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const ErrorCategorization = ({ type,setType, errorStats = {} }) => {
  const {
    success2xx = 0,
    redirect3xx = 0,
    client4xx = 0,
    server5xx = 0,
    networkErrors = 0
  } = errorStats;

  const data = {
    labels: ["2xx Success", "3xx Redirect", "4xx Client", "5xx Server", "Network"],
    datasets: [
    {
        data: [success2xx, redirect3xx, client4xx, server5xx, networkErrors],
        backgroundColor: [
          "#4ade80",
          "#fb923c",
          "#facc15",
          "#f87171", 
          "#60a5fa"  
        ],
        borderWidth: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
        display: type === "pie",
        position: "bottom",
        labels: {
            color: "#9ca3af",
            font: { size: 11 }
        }
        }
    }
   };

  const total = success2xx + redirect3xx + client4xx + server5xx + networkErrors;

  if (total === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-800 h-full">
      <h3 className="font-bold text-gray-400 uppercase tracking-widest text-sm mb-6">
        Error Categorization
      </h3>
      <span className="flex gap-4 mb-4 text-sm text-gray-400">
        <label className="flex items-center gap-1 cursor-pointer">
            <input
            type="radio"
            name="type"
            value="pie"
            checked={type === "pie"}
            onChange={(e) => setType(e.target.value)}
            />
            Pie
        </label>

        <label className="flex items-center gap-1 cursor-pointer">
            <input
            type="radio"
            name="type"
            value="bar"
            checked={type === "bar"}
            onChange={(e) => setType(e.target.value)}
            />
            Bar
        </label>
        </span>
      <div className="h-[260px]">
        {type==="pie" && <Pie data={data} options={options} />}
        {type==="bar" && <Bar data={data} options ={options}/>}
      </div>
    </div>
  );
};

export default ErrorCategorization;