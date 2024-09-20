import React, { useCallback, useState } from 'react';
import { View, ImageBackground } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  useSharedValue,
} from 'react-native-reanimated';

import { Text } from '~/components/ui/text';
import { Iconify } from '~/lib/icons/Iconify';
import { supabase } from '~/utils/supabase';
import { useGlobalContext } from '~/context/GlobalProvider';
import { ScrollView } from 'react-native-gesture-handler';

const BranchDetail = () => {
  const { location } = useGlobalContext();
  const { id } = useLocalSearchParams();
  const [branch, setBranch] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      fetchBranch();
    }, [location])
  );

  const fetchBranch = async () => {
    const { data, error } = await supabase
      .rpc('nearby_branches', {
        lat: location?.latitude,
        long: location?.longitude,
      })
      .eq('id', id)
      .select('*, working_hour(*), service(*), asset(*)')
      .single();
    if (error) {
      console.log('error', error);
    } else {
      setBranch(data);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        {branch ? (
          <View className="h-full">
            <Animated.View entering={FadeInUp.duration(1000)} className="w-screen p-3.5 pt-0 ">
              <ImageBackground
                source={{ uri: branch?.thumbnail }}
                style={{ aspectRatio: 1 / 1.2 }}
                className=" w-full justify-between overflow-hidden rounded-3xl p-3.5">
                <View></View>
                <View>
                  <Animated.View
                    entering={FadeInDown.duration(1000)}
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
            <Text className="p-7">{JSON.stringify(branch, null, 2)}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BranchDetail;
