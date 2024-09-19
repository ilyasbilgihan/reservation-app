import { useCallback, useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, FlatList, StyleSheet, Alert } from 'react-native';
import { Link, Redirect, router, useFocusEffect } from 'expo-router';
import { getNetworkStateAsync } from 'expo-network';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGlobalContext } from '~/context/GlobalProvider';
import { supabase } from '~/utils/supabase';

import { Text } from '~/components/ui/text';
import { Iconify } from '~/lib/icons/Iconify';

const SECTORS = ['Grooming', 'Accommodation', 'Rental', 'Food'];
import { getSectorItem } from '~/utils/getLabels';

import MapView, { Marker, PROVIDER_GOOGLE, UrlTile } from 'react-native-maps';
import { Button } from '~/components/ui/button';

import * as Location from 'expo-location';
import { ScrollView } from 'react-native-gesture-handler';

export default function Home() {
  const { session, branch, location, setLocation } = useGlobalContext();
  const [selectedSector, setSelectedSector] = useState<string>('Grooming');
  const [centerPosition, setCenterPosition] = useState<any>(null);
  const [branches, setBranches] = useState<any>([]);
  const [region, setRegion] = useState<any>();

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

  const setCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission not granted', 'Please grant permission to access your location');
      return;
    }

    let live_location = await Location.getCurrentPositionAsync({});
    setLocation({
      ...location,
      longitude: live_location.coords.longitude,
      latitude: live_location.coords.latitude,
    });
    setRegion({
      latitude: live_location.coords.latitude,
      longitude: live_location.coords.longitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    });
  };

  const fetchBranches = async (lat: any, long: any) => {
    const { data, error } = await supabase.rpc('nearby_branches', {
      lat,
      long,
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
          <TouchableOpacity activeOpacity={0.75} onPress={setCurrentLocation}>
            <View className="h-12 flex-row items-center gap-2 rounded-xl border border-neutral-100 bg-white px-4">
              <Iconify icon="solar:map-point-bold-duotone" size={24} className="text-primary" />
              <Text className="font-qs-semibold text-slate-500">{location.label}</Text>
            </View>
          </TouchableOpacity>
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
          <Text>{JSON.stringify(centerPosition, null, 2)}</Text>
          <View className="aspect-square w-full">
            {location ? (
              <MapView
                showsCompass
                showsUserLocation
                initialRegion={{
                  latitude: location?.latitude,
                  longitude: location?.longitude,
                  latitudeDelta: 0.08,
                  longitudeDelta: 0.08,
                }}
                region={region}
                onRegionChangeComplete={(region) => setCenterPosition(region)}
                style={styles.map}
              />
            ) : null}
          </View>
        </View>
        <View className="px-7">
          <Button
            onPress={() => {
              fetchBranches(centerPosition?.latitude, centerPosition?.longitude);
            }}>
            <Text>Get nearby branches</Text>
          </Button>
          <Text>{JSON.stringify(branches, null, 2)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
