import React, { useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { supabase } from '~/lib/supabase';
import { useGlobalContext } from '~/context/GlobalProvider';

import { Iconify } from '~/lib/icons/Iconify';
import { Text } from '~/components/ui/text';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import ReservationList from '~/components/ReservationList';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';

const MyReservation = () => {
  const { session } = useGlobalContext();
  const [reservations, setReservations] = useState<any>([]);
  const [reservationServices, setReservationServices] = useState<any>([]);
  const [reservationDates, setReservationDates] = useState<any>([]);

  useFocusEffect(
    useCallback(() => {
      fetchReservationServices();
      fetchReservationDate();
    }, [])
  );

  const fetchReservationServices = async () => {
    const { data, error } = await supabase
      .from('reservation_service')
      .select('*, reservation!inner(customer_id), service(*)')
      .eq('reservation.customer_id', session?.user.id);
    if (error) {
      console.log('error', error);
    } else {
      setReservationServices(data);
    }
  };

  const fetchReservationDate = async () => {
    const { data, error } = await supabase
      .from('reservation_date')
      .select('*, reservation!inner(*, asset(*), branch(name, phone, reservation_period))')
      .eq('reservation.customer_id', session?.user.id)
      .order('date', { ascending: true });

    if (error) {
      console.log('error', error);
    } else {
      setReservationDates(data);
      let tmp = data?.map((item: any) => item.reservation);
      let tmp2 = tmp.filter((obj1, i, arr) => arr.findIndex((obj2) => obj2?.id === obj1?.id) === i);
      setReservations(tmp2.reverse());
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

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    fetchReservationServices();
    fetchReservationDate();
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className="p-7">
          <View className="flex-row items-center gap-3.5">
            <Text className="font-qs-bold text-3xl  text-slate-700">Rezervasyonlarım</Text>
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
                  Tamamlanmamış rezervasyonunuzu iptal etmek için üzerine basılı tutunuz.
                </Text>
              </TooltipContent>
            </Tooltip>
          </View>
          <ReservationList
            reservations={pendingReservations}
            reservationServices={reservationServices}
            reservationDates={reservationDates}
            fetchReservationDates={fetchReservationDate}
            title="Onay Bekleyen"
            color="rgb(71 85 105)"
          />
          <ReservationList
            reservations={approvedReservations}
            reservationServices={reservationServices}
            reservationDates={reservationDates}
            fetchReservationDates={fetchReservationDate}
            title="Onaylanan"
            color="hsl(260 51% 41%)"
          />
          <ReservationList
            reservations={doneReservations}
            reservationServices={reservationServices}
            reservationDates={reservationDates}
            fetchReservationDates={fetchReservationDate}
            title="Tamamlanmış"
            color="rgb(13 148 136)"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyReservation;
