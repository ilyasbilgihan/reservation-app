import React, { useCallback, useState } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { supabase } from '~/utils/supabase';
import { useGlobalContext } from '~/context/GlobalProvider';

import { Iconify } from '~/lib/icons/Iconify';
import { Text } from '~/components/ui/text';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ReservationList from '~/components/ReservationList';

const BranchReservations = () => {
  const { session, branch } = useGlobalContext();
  const [selectedDate, setSelectedDate] = useState<any>(new Date().toISOString().slice(0, 10));
  const [reservations, setReservations] = useState<any>([]);
  const [reservationServices, setReservationServices] = useState<any>([]);
  const [reservationDates, setReservationDates] = useState<any>([]);

  useFocusEffect(
    useCallback(() => {
      fetchReservationServices();
      fetchReservationDate();
    }, [selectedDate, branch])
  );

  const fetchReservationServices = async () => {
    const { data, error } = await supabase
      .from('reservation_service')
      .select('*, reservation!inner(branch_id), service(*)')
      .eq('reservation.branch_id', branch?.id);
    if (error) {
      console.log('error', error);
    } else {
      setReservationServices(data);
    }
  };

  const fetchReservationDate = async () => {
    const { data, error } = await supabase
      .from('reservation_date')
      .select(
        '*, reservation!inner(*, customer:profile!customer_id(*), asset(*), branch(name, reservation_period))'
      )
      .eq('reservation.branch_id', branch?.id)
      .eq('date', selectedDate);

    if (error) {
      console.log('error', error);
    } else {
      setReservationDates(data);
      let tmp = data?.map((item: any) => item.reservation);
      let tmp2 = tmp.filter((obj1, i, arr) => arr.findIndex((obj2) => obj2?.id === obj1?.id) === i);
      setReservations(tmp2);
    }
  };

  const pendingReservations = reservations?.filter((item: any) => item?.status === 'pending');
  const approvedReservations = reservations?.filter((item: any) => item?.status === 'approved');
  const doneReservations = reservations?.filter((item: any) => item?.status === 'done');

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 28,
    right: 28,
  };

  const handleConfirmDate = async (date: any) => {
    setSelectedDate(new Date(date).toISOString().slice(0, 10));
    setDatePickerVisibility(false);
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    fetchReservationServices();
    fetchReservationDate();
    setRefreshing(false);
  }, [selectedDate, branch]);

  const [datePickerVisibility, setDatePickerVisibility] = useState(false);
  return (
    <SafeAreaView>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className="p-7">
          <View className="mb-3.5 flex-row items-center gap-3.5">
            <Text className="font-qs-bold text-3xl text-slate-700">Rezervasyonlar</Text>
            <Tooltip>
              <TooltipTrigger asChild>
                <Pressable>
                  <Iconify
                    icon="solar:question-circle-bold"
                    size={24}
                    className=" text-slate-400"
                  />
                </Pressable>
              </TooltipTrigger>
              <TooltipContent insets={contentInsets}>
                <Text className="text-sm text-slate-700">
                  Rezervasyon teklifini onaylamak veya iptal etmek için basılı tutunuz.
                </Text>
              </TooltipContent>
            </Tooltip>
          </View>
          <TouchableOpacity activeOpacity={0.75} onPress={() => setDatePickerVisibility(true)}>
            <View className="flex-row items-center gap-3.5 rounded-xl border border-input p-3.5">
              <Iconify
                icon="solar:calendar-search-bold-duotone"
                size={22}
                className="text-slate-400"
              />
              <Text className="font-qs-semibold leading-5 text-slate-500">
                {new Date(selectedDate).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })}
              </Text>
            </View>
          </TouchableOpacity>
          <ReservationList
            reservations={pendingReservations}
            reservationServices={reservationServices}
            reservationDates={reservationDates}
            fetchReservationDates={fetchReservationDate}
            longPressEvent
            adminActions
            title="Onay Bekleyen"
            color="rgb(71 85 105)"
          />
          <ReservationList
            reservations={approvedReservations}
            reservationServices={reservationServices}
            reservationDates={reservationDates}
            fetchReservationDates={fetchReservationDate}
            longPressEvent
            adminActions
            title="Onaylandı"
            color="hsl(260 51% 41%)"
          />
          <ReservationList
            reservations={doneReservations}
            reservationServices={reservationServices}
            reservationDates={reservationDates}
            fetchReservationDates={fetchReservationDate}
            longPressEvent
            adminActions
            title="Tamamlanmış"
            color="rgb(13 148 136)"
          />
          <DateTimePickerModal
            isVisible={datePickerVisibility}
            mode="date"
            locale="tr"
            onConfirm={handleConfirmDate}
            onCancel={() => {
              setDatePickerVisibility(false);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BranchReservations;
