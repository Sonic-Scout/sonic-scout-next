"use client";

import React, { createContext, useContext, useState } from 'react';

// Create the context
const TutorialContext = createContext(undefined);

// Provider component
export function TutorialProvider({ children }) {
  const [isOpenTutorial, setIsOpenTutorial] = useState(false);

  const openTutorial = () => setIsOpenTutorial(true);
  const closeTutorial = () => setIsOpenTutorial(false);

  const value = {
    isOpenTutorial,
    openTutorial,
    closeTutorial
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
}

// Custom hook for accessing the context
export function useTutorial() {
  const context = useContext(TutorialContext);
  
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  
  return context;
}
