
import React from 'react';
import { TourData } from '../types';
import { Check, Filter, Search, Map } from 'lucide-react';

interface SidebarProps {
  tours: TourData[];
  selectedTours: string[];
  onToggleTour: (tourName: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  tours, 
  selectedTours, 
  onToggleTour,
  onSelectAll,
  onDeselectAll
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredTours = tours.filter(t => 
    t.tourName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 h-full bg-white border-r border-slate-100 flex flex-col shrink-0 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.05)] z-10">
      <div className="p-8 pb-6">
        <div className="flex items-center gap-0 mb-8 select-none">
          <span className="text-2xl font-black tracking-tighter text-[#d10000]">trip</span>
          <div className="bg-[#d10000] text-white px-2 py-0.5 ml-1 rounded-sm">
            <span className="text-2xl font-black tracking-tighter uppercase italic">ventura</span>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-red-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search tours..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="px-8 py-3 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 border-b border-slate-50">
        <div className="flex items-center gap-1.5">
          <Map className="w-3 h-3 text-red-500" />
          <span>Destinations ({selectedTours.length})</span>
        </div>
        <div className="flex gap-4">
          <button onClick={onSelectAll} className="text-red-600 hover:text-red-700">All</button>
          <button onClick={onDeselectAll} className="hover:text-slate-600">None</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-2.5 custom-scrollbar">
        {filteredTours.map((tour, idx) => {
          const isSelected = selectedTours.includes(tour.tourName);
          return (
            <div 
              key={tour.productCode}
              onClick={() => onToggleTour(tour.tourName)}
              style={{ animationDelay: `${idx * 0.05}s` }}
              className={`
                group flex items-center p-3.5 rounded-2xl cursor-pointer transition-all border animate-slide-in
                ${isSelected 
                  ? 'bg-red-50/50 border-red-100 shadow-sm' 
                  : 'bg-white border-transparent hover:bg-slate-50'}
              `}
            >
              <div className={`
                w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all shrink-0
                ${isSelected ? 'bg-red-600 border-red-600 rotate-0' : 'bg-white border-slate-200 -rotate-3'}
              `}>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className={`text-sm font-bold truncate tracking-tight transition-colors ${isSelected ? 'text-red-900' : 'text-slate-800'}`}>
                  {tour.tourName}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{tour.productCode}</span>
                  {isSelected && <span className="w-1 h-1 rounded-full bg-red-400" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
