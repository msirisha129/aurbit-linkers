import { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';
import { fallbackCategories } from '../data/services';

const ServicesContext = createContext(null);

export function ServicesProvider({ children }) {
  const [categories, setCategories] = useState(fallbackCategories);
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get('/services')
      .then(({ data }) => {
        if (active && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
          setUsingFallback(false);
        }
      })
      .catch(() => {
        // Keep fallback data — backend/DB may not be running yet
        if (active) setUsingFallback(true);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <ServicesContext.Provider value={{ categories, usingFallback }}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const ctx = useContext(ServicesContext);
  if (!ctx) throw new Error('useServices must be used within ServicesProvider');
  return ctx;
}
