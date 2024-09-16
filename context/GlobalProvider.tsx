import React, { PropsWithChildren, useContext, useEffect, useState } from 'react';

import { Session } from '@supabase/supabase-js';
import { supabase } from '~/utils/supabase';
import { getItem, setItem } from '~/core/storage';

export interface GlobalContextValue {
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
  branch: any;
  setBranch: React.Dispatch<React.SetStateAction<any>>;
}

const GlobalContext = React.createContext<GlobalContextValue>({} as GlobalContextValue);

export const GlobalProvider: React.FC<PropsWithChildren> = (props) => {
  const [session, setSession] = useState<Session | null>(null);
  const [branch, setBranch] = useState<any>(null);

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
