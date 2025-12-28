
import { TourData } from '../types';

const SHEET_ID = '1bWw0eAnIXp5SE_jeWHcNbDIJDRHkl1w36l9NFE6qZuQ';
const GID = '0';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

export const fetchTourData = async (): Promise<TourData[]> => {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) throw new Error('Failed to fetch data');
    const csvText = await response.text();
    
    // Simple CSV parser (assuming comma separated and standard rows)
    const rows = csvText.split('\n').map(row => {
      // Handle potential quoted commas
      return row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    });

    // Skip header row
    // A: Name(0), B: Code(1), E: Net(4), F: Selling(5), G: Profit(6), H: Median(7), I: Final(8)
    const data: TourData[] = rows.slice(1).map(row => {
      if (row.length < 9) return null;
      
      const cleanNum = (val: string) => {
        if (!val) return 0;
        return parseFloat(val.replace(/[$,%]/g, '').trim()) || 0;
      };

      return {
        tourName: row[0]?.replace(/"/g, '') || 'Unknown',
        productCode: row[1]?.replace(/"/g, '') || 'N/A',
        netCost: cleanNum(row[4]),
        sellingPrice: cleanNum(row[5]),
        profitPercent: cleanNum(row[6]),
        medianMarketPrice: cleanNum(row[7]),
        finalCustomerPrice: cleanNum(row[8]),
      };
    }).filter((item): item is TourData => item !== null && item.tourName !== '');

    return data;
  } catch (error) {
    console.error('Error fetching CSV:', error);
    // Fallback Mock data if fetch fails due to CORS or other reasons
    return [
      { tourName: "Everest Base Camp Trek", productCode: "TV-001", netCost: 1200, sellingPrice: 1800, profitPercent: 33, medianMarketPrice: 1750, finalCustomerPrice: 1850 },
      { tourName: "Annapurna Circuit", productCode: "TV-002", netCost: 950, sellingPrice: 1450, profitPercent: 34, medianMarketPrice: 1400, finalCustomerPrice: 1500 },
      { tourName: "Kathmandu Valley Tour", productCode: "TV-003", netCost: 400, sellingPrice: 650, profitPercent: 38, medianMarketPrice: 700, finalCustomerPrice: 680 },
      { tourName: "Pokhara Lakeside Adventure", productCode: "TV-004", netCost: 300, sellingPrice: 500, profitPercent: 40, medianMarketPrice: 480, finalCustomerPrice: 520 },
      { tourName: "Chitwan Jungle Safari", productCode: "TV-005", netCost: 550, sellingPrice: 850, profitPercent: 35, medianMarketPrice: 820, finalCustomerPrice: 880 },
    ];
  }
};
