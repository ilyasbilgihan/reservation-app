import { useCallback, useEffect, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';

import { router, useFocusEffect } from 'expo-router';
import { getNetworkStateAsync } from 'expo-network';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeInDown, FadeInLeft, FadeInRight, FadeInUp } from 'react-native-reanimated';

import { useGlobalContext } from '~/context/GlobalProvider';
import { supabase } from '~/lib/supabase';
import { getSectorItem } from '~/lib/utils/getLabels';

import { Text } from '~/components/ui/text';
import { Iconify } from '~/lib/icons/Iconify';

import LocationPicker from '~/components/LocationPicker';

const SECTORS = ['Grooming', 'Accommodation', 'Rental', 'Food'];

import ListBranches from '~/components/ListBranches';

export default function Home() {
  const { session, setSession, branch, location, setLocation } = useGlobalContext();
  const [profile, setProfile] = useState<any>({});
  const [selectedSector, setSelectedSector] = useState<string>('Grooming');
  const [branches, setBranches] = useState<any>([]);

  useEffect(() => {
    (async () => {
      const networkState = await getNetworkStateAsync();
      if (!networkState.isConnected) {
        setSession(null);
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
    }, [location, selectedSector])
  );

  useFocusEffect(
    useCallback(() => {
      fetchUserDetails();
    }, [])
  );

  const fetchUserDetails = async () => {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('id', session?.user.id)
      .single();

    if (error) {
      console.log('error', error);
    } else {
      setProfile(data);
    }
  };

  const fetchBranches = async () => {
    if (!location?.latitude || !location?.longitude) {
      setBranches([]);
      return;
    }
    const { data, error } = await supabase
      .rpc('nearby_branches', {
        lat: location?.latitude,
        long: location?.longitude,
      })
      .eq('sector', selectedSector)
      .select('*, working_hour(*), rating:reservation!id(rating.avg())')
      .limit(5);

    if (error) {
    } else {
      setBranches(data);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="mx-7 flex-row items-center justify-between pt-7">
          <Animated.View
            entering={FadeInLeft.duration(500)}
            className="flex-1 flex-row items-center gap-2 pr-2">
            <Image
              source={profile?.avatar ? { uri: profile?.avatar } : require('~/assets/no-image.png')}
              className="h-14 w-14 rounded-2xl border border-input bg-white"
            />
            <View className="flex-1 justify-between">
              <Text>Hoşgeldin,</Text>
              <Text numberOfLines={1} className="font-qs-semibold text-lg">
                {profile?.full_name || "Bilinmeyen Kullanıcı"}
              </Text>
            </View>
          </Animated.View>
          <LocationPicker
            defaultRegion={location}
            onLocationSelect={(location: any) => {
              setLocation(location);
            }}>
            <Animated.View
              entering={FadeInRight.duration(500)}
              className="h-12 flex-row items-center gap-2 rounded-xl border border-input bg-background px-4">
              <Iconify icon="solar:map-point-bold-duotone" size={24} className="text-primary" />
              {location?.label ? (
                <Text className="font-qs-semibold text-slate-500">{location.label}</Text>
              ) : null}
            </Animated.View>
          </LocationPicker>
        </View>
        <Animated.View entering={FadeInUp.duration(500)}>
          <Text className="px-7 pb-3.5 pt-14 font-qs-medium text-4xl ">
            Hangi{' '}
            <Text className="bg-violet-200 font-qs-semibold text-4xl leading-3">sektörde</Text>{' '}
            <Text className="bg-amber-200 font-qs-semibold text-4xl leading-3">rezervasyona</Text>{' '}
            ihtiyacın var?
          </Text>
        </Animated.View>
        <Animated.FlatList
          entering={FadeInDown.duration(500)}
          data={SECTORS}
          contentContainerStyle={{
            paddingHorizontal: 24,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => setSelectedSector(item)}
              className={`${selectedSector == item ? 'bg-primary' : 'bg-background'} items-center justify-center rounded-xl border border-input px-3.5 py-2.5`}>
              <View className="flex-row items-center gap-3.5">
                {getSectorItem(item)?.icon(
                  selectedSector == item ? 'rgb(237 233 254)' : 'rgb(148 163 184)'
                )}
                <Text
                  style={{ lineHeight: 18 }}
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
        <ListBranches branches={branches} />
      </ScrollView>
    </SafeAreaView>
  );
}
