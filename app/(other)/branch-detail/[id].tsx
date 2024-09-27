import React, { useCallback, useState } from 'react';
import { View, ImageBackground, ScrollView, Image } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

import { Text } from '~/components/ui/text';
import { Iconify } from '~/lib/icons/Iconify';
import { supabase } from '~/utils/supabase';
import { useGlobalContext } from '~/context/GlobalProvider';
import { ImageGallery } from '@georstat/react-native-image-gallery';
import { Button } from '~/components/ui/button';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import MapView, { MapMarker, PROVIDER_GOOGLE } from 'react-native-maps';
import { getDayLabel } from '~/utils/getLabels';

const BranchDetail = () => {
  const { location } = useGlobalContext();
  const { id } = useLocalSearchParams();
  const [branch, setBranch] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      fetchBranch();
    }, [location])
  );

  const [isOpen, setIsOpen] = useState(false);
  const openGallery = () => setIsOpen(true);
  const closeGallery = () => setIsOpen(false);

  const fetchBranch = async () => {
    const { data, error } = await supabase
      .from('branch_with_location')
      .select(
        '*, working_hour(*), branch_image(*), rating:reservation!id(rating.avg()), reservations:reservation!id(*, customer:profile!customer_id(*))'
      )
      .eq('id', id)
      .gte('reservations.rating', 0)
      .order('id', { ascending: true, referencedTable: 'working_hour' })
      .single();
    if (error) {
      console.log('error', error);
    } else {
      setBranch(data);
    }
  };

  let now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  let working_hour = branch?.working_hour.find(
    (wh: any) => wh.day == new Date().toLocaleString('en-us', { weekday: 'long' })
  );
  let is_open = working_hour?.opening < now && now < working_hour?.closing;

  return (
    <>
      <SafeAreaView>
        <View className="relative h-full">
          <ScrollView>
            {branch ? (
              <View className="pb-24">
                <Animated.View entering={FadeInUp.duration(500)} className="w-screen p-3.5">
                  <ImageBackground
                    source={{ uri: branch?.thumbnail }}
                    style={{ aspectRatio: 1 }}
                    className=" w-full justify-between overflow-hidden rounded-3xl p-3.5">
                    <Animated.View entering={FadeInDown.duration(500)}>
                      {is_open ? (
                        <Text
                          style={{ lineHeight: 16 }}
                          className="ml-auto rounded-lg bg-emerald-400 px-3.5 py-1.5 font-qs-semibold text-sm text-emerald-50">
                          Şuan açık
                        </Text>
                      ) : (
                        <Text
                          style={{ lineHeight: 16 }}
                          className="ml-auto rounded-lg bg-slate-400 px-3.5 py-1.5 font-qs-semibold text-sm text-slate-100">
                          Kapalı
                        </Text>
                      )}
                    </Animated.View>
                    <View>
                      <Animated.View
                        entering={FadeInDown.duration(500)}
                        style={{ borderRadius: 10 }}
                        className="w-full gap-2 bg-white p-4">
                        <View className="flex-row items-center justify-between">
                          <Text
                            numberOfLines={2}
                            className="flex-1 font-qs-semibold text-2xl font-semibold">
                            {branch.name}
                          </Text>
                        </View>
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row  gap-2">
                            <Iconify
                              icon="solar:map-point-wave-bold-duotone"
                              size={24}
                              className="text-primary"
                            />
                            <Text>
                              {branch.city}, {branch.country}
                            </Text>
                          </View>
                          {/* <Text>todo: rating</Text> */}
                        </View>
                      </Animated.View>
                    </View>
                  </ImageBackground>
                </Animated.View>
                <View className="gap-7 px-7 pt-3.5">
                  {branch?.branch_image.length > 0 ? (
                    <View className="gap-3.5">
                      <Animated.Text
                        entering={FadeInUp.duration(500)}
                        className="font-qs-semibold text-2xl">
                        İşletmemizden görseller
                      </Animated.Text>
                      <TouchableOpacity activeOpacity={0.75} onPress={openGallery}>
                        <View className="w-full flex-row items-center justify-between gap-3.5">
                          {// array from num_of_max_images
                          branch.branch_image?.map((image: any, index: number) => {
                            return (
                              <Animated.View
                                entering={FadeInUp.delay(
                                  (1000 / branch.branch_image.length) * index
                                )
                                  .springify()
                                  .duration(2000)}
                                key={image.id}
                                className="aspect-square flex-1 items-center justify-center overflow-hidden rounded-xl border border-input bg-background">
                                <Animated.Image
                                  entering={FadeIn.delay(
                                    (1000 / branch.branch_image.length) * index
                                  ).duration(2000)}
                                  //@ts-ignore
                                  source={{ uri: image?.uri }}
                                  className="h-full w-full"
                                />
                              </Animated.View>
                            );
                          })}
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                  <Animated.View entering={FadeInUp.duration(500)} className="gap-3.5">
                    <Text className="font-qs-semibold text-2xl">Biz kimiz?</Text>
                    <Text className="m-0 p-0">{branch.details}</Text>
                  </Animated.View>
                  {branch?.reservations?.length > 0 ? (
                    <Animated.View entering={FadeInUp.duration(500)} className="gap-3.5">
                      <Text className="font-qs-semibold text-2xl">
                        Müşteri Değerlendirmeleri ({branch?.reservations?.length})
                      </Text>
                      {branch?.reservations?.map((item: any) => (
                        <View>
                          <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-3.5">
                              <Image
                                className="h-10 w-10 rounded-xl border border-input"
                                source={
                                  item?.customer?.avatar
                                    ? { uri: item?.customer?.avatar }
                                    : require('~/assets/no-image.png')
                                }
                              />
                              <Text className="font-qs-semibold">
                                {item?.customer?.full_name || 'Anonim'}
                              </Text>
                            </View>
                            <View className="flex-row items-center gap-2">
                              <Iconify
                                icon="solar:star-bold"
                                size={20}
                                className="text-amber-400"
                              />
                              <Text className="font-qs-semibold text-slate-500">
                                {item?.rating?.toFixed(1)}
                              </Text>
                            </View>
                          </View>
                          {item?.comment && <Text className="p-3.5">{item?.comment}</Text>}
                        </View>
                      ))}
                    </Animated.View>
                  ) : null}

                  <Animated.View entering={FadeInUp.duration(500)} className="gap-3.5">
                    <Text className="bg-background font-qs-semibold text-2xl">
                      Çalışma Saatlerimiz
                    </Text>
                    <View className="gap-1">
                      {branch.working_hour?.map((item: any) => {
                        let isClosed =
                          (item.opening === '00:00' || item.opening == null) &&
                          (item.closing === '00:00' || item.closing == null);
                        return (
                          <View
                            style={
                              working_hour.day == item.day
                                ? {}
                                : {
                                    borderColor: `transparent`,
                                    backgroundColor: `white`,
                                  }
                            }
                            key={item.id}
                            className="flex-row items-center justify-between rounded-xl border border-input bg-background px-7 py-3.5">
                            <Text className="font-qs-semibold">{getDayLabel(item.day)}</Text>
                            <Text className="text-slate-600">
                              {isClosed ? 'Kapalı' : item.opening + ' - ' + item.closing}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </Animated.View>
                  <Animated.View entering={FadeInUp.duration(500)} className="gap-3.5">
                    <Text className="font-qs-semibold text-2xl">Neredeyiz?</Text>
                    <View className="aspect-video w-full overflow-hidden rounded-xl">
                      <MapView
                        showsCompass
                        provider={PROVIDER_GOOGLE}
                        showsUserLocation
                        initialRegion={{
                          longitude: branch.long,
                          latitude: branch.lat,
                          latitudeDelta: 0.005,
                          longitudeDelta: 0.005,
                        }}
                        style={{ width: '100%', height: '100%' }}>
                        <MapMarker
                          coordinate={{
                            longitude: branch.long,
                            latitude: branch.lat,
                          }}
                        />
                      </MapView>
                    </View>
                  </Animated.View>
                </View>
              </View>
            ) : null}
          </ScrollView>
          <View className="absolute bottom-0 w-full p-7">
            <Animated.View entering={FadeInDown.duration(2000)}>
              <Button
                className="rounded-xl"
                onPress={() => {
                  router.push(`/reservation/${branch?.id}`);
                }}>
                <Text>Randevu Al</Text>
              </Button>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
      {branch?.branch_image.length > 0 && (
        <ImageGallery
          close={closeGallery}
          thumbColor="hsl(260 51% 41%)"
          isOpen={isOpen}
          images={[
            { id: 0, url: branch?.thumbnail },
            ...branch?.branch_image.map((image: any) => ({
              id: image.id,
              url: image.uri,
            })),
          ]}
        />
      )}
    </>
  );
};
export default BranchDetail;
