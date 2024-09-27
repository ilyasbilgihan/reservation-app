import { View } from 'react-native';
import React from 'react';
import { Iconify } from '~/lib/icons/Iconify';
import Animated, { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { Text } from './ui/text';

const ReservationCard = ({ reservationServices, item, times, handleLongPress }: any) => {
  const services = reservationServices?.filter(
    (service: any) => service.reservation_id === item?.id
  );
  const scale = useSharedValue(1);

  const longPress = Gesture.LongPress()
    .minDuration(500)
    .runOnJS(true)
    .onBegin(() => {
      scale.value = withTiming(0.95, {
        duration: 500,
        easing: Easing.bezier(0.31, 0.04, 0.03, 1.04),
      });
    })
    .onEnd((e, success) => {
      if (success) {
        handleLongPress({ reservation: item, services, times });
      }
    })
    .onFinalize(() => {
      scale.value = withTiming(1, {
        duration: 500,
        easing: Easing.bezier(0.31, 0.04, 0.03, 1.04),
      });
    });

  let duration = times.length * item?.branch?.reservation_period;

  return (
    <GestureDetector gesture={longPress}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <View
          style={{
            shadowColor: `rgba(20,20,20,0.2)`,
            elevation: 20,
            shadowOffset: { width: 0, height: 10 },
            shadowRadius: 13.16,
          }}
          className="mb-3.5 mt-3 w-full rounded-xl border border-input bg-white p-3.5">
          <View className="flex-row items-center justify-between">
            <Text className="font-qs-semibold text-xl">{item?.asset?.name}</Text>
            <Text className="font-qs-semibold text-slate-400">#RSV{item?.id}</Text>
          </View>
          <View className="gap-1 pt-3.5">
            {services.length > 0 ? (
              <Text className="font-qs-semibold">
                {services?.map((item: any) => item?.service?.name).join(', ')}
              </Text>
            ) : null}
            <View className="gap-3.5">
              <View className="flex-row items-center gap-2">
                <Iconify
                  icon="solar:clock-circle-line-duotone"
                  size={20}
                  className="text-slate-500"
                />
                {times[0] != null ? (
                  <Text className="text-slate-600">
                    {times.join(', ')} (
                    {duration < 60
                      ? duration + ' dk'
                      : Number.isInteger(duration / 60)
                        ? duration / 60 + ' saat'
                        : (duration / 60).toFixed(1) + ' saat'}
                    )
                  </Text>
                ) : (
                  <Text className="text-slate-600">Gün boyu</Text>
                )}
              </View>
              <View className="flex-row items-center gap-2">
                <Iconify icon="solar:shop-line-duotone" size={20} className="text-slate-500" />
                <Text numberOfLines={1} className="font-qs-semibold leading-5 text-slate-500">
                  {item?.branch?.name}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default ReservationCard;
