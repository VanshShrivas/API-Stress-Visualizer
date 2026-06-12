import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const ComparisonCard = ({ title, metric, formatValue = (v) => v }) => {
  if (!metric) return null;

  const { valueA, valueB, diff, pctChange, verdict } = metric;
  
  const isImproved = verdict === 'improved';
  const isRegressed = verdict === 'regressed';
  const isNoChange = verdict === 'no_change';

  let badgeColor = 'bg-gray-800 text-gray-400 border-gray-700';
  let badgeText = 'No Change';
  let Icon = Minus;

  if (isImproved) {
    badgeColor = 'bg-green-500/10 text-green-400 border-green-500/20';
    badgeText = 'Improved';
    Icon = pctChange > 0 ? ArrowUpRight : ArrowDownRight;
  } else if (isRegressed) {
    badgeColor = 'bg-red-500/10 text-red-400 border-red-500/20';
    badgeText = 'Regressed';
    Icon = pctChange > 0 ? ArrowUpRight : ArrowDownRight;
  }

  return (
    <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow-xl flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs text-gray-500 uppercase font-bold tracking-widest">{title}</h3>
        <span className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
          {badgeText}
          {!isNoChange && <Icon size={12} />}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-[10px] text-gray-500 mb-1">Run A</div>
          <div className="text-2xl font-black text-white">{formatValue(valueA)}</div>
        </div>
        <div>
          <div className="text-[10px] text-gray-500 mb-1">Run B</div>
          <div className="text-2xl font-black text-white">{formatValue(valueB)}</div>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-800 flex justify-between items-center text-xs">
        <div className="text-gray-400">
          Diff: <span className="font-mono text-white">{diff > 0 ? '+' : ''}{formatValue(diff)}</span>
        </div>
        <div className={`font-mono font-bold ${isImproved ? 'text-green-400' : isRegressed ? 'text-red-400' : 'text-gray-400'}`}>
          {pctChange > 0 ? '+' : ''}{pctChange}%
        </div>
      </div>
    </div>
  );
};

export default ComparisonCard;
