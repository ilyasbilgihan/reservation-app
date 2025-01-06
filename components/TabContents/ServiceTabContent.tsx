import React, { useCallback, useRef, useState } from 'react';
import { View, TouchableOpacity, Alert, Dimensions } from 'react-native';

import { useFocusEffect } from 'expo-router';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { RefreshControl, ScrollView, Swipeable } from 'react-native-gesture-handler';

import { useGlobalContext } from '~/context/GlobalProvider';
import { supabase } from '~/utils/supabase';

import { Iconify } from '~/lib/icons/Iconify';
import { Text } from '../ui/text';

import ServiceFormBottomSheet from '../BottomSheetComponents/ServiceForm';

const SCREEN_WIDTH = Dimensions.get('window').width;

const ServiceTabContent = () => {
  const { branch } = useGlobalContext();
  const [services, setServices] = useState<any>([]);
  const serviceModalRef = useRef<BottomSheetModal>(null);
  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, [branch?.id])
  );

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('service')
      .select('*')
      .eq('branch_id', branch?.id)
      .order('id');
    if (error) {
      Alert.alert(error.message);
      console.log(error);
    } else {
      setServices(data);
    }
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View className="flex-row justify-between p-7">
        <Text className="font-qs-semibold text-2xl">Şube Hizmetlerim</Text>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            serviceModalRef.current?.present();
          }}>
          <Iconify icon="solar:add-circle-line-duotone" size={32} className=" text-slate-400" />
        </TouchableOpacity>
        <ServiceFormBottomSheet
          ref={serviceModalRef}
          onCreate={() => {
            fetchServices();
            serviceModalRef.current?.dismiss();
          }}
        />
      </View>
      {services.length > 0 ? (
        <View className="gap-4 pb-7">
          {services?.map((item: any) => (
            <SwipeableItem key={item.id} service={item} fetchServices={fetchServices} />
          ))}
        </View>
      ) : (
        <View className="items-center gap-4 py-7">
          <Iconify icon="solar:ghost-bold-duotone" size={48} className="text-slate-400" />
          <View className="items-center">
            <Text className="text-muted-foreground">Henüz bir hizmet eklememişsiniz.</Text>
            <Text className="text-muted-foreground">
              Eklemek isterseniz sağ üstteki artı butonuna tıklayınız.
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const SwipeableItem = ({ service, fetchServices }: any) => {
  const handleActivateService = async () => {
    const { error } = await supabase.from('service').update({ active: true }).eq('id', service.id);
    if (!error) {
      await fetchServices();
    }
    ref.current?.close();
  };
  const handleDeactivateService = async () => {
    const { error } = await supabase.from('service').update({ active: false }).eq('id', service.id);
    if (!error) {
      await fetchServices();
    }
    ref.current?.close();
  };

  const ref = useRef<Swipeable>(null);
  const serviceModalRef = useRef<BottomSheetModal>(null);

  return (
    <>
      <Swipeable
        ref={ref}
        leftThreshold={100}
        rightThreshold={100}
        containerStyle={{ paddingHorizontal: 28 }}
        key={service.id}
        renderLeftActions={() => {
          return (
            <View
              style={{ width: (SCREEN_WIDTH - 56) / 3 - 28 }}
              className="ml-7 flex-row items-center justify-end">
              <Text className="text-emerald-400">Aktifleştir</Text>
            </View>
          );
        }}
        renderRightActions={() => {
          return (
            <View
              style={{ width: (SCREEN_WIDTH - 56) / 3 - 28 }}
              className="mr-7 flex-row items-center justify-start">
              <Text className="text-rose-400 ">Pasifleştir</Text>
            </View>
          );
        }}
        onSwipeableWillOpen={(direction) => {
          if (direction === 'left') {
            handleActivateService();
          } else {
            handleDeactivateService();
          }
        }}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            serviceModalRef.current?.present();
          }}>
          <View
            style={{
              backgroundColor: service?.active ? 'rgb(236 253 245)' : 'rgb(255 241 242)',
            }}
            className="flex-row rounded-xl p-4">
            <Text className="text-lg">{service.name}</Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
      <ServiceFormBottomSheet
        ref={serviceModalRef}
        service={service}
        onCreate={() => {
          fetchServices();
          serviceModalRef.current?.dismiss();
        }}
      />
    </>
  );
};

export default ServiceTabContent;
