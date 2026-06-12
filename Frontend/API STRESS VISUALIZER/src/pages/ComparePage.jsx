import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import ComparisonCard from '../components/ComparisonCard';
import ComparisonCharts from '../components/ComparisonCharts';

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const runAId = searchParams.get('runA');
  const runBId = searchParams.get('runB');
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!runAId || !runBId) {
      setError("Please select two runs to compare from the History page.");
      setLoading(false);
      return;
    }
    fetchComparison();
  }, [runAId, runBId]);

  const fetchComparison = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3500/api/compare?runA=${runAId}&runB=${runBId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch comparison');
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num, digits = 2) => {
    return typeof num === "number" && !isNaN(num) ? num.toFixed(digits) : "--";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="animate-spin text-blue-500"><RefreshCw size={32} /></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-8 text-white">
        <Link to="/history" className="text-gray-400 hover:text-white transition-colors mb-8 inline-block">
          <ArrowLeft size={24} />
        </Link>
        <div className="bg-red-950/30 border border-red-500/50 p-6 rounded-xl text-red-400 font-bold max-w-2xl mx-auto text-center">
          {error}
        </div>
      </div>
    );
  }

  const { runA, runB, comparison } = data;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to="/history" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-black italic tracking-tighter">
              RUN <span className="text-blue-500">COMPARISON</span>
            </h1>
          </div>
          <div className="text-sm text-gray-500 font-bold hidden md:block">
            Regression Analysis Dashboard
          </div>
        </header>

        {/* Run Details Headers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {[runA, runB].map((run, idx) => (
            <div key={run.testId} className={`p-6 rounded-2xl border shadow-xl ${idx === 0 ? 'bg-blue-900/10 border-blue-900/50' : 'bg-green-900/10 border-green-900/50'}`}>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-black tracking-widest text-white uppercase">Run {idx === 0 ? 'A' : 'B'}</h2>
                <div className="text-xs text-gray-500 font-mono">{run.testId.split('-')[0]}</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-gray-800/50 pb-1">
                  <span className="text-gray-500 font-bold uppercase text-[10px] tracking-wider">Date</span>
                  <span className="text-gray-300">{new Date(run.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800/50 pb-1">
                  <span className="text-gray-500 font-bold uppercase text-[10px] tracking-wider">Target</span>
                  <span className="text-gray-300 truncate max-w-[200px]" title={run.config.url}>
                    <span className="text-blue-400 font-bold mr-1">{run.config.method}</span>
                    {run.config.url}
                  </span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-gray-500 font-bold uppercase text-[10px] tracking-wider">Load Config</span>
                  <span className="text-gray-300">{run.config.totalRequests} reqs @ {run.config.concurrency} conc</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-6 text-white tracking-widest uppercase border-b border-gray-800 pb-2">Metrics Analysis</h2>
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ComparisonCard 
            title="Avg Latency" 
            metric={comparison.avgLatency} 
            formatValue={(v) => `${formatNumber(v)} ms`} 
          />
          <ComparisonCard 
            title="P95 Latency" 
            metric={comparison.p95Latency} 
            formatValue={(v) => `${formatNumber(v)} ms`} 
          />
          <ComparisonCard 
            title="Throughput" 
            metric={comparison.throughput} 
            formatValue={(v) => `${formatNumber(v)} rps`} 
          />
          <ComparisonCard 
            title="Success Rate" 
            metric={comparison.successRate} 
            formatValue={(v) => `${formatNumber(v)} %`} 
          />
          <ComparisonCard 
            title="Error Rate" 
            metric={comparison.errorRate} 
            formatValue={(v) => `${formatNumber(v)} %`} 
          />
          <ComparisonCard 
            title="Max Latency" 
            metric={comparison.maxLatency} 
            formatValue={(v) => `${formatNumber(v)} ms`} 
          />
        </div>

        {/* Visual Charts */}
        <ComparisonCharts runA={runA} runB={runB} />
      </div>
    </div>
  );
};

export default ComparePage;
