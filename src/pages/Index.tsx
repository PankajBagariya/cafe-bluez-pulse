import { useCafeData } from '../hooks/useCafeData';
import { DashboardHeader } from '../components/DashboardHeader';
import { SummaryCards } from '../components/SummaryCards';
import { LiveSalesTable } from '../components/LiveSalesTable';
import { SalesChart } from '../components/SalesChart';
import { InventorySection } from '../components/InventorySection';
import { AttendanceSection } from '../components/AttendanceSection';
import { FeedbackSection } from '../components/FeedbackSection';
import { Chatbot } from '../components/Chatbot';

const Index = () => {
  const { data, loading, error, refetch } = useCafeData();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-xl font-semibold text-primary">Loading Cafe Dashboard...</h2>
          <p className="text-muted-foreground">Fetching real-time data from Google Sheets</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <DashboardHeader 
          lastUpdated={data.lastUpdated}
          isLoading={loading}
          error={error}
          onRefresh={refetch}
        />
        
        <SummaryCards data={data} />
        
        <SalesChart data={data} />
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <LiveSalesTable data={data} />
          <InventorySection data={data} />
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <AttendanceSection data={data} />
          <div>
            <FeedbackSection data={data} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>Cafe Bluez Dashboard • Real-time updates every 60 seconds</p>
          <p className="mt-1">Built with ❤️ for efficient cafe management</p>
        </footer>
      </div>
      
      {/* Chatbot */}
      <Chatbot data={data} />
    </div>
  );
};

export default Index;