import React, { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

import { useGlobalContext } from '~/context/GlobalProvider';
import { supabase } from '~/lib/supabase';
import { getDayLabel } from '~/lib/utils/getLabels';

import BottomSheet from '../BottomSheet';
import { Text } from '~/components/ui/text';
import { Iconify } from '~/lib/icons/Iconify';

const WorkingHourBottomSheet = () => {
  const { branch } = useGlobalContext();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [workingHours, setWorkingHours] = useState<any[]>([]);
  const [target, setTarget] = useState<any>();

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = async (date: any) => {
    let time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let tmp = [...workingHours].map((item) => {
      if (item.id === target.day_id) {
        if (target.target == 'closing' && time < item.opening) {
          console.warn('closing time cannot be less than opening time');
          time = item.closing;
        }
        return {
          ...item,
          [target.target]: time,
        };
      }
      return item;
    });
    setWorkingHours(tmp);

    const { error } = await supabase
      .from('working_hour')
      .update({ [target.target]: time })
      .eq('id', target.day_id);
    hideDatePicker();
  };

  const handleOpenWorkingHours = async () => {
    await fetchWorkingHours();
    bottomSheetModalRef.current?.present();
  };

  const fetchWorkingHours = async () => {
    const { data, error } = await supabase
      .from('working_hour')
      .select('*')
      .eq('branch_id', branch?.id)
      .order('id');

    if (error) {
      console.log(error);
    } else {
      console.log(data);
      setWorkingHours(data);
    }
  };

  return (
    <View className="items-end">
      <TouchableOpacity activeOpacity={0.75} onPress={handleOpenWorkingHours}>
        <View style={{ borderRadius: 10 }} className="flex-row gap-2 bg-white p-3.5">
          <Iconify icon="solar:sort-by-time-bold-duotone" size={24} className="text-slate-900" />
          <Text>Çalışma Saatleri</Text>
        </View>
      </TouchableOpacity>
      <BottomSheet ref={bottomSheetModalRef} snapPoints={['50%', '75%']}>
        <BottomSheetView>
          <ScrollView>
            <Text className="p-7 pt-3.5 text-2xl">Çalışma Saatlerini Ayarla</Text>

            <View className="gap-4 px-7 pb-12 pt-4">
              {workingHours?.map((item) => {
                let isClosed =
                  (item.opening === '00:00' || item.opening === null) &&
                  (item.closing === '00:00' || item.closing === null);
                return (
                  <View
                    key={item.id}
                    style={{ backgroundColor: isClosed ? 'rgb(255 241 242)' : 'rgb(252 251 254)' }}
                    className="flex-row items-center justify-between overflow-hidden rounded-xl bg-background pl-4">
                    <Text>{getDayLabel(item.day)}</Text>
                    <View className="flex-row items-center">
                      <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={() => {
                          setTarget({ day_id: item.id, target: 'opening' });
                          setDatePickerVisibility(true);
                        }}>
                        <Text
                          style={{
                            backgroundColor: isClosed ? 'rgb(255 241 242)' : 'rgb(236 253 245)',
                          }}
                          className="w-20 py-4 text-center">
                          {item.opening || '00:00'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={() => {
                          setTarget({ day_id: item.id, target: 'closing' });
                          setDatePickerVisibility(true);
                        }}>
                        <Text className="w-20 bg-rose-50 py-4 text-center">
                          {item.closing || '00:00'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
              <Text>
                * Kapalı olduğunuz günlerde, açılış ve kapanış saatlerinizi 00:00 olarak
                ayarlayınız.
              </Text>
            </View>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="time"
              locale="tr"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default WorkingHourBottomSheet;
