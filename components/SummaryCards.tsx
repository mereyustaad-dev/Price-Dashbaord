
import React from 'react';
import { TourData } from '../types';
import { TrendingUp, DollarSign, Target, Briefcase, ChevronRight } from 'lucide-react';

interface SummaryCardsProps {
  selectedData: TourData[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ selectedData }) => {
  if (selectedData.length === 0) return null;

  const avgProfit = selectedData.reduce((acc, curr) => acc + curr.profitPercent, 0) / selectedData.length;
  const totalValue = selectedData.reduce((acc, curr) => acc + curr.sellingPrice, 0);
  const avgGap = selectedData.reduce((acc, curr) => acc + (curr.medianMarketPrice - curr.sellingPrice), 0) / selectedData.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { 
          label: 'Portfolio Profit Margin', 
          val: `${avgProfit.toFixed(1)}%`, 
          icon: TrendingUp, 
          bg: 'bg-red-50', 
          text: 'text-red-600' 
        },
        { 
          label: 'Total Package Value', 
          val: `$${totalValue.toLocaleString()}`, 
          icon: DollarSign, 
          bg: 'bg-slate-900', 
          text: 'text-white' 
        },
        { 
          label: 'Market Comp Index', 
          val: avgGap > 0 ? `-$${Math.abs(avgGap).toFixed(0)}` : `+$${Math.abs(avgGap).toFixed(0)}`, 
          icon: Target, 
          bg: 'bg-emerald-50', 
          text: 'text-emerald-600' 
        }
      ].map((card, i) => (
        <div key={i} className={`p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 group transition-all hover:shadow-xl ${card.bg === 'bg-slate-900' ? card.bg : 'bg-white'}`}>
          <div className={`w-16 h-16 ${card.bg === 'bg-slate-900' ? 'bg-slate-800' : card.bg} ${card.text} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
            <card.icon className="w-8 h-8" />
          </div>
          <div>
            <p className={`text-[10px] font-black uppercase tracking-widest ${card.bg === 'bg-slate-900' ? 'text-slate-400' : 'text-slate-400'}`}>{card.label}</p>
            <p className={`text-3xl font-black tracking-tighter ${card.bg === 'bg-slate-900' ? 'text-white' : 'text-slate-900'}`}>{card.val}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export const DetailTable: React.FC<SummaryCardsProps> = ({ selectedData }) => {
  const handleDownload = () => {
    const headers = ["Tour Name", "Product Code", "Net Cost", "Selling Price", "Profit %", "Median Market Price", "Final Customer Price"];
    const rows = selectedData.map(tour => [
      `"${tour.tourName}"`,
      tour.productCode,
      tour.netCost,
      tour.sellingPrice,
      tour.profitPercent,
      tour.medianMarketPrice,
      tour.finalCustomerPrice
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `tripventura_pricing_analysis_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mb-12">
      <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Inventory Intelligence</h2>
          <p className="text-sm text-slate-500 font-medium">Granular financial health of active tour listings</p>
        </div>
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#d10000] transition-colors"
        >
          Download Analysis
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience & Ref</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Net Unit Cost</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Tripventura Price</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Market Benchmark</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Unit Margin</th>
              <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Market Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {selectedData.map((tour) => (
              <tr key={tour.productCode} className="hover:bg-slate-50/80 transition-all group">
                <td className="px-10 py-5">
                  <div className="font-black text-slate-900 tracking-tight group-hover:text-red-600 transition-colors">{tour.tourName}</div>
                  <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{tour.productCode}</div>
                </td>
                <td className="px-6 py-5 text-right font-bold text-slate-500">${tour.netCost.toLocaleString()}</td>
                <td className="px-6 py-5 text-right font-black text-red-600 text-lg tracking-tighter">${tour.sellingPrice.toLocaleString()}</td>
                <td className="px-6 py-5 text-right font-bold text-emerald-600">${tour.medianMarketPrice.toLocaleString()}</td>
                <td className="px-6 py-5 text-right">
                  <div className="font-black text-slate-900">{tour.profitPercent}%</div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Gross Margin</div>
                </td>
                <td className="px-10 py-5 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${
                    tour.sellingPrice < tour.medianMarketPrice 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {tour.sellingPrice < tour.medianMarketPrice ? 'Competitive' : 'Exclusive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryCards;
