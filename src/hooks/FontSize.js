import React, { createContext, useContext, useState, useEffect } from 'react';

const FontSize = createContext();

export const FontSizeProvider = ({ children }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', scale);
  }, [scale]);

  const toggleSize = () => setScale(prev => (prev === 1 ? 1.25 : 1));
  const isLarge = scale === 1.25;

  return (
    <FontSize.Provider value={{ scale, toggleSize, isLarge }}>
      {children}
    </FontSize.Provider>
  );
};

export const useFontSize = () => useContext(FontSize);