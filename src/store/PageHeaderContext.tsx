import { createContext, useContext, useState, type ReactNode } from 'react';

interface PageHeader { title: string; subtitle?: string; showBack?: boolean; }
interface PageHeaderContextType {
  header: PageHeader | null;
  setHeader: (h: PageHeader | null) => void;
}

const PageHeaderContext = createContext<PageHeaderContextType>({ header: null, setHeader: () => {} });

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [header, setHeader] = useState<PageHeader | null>(null);
  return <PageHeaderContext.Provider value={{ header, setHeader }}>{children}</PageHeaderContext.Provider>;
}

export function usePageHeader() { return useContext(PageHeaderContext); }
