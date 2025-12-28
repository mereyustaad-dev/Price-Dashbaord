
export interface TourData {
  tourName: string;
  productCode: string;
  netCost: number;
  sellingPrice: number;
  profitPercent: number;
  medianMarketPrice: number;
  finalCustomerPrice: number;
}

export interface ChartDataPoint {
  name: string;
  "Net Cost": number;
  "Selling Price": number;
  "Market Median": number;
  "Final Price": number;
}
