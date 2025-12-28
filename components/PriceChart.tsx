
import React, { useState, useCallback } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Brush,
  ReferenceArea
} from 'recharts';
import { TourData, ChartDataPoint } from '../types';
import { TrendingUp, Award, AlertCircle, ArrowUpRight, ArrowDownRight, Compass, Maximize2, RotateCcw } from 'lucide-react';

interface PriceChartProps {
  selectedData: TourData[];
}

const PriceChart: React.FC<PriceChartProps> = ({ selectedData }) => {
  // Zoom state
  const [refAreaLeft, setRefAreaLeft] = useState<string | number>('');
  const [refAreaRight, setRefAreaRight] = useState<string | number>('');
  const [left, setLeft] = useState<string | number>('dataMin');
  const [right, setRight] = useState<string | number>('dataMax');

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  const zoom = useCallback(() => {
    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      setRefAreaLeft('');
      setRefAreaRight('');
      return;
    }

    // Ensure left is always the smaller value for proper domain calculation
    let [l, r] = [refAreaLeft, refAreaRight];
    setRefAreaLeft('');
    setRefAreaRight('');
    setLeft(l);
    setRight(r);
  }, [refAreaLeft, refAreaRight]);

  const zoomOut = () => {
    setLeft('dataMin');
    setRight('dataMax');
    setRefAreaLeft('');
    setRefAreaRight('');
  };

  const renderMultiChart = () => {
    const chartData: ChartDataPoint[] = selectedData.map(tour => ({
      name: tour.tourName.length > 20 ? tour.tourName.substring(0, 17) + '...' : tour.tourName,
      "Net Cost": tour.netCost,
      "Selling Price": tour.sellingPrice,
      "Market Median": tour.medianMarketPrice,
      "Final Price": tour.finalCustomerPrice,
    }));

    const isZoomed = left !== 'dataMin' || right !== 'dataMax';

    return (
      <div className="h-[600px] w-full bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm flex flex-col overflow-hidden">
        <div className="mb-8 flex justify-between items-start shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Global Market Positioning</h2>
              {isZoomed && (
                <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter animate-pulse">
                  Zoomed In
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 font-medium">Click and drag horizontally on the chart to zoom into specific tours</p>
          </div>
          <div className="flex gap-2">
            {isZoomed && (
              <button 
                onClick={zoomOut}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
              >
                <RotateCcw size={14} />
                Reset Zoom
              </button>
            )}
            <div className="p-2 bg-slate-50 rounded-xl text-slate-300">
              <Maximize2 size={20} />
            </div>
          </div>
        </div>
        
        {/* The fix: ensuring a stable flex child with min dimensions for Recharts */}
        <div className="flex-1 min-w-0 min-h-0 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData} 
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
              onMouseDown={(e) => e && setRefAreaLeft(e.activeLabel || '')}
              onMouseMove={(e) => refAreaLeft && setRefAreaRight(e.activeLabel || '')}
              onMouseUp={zoom}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                domain={[left, right]}
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                dy={15}
                allowDataOverflow={true}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} 
                tickFormatter={(value) => `$${value}`}
                allowDataOverflow={true}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }} 
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                height={40} 
                iconType="circle" 
                wrapperStyle={{ paddingBottom: '20px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }} 
              />
              <Line 
                type="monotone" 
                dataKey="Net Cost" 
                stroke="#64748b" 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} 
                activeDot={{ r: 7 }} 
                animationDuration={300}
              />
              <Line 
                type="monotone" 
                dataKey="Selling Price" 
                stroke="#d10000" 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} 
                activeDot={{ r: 7 }} 
                animationDuration={300}
              />
              <Line 
                type="monotone" 
                dataKey="Market Median" 
                stroke="#10b981" 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} 
                activeDot={{ r: 7 }} 
                animationDuration={300}
              />
              <Line 
                type="monotone" 
                dataKey="Final Price" 
                stroke="#f59e0b" 
                strokeWidth={4} 
                strokeDasharray="8 8" 
                dot={false}
                animationDuration={300}
              />
              
              {refAreaLeft && refAreaRight ? (
                <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} fill="#d10000" fillOpacity={0.1} />
              ) : null}
              
              <Brush 
                dataKey="name" 
                height={40} 
                stroke="#e2e8f0"
                fill="#fff"
                gap={5}
                travellerWidth={10}
                className="mt-8"
              >
                <LineChart>
                  <Line type="monotone" dataKey="Selling Price" stroke="#d10000" dot={false} strokeWidth={2} />
                </LineChart>
              </Brush>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderSingleAnalysis = () => {
    const tour = selectedData[0];
    const barData = [
      { name: 'Direct Cost', value: tour.netCost, color: '#64748b' },
      { name: 'Tripventura Price', value: tour.sellingPrice, color: '#d10000' },
      { name: 'Market Average', value: tour.medianMarketPrice, color: '#10b981' },
      { name: 'Suggested Retail', value: tour.finalCustomerPrice, color: '#f59e0b' },
    ];

    const marketGap = tour.medianMarketPrice - tour.sellingPrice;
    const isUnderMarket = marketGap > 0;
    const absoluteProfit = tour.sellingPrice - tour.netCost;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm relative overflow-hidden min-h-[500px] flex flex-col">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Compass size={180} />
            </div>
            <div className="flex justify-between items-start mb-10 shrink-0">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tour Pricing DNA</h2>
                <p className="text-sm text-slate-500 font-medium">Detailed financial breakdown for {tour.tourName}</p>
              </div>
              <div className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black tracking-widest uppercase z-10">
                {tour.productCode}
              </div>
            </div>
            
            <div className="flex-1 min-w-0 min-h-[320px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 60, right: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 800, fontSize: 11, textTransform: 'uppercase' }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(v: any) => formatCurrency(v)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={44}>
                    {barData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm flex-1 relative overflow-hidden group min-h-[240px]">
              <div className="absolute -right-4 -bottom-4 text-red-50 opacity-0 group-hover:opacity-100 transition-opacity">
                <TrendingUp size={120} />
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl shadow-sm">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-black text-slate-900 tracking-tight uppercase text-xs">Profitability Engine</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Unit Margin</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">{formatCurrency(absoluteProfit)}</p>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-red-600 h-full rounded-full" style={{ width: `${(absoluteProfit / tour.sellingPrice) * 100}%` }} />
                </div>
                <p className="text-xs text-slate-500 font-bold tracking-tight">
                  Maintaining a healthy <span className="text-red-600 font-black">{tour.profitPercent}%</span> margin.
                </p>
              </div>
            </div>

            <div className={`rounded-[2rem] border p-8 shadow-sm flex-1 transition-all min-h-[240px] ${isUnderMarket ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-2xl shadow-sm ${isUnderMarket ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  {isUnderMarket ? <Award className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                </div>
                <h3 className="font-black text-slate-900 tracking-tight uppercase text-xs">Strategic Rank</h3>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Market Difference</p>
                <div className="flex items-center gap-2">
                  <p className={`text-3xl font-black tracking-tighter ${isUnderMarket ? 'text-emerald-700' : 'text-red-700'}`}>
                    {formatCurrency(Math.abs(marketGap))}
                  </p>
                  {isUnderMarket ? <ArrowDownRight className="w-6 h-6 text-emerald-500" /> : <ArrowUpRight className="w-6 h-6 text-red-500" />}
                </div>
                <p className="text-xs font-bold leading-relaxed mt-4 text-slate-700">
                  {isUnderMarket 
                    ? `Currently priced ${formatCurrency(marketGap)} under median. Elite market attraction.` 
                    : `Premium positioning at ${formatCurrency(Math.abs(marketGap))} above median.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return selectedData.length === 1 ? renderSingleAnalysis() : renderMultiChart();
};

export default PriceChart;
