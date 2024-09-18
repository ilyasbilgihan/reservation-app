import { Link, Redirect, router, useFocusEffect } from 'expo-router';

import { Text } from '~/components/ui/text';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { supabase } from '~/utils/supabase';

import { getNetworkStateAsync } from 'expo-network';
import { useCallback, useEffect, useState } from 'react';
import { useGlobalContext } from '~/context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';

import { Calendar, toDateId } from '@marceloterreiro/flash-calendar';

export default function Home() {
  const { session, branch } = useGlobalContext();

  useEffect(() => {
    (async () => {
      const networkState = await getNetworkStateAsync();
      if (!networkState.isConnected) {
        router.replace('/auth');
      }
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (branch) {
        router.replace('/branch');
      }
    }, [branch])
  );

  const [data, setData] = useState<any>(null);

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => supabase.auth.signOut()}>
        <Text className="text-red-500">Logout</Text>
      </TouchableOpacity>
      <View className="p-12">
        <Calendar
          theme={{
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
                  backgroundColor: 'lightgray',
                  borderRadius: 8,
                  aspectRatio: 1,
                },
                content: {
                  color: 'black',
                  fontSize: 16,
                },
              }),
              today: ({ isPressed }) => ({
                container: {
                  backgroundColor: 'gren',
                  borderRadius: 8,
                  aspectRatio: 1,
                },
                content: {
                  fontSize: 16,
                  color: isPressed ? 'white' : 'black',
                },
              }),
              active: ({ isEndOfRange, isStartOfRange }) => ({
                container: {
                  backgroundColor: 'yellow',
                  borderTopLeftRadius: isStartOfRange ? 16 : 0,
                  borderBottomLeftRadius: isStartOfRange ? 16 : 0,
                  borderTopRightRadius: isEndOfRange ? 16 : 0,
                  borderBottomRightRadius: isEndOfRange ? 16 : 0,
                },
                content: {
                  color: 'orange',
                },
              }),
            },
            itemDayContainer: {
              activeDayFiller: {
                backgroundColor: 'blue',
              },
            },
          }}
          calendarFormatLocale="tr"
          calendarFirstDayOfWeek="monday"
          calendarMonthId={toDateId(new Date())}
          onCalendarDayPress={(dateId) => {
            console.log(`Clicked on ${dateId}`);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
