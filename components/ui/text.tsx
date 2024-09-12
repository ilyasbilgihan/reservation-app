import * as Slot from '@rn-primitives/slot';
import { SlottableTextProps, TextRef } from '@rn-primitives/types';
import * as React from 'react';
import { Text as RNText, Animated as RNAnimated, StyleSheet } from 'react-native';
import { cn } from '~/lib/utils';

const TextClassContext = React.createContext<string | undefined>(undefined);

const Text = React.forwardRef<
  TextRef,
  SlottableTextProps & { animateOnChange?: boolean; duration?: number }
>(
  (
    { className, animateOnChange, duration, asChild = false, children: value, style, ...props },
    ref
  ) => {
    const textClass = React.useContext(TextClassContext);
    const Component = asChild ? Slot.Text : RNText;

    if (!animateOnChange) {
      return (
        <Component
          className={cn('text-base text-foreground web:select-text', textClass, className)}
          ref={ref}
          style={style}
          {...props}>
          {value}
        </Component>
      );
    } else {
      const [localValue, setLocalValue] = React.useState<any>(null);
      const fadeAnim = React.useRef(new RNAnimated.Value(1)).current;

      const fadeIn = React.useCallback(
        (fn: any) =>
          RNAnimated.timing(fadeAnim, {
            toValue: 1,
            useNativeDriver: false,
            duration: duration || 250,
          }).start(fn),
        [fadeAnim, duration]
      );
      const fadeOut = React.useCallback(
        (fn: any) =>
          RNAnimated.timing(fadeAnim, {
            toValue: 0,
            useNativeDriver: false,
            duration: duration || 250,
          }).start(fn),
        [fadeAnim, duration]
      );
      const ease = React.useCallback(
        () => fadeOut(() => fadeIn(setLocalValue(value))),
        [value, fadeIn, fadeOut]
      );

      React.useEffect(() => {
        if (!localValue) {
          setLocalValue(value);
          return;
        }
        ease();
      }, [value, ease]);

      if (!localValue) {
        return null;
      }
      return (
        <RNAnimated.Text
          className={cn('text-base text-foreground web:select-text', textClass, className)}
          ref={ref}
          style={StyleSheet.flatten([style, { opacity: fadeAnim }])}
          {...props}>
          {localValue}
        </RNAnimated.Text>
      );
    }
  }
);
Text.displayName = 'Text';

export { Text, TextClassContext };
