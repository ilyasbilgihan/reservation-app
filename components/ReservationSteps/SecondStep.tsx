import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { FadeInLeft, FadeInUp, FadeOutLeft } from 'react-native-reanimated';
import { Calendar, CalendarTheme, toDateId } from '@marceloterreiro/flash-calendar';

import { supabase } from '~/lib/supabase';

import { Text } from '../ui/text';
import { Iconify } from '~/lib/icons/Iconify';
import { Service } from '~/app/(other)/reservation/[id]';
import { generateTimeList } from '~/lib/utils/reservation';
import { getSectorItem } from '~/lib/utils/getLabels';

type ReservedTime =
  | {
      value: string;
      disabled: boolean;
    }[]
  | null;

const SecondStep = ({
  calendarActiveDateRanges,
  disabledDays,
  onCalendarDayPress,
  reservationData,
  branch,
  setField,
}: any) => {
  const totalPeriod = useCallback(() => {
    return reservationData.services?.reduce((acc: number, curr: Service) => {
      return acc + curr.time_span;
    }, 0);
  }, [reservationData.services]);

  useEffect(() => {
    let end = calendarActiveDateRanges[0]?.endId;
    let start = calendarActiveDateRanges[0]?.startId;
    if (start == end && start != null) {
      fetchReservationsOfDay(start);
    }
  }, [calendarActiveDateRanges]);

  const [timeList, setTimeList] = useState<ReservedTime>(null);

  const fetchReservationsOfDay = async (day?: string) => {
    const { data, error } = await supabase
      .from('reservation_date')
      .select('*')
      .eq('asset_id', reservationData?.asset?.id)
      .eq('date', day);
    if (error) {
      console.log('error', error);
    } else {
      let reservations = data?.map((item: any) => item.time);
      let candidateList = generateTimeList(getSelectedDay(), branch?.reservation_period);
      let available = candidateList.map((item: any) => {
        if (reservations.includes(item + ':00')) {
          return {
            value: item,
            disabled: true,
          };
        } else {
          return {
            value: item,
            disabled: false,
          };
        }
      });
      setTimeList(available);
    }
  };

  const getSelectedDay = () => {
    if (branch) {
      let selected = new Date(calendarActiveDateRanges[0]?.startId!)?.toLocaleString('en-us', {
        weekday: 'long',
      });
      return branch?.working_hour.find((item: any) => item.day === selected);
    } else {
      return null;
    }
  };

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
                Tarih Seçimi
              </Animated.Text>
              <Animated.View
                entering={FadeInLeft.duration(500)}
                exiting={FadeOutLeft.duration(500)}>
                <View className="py-7">
                  <Calendar.List
                    theme={calendarTheme}
                    calendarDisabledDateIds={disabledDays}
                    calendarActiveDateRanges={calendarActiveDateRanges}
                    calendarMinDateId={toDateId(new Date())}
                    onCalendarDayPress={(dateId) => {
                      let hasDisabledDay = false;
                      let start = calendarActiveDateRanges[0]?.startId;
                      let end = calendarActiveDateRanges[0]?.endId;
                      if (start && !end) {
                        if (['Grooming', 'Food'].includes(branch?.sector) && start != dateId) {
                          onCalendarDayPress(start);
                          return;
                        }
                        end = dateId;
                        if (dateId < start) {
                          end = start;
                          start = dateId;
                        }
                        // going to add endId if possible
                        for (let i = 0; i < disabledDays.length; i++) {
                          if (start < disabledDays[i] && disabledDays[i] < end) {
                            hasDisabledDay = true;
                          }
                        }
                      }
                      if (hasDisabledDay) return;
                      onCalendarDayPress(dateId);
                    }}
                    calendarFormatLocale="tr"
                    calendarFirstDayOfWeek="monday"
                    calendarInitialMonthId={toDateId(new Date())}
                    calendarMaxDateId={toDateId(
                      new Date(new Date().setMonth(new Date().getMonth() + 1))
                    )}
                    calendarDayHeight={44}
                  />
                </View>
              </Animated.View>
            </View>
            {calendarActiveDateRanges[0]?.startId == calendarActiveDateRanges[0]?.endId &&
            calendarActiveDateRanges.length > 0 ? (
              <View className="p-7">
                <Animated.Text
                  entering={FadeInUp.duration(500)}
                  exiting={FadeOutLeft.duration(500)}
                  className="text-4xl capitalize">
                  Saat Seçimi
                </Animated.Text>
                <Animated.View
                  entering={FadeInLeft.duration(500)}
                  exiting={FadeOutLeft.duration(500)}
                  className="gap-7">
                  <Text>
                    {new Date(calendarActiveDateRanges[0]?.startId!).toLocaleDateString('tr', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </Text>
                  {totalPeriod() > 0 ? (
                    <Text>
                      Seçtiğiniz hizmetlere göre{' '}
                      {
                        //@ts-ignore
                        totalPeriod() * branch?.reservation_period
                      }{' '}
                      dakikalık randevu saati seçmelisiniz. Aşağıdaki her bir periyod{' '}
                      {branch?.reservation_period} dakikadır.
                    </Text>
                  ) : null}
                  <View className="flex-row flex-wrap gap-3.5">
                    {timeList?.map((item: any) => {
                      return (
                        <TouchableOpacity
                          key={item.value}
                          activeOpacity={0.75}
                          onPress={() => {
                            if (!item.disabled) {
                              if (!reservationData.selectedTime.includes(item.value)) {
                                let total = totalPeriod();
                                if (reservationData.selectedTime.length < total || total == 0) {
                                  setField('selectedTime', [
                                    ...reservationData.selectedTime,
                                    item.value,
                                  ]);
                                }
                              } else {
                                setField(
                                  'selectedTime',
                                  reservationData.selectedTime.filter(
                                    (x: string) => x !== item.value
                                  )
                                );
                              }
                            }
                          }}>
                          <View
                            style={{
                              width: (Dimensions.get('window').width - 56 - 42) / 4,
                              backgroundColor: item.disabled
                                ? 'hsl(260 52% 99%)'
                                : reservationData.selectedTime.includes(item.value)
                                  ? 'hsl(260 51% 41%)'
                                  : 'hsl(260 51% 95%)',
                            }}
                            className="items-center justify-center rounded-lg border border-input  py-3.5">
                            <Text
                              style={{
                                color: reservationData.selectedTime.includes(item.value)
                                  ? 'rgb(237 233 254)'
                                  : 'black',
                              }}>
                              {item.value}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </Animated.View>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const calendarTheme: CalendarTheme = {
  rowMonth: {
    content: {
      height: 24,
      textAlign: 'left',
      fontSize: 18,
      fontFamily: 'Quicksand Medium',
    },
  },
  itemDay: {
    idle: ({ isPressed }) => ({
      container: {
        backgroundColor: isPressed ? 'hsl(260 51% 41%)' : 'hsl(260 51% 95%)',
        borderRadius: 12,
        aspectRatio: 1,
      },
      content: {
        color: isPressed ? 'rgb(237 233 254)' : 'black',
        fontSize: 16,
      },
    }),
    today: ({ isPressed }) => ({
      container: {
        backgroundColor: 'white',
        borderRadius: 44,
        aspectRatio: 1,
      },
      content: {
        fontSize: 16,
        borderColor: 'hsl(260 12% 94%)',
        color: 'black',
      },
    }),
    active: ({ isEndOfRange, isStartOfRange }) => ({
      container: {
        backgroundColor: 'hsl(260 51% 41%)',
        borderTopLeftRadius: isStartOfRange ? 12 : 0,
        borderBottomLeftRadius: isStartOfRange ? 12 : 0,
        borderTopRightRadius: isEndOfRange ? 12 : 0,
        borderBottomRightRadius: isEndOfRange ? 12 : 0,
      },
      content: {
        fontSize: 16,
        color: 'rgb(237 233 254)',
      },
    }),
    disabled: ({ isPressed }) => ({
      container: {
        backgroundColor: 'hsl(260 52% 99%)',
        borderRadius: 12,
        aspectRatio: 1,
      },
      content: {
        color: 'black',
        fontSize: 16,
        opacity: 0.3,
      },
    }),
  },
  itemDayContainer: {
    activeDayFiller: {
      backgroundColor: 'hsl(260 51% 41%)',
    },
  },
};

export default SecondStep;
