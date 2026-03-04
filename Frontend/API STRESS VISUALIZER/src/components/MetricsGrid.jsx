import React from 'react';

const formatNumber = (num, digits = 2) => {
  return typeof num === "number" && !isNaN(num)
    ? num.toFixed(digits)
    : "--";
};

const StatCard = ({ label, value, color = "text-white", subValue }) => (
  <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 flex flex-col justify-between">
    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">
      {label}
    </p>
    <div>
      <p className={`text-3xl font-black ${color}`}>
        {value ?? 0}
      </p>
      {subValue && (
        <p className="text-[10px] text-gray-600 mt-1">{subValue}</p>
      )}
    </div>
  </div>
);

const MetricsGrid = ({ metrics = {} }) => {
  metrics = metrics ?? {};
  return (
    <div className="space-y-6">
      {/* Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Completed"
          value={metrics.completed ?? "0"}
          subValue={`Out of ${metrics.totalRequests ?? 0}`}
        />

        <StatCard
          label="Success Rate (%)"
          value={`${formatNumber(metrics.successRate)}`}
          color="text-green-400"
        />

        <StatCard
          label="Error Rate (%)"
          value={`${formatNumber(metrics.errorRate)}`}
          color="text-red-400"
        />
      </div>

      {/* Latency Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Avg Latency (ms)"
          value={`${formatNumber(metrics.avgLatency)}`}
          color="text-yellow-400"
        />

        <StatCard
          label="Throughput (rps)"
          value={`${formatNumber(metrics.throughput)}`}
          color="text-blue-400"
        />

        <StatCard
          label="P95 Latency (ms)"
          value={`${formatNumber(metrics.p95Latency)}`}
        />

        <StatCard
          label="Status"
          value={metrics.status ?? "--"}
          color="text-purple-400"
        />
      </div>

      {/* Footer */}
      <div className="bg-gray-900/50 p-4 rounded-xl border border-dashed border-gray-800 grid grid-cols-3 text-center text-xs">
        <div>
          MIN:{" "}
          <span className="text-white font-mono">
            {metrics.minLatency ?? 0}ms
          </span>
        </div>
        <div>
          MAX:{" "}
          <span className="text-white font-mono">
            {metrics.maxLatency ?? 0}ms
          </span>
        </div>
        <div>
          ERRORS:{" "}
          <span className="text-red-500 font-mono">
            {metrics.errors ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MetricsGrid;