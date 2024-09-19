import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Alert, Dimensions } from 'react-native';

import { useFocusEffect } from 'expo-router';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { RefreshControl, ScrollView, Swipeable } from 'react-native-gesture-handler';

import { useGlobalContext } from '~/context/GlobalProvider';
import { supabase } from '~/utils/supabase';

import { Iconify } from '~/lib/icons/Iconify';
import AssetFormBottomSheet from './AssetFormBottomSheet';
import { Text } from './ui/text';

import { getSectorItem } from '~/utils/getLabels';

const SCREEN_WIDTH = Dimensions.get('window').width;

const AssetTabContent = () => {
  const { branch } = useGlobalContext();
  const [assets, setAssets] = useState<any>([]);
  const assetModalRef = useRef<BottomSheetModal>(null);
  useFocusEffect(
    useCallback(() => {
      fetchAssets();
    }, [branch?.id])
  );

  const fetchAssets = async () => {
    const { data, error } = await supabase
      .from('asset')
      .select('*')
      .eq('branch_id', branch?.id)
      .order('id');
    if (error) {
      Alert.alert(error.message);
      console.log(error);
    } else {
      setAssets(data);
    }
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAssets();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View className="flex-row justify-between p-7">
        <Text className="font-qs-semibold text-2xl">
          Rezerv {getSectorItem(branch?.sector?.value)?.title}
        </Text>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            assetModalRef.current?.present();
          }}>
          <Iconify icon="solar:add-circle-line-duotone" size={32} className=" text-slate-400" />
        </TouchableOpacity>
        <AssetFormBottomSheet
          ref={assetModalRef}
          onCreate={() => {
            fetchAssets();
            assetModalRef.current?.dismiss();
          }}
        />
      </View>
      {assets.length > 0 ? (
        <View className="gap-4 pb-7">
          {assets?.map((item: any) => (
            <SwipeableItem key={item.id} asset={item} fetchAssets={fetchAssets} />
          ))}
        </View>
      ) : (
        <View className="items-center gap-4 py-7">
          <Iconify icon="solar:ghost-bold-duotone" size={48} className="text-slate-400" />
          <View className="items-center">
            <Text className="text-muted-foreground">
              Henüz bir {getSectorItem(branch?.sector?.value)?.singular} eklememişsiniz.
            </Text>
            <Text className="text-muted-foreground">
              Eklemek isterseniz sağ üstteki artı butonuna tıklayınız.
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const SwipeableItem = ({ asset, fetchAssets }: any) => {
  const handleActivateAsset = async () => {
    const { error } = await supabase.from('asset').update({ active: true }).eq('id', asset.id);
    if (!error) {
      await fetchAssets();
    }
    ref.current?.close();
  };
  const handleDeactivateAsset = async () => {
    const { error } = await supabase.from('asset').update({ active: false }).eq('id', asset.id);
    if (!error) {
      await fetchAssets();
    }
    ref.current?.close();
  };

  const ref = useRef<Swipeable>(null);
  const assetModalRef = useRef<BottomSheetModal>(null);

  return (
    <>
      <Swipeable
        ref={ref}
        leftThreshold={100}
        rightThreshold={100}
        containerStyle={{ paddingHorizontal: 28 }}
        key={asset.id}
        renderLeftActions={() => {
          return (
            <View
              style={{ width: (SCREEN_WIDTH - 56) / 3 - 28 }}
              className="ml-7 flex-row items-center justify-end">
              <Text className="text-emerald-400">Aktifleştir</Text>
            </View>
          );
        }}
        renderRightActions={() => {
          return (
            <View
              style={{ width: (SCREEN_WIDTH - 56) / 3 - 28 }}
              className="mr-7 flex-row items-center justify-start">
              <Text className="text-rose-400 ">Pasifleştir</Text>
            </View>
          );
        }}
        onSwipeableWillOpen={(direction) => {
          if (direction === 'left') {
            handleActivateAsset();
          } else {
            handleDeactivateAsset();
          }
        }}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            assetModalRef.current?.present();
          }}>
          <View
            style={{
              backgroundColor: asset?.active ? 'rgb(236 253 245)' : 'rgb(255 241 242)',
            }}
            className="flex-row rounded-xl p-4">
            <Text className="text-lg">{asset.name}</Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
      <AssetFormBottomSheet
        ref={assetModalRef}
        asset={asset}
        onCreate={() => {
          fetchAssets();
          assetModalRef.current?.dismiss();
        }}
      />
    </>
  );
};

export default AssetTabContent;
