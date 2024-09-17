import React, { useCallback, useRef, useState } from 'react';
import { View, ImageBackground, TouchableOpacity } from 'react-native';

import { useFocusEffect } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGlobalContext } from '~/context/GlobalProvider';

import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
} from 'react-native-reanimated';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Text } from '~/components/ui/text';
import { Iconify } from '~/lib/icons/Iconify';
import WorkingHourBottomSheet from '~/components/WorkingHourBottomSheet';

import { getAssetLabel } from '~/utils/getLabels';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import AssetFormBottomSheet from '~/components/AssetFormBottomSheet';
import AssetTabContent from '~/components/AssetTabContent';

const Branch = () => {
  const { branch } = useGlobalContext();

  const [tab, setTab] = useState<string>('assets');

  useFocusEffect(
    useCallback(() => {
      /* StatusBar.setHidden(true);

      return () => {
        StatusBar.setHidden(false);
      }; */
    }, [])
  );

  return (
    <SafeAreaView>
      {branch ? (
        <ScrollView>
          <View className="w-screen p-3.5 pt-0 ">
            <ImageBackground
              source={{ uri: branch?.thumbnail }}
              style={{ aspectRatio: 16 / 9 }}
              className=" w-full justify-between overflow-hidden rounded-3xl p-3.5">
              <View className="items-end">
                <WorkingHourBottomSheet />
              </View>
              <View style={{ borderRadius: 10 }} className="w-full gap-2 bg-white p-4">
                <View className="flex-row items-center justify-between">
                  <Text
                    numberOfLines={2}
                    className="flex-1 font-qs-semibold text-2xl font-semibold">
                    {branch.name}
                  </Text>
                  {/* <Text>
                    {
                      //@ts-ignore
                      {
                        Accommodation: 'Konaklama',
                        Rental: 'Kiralama',
                        Grooming: 'Bakım',
                        Food: 'Yemek',
                      }[branch?.sector]
                    }
                  </Text> */}
                </View>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row  gap-2">
                    <Iconify
                      icon="solar:map-point-wave-bold-duotone"
                      size={24}
                      className="text-orange-500"
                    />
                    <Text>
                      {branch.city}, {branch.country}
                    </Text>
                  </View>
                  {/* <Text>todo: rating</Text> */}
                </View>
              </View>
            </ImageBackground>
          </View>
          <Tabs
            value={tab}
            onValueChange={setTab}
            className="mx-auto w-full max-w-[400px] flex-col gap-1.5">
            <View className="px-7">
              <TabsList className=" w-full flex-row ">
                <TabsTrigger value="assets" className="flex-1 ">
                  <Text>{getAssetLabel(branch?.sector?.value)?.title}</Text>
                </TabsTrigger>
                <TabsTrigger value="services" className="flex-1 ">
                  <Text>Hizmetlerim</Text>
                </TabsTrigger>
              </TabsList>
            </View>
            <TabsContent value="assets">
              <Animated.View
                style={{ paddingTop: 16 }}
                entering={FadeInLeft.delay(250).duration(250)}
                exiting={FadeOutLeft.duration(500)}>
                <AssetTabContent />
              </Animated.View>
            </TabsContent>
            <TabsContent value="services">
              <Animated.View
                style={{ paddingTop: 16 }}
                entering={FadeInRight.delay(250).duration(250)}
                exiting={FadeOutRight.duration(500)}>
                <View className="flex-row justify-between px-7">
                  <Text className="font-qs-semibold text-2xl">Şube Hizmetlerim</Text>
                  <TouchableOpacity activeOpacity={0.75} onPress={() => {}}>
                    <Iconify
                      icon="solar:add-circle-line-duotone"
                      size={32}
                      className=" text-slate-400"
                    />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </TabsContent>
          </Tabs>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
};

export default Branch;
