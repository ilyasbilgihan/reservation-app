import { View } from 'react-native';
import React, { useState } from 'react';
import { Iconify } from '~/lib/icons/Iconify';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Text } from './ui/text';
import ReservationCard from './ReservationCard';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '~/components/ui/dialog';
import { Button } from './ui/button';
import { supabase } from '~/utils/supabase';

const ReservationList = ({
  reservations,
  reservationServices,
  reservationDates,
  fetchReservationDates,
  longPressEvent = false,
  title,
  color,
}: any) => {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const handleLongPress = (item: any) => {
    setSelected(item);
  };

  const handleCancelReservation = async (id: any) => {
    const { error } = await supabase
      .from('reservation')
      .update({ status: 'rejected' })
      .eq('id', id);
    if (error) {
      console.log('error', error);
    } else {
      fetchReservationDates();
      setSelected(null);
    }
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
                <View className="flex-1">
                  {longPressEvent ? (
                    <ReservationCard
                      reservationServices={reservationServices}
                      item={item}
                      times={times}
                      handleLongPress={handleLongPress}
                    />
                  ) : (
                    <ReservationCard
                      reservationServices={reservationServices}
                      item={item}
                      times={times}
                    />
                  )}
                </View>
              </View>
            );
          })}
        </>
      ) : null}
      <Dialog
        open={selected !== null}
        onOpenChange={(value) => {
          if (!value) {
            setSelected(null);
          }
        }}>
        <DialogOverlay closeOnPress />
        <DialogContent className="mx-7">
          <DialogHeader>
            <DialogTitle>İptal Etmeyi Onayla</DialogTitle>
            <DialogDescription>
              <Text className="font-qs-semibold">#RSV{selected?.id}</Text> kodlu rezervasyonu iptal
              etmek istediğinize emin misiniz?
            </DialogDescription>
            <DialogDescription>
              <Text>Bu işlem geri alınamaz.</Text>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row">
            <DialogClose asChild className="flex-1">
              <Button variant={'outline'}>
                <Text>Vazgeç</Text>
              </Button>
            </DialogClose>
            <DialogClose asChild className="flex-1">
              <Button onPress={() => handleCancelReservation(selected?.id)}>
                <Text>Onayla</Text>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  ) : null;
};

export default ReservationList;
