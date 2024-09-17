import React, { useRef } from 'react';
import { View, Image } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

import { useGlobalContext } from '~/context/GlobalProvider';

import { Text } from '~/components/ui/text';
import BranchFormBottomSheet from './BranchFormBottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { getSectorLabel } from '~/utils/getSectorLabel';

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
      let lbl = getSectorLabel(item.sector);

      setBranch({
        ...item,
        sector: {
          value: item.sector,
          label: lbl,
        },
      });
    });
  const composed = Gesture.Race(tap, longPress);

  return (
    <>
      <GestureDetector gesture={composed}>
        <Animated.View
          style={{ opacity: branch?.id === item.id ? 0.5 : 1, transform: [{ scale }] }}
          className="flex-row rounded-3xl bg-background  p-2 shadow-soft-5">
          <Image source={{ uri: item?.thumbnail }} className="h-24 w-24 rounded-2xl " />
          <View className="flex-1 justify-center px-4">
            <Text numberOfLines={1} className="font-qs-semibold text-2xl">
              {item.name}
            </Text>
            <Text>{item.phone}</Text>
            <View className="flex-row justify-between">
              <Text>{getSectorLabel(item.sector)}</Text>
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
