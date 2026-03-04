import React from "react";

const LatencyBucketHistogram = ({ buckets = [], counts = [] }) => {
  if (!buckets.length || !counts.length) return null;

  // Find last non-zero bucket
  const lastActiveIndex = counts.reduce((last, val, i) => {
    return val > 0 ? i : last;
  }, -1);

  // If all zero, show first bucket only
  const visibleCounts =
    lastActiveIndex === -1
      ? counts.slice(0, 1)
      : counts.slice(0, lastActiveIndex + 1);

  const maxCount = Math.max(...visibleCounts, 1);

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-zinc-800">
      <h3 className="font-bold text-gray-400 uppercase mb-5 tracking-widest text-sm">
        Latency Histogram
      </h3>

      <div className="space-y-2">
        {visibleCounts.map((count, i) => {
          let label;

          if (i < buckets.length - 1) {
            label = `${buckets[i]}-${buckets[i + 1]} ms`;
          } else {
            label = `>=${buckets[buckets.length - 1]} ms`;
          }

          const widthPercent = (count / maxCount) * 100;

          return (
            <div key={i} className="flex items-center gap-3">
              <div className="w-24 text-xs text-gray-500">
                {label}
              </div>

              <div className="flex-1 bg-zinc-800 h-4 rounded">
                <div
                  className="h-4 bg-blue-500 rounded"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>

              <div className="w-8 text-xs text-gray-300 text-right">
                {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LatencyBucketHistogram;