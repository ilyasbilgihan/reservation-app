import React, { PropsWithChildren, useContext, useEffect, useState } from 'react';

import { Session } from '@supabase/supabase-js';
import { supabase } from '~/utils/supabase';
import { getItem, setItem } from '~/core/storage';

type Location = {
  latitude: number;
  longitude: number;
  label: string;
};

export interface GlobalContextValue {
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
  branch: any;
  setBranch: React.Dispatch<React.SetStateAction<any>>;
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
}

const GlobalContext = React.createContext<GlobalContextValue>({} as GlobalContextValue);

export const GlobalProvider: React.FC<PropsWithChildren> = (props) => {
  const [session, setSession] = useState<Session | null>(null);
  const [branch, setBranch] = useState<any>(null);
  const [location, setLocation] = useState<Location>({
    latitude: 37.782,
    longitude: 29.097,
    label: 'Konum Seçilmedi',
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('get session', session);
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      console.log('auth change', session);
      setSession(session);
    });

    (async () => {
      const branchId = await getItem('branch');
      if (branchId) setBranch(branchId);
    })();
  }, []);

  useEffect(() => {
    setItem('branch', branch);
  }, [branch]);

  return (
    <GlobalContext.Provider
      value={{
        session,
        setSession,
        branch,
        setBranch,
        location,
        setLocation,
      }}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error('useSomeContext must be used within SomeProvider');
  return ctx;
};
