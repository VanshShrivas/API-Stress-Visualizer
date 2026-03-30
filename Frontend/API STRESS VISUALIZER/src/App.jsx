import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ConfigForm from './components/ConfigForm';
import MetricsGrid from './components/MetricsGrid';
import { LiveChart } from './components/LiveChart';
import { useLoadTest } from './useLoadTest';
import { Menu } from 'lucide-react';
import LatencyBucketHistogram from './components/LatencyBucketHistogram';
import ErrorCategorization from './components/ErrorCategorization'

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
  const [type, setType] = useState("pie");
  const { metrics, historyData, error } = useLoadTest(testId, () => {
    console.log("Test Completed successfully!");
  });
  //since this depends on testId which is a state in my project..so whenver the id is set (either a new test or the recent test id=>truiggers the useLoadTest function which in turn calls the info route with the given testID which is important to note as this would only be able to give the data if the server has not been restarted in between...to eliminate we have to have to use database or the local client side storage where we can just put in data into the local storage alongwith the testID (for now we are only setting ids into the local storage this can be changed...))

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
        const newHistory = [data.testID, ...history.filter(id => id !== data.testID)].slice(0, 10);
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
        onSelect={id => { setTestId(id); }}
        activeId={testId}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />


      {/* Main content */}
      <main className="flex-1 overflow-y-auto px-8 pb-8 bg-[#0a0a0a]">
        <header className="sticky top-1 z-40 mb-5 backdrop-blur-sm rounded-full border border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

            <div className="flex justify-between">

              {/* Hamburger */}
              <button
                className="mr-2 flex items-center justify-center"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={22} className="text-gray-200 hover:text-gray-500" />
              </button>

              <div>
                <h1 className="text-2xl font-black italic text-white tracking-tighter">
                  LOAD<span className="text-blue-500">VIZ</span>
                </h1>
                <p className="text-gray-500 text-xs font-medium">
                  Monitor your API performance in real-time.
                </p>
              </div>

            </div>

            {testId && (
              <div className=" hidden md:block px-4 py-1 bg-blue-500/10 border border-blue-500/50 rounded-full text-blue-400 text-xs font-bold animate-pulse">
                LIVE SESSION: {testId}
              </div>
            )}

          </div>
        </header>

        {error && (
          <div className="max-w-7xl mx-auto mb-6 p-4 bg-red-950/30 border border-red-500/50 rounded-xl text-red-400 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <span className="text-lg">⚠️</span> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <ConfigForm config={config} metrics={metrics} setConfig={setConfig} onStart={handleStartTest} onAbort={handleAbortTest} />
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
              <div className="mb-5">
                <LiveChart data={historyData} />
              </div>
              <div className="mb-5">
                <LatencyBucketHistogram buckets={metrics != null ? metrics.buckets : []} counts={metrics != null ? metrics.counts : []} />
              </div>
              <div className="mb-5">
                <ErrorCategorization type={type} setType={setType} errorStats={metrics != null ? metrics.errorStats : {}} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;