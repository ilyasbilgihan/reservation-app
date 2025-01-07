import { useState } from 'react';
import { View } from 'react-native';

import { Text } from '~/components/ui/text';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import BranchTabContent from '~/components/TabContents/BranchTabContent';
import IndividualTabContent from '~/components/TabContents/IndividualTabContent';

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
        <IndividualTabContent />
      </TabsContent>
      <TabsContent value="company" className="flex-1">
        <BranchTabContent />
      </TabsContent>
    </Tabs>
  );
}
