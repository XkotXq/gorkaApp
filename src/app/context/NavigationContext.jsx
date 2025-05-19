import React, { createContext, useContext, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const translateX = useSharedValue(0);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <NavigationContext.Provider value={{ isOpen, setIsOpen, translateX }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = () => useContext(NavigationContext);