import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-deck-swiper';

import { supabase } from '~/utils/supabase';
import { useGlobalContext } from '~/context/GlobalProvider';

import { Iconify } from '~/lib/icons/Iconify';
import { Text } from '~/components/ui/text';
import { ScrollView } from 'react-native-gesture-handler';
import ReservationList from '~/components/ReservationList';

const MyReservation = () => {
  const { session } = useGlobalContext();
  const [reservations, setReservations] = useState<any>([]);
  const [reservationServices, setReservationServices] = useState<any>([]);
  const [reservationDates, setReservationDates] = useState<any>([]);

  useFocusEffect(
    useCallback(() => {
      //fetchReservations();
      fetchReservationServices();
      fetchReservationDate();
    }, [])
  );

  const fetchReservations = async () => {
    const { data, error } = await supabase
      .from('reservation')
      .select('*, asset(*), branch(name)')
      .eq('customer_id', session?.user.id);
    if (error) {
      console.log('error', error);
    } else {
      setReservations(data);
    }
  };

  const fetchReservationServices = async () => {
    const { data, error } = await supabase
      .from('reservation_service')
      .select('*, reservation(customer_id), service(*)')
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
      .select('*, reservation(*, asset(*), branch(name))')
      .eq('reservation.customer_id', session?.user.id)
      .order('date', { ascending: false });

    if (error) {
      console.log('error', error);
    } else {
      setReservationDates(data);
      let tmp = data?.map((item: any) => item.reservation);
      let tmp2 = tmp.filter((obj1, i, arr) => arr.findIndex((obj2) => obj2.id === obj1.id) === i);
      setReservations(tmp2);
    }
  };

  const pendingReservations = reservations?.filter((item: any) => item.status === 'pending');
  const approvedReservations = reservations?.filter((item: any) => item.status === 'approved');
  const doneReservations = reservations?.filter((item: any) => item.status === 'done');
  const rejectedReservations = reservations?.filter((item: any) => item.status === 'rejected');

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="px-7 pt-7">
          <Text className="font-qs-bold text-3xl  text-slate-700">Rezervasyonlarım</Text>
          <ReservationList
            reservations={pendingReservations}
            reservationServices={reservationServices}
            reservationDates={reservationDates}
            title="Onay Bekleyen"
            color="rgb(71 85 105)"
          />
          <ReservationList
            reservations={approvedReservations}
            reservationServices={reservationServices}
            reservationDates={reservationDates}
            title="Onaylanan"
            color="hsl(260 51% 41%)"
          />
          <ReservationList
            reservations={doneReservations}
            reservationServices={reservationServices}
            reservationDates={reservationDates}
            title="Tamamlanmış"
            color="rgb(13 148 136)"
          />
          <ReservationList
            reservations={rejectedReservations}
            reservationServices={reservationServices}
            reservationDates={reservationDates}
            title="Reddedilmiş"
            color="hsl(13 81% 43%)"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyReservation;
