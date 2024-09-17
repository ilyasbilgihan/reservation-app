import React, { useCallback, useRef, useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';

import { useFocusEffect } from 'expo-router';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { RefreshControl, ScrollView, Swipeable } from 'react-native-gesture-handler';

import { useGlobalContext } from '~/context/GlobalProvider';
import { supabase } from '~/utils/supabase';

import { Iconify } from '~/lib/icons/Iconify';
import AssetFormBottomSheet from './AssetFormBottomSheet';
import { Text } from './ui/text';

import { getAssetLabel } from '~/utils/getLabels';

const AssetTabContent = () => {
  const { branch } = useGlobalContext();
  const [assets, setAssets] = useState<any>([]);
  const [asset, setAsset] = useState<any>({});
  const assetModalRef = useRef<BottomSheetModal>(null);
  useFocusEffect(
    useCallback(() => {
      fetchAssets();
    }, [])
  );

  const fetchAssets = async () => {
    const { data, error } = await supabase.from('asset').select('*').eq('branch_id', branch?.id);
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

  const handleActivateAsset = async (id: any) => {
    const { error } = await supabase.from('asset').update({ active: true }).eq('id', id);
    if (!error) {
      await fetchAssets();
    }
  };
  const handleDeactivateAsset = async (id: any) => {
    const { error } = await supabase.from('asset').update({ active: false }).eq('id', id);
    if (!error) {
      await fetchAssets();
    }
  };

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View className="flex-row justify-between px-7">
        <Text className="font-qs-semibold text-2xl">
          Rezerv {getAssetLabel(branch?.sector?.value)?.title}
        </Text>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            setAsset(null);
            assetModalRef.current?.present();
          }}>
          <Iconify icon="solar:add-circle-line-duotone" size={32} className=" text-slate-400" />
        </TouchableOpacity>
      </View>
      {assets.length > 0 ? (
        <View className="mt-8 gap-4">
          {assets?.map((asset: any) => (
            <Swipeable
              leftThreshold={100}
              rightThreshold={100}
              containerStyle={{ paddingHorizontal: 28 }}
              key={asset.id}
              renderLeftActions={() => {
                return (
                  <View className="w-1/2 flex-row items-center px-14">
                    <Text className="text-emerald-400">Aktifleştir</Text>
                  </View>
                );
              }}
              renderRightActions={() => {
                return (
                  <View className="w-1/2 flex-row items-center justify-end px-14">
                    <Text className="text-rose-400 ">Pasifleştir</Text>
                  </View>
                );
              }}
              onSwipeableWillOpen={(direction) => {
                if (direction === 'left') {
                  handleActivateAsset(asset.id);
                } else {
                  handleDeactivateAsset(asset.id);
                }
              }}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => {
                  setAsset(asset);
                  assetModalRef.current?.present();
                }}>
                <View
                  style={{
                    backgroundColor: asset?.active ? 'rgb(236 253 245)' : 'rgb(255 241 242)',
                  }}
                  className="flex-row rounded-xl p-4 shadow-soft-5">
                  <Text className="text-lg">{asset.name}</Text>
                </View>
              </TouchableOpacity>
            </Swipeable>
          ))}
        </View>
      ) : (
        <View className="items-center gap-4 py-7">
          <Iconify icon="solar:ghost-bold-duotone" size={48} className="text-slate-400" />
          <View className="items-center">
            <Text className="text-muted-foreground">
              Henüz bir {getAssetLabel(branch?.sector?.value)?.singular} eklememişsiniz.
            </Text>
            <Text className="text-muted-foreground">
              Eklemek isterseniz sağ üstteki artı butonuna tıklayınız.
            </Text>
          </View>
        </View>
      )}
      <AssetFormBottomSheet
        ref={assetModalRef}
        asset={asset}
        onCreate={() => {
          fetchAssets();
          assetModalRef.current?.dismiss();
        }}
      />
    </ScrollView>
  );
};

export default AssetTabContent;
