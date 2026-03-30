import React, { useState } from 'react';
import { Plus, Trash2, ShieldCheck, FileText } from 'lucide-react'; 

const ConfigForm = ({ config, metrics, setConfig, onStart , onAbort }) => {
  const [customHeaders, setCustomHeaders] = useState([{ key: '', value: '' }]);

  const addHeader = () => {
    setCustomHeaders([...customHeaders, { key: '', value: '' }]);
  };

  const removeHeader = (index) => {
    const newHeaders = customHeaders.filter((_, i) => i !== index);
    setCustomHeaders(newHeaders);
    updateParentHeaders(newHeaders);
  };

  const handleHeaderChange = (index, field, val) => {
    const newHeaders = [...customHeaders];
    newHeaders[index][field] = val;
    setCustomHeaders(newHeaders);
    updateParentHeaders(newHeaders);
  };

  const updateParentHeaders = (headersList) => {
    const headerObj = headersList.reduce((acc, curr) => {
      if (curr.key) acc[curr.key] = curr.value;
      return acc;
    }, {});
    setConfig({ ...config, additionalHeaders: headerObj });
  };

  const handleDownloadPDF = () => {
      // Placeholder for backend download logic
      if (!metrics || !metrics.id) return;
      window.open(`http://localhost:3500/api/download-report/${metrics.id}`, '_blank');
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck className="text-blue-500" size={24} />
        <h2 className="text-xl font-bold text-blue-400">Test Configuration</h2>
      </div>

      <form onSubmit={onStart} className="space-y-6">
        
        {/* URL & Method */}
        <div className="space-y-2">
          <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">Endpoint</label>
          <div className="flex gap-2">
            <select 
              className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={config.method}
              onChange={e => setConfig({...config, method: e.target.value})}
            >
              {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => <option key={m}>{m}</option>)}
            </select>
            <input 
              type="url" 
              placeholder="https://api.yourdomain.com/v1/test" 
              className="flex-1 bg-gray-800 p-3 rounded-lg border w-2 border-gray-700 text-sm outline-none focus:border-blue-500 transition-all"
              onChange={e => setConfig({...config, url: e.target.value})} 
              value={config.url}
              required 
            />
          </div>
        </div>

        {/* Dynamic Custom Headers Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">Custom Headers</label>
            <button 
              type="button" 
              onClick={addHeader}
              className="text-blue-500 hover:text-blue-400 text-xs flex items-center gap-1 font-bold transition-colors"
            >
              <Plus size={14} /> Add Header
            </button>
          </div>
          <div className="space-y-2">
            {customHeaders.map((header, index) => (
              <div key={index} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                <input 
                  placeholder="Key" 
                  className="flex-1 bg-gray-800 p-2 rounded border w-1.5 border-gray-700 text-xs outline-none focus:border-blue-400"
                  value={header.key}
                  onChange={e => handleHeaderChange(index, 'key', e.target.value)}
                />
                <input 
                  placeholder="Value" 
                  className="flex-1 bg-gray-800 p-2 rounded border border-gray-700 text-xs outline-none focus:border-blue-400"
                  value={header.value}
                  onChange={e => handleHeaderChange(index, 'value', e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => removeHeader(index)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Selection */}
        <div className="space-y-3 bg-gray-800/30 p-4 rounded-xl border border-gray-800">
          <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">Preset Auth</label>
          <select 
            className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            value={config.authType}
            onChange={e => setConfig({...config, authType: e.target.value})}
          >
            <option value="none">No Preset Auth</option>
            <option value="bearer">Bearer Token</option>
            <option value="basic">Basic Auth</option>
            <option value="apikey">API Key</option>
          </select>
          
          {config.authType === 'bearer' && (
            <input type="text" placeholder="Token: eyJhbG..." className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 text-sm animate-in zoom-in-95" 
              onChange={e => setConfig({...config, token: e.target.value})} />
          )}
          
          {config.authType === 'basic' && (
            <div className="grid grid-cols-2 gap-2 animate-in zoom-in-95">
              <input type="text" placeholder="User" className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-sm" 
                onChange={e => setConfig({...config, user: e.target.value})} />
              <input type="password" placeholder="Pass" className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-sm" 
                onChange={e => setConfig({...config, pass: e.target.value})} />
            </div>
          )}

          {config.authType === 'apikey' && (
            <div className="grid grid-cols-2 gap-2 animate-in zoom-in-95">
              <input type="text" placeholder="Header Name (e.g. x-api-key)" className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-sm" 
                onChange={e => setConfig({...config, apiKeyName: e.target.value})} />
              <input type="text" placeholder="Key Value" className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-sm" 
                onChange={e => setConfig({...config, apiKeyValue: e.target.value})} />
            </div>
          )}
        </div>

        {/* JSON Body */}
        {config.method !== 'GET' && (
          <div className="space-y-2">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">Request Body (JSON)</label>
            <textarea 
              rows="5"
              className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 font-mono text-xs focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              placeholder='{&#10;  "action": "stress_test",&#10;  "data": {}&#10;}'
              onChange={e => setConfig({...config, body: e.target.value})}
            />
          </div>
        )}

        {/* Load Parameters */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-tighter">Total Requests</label>
            <input type="number" className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 focus:border-blue-500 outline-none" 
              value={config.totalRequests} onChange={e => setConfig({...config, totalRequests: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-tighter">Concurrency</label>
            <input type="number" className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 focus:border-blue-500 outline-none" 
              value={config.concurrency} onChange={e => setConfig({...config, concurrency: e.target.value})} />
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
            Fire Load Test
            </button>
            
            {metrics!=null && metrics.status==="running" && (
            <button 
                type="button"
                onClick={onAbort} 
                className="w-full bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/50 py-4 rounded-xl font-black uppercase tracking-widest transition-all active:scale-[0.98]"
            >
                Abort Test
            </button>
            )}

            {metrics != null && (metrics.status === 'completed' || metrics.status === 'aborted') && (
              <button 
                type="button"
                onClick={handleDownloadPDF}
                className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden"
              >
                <>
                  <FileText size={18} />
                  Download PDF Report
                </>
              </button>
            )}
        </div>
      </form>
    </div>
  );
};

export default ConfigForm;