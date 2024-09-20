import React, { PropsWithChildren, useContext, useEffect, useState } from 'react';

import { Session } from '@supabase/supabase-js';
import { supabase } from '~/utils/supabase';
import { getItem, setItem } from '~/core/storage';

type Location = {
  latitude: number | null;
  longitude: number | null;
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
    latitude: null,
    longitude: null,
    label: 'Konum Seçilmedi',
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    (async () => {
      const branchId = await getItem('branch');
      if (branchId) setBranch(branchId);

      const loc = await getItem('location');
      console.log('loc from storage', loc);
      if (loc) setLocation(loc);
    })();
  }, []);

  useEffect(() => {
    setItem('branch', branch);
  }, [branch]);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      setItem('location', location);
    }
  }, [location]);

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
