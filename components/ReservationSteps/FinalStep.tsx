import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInLeft, FadeInUp, FadeOutLeft } from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler';

import { Text } from '../ui/text';
import { Iconify } from '~/lib/icons/Iconify';
import { getSectorItem } from '~/utils/getLabels';
import { Service } from '~/app/(other)/reservation/[id]';

const FinalStep = ({ branch, reservationData, calendarActiveDateRanges }: any) => {
  let start = new Date(calendarActiveDateRanges[0]?.startId).toLocaleDateString('tr', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  let end = new Date(calendarActiveDateRanges[0]?.endId).toLocaleDateString('tr', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return (
    <View className="h-full">
      <View className="flex-1">
        <ScrollView>
          <View className="pb-24">
            <View className="p-7">
              <Animated.Text
                entering={FadeInUp.duration(500)}
                exiting={FadeOutLeft.duration(500)}
                className="text-4xl capitalize">
                Rezervasyon özeti
              </Animated.Text>
              <Animated.View
                entering={FadeInLeft.duration(500)}
                exiting={FadeOutLeft.duration(500)}>
                <View className="gap-3.5 py-7">
                  <View className="w-full flex-row items-center rounded-xl border border-input bg-background p-3.5">
                    <Text className="w-1/3 font-qs-semibold">İşletme Adı</Text>
                    <Text numberOfLines={1} className="flex-1">
                      {branch?.name}
                    </Text>
                  </View>
                  <View className="w-full flex-row items-center rounded-xl border border-input bg-background p-3.5">
                    <Text className="w-1/3 font-qs-semibold capitalize">
                      {getSectorItem(branch?.sector)?.singular}
                    </Text>
                    <Text numberOfLines={1} className="flex-1">
                      {reservationData.asset?.name}
                    </Text>
                  </View>
                  {reservationData.services.length > 0 ? (
                    <View className="w-full flex-row items-center rounded-xl border border-input bg-background p-3.5">
                      <Text className="w-1/3 font-qs-semibold">Hizmetler</Text>
                      <Text className="flex-1">
                        {reservationData.services
                          ?.map((service: Service) => service.name)
                          .join(', ')}
                      </Text>
                    </View>
                  ) : null}
                  {start == end ? (
                    <View className="w-full flex-row items-center rounded-xl border border-input bg-background p-3.5">
                      <Text className="w-1/3 font-qs-semibold">Tarih</Text>
                      <Text numberOfLines={1} className="flex-1">
                        {start}
                      </Text>
                    </View>
                  ) : (
                    <View className="w-full flex-row items-center rounded-xl border border-input bg-background p-3.5">
                      <View className="w-1/3">
                        <Text className="font-qs-semibold">Başlangıç</Text>
                        <Text className="font-qs-semibold">Bitiş</Text>
                      </View>
                      <View className="flex-1">
                        <Text>{start}</Text>
                        <Text>{end}</Text>
                      </View>
                    </View>
                  )}
                  {reservationData.selectedTime.length > 0 ? (
                    <View className="w-full flex-row items-center rounded-xl border border-input bg-background p-3.5">
                      <Text className="w-1/3 font-qs-semibold capitalize">Saat</Text>
                      <Text numberOfLines={1} className="flex-1">
                        {reservationData.selectedTime?.join(', ')}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </Animated.View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default FinalStep;
