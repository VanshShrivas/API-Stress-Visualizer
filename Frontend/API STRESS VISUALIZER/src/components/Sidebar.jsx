import React from 'react';
import { X } from 'lucide-react';

const Sidebar = ({ history, onSelect, activeId, open, onClose }) => {
  return (
    <>
      {/* Overlay sidebar for all screens */}
      <div className={`fixed inset-0 z-50 bg-black/50 transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="w-85 h-full bg-gray-950 p-6 flex flex-col relative">
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            onClick={onClose} // close overlay
          >
            <X size={20} />
          </button>
          <SidebarContent history={history} onSelect={onSelect} activeId={activeId} />
        </div>
      </div>
    </>
  );
};

const SidebarContent = ({ history, onSelect, activeId }) => (
  <>
    <div className="mb-10">
      <h1 className="text-2xl font-black italic text-white tracking-tighter">
        REC<span className="text-blue-500">ENTS</span>
      </h1>
    </div>

    <h3 className="text-xs font-black text-gray-600 uppercase tracking-widest mb-4">Recent 10 Tests</h3>
    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
      {history.length === 0 && <p className="text-gray-500 text-sm italic">No history yet...</p>}
      {history.map((id, index) => (
        <button 
          key={id + index} 
          onClick={() => onSelect(id)}
          className={`w-full text-left p-3 rounded-xl border transition-all truncate group ${
            activeId === id 
            ? 'bg-blue-600/10 border-blue-500/50 text-blue-400' 
            : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600'
          }`}
        >
          <div className="text-[10px] text-gray-500 mb-1">Session ID</div>
          <div className="font-mono p-1 text-xs font-bold">{id}</div>
        </button>
      ))}
    </div>

    <div className="pt-6 mt-6 border-t border-gray-800 text-[10px] text-gray-600">
      Connected to: <span className="text-green-500">Local Backend</span>
    </div>
  </>
);

export default Sidebar;