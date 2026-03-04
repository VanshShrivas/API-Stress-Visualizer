import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

export const LiveChart = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true, grid: { color: '#374151' } } },
    plugins: { legend: { position: 'top', labels: { color: '#fff' } } }
  };

  const chartConfig = {
    labels: data.labels,
    datasets: [
      { label: 'Throughput', data: data.throughput, borderColor: '#60a5fa', tension: 0.3 },
      { label: 'Success %', data: data.success, borderColor: '#4ade80', tension: 0.3 },
      { label: 'Error %', data: data.error, borderColor: '#f87171', tension: 0.3 },
    ],
  };

  return (
    <div className="h-80 w-full bg-gray-800 p-4 rounded-xl shadow-inner">
      <Line data={chartConfig} options={options} />
    </div>
  );
};