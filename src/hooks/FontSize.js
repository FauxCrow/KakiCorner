import React, { createContext, useContext, useState, useEffect } from 'react';

const FontSize = createContext();

export const FontSizeProvider = ({ children }) => {
  const [isLarge, setIsLarge] = useState(false);

  const toggleSize = () => {
    setIsLarge(prev => {
      const nextState = !prev;
      const newScale = nextState ? 1.25 : 1;
      
      document.documentElement.style.setProperty('--font-scale', newScale);
      document.documentElement.setAttribute('data-font-size', nextState ? 'large' : 'normal');
      
      return nextState;
    });
  };

  return (
    <FontSize.Provider value={{ toggleSize, isLarge }}>
      {children}
    </FontSize.Provider>
  );
};

export const useFontSize = () => useContext(FontSize);