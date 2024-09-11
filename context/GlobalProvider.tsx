import React, { PropsWithChildren, useContext, useEffect, useState } from 'react';

import { Session } from '@supabase/supabase-js';
import { supabase } from '~/utils/supabase';

export interface GlobalContextValue {
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
}

const GlobalContext = React.createContext<GlobalContextValue>({} as GlobalContextValue);

export const GlobalProvider: React.FC<PropsWithChildren> = (props) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('get session', session);
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      console.log('auth change', session);
      setSession(session);
    });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        session,
        setSession,
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
