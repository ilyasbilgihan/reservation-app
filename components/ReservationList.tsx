import { View, LayoutChangeEvent } from 'react-native';
import React, { useState } from 'react';
import { Iconify } from '~/lib/icons/Iconify';
import Swiper from 'react-native-deck-swiper';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Text } from './ui/text';

const ReservationList = ({
  reservations,
  reservationServices,
  reservationDates,
  title,
  color,
}: any) => {
  const [expanded, setExpanded] = useState(false);

  return reservations.length > 0 ? (
    <>
      <TouchableOpacity activeOpacity={0.75} onPress={() => setExpanded(!expanded)}>
        <View className="relative z-50 flex-row items-center gap-3.5 pb-3.5 pt-7">
          <View style={{ backgroundColor: color }} className="h-2.5 w-2.5 rounded-full"></View>
          <Text className="font-qs-semibold text-xl leading-6">
            {title} ({reservations?.length})
          </Text>
          <View
            style={[{ height: 1, borderWidth: 1, borderStyle: 'dashed' }]}
            className="top-px flex-1 border-input"></View>

          <View className="h-8 w-8 items-center justify-center rounded-full border border-input bg-background">
            {expanded ? (
              <Iconify icon="pajamas:chevron-up" size={22} className=" text-slate-500" />
            ) : (
              <Iconify icon="pajamas:chevron-down" size={22} className=" text-slate-500" />
            )}
          </View>
        </View>
      </TouchableOpacity>
      {expanded ? (
        <>
          {reservations.map((item: any) => {
            const services = reservationServices?.filter(
              (service: any) => service.reservation_id === item.id
            );
            const dates = reservationDates?.filter((date: any) => date.reservation_id === item.id);
            let times = dates
              .map((date: any) => date.time?.slice(0, 5))
              .sort((a: any, b: any) => a.localeCompare(b));

            let additional = (services?.length - 1) * 8;
            let totalHeight = 150 + (additional < 0 ? 0 : additional);
            return (
              <View className="w-full flex-row " key={item.id}>
                <View style={{ width: 48 }}>
                  {times[0] == null ? (
                    <>
                      <View className="w-full">
                        <View className="h-6 w-9 items-center">
                          <Text style={{ color }} className="font-qs-bold text-sm uppercase">
                            {new Date(dates.at(-1)?.date).toLocaleDateString('tr', {
                              month: 'short',
                            })}
                          </Text>
                        </View>
                        <View className="w-full flex-row">
                          <View
                            style={{ backgroundColor: color }}
                            className="aspect-square w-9 items-center justify-center rounded-full">
                            <Text className="font-qs-semibold leading-5 text-gray-100">
                              {new Date(dates.at(-1)?.date).toLocaleDateString('tr', {
                                day: '2-digit',
                              })}
                            </Text>
                          </View>
                          <View className="flex-1 justify-center px-1">
                            <View
                              style={{ height: 2, backgroundColor: color }}
                              className="w-full rounded-md"></View>
                          </View>
                        </View>
                      </View>
                      <View className="h-5 w-9 items-center pt-1">
                        <View
                          style={[
                            {
                              width: 1,
                              borderLeftWidth: 2,
                              borderStyle: 'dotted',
                              borderColor: color,
                            },
                          ]}
                          className="w-px flex-1"></View>
                      </View>
                    </>
                  ) : null}
                  <View className="w-full">
                    <View className="h-6 w-9 items-center">
                      <Text style={{ color }} className="font-qs-bold text-sm uppercase">
                        {new Date(dates.at(0)?.date).toLocaleDateString('tr', {
                          month: 'short',
                        })}
                      </Text>
                    </View>
                    <View className="w-full flex-row">
                      <View
                        style={{ backgroundColor: color }}
                        className="aspect-square w-9 items-center justify-center rounded-full">
                        <Text className="font-qs-semibold leading-5 text-gray-100">
                          {new Date(dates.at(0)?.date).toLocaleDateString('tr', {
                            day: '2-digit',
                          })}
                        </Text>
                      </View>
                      <View className="flex-1 justify-center px-1">
                        <View
                          style={{ height: 2, backgroundColor: color }}
                          className="w-full rounded-md"></View>
                      </View>
                    </View>
                  </View>
                  <View className="w-9 flex-1 items-center pb-0.5 pt-1">
                    <View
                      style={{ width: 5, backgroundColor: color }}
                      className="h-full rounded-lg"></View>
                  </View>
                </View>
                <View className="flex-1">
                  <View className="relative z-50 h-6"></View>
                  <View style={{ height: totalHeight }}>
                    {services.length > 1 ? (
                      <View style={{ marginLeft: -48 }} className="relative flex-1">
                        <Swiper
                          cards={services}
                          renderCard={(card: any, index) => {
                            return (
                              <View
                                key={card?.id}
                                style={{
                                  shadowColor: `rgba(20,20,20,${0.2 / services?.length})`, // handle stack shadow opacity
                                  elevation: 20,
                                  shadowOffset: { width: 0, height: 10 },
                                  shadowRadius: 13.16,
                                }}
                                className=" w-full rounded-xl border border-input bg-white px-3.5 pb-3.5">
                                <View className="h-9 flex-row items-center justify-between">
                                  <Text className="font-qs-semibold text-xl">
                                    {item?.asset?.name}
                                  </Text>
                                  <Text className="font-qs-semibold text-slate-400">
                                    #RSV{item.id}-{card?.service_id}
                                  </Text>
                                </View>
                                <View className="gap-2 pt-2">
                                  <Text className="font-qs-semibold">{card?.service?.name}</Text>
                                  <View className="flex-row items-center gap-2">
                                    <Iconify
                                      icon="solar:clock-circle-line-duotone"
                                      size={20}
                                      className="text-slate-500"
                                    />
                                    {times[0] != null ? (
                                      <Text className="text-slate-600">{times.join(', ')}</Text>
                                    ) : (
                                      <Text className="text-slate-600">Gün boyu</Text>
                                    )}
                                  </View>
                                  <View className="flex-row items-center gap-2">
                                    <Iconify
                                      icon="solar:shop-line-duotone"
                                      size={20}
                                      className="text-slate-500"
                                    />
                                    <Text
                                      numberOfLines={1}
                                      className="font-qs-semibold leading-5 text-slate-500">
                                      {item?.branch?.name}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            );
                          }}
                          infinite
                          onSwiped={(cardIndex) => {
                            /* console.log(cardIndex); */
                          }}
                          cardHorizontalMargin={48}
                          cardVerticalMargin={0}
                          verticalThreshold={48}
                          horizontalThreshold={48}
                          cardIndex={0}
                          backgroundColor={'transparent'}
                          stackSeparation={0}
                          stackSize={services.length}
                          disableBottomSwipe
                          disableTopSwipe
                        />
                      </View>
                    ) : (
                      <View className="relative z-50 flex-1">
                        <View
                          style={{
                            shadowColor: `rgba(20,20,20,${0.2})`, // handle stack shadow opacity
                            elevation: 20,
                            shadowOffset: { width: 0, height: 10 },
                            shadowRadius: 13.16,
                          }}
                          className="w-full flex-1 rounded-xl border border-input bg-white px-3.5 pb-3.5">
                          <View className="flex-row items-center justify-between py-1">
                            <Text className="font-qs-semibold text-xl">{item?.asset?.name}</Text>
                            <Text className="font-qs-semibold text-slate-400">#RSV{item.id}</Text>
                          </View>
                          <View className="flex-1 gap-2 pt-2">
                            {/* <Text className="font-qs-semibold">
                                    {card?.service?.name}
                                  </Text> */}
                            <View className="flex-row items-center gap-2">
                              <Iconify
                                icon="solar:clock-circle-line-duotone"
                                size={20}
                                className="text-slate-500"
                              />
                              {times[0] != null ? (
                                <Text className="text-slate-600">{times.join(', ')}</Text>
                              ) : (
                                <Text className="text-slate-600">Gün boyu</Text>
                              )}
                            </View>
                            <View className="mt-auto flex-row items-center gap-2">
                              <Iconify
                                icon="solar:shop-line-duotone"
                                size={20}
                                className="text-slate-500"
                              />
                              <Text
                                numberOfLines={1}
                                className="font-qs-semibold leading-5 text-slate-500">
                                {item?.branch?.name}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View className="h-6"></View>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </>
      ) : null}
    </>
  ) : null;
};

export default ReservationList;
