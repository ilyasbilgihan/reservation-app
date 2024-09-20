import { useCallback, useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, FlatList } from 'react-native';

import { router, useFocusEffect } from 'expo-router';
import { getNetworkStateAsync } from 'expo-network';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

import { useGlobalContext } from '~/context/GlobalProvider';
import { supabase } from '~/utils/supabase';
import { getSectorItem } from '~/utils/getLabels';

import { Text } from '~/components/ui/text';
import { Iconify } from '~/lib/icons/Iconify';

import LocationPicker from '~/components/LocationPicker';

const SECTORS = ['Grooming', 'Accommodation', 'Rental', 'Food'];

export default function Home() {
  const { branch, location, setLocation } = useGlobalContext();
  const [selectedSector, setSelectedSector] = useState<string>('Grooming');
  const [branches, setBranches] = useState<any>([]);

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

  useFocusEffect(
    useCallback(() => {
      fetchBranches();
    }, [location])
  );

  const fetchBranches = async () => {
    if (!location?.latitude || !location?.longitude) {
      setBranches(null);
    }
    const { data, error } = await supabase.rpc('nearby_branches', {
      lat: location?.latitude,
      long: location?.longitude,
    });

    if (error) {
      console.log(error);
    } else {
      setBranches(data);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="mx-7 flex-row items-center justify-between pt-7">
          <LocationPicker
            defaultRegion={location}
            onLocationSelect={(location: any) => {
              setLocation(location);
            }}>
            <View className="h-12 flex-row items-center gap-2 rounded-xl border border-neutral-100 bg-white px-4">
              <Iconify icon="solar:map-point-bold-duotone" size={24} className="text-primary" />
              {location?.label ? (
                <Text className="font-qs-semibold text-slate-500">{location.label}</Text>
              ) : null}
            </View>
          </LocationPicker>
          <View className="overflow-hidden rounded-xl border border-neutral-100 bg-white">
            <Image source={require('~/assets/no-image.png')} className="h-12 w-12" />
          </View>
        </View>
        <FlatList
          data={SECTORS}
          contentContainerStyle={{
            paddingVertical: 14,
            paddingHorizontal: 24,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => setSelectedSector(item)}
              className={`${selectedSector == item ? 'bg-primary' : 'bg-background'} items-center justify-center rounded-xl border border-neutral-100 px-3.5 py-2.5`}>
              <View className="flex-row gap-3.5">
                {getSectorItem(item)?.icon(
                  selectedSector == item ? 'rgb(237 233 254)' : 'rgb(148 163 184)'
                )}
                <Text
                  className={`${selectedSector == item ? ' text-violet-100' : 'text-slate-400'} font-qs-semibold`}>
                  {getSectorItem(item)?.value}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ width: 7 }} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => 'sector-' + item}
          /* extraData={selectedId}  // rerender when selectedId changes */
        />
        <View className="px-7">
          <Text>{JSON.stringify(location, null, 2)}</Text>
          <Text>{JSON.stringify(branches, null, 2)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
