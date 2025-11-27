import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface MaintenanceContextType {
  isMaintenanceMode: boolean;
  setIsMaintenanceMode: (enabled: boolean) => void;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: React.ReactNode }) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const { user } = useAuth();

  // Check for maintenance mode on component mount
  useEffect(() => {
    const checkMaintenanceMode = () => {
      // Check localStorage for maintenance mode setting
      const maintenanceMode = localStorage.getItem('maintenanceMode') === 'true';
      setIsMaintenanceMode(maintenanceMode);
    };

    checkMaintenanceMode();

    // Listen for storage events to sync maintenance mode across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'maintenanceMode') {
        setIsMaintenanceMode(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setMaintenanceMode = (enabled: boolean) => {
    setIsMaintenanceMode(enabled);
    localStorage.setItem('maintenanceMode', enabled.toString());
    
    // Dispatch storage event to sync across tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'maintenanceMode',
      oldValue: (!enabled).toString(),
      newValue: enabled.toString()
    }));
  };

  return (
    <MaintenanceContext.Provider value={{ 
      isMaintenanceMode, 
      setIsMaintenanceMode: setMaintenanceMode 
    }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useMaintenance must be used within MaintenanceProvider');
  }
  return context;
}

// Maintenance Page Component
export function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8 text-center border border-gray-700">
        <div className="mb-6">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Site Under Maintenance</h1>
        <p className="text-gray-300 mb-6">
          We're currently performing scheduled maintenance to improve your experience. 
          We'll be back online shortly.
        </p>
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <p className="text-yellow-400 font-semibold">Estimated Time:</p>
          <p className="text-white">30 minutes</p>
        </div>
        <p className="text-gray-400 text-sm">
          Thank you for your patience.
        </p>
      </div>
    </div>
  );
}