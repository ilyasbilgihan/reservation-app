import React, { useCallback, useState } from 'react';
import { View, ImageBackground, StatusBar } from 'react-native';

import { router, useFocusEffect } from 'expo-router';

import { useGlobalContext } from '~/context/GlobalProvider';

import { Iconify } from '~/lib/icons/Iconify';

import { Text } from '~/components/ui/text';
import { ScrollView } from 'react-native-gesture-handler';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import EditBranch from '~/components/EditBranch';

const Branch = () => {
  const { branch } = useGlobalContext();

  const [tab, setTab] = useState<string>('general');

  useFocusEffect(
    useCallback(() => {
      StatusBar.setHidden(true);

      return () => {
        StatusBar.setHidden(false);
      };
    }, [])
  );

  return (
    <>
      {branch ? (
        <ScrollView>
          <View className="w-screen p-4 ">
            <ImageBackground
              source={{ uri: branch?.thumbnail }}
              className="aspect-square w-full items-center justify-end overflow-hidden rounded-3xl p-4">
              <View className="w-full gap-2 rounded-3xl bg-background p-4">
                <View className="flex-row items-center justify-between">
                  <Text
                    numberOfLines={2}
                    className="font-qs-semibold flex-1 text-2xl font-semibold">
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
                <TabsTrigger value="general" className="flex-1 ">
                  <Text>Genel</Text>
                </TabsTrigger>
                <TabsTrigger value="services" className="flex-1 ">
                  <Text>Hizmetler</Text>
                </TabsTrigger>
                <TabsTrigger value="working_hours" className="flex-1 ">
                  <Text>Ç. Saatleri</Text>
                </TabsTrigger>
              </TabsList>
            </View>
            <TabsContent value="general">
              <ScrollView>
                <Animated.View
                  className="px-7"
                  entering={FadeIn.delay(250).duration(250)}
                  exiting={FadeOut.duration(500)}>
                  <EditBranch branch={branch} />
                </Animated.View>
              </ScrollView>
            </TabsContent>
            <TabsContent value="services">
              <ScrollView>
                <Animated.View
                  className="px-7"
                  entering={FadeIn.delay(250).duration(250)}
                  exiting={FadeOut.duration(500)}>
                  <Text>TODO: Services List/Create/Update</Text>
                </Animated.View>
              </ScrollView>
            </TabsContent>
            <TabsContent value="working_hours">
              <ScrollView>
                <Animated.View
                  className="px-7"
                  entering={FadeIn.delay(250).duration(250)}
                  exiting={FadeOut.duration(500)}>
                  <Text>TODO: Working Hours List/Create/Update</Text>
                </Animated.View>
              </ScrollView>
            </TabsContent>
          </Tabs>
        </ScrollView>
      ) : null}
    </>
  );
};

export default Branch;
