import { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import { DashboardData, SalesRecord, InventoryItem, AttendanceRecord, FeedbackRecord } from '../types/cafe';

const SPREADSHEET_ID = '1uHdxui32Vb9W7JSxnbxVB35VwqAk0ex2gQpQhCzLYH0';
const REFRESH_INTERVAL = 60000; // 60 seconds

// Sheet GIDs - using 0 for now, will get correct GIDs from sheet structure
const SHEET_GIDS = {
  salesLog: '0',        // First sheet (working)
  inventory: '0',       // Use same for now until we get correct GIDs
  attendance: '0',      // Use same for now until we get correct GIDs
  feedback: '0'         // Use same for now until we get correct GIDs
};

const buildCSVUrl = (gid: string) => 
  `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;

export const useCafeData = () => {
  const [data, setData] = useState<DashboardData>({
    salesLog: [],
    inventory: [],
    attendance: [],
    feedback: [],
    lastUpdated: new Date()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parseSalesData = (csvData: string): SalesRecord[] => {
    const result = Papa.parse(csvData, { header: true, skipEmptyLines: true });
    return result.data.map((row: any) => ({
      date: row['Date'] || '',
      time: row['Time'] || '',
      itemName: row['Item Name'] || '',
      quantity: parseInt(row['Quantity']) || 0,
      price: parseFloat(row['Price (₹)']) || 0,
      paymentType: row['Payment Type'] as 'UPI' | 'Cash' || 'Cash',
      staffName: row['Staff Name'] || ''
    })).filter(record => record.date && record.itemName);
  };

  const parseInventoryData = (csvData: string): InventoryItem[] => {
    const result = Papa.parse(csvData, { header: true, skipEmptyLines: true });
    return result.data.map((row: any) => ({
      itemName: row['Item Name'] || '',
      stockLeft: parseInt(row['Stock Left']) || 0,
      reorderThreshold: parseInt(row['Reorder Threshold']) || 0
    })).filter(item => item.itemName);
  };

  const parseAttendanceData = (csvData: string): AttendanceRecord[] => {
    const result = Papa.parse(csvData, { header: true, skipEmptyLines: true });
    return result.data.map((row: any) => ({
      staffName: row['Staff Name'] || '',
      date: row['Date'] || '',
      timeIn: row['Time In'] || '',
      timeOut: row['Time Out'] || ''
    })).filter(record => record.staffName && record.date);
  };

  const parseFeedbackData = (csvData: string): FeedbackRecord[] => {
    const result = Papa.parse(csvData, { header: true, skipEmptyLines: true });
    return result.data.map((row: any) => ({
      date: row['Date'] || '',
      rating: parseInt(row['Rating']) || 0,
      feedback: row['Feedback'] || ''
    })).filter(record => record.date && record.rating);
  };

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      
      // For now, only fetch sales data since other sheet GIDs are incorrect
      // Once the correct GIDs are determined, we can fetch all sheets
      const salesResponse = await fetch(buildCSVUrl(SHEET_GIDS.salesLog));
      const salesCSV = await salesResponse.text();

      const newData: DashboardData = {
        salesLog: parseSalesData(salesCSV),
        inventory: [
          { itemName: 'Coffee Beans', stockLeft: 15, reorderThreshold: 20 },
          { itemName: 'Burger Buns', stockLeft: 25, reorderThreshold: 10 }
        ],
        attendance: [
          { staffName: 'Ram', date: '2025-07-31', timeIn: '09:00', timeOut: '18:00' },
          { staffName: 'Geeta', date: '2025-07-31', timeIn: '10:00', timeOut: '19:00' }
        ],
        feedback: [
          { date: '2025-07-31', rating: 5, feedback: 'Excellent service and food!' },
          { date: '2025-07-30', rating: 4, feedback: 'Good food, quick service' }
        ],
        lastUpdated: new Date()
      };

      setData(newData);
    } catch (err) {
      console.error('Error fetching cafe data:', err);
      setError('Failed to fetch data. Please check your connection.');
      
      // Fallback demo data for development
      const demoData: DashboardData = {
        salesLog: [
          {
            date: '2025-07-31',
            time: '11:30',
            itemName: 'Veg Burger',
            quantity: 2,
            price: 33,
            paymentType: 'UPI',
            staffName: 'Ram'
          },
          {
            date: '2025-07-31',
            time: '13:15',
            itemName: 'Coffee',
            quantity: 4,
            price: 40,
            paymentType: 'Cash',
            staffName: 'Geeta'
          }
        ],
        inventory: [
          { itemName: 'Coffee Beans', stockLeft: 15, reorderThreshold: 20 },
          { itemName: 'Burger Buns', stockLeft: 25, reorderThreshold: 10 }
        ],
        attendance: [
          { staffName: 'Ram', date: '2025-07-31', timeIn: '09:00', timeOut: '18:00' },
          { staffName: 'Geeta', date: '2025-07-31', timeIn: '10:00', timeOut: '19:00' }
        ],
        feedback: [
          { date: '2025-07-31', rating: 5, feedback: 'Excellent service and food!' },
          { date: '2025-07-30', rating: 4, feedback: 'Good food, quick service' }
        ],
        lastUpdated: new Date()
      };
      setData(demoData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};