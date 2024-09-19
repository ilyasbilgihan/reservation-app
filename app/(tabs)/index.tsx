import { Link, Redirect, router, useFocusEffect } from 'expo-router';

import { Text } from '~/components/ui/text';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { supabase } from '~/utils/supabase';

import { getNetworkStateAsync } from 'expo-network';
import { useCallback, useEffect, useState } from 'react';
import { useGlobalContext } from '~/context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const { session, branch } = useGlobalContext();

  useEffect(() => {
    (async () => {
      const networkState = await getNetworkStateAsync();
      if (!networkState.isConnected) {
        router.replace('/auth');
      }
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (branch) {
        router.replace('/branch');
      }
    }, [branch])
  );

  const [data, setData] = useState<any>(null);

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => supabase.auth.signOut()}>
        <Text className="text-red-500">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
