'use client'
import { createContext, useContext, useState } from 'react';

type FilterPanelContextType = {
  isSidebarOpen: boolean | undefined;
  toggleSidebar: (open: boolean) => void;
};

const FilterPanelContext = createContext<FilterPanelContextType | undefined>(undefined);

export function FilterPanelProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean | undefined>(undefined);

  const toggleSidebar = (open: boolean) => {
    setIsSidebarOpen(open);
  };

  return (
    <FilterPanelContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </FilterPanelContext.Provider>
  );
}

export function useFilterPanelContext() {
  const context = useContext(FilterPanelContext);
  if (!context) {
    throw new Error('useFilterPanel must be used within a FilterPanelProvider');
  }
  return context;
}