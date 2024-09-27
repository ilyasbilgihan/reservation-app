import { useCallback, useEffect, useState } from 'react';
import { Alert, BackHandler, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useDateRange } from '@marceloterreiro/flash-calendar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent } from '~/components/ui/tabs';
import { supabase } from '~/utils/supabase';
import { getDatesInRange, getOffDayDatesOfCurrentYear } from '~/utils/reservation';

import ReservationFirstStep from '~/components/ReservationSteps/FirstStep';
import ReservationSecondStep from '~/components/ReservationSteps/SecondStep';
import ReservationFinalStep from '~/components/ReservationSteps/FinalStep';
import { useGlobalContext } from '~/context/GlobalProvider';

type Asset = {
  id: number;
  branch_id: number;
  name: string;
  active: boolean;
  price: number;
} | null;

export type Service = {
  id: number;
  branch_id: number;
  name: string;
  time_span: number;
  active: boolean;
  price: number;
};

export default function Reservation() {
  const { id } = useLocalSearchParams();
  const { calendarActiveDateRanges, onCalendarDayPress } = useDateRange();
  const { session } = useGlobalContext();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('1');
  const insets = useSafeAreaInsets();

  const [branch, setBranch] = useState<any>(null);
  const [reservationData, setReservationData] = useState<{
    asset: Asset;
    services: Service[];
    selectedTime: string[];
  }>({
    asset: null,
    services: [],
    selectedTime: [],
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
      .select('*, working_hour(*), asset(*), service(*)')
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

  const fetchReservationsOfMonth = async (assetId: number) => {
    console.log(assetId);
    const { data, error } = await supabase
      .from('reservation_date')
      .select('*')
      .eq('asset_id', assetId)
      .is('time', null);
    if (error) {
      console.log('error', error);
    } else {
      console.log('reserved days', data);
      setDisabledDays([...disabledDays, ...data.map((item: any) => item.date)]);
    }
  };

  useEffect(() => {
    if (step == '2') {
      fetchReservationsOfMonth(reservationData?.asset?.id!);
    }
  }, [step]);

  const totalPeriod = useCallback(() => {
    return reservationData.services?.reduce((acc, curr) => {
      return acc + curr.time_span;
    }, 0);
  }, [reservationData.services]);

  const checkValid = useCallback(() => {
    if (step == '1') {
      return reservationData.asset != null;
    } else if (step == '2') {
      if (calendarActiveDateRanges[0]?.endId) {
        if (calendarActiveDateRanges[0]?.startId == calendarActiveDateRanges[0]?.endId) {
          return totalPeriod() == 0
            ? reservationData.selectedTime.length > 0
            : reservationData.selectedTime.length == totalPeriod();
        } else {
          return true;
        }
      } else {
        return false;
      }
    } else if (step == '3') {
      return true;
    }
  }, [step, reservationData, calendarActiveDateRanges]);

  const handleCreateReservation = async () => {
    setLoading(true);
    const { data: insertData, error } = await supabase
      .from('reservation')
      .insert({
        branch_id: branch?.id,
        asset_id: reservationData.asset?.id,
        customer_id: session?.user.id,
      })
      .select('id');

    if (error) {
      console.log('reservation create error ', error);
      setLoading(false);
    } else {
      let start = calendarActiveDateRanges[0]?.startId;
      let end = calendarActiveDateRanges[0]?.endId;

      let err = [];

      if (start == end) {
        for (let i = 0; i < reservationData.selectedTime.length; i++) {
          const { error: err1 } = await supabase.from('reservation_date').insert({
            reservation_id: insertData[0].id,
            date: start,
            time: reservationData.selectedTime[i],
            asset_id: reservationData.asset?.id,
          });
          if (err1) {
            Alert.alert(err1.message);
            err.push(err1);
          }
        }
      } else {
        let dates = getDatesInRange(start!, end!);
        for (let i = 0; i < dates.length; i++) {
          let date = dates[i];
          const { error: err2 } = await supabase.from('reservation_date').insert({
            reservation_id: insertData[0].id,
            date: date,
            asset_id: reservationData.asset?.id,
          });
          if (err2) {
            Alert.alert(err2.message);
            err.push(err2);
          }
        }
      }
      for (let i = 0; i < reservationData.services.length; i++) {
        let service_id = reservationData.services[i].id;
        const { error: err3 } = await supabase.from('reservation_service').insert({
          reservation_id: insertData[0].id,
          service_id,
        });
        if (err3) {
          Alert.alert(err3.message);
          err.push(err3);
        }
      }
      console.log(err);
      if (err.length > 0) {
        await supabase.from('reservation').delete().eq('id', insertData[0].id);
      } else {
        router.replace(`/branch-detail/${branch?.id}`);
      }
      setLoading(false);
    }
  };

  return (
    <View style={{ ...insets, marginBottom: insets.top }}>
      <Tabs value={step} onValueChange={setStep} className="mx-auto w-full max-w-[400px] flex-col">
        <TabsContent value="1">
          <ReservationFirstStep
            branch={branch}
            reservationData={reservationData}
            setField={setField}
          />
        </TabsContent>
        <TabsContent value="2">
          <ReservationSecondStep
            branch={branch}
            reservationData={reservationData}
            setField={setField}
            calendarActiveDateRanges={calendarActiveDateRanges}
            disabledDays={disabledDays}
            onCalendarDayPress={onCalendarDayPress}
          />
        </TabsContent>
        <TabsContent value="3">
          <ReservationFinalStep
            branch={branch}
            reservationData={reservationData}
            calendarActiveDateRanges={calendarActiveDateRanges}
          />
        </TabsContent>
      </Tabs>
      <View className="absolute bottom-0 z-50 w-full p-7">
        <Animated.View entering={FadeInDown.duration(500)}>
          <Button
            disabled={!checkValid() && !loading}
            className="rounded-xl"
            onPress={() => {
              if (step == '3') {
                handleCreateReservation();
              } else {
                setStep('' + (+step + 1));
              }
            }}>
            <Text animateOnChange>{step == '3' ? 'Rezervasyonu Oluştur' : 'Devam'}</Text>
          </Button>
        </Animated.View>
      </View>
    </View>
  );
}
