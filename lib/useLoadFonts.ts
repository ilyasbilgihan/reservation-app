import { useFonts } from 'expo-font';
import { useEffect } from 'react';

export const useLoadFonts = () => {
  const [loaded, error] = useFonts({
    'Quicksand Light': require('../assets/fonts/Quicksand-Light.ttf'),
    'Quicksand Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand Medium': require('../assets/fonts/Quicksand-Medium.ttf'),
    Quicksand: require('../assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand SemiBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return {loaded, error};
};
