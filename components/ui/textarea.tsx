import * as React from 'react';
import { TextInput, View } from 'react-native';
import { cn } from '~/lib/utils/cn';

const Textarea = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  React.ComponentPropsWithoutRef<typeof TextInput>
>(({ className, multiline = true, numberOfLines = 5, placeholderClassName, ...props }, ref) => {
  return (
    <View
      className={cn(
        'native:text-lg native:leading-[1.25] min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground web:flex web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 lg:text-sm',
        props.editable === false && 'opacity-50 web:cursor-not-allowed',
        className
      )}>
      <TextInput
        ref={ref}
        className="flex-1 font-qs-medium"
        placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        {...props}
      />
    </View>
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };
