// Añade esta directiva al inicio del archivo
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getContactData } from '../lib/supabaseContactService';

// Crea el contexto
const ContactContext = createContext();

export function ContactProvider({ children }) {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContactData() {
      const data = await getContactData();
      setContactInfo(data);
      setLoading(false);
    }
    
    loadContactData();
  }, []);

  return (
    <ContactContext.Provider value={{ contactInfo, loading }}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContact() {
  const context = useContext(ContactContext);
  
  if (context === undefined) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  
  return context;
}