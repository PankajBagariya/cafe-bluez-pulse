export interface SalesRecord {
  date: string;
  time: string;
  itemName: string;
  quantity: number;
  price: number;
  paymentType: 'UPI' | 'Cash';
  staffName: string;
}

export interface InventoryItem {
  itemName: string;
  stockLeft: number;
  reorderThreshold: number;
}

export interface AttendanceRecord {
  staffName: string;
  date: string;
  timeIn: string;
  timeOut: string;
}

export interface FeedbackRecord {
  date: string;
  rating: number;
  feedback: string;
}

export interface DashboardData {
  salesLog: SalesRecord[];
  inventory: InventoryItem[];
  attendance: AttendanceRecord[];
  feedback: FeedbackRecord[];
  lastUpdated: Date;
}