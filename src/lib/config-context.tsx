import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppConfig {
  searchFee: number;
  commissionRate: number;
  lowStockThreshold: number;
  maintenanceMode: boolean;
}

interface ConfigContextType {
  config: AppConfig;
  updateConfig: (newConfig: Partial<AppConfig>) => void;
}

const DEFAULT_CONFIG: AppConfig = {
  searchFee: 300,
  commissionRate: 10,
  lowStockThreshold: 50,
  maintenanceMode: false,
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('tictac_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const updateConfig = (newConfig: Partial<AppConfig>) => {
    setConfig(prev => {
      const updated = { ...prev, ...newConfig };
      localStorage.setItem('tictac_config', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
