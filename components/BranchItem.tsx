import React, { useRef } from 'react';
import { View, Image } from 'react-native';
import { router } from 'expo-router';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

import { useGlobalContext } from '~/context/GlobalProvider';

import { Text } from '~/components/ui/text';
import BranchFormBottomSheet from './BottomSheetComponents/BranchForm';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

const BranchItem = ({ item, onUpdate }: any) => {
  const { branch, setBranch } = useGlobalContext();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const scale = useSharedValue(1);

  const longPress = Gesture.LongPress()
    .minDuration(500)
    .runOnJS(true)
    .onBegin(() => {
      scale.value = withTiming(0.95, {
        duration: 500,
        easing: Easing.bezier(0.31, 0.04, 0.03, 1.04),
      });
    })
    .onEnd((e, success) => {
      if (success) {
        console.log('long pressed', item.name);
        bottomSheetModalRef.current?.present();
      }
    })
    .onFinalize(() => {
      scale.value = withTiming(1, {
        duration: 500,
        easing: Easing.bezier(0.31, 0.04, 0.03, 1.04),
      });
    });
  const tap = Gesture.Tap()
    .runOnJS(true)
    .onEnd(() => {
      if (branch?.id != item.id) {
        setBranch(item);
        router.replace('/(tabs)/branch');
      } else {
        setBranch(null);
      }
    });
  const composed = Gesture.Race(tap, longPress);
  return (
    <>
      <GestureDetector gesture={composed}>
        <Animated.View
          style={{
            shadowColor: 'rgba(20,20,20,0.20)',
            elevation: 20,
            shadowOffset: { width: 0, height: 10 },
            shadowRadius: 13.16,
            opacity: branch?.id === item.id ? 0.5 : 1,
            transform: [{ scale }],
          }}
          className="flex-row rounded-3xl bg-white p-2">
          <Image source={{ uri: item?.thumbnail }} className="h-24 w-24 rounded-2xl " />
          <View className="flex-1 justify-center px-4">
            <Text numberOfLines={1} className="font-qs-semibold text-2xl">
              {item.name}
            </Text>
            <Text>{item.phone}</Text>
            <View className="flex-row justify-between">
              <Text>{item?.sector?.label}</Text>
              <Text>
                {item.city}, {item.country}
              </Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>

      <BranchFormBottomSheet
        ref={bottomSheetModalRef}
        branch={item}
        onCreate={() => {
          onUpdate();
          bottomSheetModalRef.current?.dismiss();
        }}
      />
    </>
  );
};

export default BranchItem;
