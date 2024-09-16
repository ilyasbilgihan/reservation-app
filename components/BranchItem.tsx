import React from 'react';
import { View, Text, Image } from 'react-native';
import { useGlobalContext } from '~/context/GlobalProvider';

const BranchItem = ({ item }: any) => {
  const { branch } = useGlobalContext();
  return (
    <View
      style={{ opacity: branch?.id === item.id ? 0.5 : 1 }}
      className="shadow-soft-5 flex-row rounded-3xl  bg-background p-2">
      <Image source={{ uri: item?.thumbnail }} className="h-24 w-24 rounded-2xl " />
      <View className="flex-1 justify-center px-4">
        <Text numberOfLines={1} className="text-2xl font-semibold">
          {item.name}
        </Text>
        <Text>{item.phone}</Text>
        <View className="flex-row justify-between">
          <Text>
            {
              //@ts-ignore
              {
                Accommodation: 'Konaklama',
                Rental: 'Kiralama',
                Grooming: 'Bakım',
                Food: 'Yemek',
              }[item.sector]
            }
          </Text>
          <Text>
            {item.city}, {item.country}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default BranchItem;
