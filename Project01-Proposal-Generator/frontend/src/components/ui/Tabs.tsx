'use client';

import { useState, createContext, useContext, HTMLAttributes } from 'react';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({
  className = '',
  defaultValue,
  value,
  onValueChange,
  children,
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const activeTab = value ?? internalValue;

  const setActiveTab = (id: string) => {
    setInternalValue(id);
    onValueChange?.(id);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`w-full ${className}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export type TabsListProps = HTMLAttributes<HTMLDivElement>;

export function TabsList({ className = '', children, ...props }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={`
        flex items-center gap-2 p-1
        bg-[var(--color-light-surface)]
        rounded-[var(--radius-pill)]
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({ className = '', value, children, ...props }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const isActive = context.activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => context.setActiveTab(value)}
      className={`
        px-4 py-2 text-sm font-semibold
        rounded-[var(--radius-pill)]
        transition-all duration-200
        ${isActive
          ? 'bg-white text-[var(--color-near-black)] shadow-sm'
          : 'text-[var(--color-gray)] hover:text-[var(--color-near-black)]'
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({ className = '', value, children, ...props }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  if (context.activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      className={`mt-4 outline-none ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
