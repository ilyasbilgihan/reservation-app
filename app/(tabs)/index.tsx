import { Link, router } from 'expo-router';

import * as React from 'react';
import { Text } from '~/components/ui/text';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { supabase } from '~/utils/supabase';

import { getNetworkStateAsync } from 'expo-network';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    (async () => {
      const networkState = await getNetworkStateAsync();
      if (!networkState.isConnected) {
        router.replace('/auth');
      }
    })();
  }, []);

  return (
    <>
      <Link href="/(other)/test" className="text-red-500">
        asdasd
      </Link>
      <TouchableOpacity onPress={() => supabase.auth.signOut()}>
        <Text className="text-red-500">Logout</Text>
      </TouchableOpacity>
    </>
  );
}
