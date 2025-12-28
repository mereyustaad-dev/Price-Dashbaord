
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import PriceChart from './components/PriceChart';
import SummaryCards, { DetailTable } from './components/SummaryCards';
import { fetchTourData } from './services/dataService';
import { TourData } from './types';
import { RefreshCw, LayoutDashboard, Database, Info, AlertCircle, Facebook, Instagram, Youtube, Music2, Pin, Mail, Send } from 'lucide-react';

const ContactBox = () => {
  const handleEmail = () => {
    window.location.href = "mailto:hashirpaarvi@gmail.com?subject=Data Discrepancy Report&body=Hello Shahid Paarvi,%0D%0A%0D%0AI noticed the following discrepancy in the Tripventura Pricing Dashboard data:%0D%0A%0D%0A[Please describe the issue here]";
  };

  return (
    <div className="mt-12 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white p-8 shadow-sm group hover:shadow-xl hover:bg-white/60 transition-all border-dashed border-2">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-red-600 text-white rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <Mail className="w-8 h-8" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Data Discrepancy Found?</h3>
          <p className="text-slate-600 font-medium mt-1">Suggest improvements or report data issues directly to <strong>Shahid Paarvi</strong>.</p>
        </div>
        <button 
          onClick={handleEmail}
          className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full text-sm font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg active:scale-95"
        >
          <Send className="w-5 h-5" />
          Contact Shahid
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [tours, setTours] = useState<TourData[]>([]);
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTourData();
      setTours(data);
      if (data.length > 0) {
        setSelectedTours(data.slice(0, 3).map(t => t.tourName));
      }
      setError(null);
    } catch (err) {
      setError("Unable to sync live data. Showing cached results.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleTour = (tourName: string) => {
    setSelectedTours(prev => 
      prev.includes(tourName) 
        ? prev.filter(t => t !== tourName) 
        : [...prev, tourName]
    );
  };

  const handleSelectAll = () => setSelectedTours(tours.map(t => t.tourName));
  const handleDeselectAll = () => setSelectedTours([]);

  const selectedData = tours.filter(t => selectedTours.includes(t.tourName));

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white flex-col gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute top-0 w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-slate-900 font-bold text-lg tracking-tight animate-pulse uppercase">Tripventura Experience Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <Sidebar 
        tours={tours} 
        selectedTours={selectedTours} 
        onToggleTour={handleToggleTour}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Brand Top Bar */}
        <div className="bg-[#d10000] text-white px-8 py-2 flex justify-between items-center text-[11px] font-bold uppercase tracking-widest shrink-0">
          <div className="flex gap-4">
            <Facebook size={14} className="cursor-pointer hover:opacity-80" />
            <Instagram size={14} className="cursor-pointer hover:opacity-80" />
            <Youtube size={14} className="cursor-pointer hover:opacity-80" />
            <Music2 size={14} className="cursor-pointer hover:opacity-80" />
            <Pin size={14} className="cursor-pointer hover:opacity-80" />
          </div>
          <div className="flex items-center gap-2">
            <span>&lsaquo;</span>
            <span className="mx-4">Credible global travel agency 🌍</span>
            <span>&rsaquo;</span>
          </div>
          <div className="w-[100px]"></div> {/* Spacer */}
        </div>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-end mb-10">
              <div>
                <div className="flex items-center gap-2 text-red-600 mb-2 font-black text-xs uppercase tracking-widest">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Internal Price Analytics</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                  Experience <span className="text-red-600">Profitability</span>
                </h1>
                <p className="text-slate-500 mt-2 font-medium">
                  Optimizing global travel experiences through data-driven pricing strategies.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={loadData}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-bold hover:shadow-lg hover:border-red-100 transition-all text-slate-700 shadow-sm"
                >
                  <RefreshCw className="w-4 h-4 text-red-600" />
                  Refresh Data
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-800 text-sm font-bold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            {selectedData.length > 0 ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <SummaryCards selectedData={selectedData} />
                <PriceChart selectedData={selectedData} />
                <DetailTable selectedData={selectedData} />
                <ContactBox />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-white/60 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <Info className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Ready to Analyze?</h3>
                <p className="text-sm max-w-sm text-center mt-2 font-medium">
                  Select your tours from the left panel to begin deep-dive price comparisons.
                </p>
              </div>
            )}

            <footer className="mt-20 pt-10 border-t border-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest pb-12">
              <p>© 2024 Tripventura LLC • Global Travel Excellence</p>
            </footer>
          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #f43f5e; }
      `}} />
    </div>
  );
};

export default App;
