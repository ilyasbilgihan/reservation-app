import React, { useRef, useState } from 'react';
import { Alert, View } from 'react-native';

import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useGlobalContext } from '~/context/GlobalProvider';

import { Text } from '~/components/ui/text';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Iconify } from '~/lib/icons/Iconify';
import BottomSheet from './BottomSheet';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Button } from './ui/button';

const LocationPicker = ({ children, onLocationSelect, hideLabelInput, defaultRegion }: any) => {
  const { location } = useGlobalContext();
  const [label, setLabel] = useState('');
  const [centerPosition, setCenterPosition] = useState<any>({
    latitude: defaultRegion?.latitude || 37.77746715,
    longitude: defaultRegion?.longitude || 29.0696798,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handleOpenLocationPicker = async () => {
    bottomSheetModalRef.current?.present();
  };

  const handleLocationSelect = () => {
    onLocationSelect({
      latitude: centerPosition.latitude,
      longitude: centerPosition.longitude,
      label,
    });
    bottomSheetModalRef.current?.dismiss();
  };

  const grantAccessLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission not granted', 'Please grant permission to access your location');
      return;
    }

    let live_location = await Location.getCurrentPositionAsync({});
    setCenterPosition({
      ...centerPosition,
      longitude: live_location.coords.longitude,
      latitude: live_location.coords.latitude,
    });
  };

  return (
    <>
      <TouchableOpacity activeOpacity={0.75} onPress={handleOpenLocationPicker}>
        {children}
      </TouchableOpacity>
      <BottomSheet
        ref={bottomSheetModalRef}
        enableContentPanningGesture={false}
        snapPoints={['50%', '75%']}>
        <BottomSheetView>
          <View className="gap-7 px-7">
            <View className="flex-row items-center justify-between">
              <Text className="pt-3.5 text-2xl">Konum Belirle</Text>
              <TouchableOpacity activeOpacity={0.75} onPress={grantAccessLocation}>
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-cyan-600">
                  <Iconify icon="tabler:location-check" size={24} className="text-cyan-50" />
                </View>
              </TouchableOpacity>
            </View>
            {hideLabelInput ? null : (
              <View className="gap-1">
                <Label nativeID="name">Konum Etiketi</Label>
                <Input
                  placeholder="İş yeri, Evim, Pamukkale..."
                  value={label}
                  onChangeText={(value) => setLabel(value)}
                  aria-labelledby="name"
                  aria-errormessage="name"
                />
              </View>
            )}
            <View className="aspect-square w-full">
              {location ? (
                <MapView
                  showsCompass
                  showsUserLocation
                  initialRegion={centerPosition}
                  onRegionChangeComplete={(region) => setCenterPosition(region)}
                  style={{ width: '100%', height: '100%' }}></MapView>
              ) : null}
              <View
                style={{
                  top: '50%',
                  left: '50%',
                  transform: [{ translateX: -22 }, { translateY: -40 }],
                }}
                className="absolute h-12 w-12 items-center justify-center">
                <Iconify
                  icon="mingcute:location-fill"
                  size={40}
                  className="absolute text-rose-600"
                />
              </View>
            </View>

            <Button onPress={handleLocationSelect}>
              <Text className="text-slate-100">Bu konumu seç</Text>
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export default LocationPicker;
