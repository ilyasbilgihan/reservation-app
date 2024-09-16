import { Link, Redirect, router, useFocusEffect } from 'expo-router';

import { Text } from '~/components/ui/text';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { supabase } from '~/utils/supabase';

import { getNetworkStateAsync } from 'expo-network';
import { useCallback, useEffect, useState } from 'react';
import { useGlobalContext } from '~/context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';

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
  const testDB = async () => {
    /* const { data, error } = await supabase.from('profile').select().eq('id', session?.user.id); */
    /* const { data, error } = await supabase
      .from('branch')
      .upsert({
        name: 'test',
        phone: '1234',
        city: 'istanbul',
        country: 'turkey',
        thumbnail: 'test.jpg',
        reservation_period: '120',
        owner_id: session?.user.id,
        sectore: 'Rental',
      })
      .select('*'); */

    const { data: branch } = await supabase.from('branch').select('*');

    /* const { data, error } = await supabase
      .from('service')
      .upsert({
        branch_id: branch.id,
        name: 'insurance',
        price: '100',
        time_span: 0,
      })
      .select('*'); */
    /* const { data, error } = await supabase
      .from('working_hour')
      .upsert({
        branch_id: branch.id,
        day: 'Monday',
        opening: '10:00',
        closing: '18:00',
      })
      .select('*'); */

    /* const { data, error } = await supabase
      .from('asset')
      .upsert({
        branch_id: branch.id,
        name: 'Peugeot 408 (34 UA 34)',
        price: '100000',
      })
      .select('*'); */

    /* prevent adding reservations at intersecting times*/
    const { data, error } = await supabase
      .from('reservation')
      .upsert({
        branch_id: branch![0]?.id,
        asset_id: 1,
        customer_id: session?.user.id,
        start_date: '2024-09-12T03:00:00.000Z',
        end_date: '2024-09-12T06:00:00.000Z',
      })
      .select('*');

    /* const { data, error } = await supabase.from('service').select('*'); */
    setData(error || data);
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => supabase.auth.signOut()}>
        <Text className="text-red-500">Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={testDB}>
        <Text className="text-4xl text-purple-500">Test DB</Text>
      </TouchableOpacity>
      <Text>{JSON.stringify(data, null, 2)}</Text>
    </SafeAreaView>
  );
}
