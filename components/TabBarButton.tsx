import { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Iconify } from '~/lib/icons/Iconify';

const icons = {
  index: (props: any) => <Iconify icon="solar:compass-line-duotone" size={24} {...props} />,
  branch: (props: any) => <Iconify icon="solar:shop-line-duotone" size={24} {...props} />,
  profile: (props: any) => <Iconify icon="solar:user-line-duotone" size={24} {...props} />,
  'my-reservations': (props: any) => <Iconify icon="solar:calendar-linear" size={24} {...props} />,
  'branch-reservations': (props: any) => (
    <Iconify icon="solar:calendar-search-linear" size={24} {...props} />
  ),
};

const icons_focused = {
  index: (props: any) => <Iconify icon="solar:compass-bold-duotone" size={24} {...props} />,
  branch: (props: any) => <Iconify icon="solar:shop-bold-duotone" size={24} {...props} />,
  profile: (props: any) => <Iconify icon="solar:user-bold-duotone" size={24} {...props} />,
  'my-reservations': (props: any) => <Iconify icon="solar:calendar-bold" size={24} {...props} />,
  'branch-reservations': (props: any) => (
    <Iconify icon="solar:calendar-search-bold" size={24} {...props} />
  ),
};

const TabBarButton = (props: any) => {
  const { isFocused, label, routeName, color } = props;

  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused, {
      duration: 500,
    });
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.4]);
    const top = interpolate(scale.value, [0, 1], [0, 6]);

    return {
      // styles
      transform: [{ scale: scaleValue }],
      top,
    };
  });
  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);

    return {
      // styles
      opacity,
    };
  });
  return label ? (
    <Pressable {...props} className="flex-1 items-center justify-center gap-1">
      <Animated.View style={[animatedIconStyle, { transformOrigin: 'top center', top: 0 }]}>
        {
          // @ts-ignore
          isFocused ? icons_focused[routeName]({ color }) : icons[routeName]({ color })
        }
      </Animated.View>

      <Animated.Text
        className="font-qs-semibold"
        style={[
          {
            color,
            fontSize: 12,
          },
          animatedTextStyle,
        ]}>
        {label}
      </Animated.Text>
    </Pressable>
  ) : (
    <Pressable
      {...props}
      style={{
        borderRadius: 28,
        shadowColor: 'rgba(76, 29, 149,0.75)',
        elevation: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4.65,
      }}
      className="-top-6 aspect-square items-center justify-center gap-1 bg-primary">
      {isFocused
        ? icons_focused[routeName as keyof typeof icons_focused]({
            className: 'text-violet-100',
            size: 30,
          })
        : icons[routeName as keyof typeof icons]({ className: 'text-violet-200', size: 30 })}
    </Pressable>
  );
};

export default TabBarButton;
