"use client";

import React, { createContext, useContext, useState } from 'react';

// Create the context
const ExploreContext = createContext(undefined);

// Provider component
export function ExploreProvider({ children }) {
  const [isOpenExplore, setIsOpenExplore] = useState(false);

  const openExplore = () => setIsOpenExplore(true);
  const closeExplore = () => setIsOpenExplore(false);

  const value = {
    isOpenExplore,
    openExplore,
    closeExplore
  };

  return (
    <ExploreContext.Provider value={value}>
      {children}
    </ExploreContext.Provider>
  );
}

// Custom hook for accessing the context
export function useExplore() {
  const context = useContext(ExploreContext);
  
  if (context === undefined) {
    throw new Error('useExplore must be used within an ExploreProvider');
  }
  
  return context;
}
