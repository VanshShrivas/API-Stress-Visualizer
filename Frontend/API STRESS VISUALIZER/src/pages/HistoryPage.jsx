import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpDown, FileText } from 'lucide-react';

const HistoryPage = () => {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('timestamp');
  const [order, setOrder] = useState('desc');
  const [selectedRuns, setSelectedRuns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, [sortBy, order]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3500/api/history?sortBy=${sortBy}&order=${order}`);
      if (!res.ok) throw new Error('Failed to fetch historical runs');
      const data = await res.json();
      setRuns(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('desc');
    }
  };

  const toggleSelect = (testId) => {
    if (selectedRuns.includes(testId)) {
      setSelectedRuns(selectedRuns.filter(id => id !== testId));
    } else {
      if (selectedRuns.length < 2) {
        setSelectedRuns([...selectedRuns, testId]);
      } else {
        alert("You can only compare 2 runs at a time.");
      }
    }
  };

  const handleCompare = () => {
    if (selectedRuns.length === 2) {
      navigate(`/compare?runA=${selectedRuns[0]}&runB=${selectedRuns[1]}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-black italic tracking-tighter">
              HISTORICAL <span className="text-blue-500">RUNS</span>
            </h1>
          </div>
          <button
            onClick={handleCompare}
            disabled={selectedRuns.length !== 2}
            className={`px-6 py-2 rounded-full font-bold uppercase tracking-widest transition-all ${
              selectedRuns.length === 2 
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            Compare Selected ({selectedRuns.length}/2)
          </button>
        </header>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-950 text-gray-400 uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-4 w-12"></th>
                  <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('timestamp')}>
                    <div className="flex items-center gap-1">Date/Time <ArrowUpDown size={12} /></div>
                  </th>
                  <th className="p-4">Target</th>
                  <th className="p-4">Reqs / Conc</th>
                  <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('metrics.avgLatency')}>
                    <div className="flex items-center gap-1">Avg Latency <ArrowUpDown size={12} /></div>
                  </th>
                  <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('metrics.p95Latency')}>
                    <div className="flex items-center gap-1">P95 <ArrowUpDown size={12} /></div>
                  </th>
                  <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('metrics.throughput')}>
                    <div className="flex items-center gap-1">Throughput <ArrowUpDown size={12} /></div>
                  </th>
                  <th className="p-4">Success %</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr><td colSpan="9" className="p-8 text-center text-gray-500">Loading...</td></tr>
                ) : runs.length === 0 ? (
                  <tr><td colSpan="9" className="p-8 text-center text-gray-500">No historical runs found.</td></tr>
                ) : (
                  runs.map(run => (
                    <tr 
                      key={run.testId} 
                      className={`hover:bg-gray-800/50 transition-colors ${selectedRuns.includes(run.testId) ? 'bg-blue-900/10' : ''}`}
                    >
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                          checked={selectedRuns.includes(run.testId)}
                          onChange={() => toggleSelect(run.testId)}
                        />
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-bold">{new Date(run.timestamp).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{new Date(run.timestamp).toLocaleTimeString()}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-xs truncate max-w-[200px]" title={run.config.url}>
                          <span className="text-blue-400 font-bold mr-2">{run.config.method}</span>
                          {run.config.url}
                        </div>
                      </td>
                      <td className="p-4 text-gray-400">
                        {run.config.totalRequests} / {run.config.concurrency}
                      </td>
                      <td className="p-4 font-mono">{run.metrics?.avgLatency?.toFixed(2) || '--'} ms</td>
                      <td className="p-4 font-mono">{run.metrics?.p95Latency?.toFixed(2) || '--'} ms</td>
                      <td className="p-4 font-mono text-blue-400">{run.metrics?.throughput?.toFixed(2) || '--'} rps</td>
                      <td className="p-4 font-mono text-green-400">{run.metrics?.successRate?.toFixed(2) || '--'}%</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          run.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {run.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => window.open(`http://localhost:3500/api/download-report/${run.testId}`, '_blank')}
                          className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded px-2.5 py-1 transition-all active:scale-95"
                          title="Download PDF Report"
                        >
                          <FileText size={12} />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
