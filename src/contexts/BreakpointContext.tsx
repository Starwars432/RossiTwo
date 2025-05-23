import React, { createContext, useContext, useState } from 'react';
import { Breakpoint } from '../lib/types/editor';

interface BreakpointContextType {
  breakpoint: Breakpoint;
  setBreakpoint: (breakpoint: Breakpoint) => void;
}

const BreakpointContext = createContext<BreakpointContextType>({
  breakpoint: 'desktop',
  setBreakpoint: () => {},
});

export const useBreakpoint = () => {
  const context = useContext(BreakpointContext);
  if (!context) {
    throw new Error('useBreakpoint must be used within a BreakpointProvider');
  }
  return context;
};

export const BreakpointProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');

  return (
    <BreakpointContext.Provider value={{ breakpoint, setBreakpoint }}>
      {children}
    </BreakpointContext.Provider>
  );
};