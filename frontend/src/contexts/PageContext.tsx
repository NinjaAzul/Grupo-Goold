'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface PageContextType {
  title: string;
  description?: string;
  setPageInfo: (title: string, description?: string) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export function PageProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState<string | undefined>(undefined);

  const setPageInfo = (newTitle: string, newDescription?: string) => {
    setTitle(newTitle);
    setDescription(newDescription);
  };

  return (
    <PageContext.Provider value={{ title, description, setPageInfo }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePage() {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error('usePage must be used within a PageProvider');
  }
  return context;
}

