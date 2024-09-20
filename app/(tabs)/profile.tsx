import { useState } from 'react';
import { View } from 'react-native';

import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
} from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from '~/components/ui/text';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import BranchTabContent from '~/components/BranchTabContent';
import IndividualTabContent from '~/components/IndividualTabContent';

export default function Profile() {
  const [value, setValue] = useState('individual');

  return (
    <Tabs
      value={value}
      onValueChange={setValue}
      className="mx-auto h-full w-full max-w-[400px] flex-col gap-1.5">
      <View className="px-7">
        <TabsList className=" w-full flex-row">
          <TabsTrigger value="individual" className="flex-1">
            <Text>Bireysel</Text>
          </TabsTrigger>
          <TabsTrigger value="company" className="flex-1">
            <Text>Kurumsal</Text>
          </TabsTrigger>
        </TabsList>
      </View>
      <TabsContent value="individual" className="flex-1">
        <ScrollView>
          <Animated.View
            className="gap-4 px-7 py-7"
            entering={FadeInLeft.delay(250).duration(250)}
            exiting={FadeOutLeft.duration(500)}>
            <IndividualTabContent />
          </Animated.View>
        </ScrollView>
      </TabsContent>
      <TabsContent value="company" className="flex-1">
        <ScrollView>
          <Animated.View
            className="py-7"
            entering={FadeInRight.delay(250).duration(250)}
            exiting={FadeOutRight.duration(500)}>
            <BranchTabContent />
          </Animated.View>
        </ScrollView>
      </TabsContent>
    </Tabs>
  );
}
