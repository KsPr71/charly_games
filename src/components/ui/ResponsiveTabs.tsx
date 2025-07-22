'use client';

import { useState, useEffect, Children, isValidElement } from 'react';
import {
  Tabs as ShadTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ResponsiveTabs({
  defaultValue,
  tabs,
  children,
}: {
  defaultValue: string;
  tabs: { value: string; label: string; icon?: React.ReactNode }[];
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedTab, setSelectedTab] = useState(defaultValue);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Verificar al montar
    checkIfMobile();
    
    // Escuchar cambios de tamaño
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="space-y-4">
        <Select value={selectedTab} onValueChange={setSelectedTab}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar sección" />
          </SelectTrigger>
          <SelectContent>
            {tabs.map((tab) => (
              <SelectItem key={tab.value} value={tab.value}>
                <div className="flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {Children.map(children, (child) => {
            if (isValidElement(child) && child.props.value === selectedTab) {
              return child;
            }
            return null;
          })}
        </div>
      </div>
    );
  }

  return (
    <ShadTabs defaultValue={defaultValue} className="w-full">
      <TabsList className="bg-transparent mb-6 p-0 gap-2">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="
              relative px-4 py-2 rounded-lg text-sm font-medium
              bg-white text-gray-700 shadow-sm border border-gray-200
              hover:bg-gray-50 hover:text-gray-900 transition-all
              data-[state=active]:bg-fuchsia-600 data-[state=active]:text-white
              data-[state=active]:border-fuchsia-600 data-[state=active]:shadow-md
              group
            "
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-transparent group-data-[state=active]:bg-fuchsia-300 transition-all" />
          </TabsTrigger>
        ))}
      </TabsList>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {children}
      </div>
    </ShadTabs>
  );
}