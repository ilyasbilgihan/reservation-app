import React, { useCallback, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { supabase } from '~/utils/supabase';

import { Text } from './ui/text';
import { Iconify } from '~/lib/icons/Iconify';
import BranchFormBottomSheet from './BranchFormBottomSheet';
import { useFocusEffect } from 'expo-router';
import { useGlobalContext } from '~/context/GlobalProvider';
import { getSectorItem } from '~/utils/getLabels';
import BranchItem from './BranchItem';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';

const BranchTabContent = () => {
  const { session } = useGlobalContext();
  const [branches, setBranches] = useState<any>([]);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const fetchBranches = async () => {
    const { data, error } = await supabase
      .from('branch_with_location')
      .select('*, branch_image(*)')
      .eq('owner_id', session?.user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setBranches(
        data.map((b) => ({
          ...b,
          sector: { value: b.sector, label: getSectorItem(b.sector)?.value },
        }))
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBranches();
    }, [])
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBranches();
    setRefreshing(false);
  }, []);
  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View className="flex-row items-center justify-between px-7">
        <Text className="font-qs-semibold text-2xl">Şubelerim</Text>
        <TouchableOpacity activeOpacity={0.75} onPress={handlePresentModalPress}>
          <Iconify icon="solar:add-circle-line-duotone" size={32} className=" text-slate-400" />
        </TouchableOpacity>
        <BranchFormBottomSheet
          ref={bottomSheetModalRef}
          onCreate={() => {
            fetchBranches();
            bottomSheetModalRef.current?.dismiss();
          }}
        />
      </View>
      {branches.length > 0 ? (
        <View className="mt-4 gap-4 px-7">
          {branches.map((item: any) => (
            <BranchItem
              item={item}
              key={item.id}
              onUpdate={() => {
                fetchBranches();
              }}
            />
          ))}
          <Text>
            * Şube görünümüne girmek veya şube görünümünden çıkmak istediğiniz şubenize tıklayınız.
            Düzenlemek için ise basılı tutunuz.
          </Text>
          {/* <Text>{JSON.stringify(branches, null, 2)}</Text> */}
        </View>
      ) : (
        <View className="items-center gap-4 py-7">
          <Iconify icon="solar:ghost-bold-duotone" size={48} className="text-slate-400" />
          <View className="items-center">
            <Text className="text-muted-foreground">Henüz bir şube eklememişsiniz.</Text>
            <Text className="text-muted-foreground">
              Eklemek isterseniz sağ üstteki artı butonuna tıklayınız.
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default BranchTabContent;
