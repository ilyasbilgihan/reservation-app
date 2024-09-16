import { View, Text } from 'react-native';
import React from 'react';
import { useGlobalContext } from '~/context/GlobalProvider';

const Branch = () => {
  const { branch } = useGlobalContext();

  return (
    <View className="px-7">
      <Text>{JSON.stringify(branch, null, 2)}</Text>
    </View>
  );
};

export default Branch;
