import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ConfigForm from './components/ConfigForm';
import MetricsGrid from './components/MetricsGrid';
import { LiveChart } from './components/LiveChart';
import { useLoadTest } from './useLoadTest';
import { Menu } from 'lucide-react';

const App = () => {
  const [testId, setTestId] = useState(null);
  const [history, setHistory] = useState(JSON.parse(localStorage.getItem('test_history') || '[]'));
  const [config, setConfig] = useState({
    url: '',
    method: 'GET',
    body: '',
    totalRequests: 100,
    concurrency: 10,
    authType: 'none',
    token: '',
    user: '',
    pass: ''
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { metrics, historyData } = useLoadTest(testId, () => {
    console.log("Test Completed successfully!");
  });

  const handleStartTest = async (e) => {
    e.preventDefault();
    let finalHeaders = { 'Content-Type': 'application/json', ...config.additionalHeaders };
    if (config.authType === 'bearer' && config.token) finalHeaders['Authorization'] = `Bearer ${config.token}`;
    if (config.authType === 'basic' && config.user && config.pass) finalHeaders['Authorization'] = `Basic ${btoa(`${config.user}:${config.pass}`)}`;
    let parsedBody = null;
    if (config.method !== 'GET' && config.body) {
      try { parsedBody = JSON.parse(config.body); } catch { alert("Invalid JSON in Body!"); return; }
    }
    const payload = {
      url: config.url,
      method: config.method,
      headers: finalHeaders,
      body: parsedBody,
      totalRequests: parseInt(config.totalRequests),
      concurrency: parseInt(config.concurrency)
    };
    try {
      const response = await fetch('http://localhost:3500/api/start-load-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Server Error:", data.error || "Unknown error");
        alert(data.error || `Request failed with status ${response.status}`);
        return;
      }
      if (data.testID) {
        setTestId(data.testID);
        const newHistory = [data.testID, ...history].slice(0, 10);
        setHistory(newHistory);
        localStorage.setItem('test_history', JSON.stringify(newHistory));
      }
    } catch (err) {
      alert("NOT GOOD!!!");
    }
    setSidebarOpen(false);
  };

  const handleAbortTest = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:3500/api/abort-test/${testId}`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex h-screen bg-black text-gray-100 overflow-hidden font-sans">

      {/* Sidebar */}
      <Sidebar
        history={history}
        onSelect={id => { setTestId(id); setSidebarOpen(false); }}
        activeId={testId}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Hamburger Icon */}
      <button 
        className="absolute top-4 left-4 z-50 md:hidden p-2 rounded bg-gray-900 border border-gray-700 hover:bg-gray-800 transition"
        onClick={() => setSidebarOpen(prev => !prev)}
      >
        <Menu size={24} className="text-gray-200" />
      </button>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8 bg-[#0a0a0a] relative">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tight">Dashboard</h2>
              <p className="text-gray-500 font-medium">Monitor your API performance in real-time.</p>
            </div>
            {testId && (
              <div className="px-4 py-1 bg-blue-500/10 border border-blue-500/50 rounded-full text-blue-400 text-xs font-bold animate-pulse">
                LIVE SESSION: {testId}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <ConfigForm config={config} testId={testId} setConfig={setConfig} onStart={handleStartTest} onAbort={handleAbortTest} />
            </div>

            <div className="lg:col-span-8 space-y-8">
              <MetricsGrid metrics={metrics} />
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-400 uppercase tracking-widest text-sm">Performance Trends</h3>
                  <div className="flex gap-4 text-[10px] font-bold uppercase">
                    <span className="text-blue-400">● Throughput</span>
                    <span className="text-green-400">● Success %</span>
                    <span className="text-red-400">● Error %</span>
                  </div>
                </div>
                <div className="h-[350px]">
                  <LiveChart data={historyData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;