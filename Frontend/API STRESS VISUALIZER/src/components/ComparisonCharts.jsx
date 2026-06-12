import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ComparisonCharts = ({ runA, runB }) => {
  if (!runA || !runB) return null;

  const a = runA.metrics;
  const b = runB.metrics;

  const createData = (labelA, labelB, valA, valB, colorA = '#60a5fa', colorB = '#34d399') => ({
    labels: ['Run A', 'Run B'],
    datasets: [
      {
        label: 'Metric Value',
        data: [valA, valB],
        backgroundColor: [colorA, colorB],
        borderRadius: 4,
      }
    ]
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: '#374151' }, ticks: { color: '#9ca3af' } },
      x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
    }
  };

  const chartConfigs = [
    { title: 'Throughput (RPS)', data: createData('Run A', 'Run B', a.throughput, b.throughput, '#3b82f6', '#10b981') },
    { title: 'Avg Latency (ms)', data: createData('Run A', 'Run B', a.avgLatency, b.avgLatency, '#f59e0b', '#f97316') },
    { title: 'P95 Latency (ms)', data: createData('Run A', 'Run B', a.p95Latency, b.p95Latency, '#ef4444', '#dc2626') },
    { title: 'Error Rate (%)', data: createData('Run A', 'Run B', a.errorRate, b.errorRate, '#ec4899', '#db2777') },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {chartConfigs.map((config, index) => (
        <div key={index} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
          <h3 className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-4 text-center">{config.title}</h3>
          <div className="h-48">
            <Bar data={config.data} options={options} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComparisonCharts;
