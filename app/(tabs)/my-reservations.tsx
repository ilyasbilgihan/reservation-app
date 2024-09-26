import React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Iconify } from '~/lib/icons/Iconify';

const MyReservation = () => {
  return (
    <SafeAreaView>
      <View className="px-7">
        <View className="w-full flex-row">
          <View style={{ width: 56 }}>
            <View className="w-full">
              <View className="h-7 w-9 items-center">
                <Text className="font-qs-semibold text-sm text-primary">APR</Text>
              </View>
              <View className="w-full flex-row">
                <View className="aspect-square w-9 items-center justify-center rounded-full bg-primary">
                  <Text className="leading-5 text-violet-100">22</Text>
                </View>
                <View className="flex-1 justify-center px-2">
                  <View className="h-0.5 w-full bg-primary"></View>
                </View>
              </View>
            </View>
            <View className="w-9 flex-1 items-center pt-2">
              <View className="h-full w-1 rounded-md bg-primary"></View>
            </View>
          </View>
          <View
            style={{
              shadowColor: 'rgba(20,20,20,0.20)',
              elevation: 20,
              shadowOffset: { width: 0, height: 10 },
              shadowRadius: 13.16,
            }}
            className="mt-7 flex-1 rounded-xl border border-input bg-white px-3.5 pb-3.5">
            <View className="h-9 flex-row items-center justify-between">
              <Text className="font-qs-bold">10:00 - 10:30</Text>
              <Text className="font-qs-semibold text-slate-400">#RSV1</Text>
            </View>
            <View className="gap-2 pt-2">
              <Text className="font-qs-semibold text-xl">Ayşe Yıldız</Text>
              <Text className=" text-slate-600">Saç Kesimi</Text>
              <View className="flex-row items-center gap-2">
                <Iconify icon="solar:shop-line-duotone" size={20} className="text-slate-500" />
                <Text className="font-qs-semibold leading-5 text-slate-500">
                  Victory Güzellik Salonu
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MyReservation;
