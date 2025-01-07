import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { View, Alert, Pressable } from 'react-native';

import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetView, BottomSheetModal } from '@gorhom/bottom-sheet';

import { useGlobalContext } from '~/context/GlobalProvider';
import { supabase } from '~/lib/supabase';

import { Iconify } from '~/lib/icons/Iconify';
import BottomSheet from '../BottomSheet';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Text } from '../ui/text';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

import { getSectorItem } from '~/lib/utils/getLabels';

const ServiceFormBottomSheet = forwardRef<
  BottomSheetModal,
  {
    service?: any;
    onCreate: () => void;
  }
>(({ onCreate, service }, ref) => {
  const { branch } = useGlobalContext();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: service?.name || '',
    price: service?.price || '',
    time_span: service?.time_span || '',
  });
  const setField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  useEffect(() => {
    if (service) {
      setFormData({
        name: service?.name || '',
        price: service?.price || '',
        time_span: service?.time_span || '',
      });
    }
  }, [service]);

  const handleCreateService = async () => {
    if (loading) return;

    setLoading(true);
    if (service) {
      const { error } = await supabase
        .from('service')
        .update({
          ...formData,
          branch_id: branch?.id,
        })
        .eq('id', service?.id);

      if (error) {
        Alert.alert('Error update', error.message);
        console.log('error update', error.message);
        setLoading(false);
        return;
      }
    } else {
      const { data, error } = await supabase.from('service').insert({
        ...formData,
        branch_id: branch?.id,
      });

      if (error) {
        Alert.alert('Error create', error.message);
        console.log('error create', error.message);
        setLoading(false);
        return;
      } else {
        setFormData({
          name: '',
          price: '',
          time_span: '',
        });
      }
    }

    setLoading(false);
    onCreate();
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setFormData({
      name: service?.name || '',
      price: service?.price || '',
      time_span: service?.time_span || '',
    });
    setLoading(false);
    setRefreshing(false);
  }, [service]);

  return (
    <>
      <BottomSheet ref={ref} snapPoints={['33%', '66%']}>
        <BottomSheetView>
          <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View className="gap-4 p-7">
              <View className="gap-1">
                <Label nativeID="name">Hizmet Adı</Label>
                <Input
                  placeholder={getSectorItem(branch?.sector?.value)?.service}
                  value={formData.name}
                  onChangeText={(value) => setField('name', value)}
                  aria-labelledby="name"
                  aria-errormessage="name"
                />
              </View>
              <View className="gap-1">
                <Label nativeID="price">Ücret</Label>
                <Input
                  placeholder="200"
                  keyboardType="numeric"
                  value={formData.price}
                  onChangeText={(value) => {
                    setField('price', value);
                  }}
                  aria-labelledby="price"
                  aria-errormessage="price"
                />
              </View>
              <View className="gap-1">
                <View className="flex-row items-center gap-2">
                  <Label nativeID="price">Periyot sayısı</Label>
                  <Tooltip delayDuration={150}>
                    <TooltipTrigger asChild>
                      <Pressable>
                        <Iconify
                          icon="solar:question-circle-bold"
                          size={20}
                          className=" mt-1 text-slate-400"
                        />
                      </Pressable>
                    </TooltipTrigger>
                    <TooltipContent className="gap-3 py-4" insets={contentInsets}>
                      <Text className="text-sm text-slate-700">
                        * Bu hizmet seçildiğinde kaç adet rezervasyon periyoduna ihtiyaç
                        duyulacağını belirtiniz.
                      </Text>
                      <Text className="text-sm text-slate-700">
                        * Hizmetin, rezervasyon süresine etkisinin olmamasını istiyorsanız 0
                        giriniz.
                      </Text>
                      <Text className="text-sm text-slate-700">
                        * Buradaki dakika değerini genel şube ayarlarınızdan değiştirebilirsiniz.
                      </Text>
                    </TooltipContent>
                  </Tooltip>
                </View>
                <Input
                  placeholder="0"
                  keyboardType="numeric"
                  value={'' + formData.time_span}
                  onChangeText={(value) => {
                    setField('time_span', value);
                  }}
                  aria-labelledby="time_span"
                  aria-errormessage="time_span"
                  rightComponent={
                    <View className="flex-row items-center gap-2">
                      <Iconify
                        icon="lets-icons:close-round"
                        size={12}
                        className="mt-1 text-slate-900"
                      />
                      <Text className="text-slate-900">
                        {branch.reservation_period} ={' '}
                        {formData.time_span * branch.reservation_period} dk
                      </Text>
                    </View>
                  }
                />
              </View>
              <Button onPress={handleCreateService} disabled={loading}>
                <Text className="text-slate-100">{service ? 'Kaydet' : 'Oluştur'}</Text>
              </Button>
            </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
});

export default ServiceFormBottomSheet;
