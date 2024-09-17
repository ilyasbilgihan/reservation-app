import {
  BottomSheetBackdropProps,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useFocusEffect } from 'expo-router';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import { BackHandler } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';

const CustomBackdrop = ({ animatedIndex, style }: BottomSheetBackdropProps) => {
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [0, 1], [0, 1], Extrapolation.CLAMP),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );

  return <Animated.View style={containerStyle} />;
};

const BottomSheet = forwardRef<
  BottomSheetModal,
  {
    footerComponent?: React.FC<BottomSheetFooterProps> | undefined;
    snapPoints?: string[];
    children: React.ReactNode;
  }
>(({ footerComponent, snapPoints, children }, ref) => {
  const snapPts = useMemo(() => (snapPoints ? snapPoints : ['66%', '96%']), []);

  const [currentState, setCurrentState] = useState<number>(-1);
  const handleSheetChanges = useCallback((index: number) => {
    setCurrentState(index);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (currentState != -1 && ref) {
          //@ts-ignore
          ref?.current?.close();
          return true;
        } else {
          return false;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [ref, currentState])
  );

  return (
    <BottomSheetModal
      backgroundStyle={{ backgroundColor: 'rgb(255 255 255)' }}
      backdropComponent={CustomBackdrop}
      ref={ref}
      index={1}
      /* handleIndicatorStyle={{ backgroundColor: 'rgb(248 250 252)' }} */
      footerComponent={footerComponent}
      snapPoints={snapPts}
      onChange={handleSheetChanges}>
      <BottomSheetView>{children}</BottomSheetView>
    </BottomSheetModal>
  );
});

export default BottomSheet;
