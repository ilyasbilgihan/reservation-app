import { View } from 'react-native';
import React, { useRef, useState } from 'react';
import { Iconify } from '~/lib/icons/Iconify';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Text } from './ui/text';
import ReservationCard from './ReservationCard';
import ReservationBottomSheet from './BottomSheetComponents/ReservationInfo';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

const ReservationList = ({
  reservations,
  reservationServices,
  reservationDates,
  fetchReservationDates,
  adminActions = false,
  title,
  color,
}: any) => {
  const [expanded, setExpanded] = useState(false);

  const reservationModalRef = useRef<BottomSheetModal>(null);

  const [selected, setSelected] = useState<any>(null);

  const handleLongPress = (item: any) => {
    setSelected(item);
    reservationModalRef.current?.present();
  };

  return reservations.length > 0 ? (
    <>
      <TouchableOpacity activeOpacity={0.75} onPress={() => setExpanded(!expanded)}>
        <View className="flex-row items-center gap-3.5 pb-3.5 pt-7">
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
            const dates = reservationDates?.filter((date: any) => date.reservation_id === item?.id);
            let times = dates
              .map((date: any) => date.time?.slice(0, 5))
              .sort((a: any, b: any) => a.localeCompare(b));

            return (
              <View className="w-full flex-row " key={item?.id}>
                {adminActions ? null : (
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
                        <View className="top-0.5 h-4 w-9 items-center pt-0.5">
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
                )}
                <View className="flex-1">
                  <ReservationCard
                    reservationServices={reservationServices}
                    item={item}
                    times={times}
                    handleLongPress={handleLongPress}
                  />
                </View>
              </View>
            );
          })}
        </>
      ) : null}
      <ReservationBottomSheet
        ref={reservationModalRef}
        selected={selected}
        adminActions={adminActions}
        onAction={() => {
          reservationModalRef.current?.dismiss();
          fetchReservationDates();
          setSelected(null);
        }}
      />
    </>
  ) : null;
};

export default ReservationList;
