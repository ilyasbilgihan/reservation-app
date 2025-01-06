import React, { forwardRef, useState } from 'react';
import { View, Alert } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import { BottomSheetView, BottomSheetModal } from '@gorhom/bottom-sheet';
import BottomSheet from '../BottomSheet';

import { Iconify } from '~/lib/icons/Iconify';
import { useGlobalContext } from '~/context/GlobalProvider';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { supabase } from '~/utils/supabase';
import { Text } from '../ui/text';
import { Textarea } from '../ui/textarea';

const ReservationBottomSheet = forwardRef<
  BottomSheetModal,
  {
    asset?: any;
    selected?: any;
    onAction: () => void;
    adminActions?: boolean;
  }
>(({ selected, onAction, adminActions }, ref) => {
  const { branch, session } = useGlobalContext();

  let duration = selected?.times.length * selected?.reservation.branch?.reservation_period;
  const [loading, setLoading] = useState(false);

  const handleCancelReservation = async () => {
    if (loading) return;

    setLoading(true);
    const { error } = await supabase
      .from('reservation')
      .delete()
      .eq('id', selected?.reservation?.id);
    if (error) {
      console.log('error', error);
    } else {
      onAction();
    }
    setLoading(false);
  };
  const handleApproveReservation = async () => {
    if (loading) return;

    setLoading(true);
    const { error } = await supabase
      .from('reservation')
      .update({ status: 'approved' })
      .eq('id', selected?.reservation?.id);
    if (error) {
      console.log('error', error);
    } else {
      onAction();
    }
    setLoading(false);
  };
  const handleCompleteReservation = async () => {
    if (loading) return;

    setLoading(true);
    const { error } = await supabase
      .from('reservation')
      .update({ status: 'done' })
      .eq('id', selected?.reservation?.id);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      onAction();
    }
    setLoading(false);
  };

  const [rating, setRating] = useState('' + (selected?.reservation?.rating || 0));
  const [ratingComment, setRatingComment] = useState(selected?.reservation?.comment || '');

  const handleRateReservation = async () => {
    if (loading) return;

    setLoading(true);
    const { error } = await supabase
      .from('reservation')
      .update({ rating, comment: ratingComment })
      .eq('id', selected?.reservation?.id);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      onAction();
    }
    setLoading(false);
  };

  return (
    <>
      <BottomSheet ref={ref} snapPoints={['33%', '66%']}>
        <BottomSheetView>
          <ScrollView>
            <View className="p-7">
              <View className="flex-row items-center justify-between">
                <Text className="font-qs-semibold text-2xl">
                  {selected?.reservation?.asset?.name}
                </Text>
                <Text className="font-qs-semibold text-slate-400">
                  #RSV{selected?.reservation?.id}
                </Text>
              </View>
              <View className="gap-1 pt-3.5">
                {selected?.services.length > 0 ? (
                  <Text className="font-qs-semibold">
                    {selected?.services?.map((item: any) => item?.service?.name).join(', ')}
                  </Text>
                ) : null}
                <View className="gap-3.5">
                  <View className="flex-row items-center gap-2">
                    <Iconify
                      icon="solar:clock-circle-line-duotone"
                      size={20}
                      className="text-slate-500"
                    />
                    {selected?.times[0] != null ? (
                      <Text className="text-slate-600">
                        {selected?.times.join(', ')} (
                        {duration < 60
                          ? duration + ' dk'
                          : Number.isInteger(duration / 60)
                            ? duration / 60 + ' saat'
                            : (duration / 60).toFixed(1) + ' saat'}
                        )
                      </Text>
                    ) : (
                      <Text className="text-slate-600">Gün boyu</Text>
                    )}
                  </View>
                  {adminActions ? (
                    <>
                      <View className="flex-row items-center gap-2">
                        <Iconify
                          icon="solar:user-bold-duotone"
                          size={20}
                          className="text-slate-500"
                        />
                        <Text
                          numberOfLines={1}
                          className="font-qs-semibold leading-5 text-slate-500">
                          {selected?.reservation?.customer?.full_name}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Iconify
                          icon="solar:phone-calling-bold-duotone"
                          size={20}
                          className="text-slate-500"
                        />
                        <Text
                          numberOfLines={1}
                          className="font-qs-semibold leading-5 text-slate-500">
                          {selected?.reservation?.customer?.phone}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View className="flex-row items-center gap-2">
                        <Iconify
                          icon="solar:shop-line-duotone"
                          size={20}
                          className="text-slate-500"
                        />
                        <Text
                          numberOfLines={1}
                          className="font-qs-semibold leading-5 text-slate-500">
                          {selected?.reservation?.branch?.name}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Iconify
                          icon="solar:phone-calling-bold-duotone"
                          size={20}
                          className="text-slate-500"
                        />
                        <Text
                          numberOfLines={1}
                          className="font-qs-semibold leading-5 text-slate-500">
                          {selected?.reservation?.branch?.phone}
                        </Text>
                      </View>
                    </>
                  )}
                  {!adminActions && selected?.reservation?.status == 'done' && (
                    <>
                      <View className="gap-1">
                        <Label nativeID="rating">Puan</Label>
                        <Input
                          placeholder="0-5"
                          maxLength={1}
                          keyboardType="numeric"
                          value={rating}
                          onChangeText={(value: any) => {
                            if (+value >= 0 && +value <= 5) {
                              setRating(value);
                            }
                          }}
                          aria-labelledby="rating"
                          aria-errormessage="rating"
                        />
                      </View>
                      <View className="gap-1">
                        <View className="flex-row items-end justify-between">
                          <Label nativeID="ratingComment">Değerlendirme</Label>
                          <Text className="text-sm">{ratingComment.length}/256</Text>
                        </View>
                        <Textarea
                          maxLength={256}
                          placeholder="Harika bir deneyimdi."
                          value={ratingComment}
                          onChangeText={(item: any) => {
                            setRatingComment(item);
                          }}
                          aria-labelledby="ratingComment"
                        />
                        <Button onPress={handleRateReservation}>
                          <Text>Kaydet</Text>
                        </Button>
                      </View>
                    </>
                  )}
                  {adminActions &&
                    selected?.reservation?.rating &&
                    selected?.reservation?.comment && (
                      <View className="">
                        <Text className="text-slate-600">
                          <Text className="font-qs-semibold text-slate-700">
                            Müşteri Değerlendirmesi:
                          </Text>{' '}
                          {selected?.reservation?.comment} ({selected?.reservation?.rating}/5)
                        </Text>
                      </View>
                    )}
                  {selected?.reservation?.status !== 'done' && (
                    <Button variant={'destructive'} onPress={handleCancelReservation}>
                      <Text>İptal Et</Text>
                    </Button>
                  )}
                  {adminActions && selected?.reservation?.status === 'pending' && (
                    <Button onPress={handleApproveReservation}>
                      <Text>Onayla</Text>
                    </Button>
                  )}
                  {adminActions && selected?.reservation?.status === 'approved' && (
                    <Button className="bg-teal-700" onPress={handleCompleteReservation}>
                      <Text>Tamamlandı Olarak İşaretle</Text>
                    </Button>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
});

export default ReservationBottomSheet;
