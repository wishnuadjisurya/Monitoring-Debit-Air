import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { Companies } from '@/components/Companies';
import { Monitoring } from '@/components/Monitoring';
import { Reports } from '@/components/Reports';
import { Map } from '@/components/Map';
import { Alerts } from '@/components/Alerts';
import { Settings } from '@/components/Settings';
import { Toaster } from '@/components/ui/sonner';

type ViewType = 'dashboard' | 'companies' | 'monitoring' | 'reports' | 'map' | 'alerts' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>(undefined);

  const handleViewChange = (view: string, companyId?: string) => {
    setCurrentView(view as ViewType);
    if (companyId) {
      setSelectedCompanyId(companyId);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'companies':
        return <Companies onViewChange={handleViewChange} />;
      case 'monitoring':
        return <Monitoring selectedCompanyId={selectedCompanyId} />;
      case 'reports':
        return <Reports selectedCompanyId={selectedCompanyId} />;
      case 'map':
        return <Map />;
      case 'alerts':
        return <Alerts />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderContent()}
      <Toaster />
    </Layout>
  );
}

export default App;
