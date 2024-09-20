import {
  BottomSheetBackdropProps,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { useFocusEffect } from 'expo-router';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import { BackHandler } from 'react-native';

const BottomSheet = forwardRef<
  React.ElementRef<typeof BottomSheetModal>,
  React.ComponentPropsWithoutRef<typeof BottomSheetModal> & {
    footerComponent?: React.FC<BottomSheetFooterProps> | undefined;
    snapPoints?: string[];
    children: React.ReactNode;
  }
>(({ footerComponent, snapPoints, children, ...props }, ref) => {
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

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        style={[props.style]}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      backgroundStyle={{ backgroundColor: 'rgb(255 255 255)' }}
      backdropComponent={renderBackdrop}
      ref={ref}
      index={1}
      /* handleIndicatorStyle={{ backgroundColor: 'rgb(248 250 252)' }} */
      footerComponent={footerComponent}
      snapPoints={snapPts}
      onChange={handleSheetChanges}
      {...props}>
      <BottomSheetView>{children}</BottomSheetView>
    </BottomSheetModal>
  );
});

export default BottomSheet;
