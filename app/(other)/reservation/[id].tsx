import { useCallback, useRef, useState } from 'react';
import { BackHandler, ScrollView, StyleSheet, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutLeft,
  FadeOutRight,
} from 'react-native-reanimated';
import {
  Calendar,
  CalendarTheme,
  toDateId,
  fromDateId,
  useDateRange,
} from '@marceloterreiro/flash-calendar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Iconify } from '~/lib/icons/Iconify';
import { getSectorItem } from '~/utils/getLabels';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent } from '~/components/ui/tabs';
import { supabase } from '~/utils/supabase';

export default function Reservation() {
  const { id } = useLocalSearchParams();
  const {
    calendarActiveDateRanges,
    onCalendarDayPress,
    // Also available for your convenience:
    // dateRange, // { startId?: string, endId?: string }
    // isDateRangeValid, // boolean
    // onClearDateRange, // () => void
  } = useDateRange();

  const [step, setStep] = useState('1');
  const insets = useSafeAreaInsets();

  const [branch, setBranch] = useState<any>(null);
  const [reservationData, setReservationData] = useState({
    asset: null,
    service: null,
  });
  const [disabledDays, setDisabledDays] = useState(['2024-09-28']);
  const setField = (field: string, value: any) => {
    setReservationData({ ...reservationData, [field]: value });
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (+step > 1) {
          setStep('' + (+step - 1));
          return true;
        } else {
          return false;
        }
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [step])
  );

  useFocusEffect(
    useCallback(() => {
      fetchBranch();
    }, [])
  );

  const fetchBranch = async () => {
    const { data, error } = await supabase
      .from('branch')
      .select('*, working_hour(*), asset!inner(*), service!inner(*)')
      .eq('id', id)
      .order('id', { ascending: true, referencedTable: 'working_hour' })
      .single();
    if (error) {
      console.log('error', error);
    } else {
      let off_days = data?.working_hour?.filter((item: any) => {
        if (item.opening == item.closing && (item.opening == '00:00' || item.opening == null)) {
          return true;
        } else {
          return false;
        }
      });
      let off_dates = getOffDayDatesOfCurrentYear(off_days.map((item: any) => item.day));
      setDisabledDays(off_dates);
      setBranch(data);
    }
  };

  const getOffDayDatesOfCurrentYear = (daysOfWeekInput: string[]) => {
    let allSpecificDays = [];
    let year = new Date().getFullYear();
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    // Her ay için döngü
    for (let month = 0; month < 12; month++) {
      for (let dayOfWeek of daysOfWeekInput) {
        let targetDay = daysOfWeek.indexOf(dayOfWeek);

        let date = new Date(year, month, 1);

        // İlk hedef günü bul
        while (date.getDay() !== targetDay) {
          date.setDate(date.getDate() + 1);
        }

        // Ayın sonuna kadar hedef günleri ekle
        while (date.getMonth() === month) {
          allSpecificDays.push(toDateId(date)); // Tarihleri diziye ekle
          date.setDate(date.getDate() + 7); // Bir sonraki aynı gün
        }
      }
    }

    return allSpecificDays;
  };

  // TODO: FIX function (bugged)
  function generateTimeList(prop: any) {
    let timeList = [];
    let startTime = prop?.opening;
    let endTime = prop?.closing;

    // Saatleri dakika cinsine çevir
    let startMinutes = toMinutes(startTime);
    let endMinutes = toMinutes(endTime);

    // 30 dakika aralıklarla liste oluştur
    for (let minutes = startMinutes; minutes <= endMinutes; minutes += 30) {
      timeList.push(toTimeFormat(minutes));
    }

    return timeList;
  }

  // Zamanı "HH:MM" formatında dakikaya çevir
  function toMinutes(time: any) {
    let [hours, minutes] = time?.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Dakikayı "HH:MM" formatına çevir
  function toTimeFormat(minutes: any) {
    let hours = Math.floor(minutes / 60);
    let mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  return (
    <View style={{ ...insets, marginBottom: insets.top }}>
      <Tabs value={step} onValueChange={setStep} className="mx-auto w-full max-w-[400px] flex-col">
        <TabsContent value="1">
          <View className="h-full">
            <View className="flex-row items-center justify-between px-7 py-3.5">
              <TouchableOpacity activeOpacity={0.75} onPress={() => router.back()}>
                <Animated.View
                  entering={FadeInUp.duration(1000)}
                  exiting={FadeOutLeft.duration(1000)}
                  className="flex-row items-center gap-3.5">
                  <Iconify icon="solar:arrow-left-linear" size={24} color={'black'} />
                  <Text className="font-qs-semibold text-lg leading-6">Fatih Osman Berber</Text>
                </Animated.View>
              </TouchableOpacity>
              <Animated.View
                entering={FadeInUp.duration(1000)}
                exiting={FadeOutLeft.duration(1000)}>
                <Text>Adım 1/3</Text>
              </Animated.View>
            </View>
            <View className="flex-1">
              <ScrollView>
                {branch ? (
                  <View className="pb-24">
                    <View className="gap-3.5 p-7">
                      <Animated.Text
                        entering={FadeInUp.duration(1000)}
                        exiting={FadeOutLeft.duration(1000)}
                        className="text-4xl capitalize">
                        {getSectorItem(branch?.sector)?.singular} Seçimi
                      </Animated.Text>
                      <View className="gap-3.5">
                        {branch?.asset.length > 0 ? (
                          branch?.asset.map((item: any, index: number) => {
                            return (
                              <TouchableOpacity
                                activeOpacity={0.75}
                                key={item.id}
                                onPress={() => setField('asset', item)}>
                                <Animated.View
                                  entering={FadeInRight.delay(index * 200).duration(1000)}
                                  exiting={FadeOutLeft.duration(1000)}
                                  style={
                                    reservationData.asset === item
                                      ? { backgroundColor: 'hsl(260 51% 41%)' }
                                      : {}
                                  }
                                  className="rounded-lg border border-input bg-background p-3.5">
                                  <Text
                                    style={
                                      reservationData.asset === item
                                        ? { color: 'rgb(237 233 254)' }
                                        : {}
                                    }>
                                    {item.name}
                                  </Text>
                                </Animated.View>
                              </TouchableOpacity>
                            );
                          })
                        ) : (
                          <Animated.View
                            exiting={FadeOut.duration(500)}
                            entering={FadeIn.delay(0).duration(1000)}
                            className="items-center gap-4 p-7">
                            <Iconify
                              icon="solar:ghost-bold-duotone"
                              size={48}
                              className="text-slate-400"
                            />
                            <Text className="text-center text-muted-foreground">
                              <Text className="capitalize">
                                {getSectorItem(branch?.sector)?.singular}
                              </Text>
                              <Text>
                                {' '}
                                bulunamadı. İşletme henüz hazır değil ya da bir şeyler yanlış gitti.
                                Lütfen işletmeyle iletişime geçiniz.
                              </Text>
                            </Text>
                          </Animated.View>
                        )}
                      </View>
                    </View>
                    <View className="gap-3.5 p-7">
                      <Animated.Text
                        entering={FadeInUp.duration(1000)}
                        exiting={FadeOutLeft.duration(1000)}
                        className="text-4xl capitalize">
                        Hizmet Seçimi
                      </Animated.Text>
                      <View className="gap-3.5">
                        {branch?.service.length > 0 ? (
                          branch?.service.map((item: any, index: number) => {
                            return (
                              <TouchableOpacity
                                activeOpacity={0.75}
                                key={item.id}
                                onPress={() => {
                                  if (reservationData.service === item) {
                                    setField('service', null);
                                  } else {
                                    setField('service', item);
                                  }
                                }}>
                                <Animated.View
                                  entering={FadeInRight.delay(index * 200).duration(1000)}
                                  exiting={FadeOutLeft.duration(1000)}
                                  style={
                                    reservationData.service === item
                                      ? { backgroundColor: 'hsl(260 51% 41%)' }
                                      : {}
                                  }
                                  className="rounded-lg border border-input bg-background p-3.5">
                                  <Text
                                    style={
                                      reservationData.service === item
                                        ? { color: 'rgb(237 233 254)' }
                                        : {}
                                    }>
                                    {item.name}
                                  </Text>
                                </Animated.View>
                              </TouchableOpacity>
                            );
                          })
                        ) : (
                          <Animated.View
                            exiting={FadeOut.duration(500)}
                            entering={FadeIn.delay(0).duration(1000)}
                            className="items-center gap-4 p-7">
                            <Iconify
                              icon="solar:ghost-bold-duotone"
                              size={48}
                              className="text-slate-400"
                            />
                            <Text className="text-center text-muted-foreground">
                              Bu işletme herhangi bir ekstra hizmet sunmuyor.
                            </Text>
                          </Animated.View>
                        )}
                      </View>
                    </View>
                  </View>
                ) : null}
              </ScrollView>
            </View>
          </View>
        </TabsContent>
        <TabsContent value="2">
          <View className="h-full">
            <View className="flex-row items-center justify-between px-7 py-3.5">
              <TouchableOpacity activeOpacity={0.75} onPress={() => setStep('1')}>
                <Animated.View
                  entering={FadeInUp.duration(1000)}
                  exiting={FadeOutLeft.duration(1000)}
                  className="flex-row items-center gap-3.5">
                  <Iconify icon="solar:arrow-left-linear" size={24} color={'black'} />
                  <Text className="font-qs-semibold text-lg leading-6">
                    Personel & Hizmet Seçimi
                  </Text>
                </Animated.View>
              </TouchableOpacity>
              <Animated.View
                entering={FadeInUp.duration(1000)}
                exiting={FadeOutLeft.duration(1000)}>
                <Text>Adım 2/3</Text>
              </Animated.View>
            </View>
            <View className="flex-1">
              <ScrollView>
                <View className="pb-24">
                  <View className="p-7">
                    <Animated.Text
                      entering={FadeInUp.duration(1000)}
                      exiting={FadeOutLeft.duration(1000)}
                      className="text-4xl capitalize">
                      Tarih Seçimi
                    </Animated.Text>
                    <Animated.View
                      entering={FadeInLeft.duration(1000)}
                      exiting={FadeOutLeft.duration(1000)}>
                      <View className="py-7">
                        <Calendar
                          theme={calendarTheme}
                          calendarDisabledDateIds={disabledDays}
                          calendarActiveDateRanges={calendarActiveDateRanges}
                          calendarMinDateId={toDateId(new Date())}
                          onCalendarDayPress={(dateId) => {
                            let hasDisabledDay = false;
                            let start = calendarActiveDateRanges[0]?.startId;
                            let end = calendarActiveDateRanges[0]?.endId;

                            if (start && !end) {
                              end = dateId < start ? start : dateId;
                              start = dateId < start ? dateId : start;

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
                          calendarMonthId={toDateId(new Date())}
                          calendarDayHeight={44}
                        />
                      </View>
                    </Animated.View>
                  </View>
                  {calendarActiveDateRanges[0]?.startId == calendarActiveDateRanges[0]?.endId ? (
                    <View className="p-7">
                      <Animated.Text
                        entering={FadeInUp.duration(1000)}
                        exiting={FadeOutLeft.duration(1000)}
                        className="text-4xl capitalize">
                        Saat Seçimi
                      </Animated.Text>
                      <Animated.View
                        entering={FadeInLeft.duration(1000)}
                        exiting={FadeOutLeft.duration(1000)}>
                        <View className="py-7">
                          {calendarActiveDateRanges[0]?.startId ==
                          calendarActiveDateRanges[0]?.endId ? (
                            <Text>
                              {JSON.stringify(
                                branch?.working_hour.find(
                                  (item: any) =>
                                    item.day ===
                                    new Date(calendarActiveDateRanges[0]?.startId!)?.toLocaleString(
                                      'en-us',
                                      { weekday: 'long' }
                                    )
                                ),
                                null,
                                2
                              )}
                            </Text>
                          ) : null}
                        </View>
                      </Animated.View>
                    </View>
                  ) : null}
                </View>
              </ScrollView>
            </View>
          </View>
        </TabsContent>
      </Tabs>
      <View className="absolute bottom-0 w-full p-7">
        <Animated.View entering={FadeInDown.duration(1000)}>
          <Button
            disabled={!reservationData.asset}
            className="rounded-xl"
            onPress={() => {
              if (reservationData.asset) {
                setStep('2');
              }
            }}>
            <Text>İleri</Text>
          </Button>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});

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
        backgroundColor: 'hsl(260 51% 95%)',
        borderRadius: 12,
        aspectRatio: 1,
        opacity: 0.3,
      },
      content: {
        color: 'black',
        fontSize: 16,
      },
    }),
  },
  itemDayContainer: {
    activeDayFiller: {
      backgroundColor: 'hsl(260 51% 41%)',
    },
  },
};
