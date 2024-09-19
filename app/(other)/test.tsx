import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Text } from '~/components/ui/text';

import { Calendar, toDateId } from '@marceloterreiro/flash-calendar';

export default function Test() {
  return (
    <>
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
