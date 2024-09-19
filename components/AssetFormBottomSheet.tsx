import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { View, Alert, Pressable } from 'react-native';

import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { BottomSheetView, BottomSheetModal } from '@gorhom/bottom-sheet';
import BottomSheet from './BottomSheet';

import { Iconify } from '~/lib/icons/Iconify';
import useImagePicker from '~/utils/useImagePicker';
import { useGlobalContext } from '~/context/GlobalProvider';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '~/utils/supabase';
import { getSectorItem } from '~/utils/getLabels';
import { Text } from './ui/text';

const AssetFormBottomSheet = forwardRef<
  BottomSheetModal,
  {
    asset?: any;
    onCreate: () => void;
  }
>(({ onCreate, asset }, ref) => {
  const { image, setImage, pickImage } = useImagePicker();
  const { branch } = useGlobalContext();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: asset?.name || '',
    price: asset?.price || '',
  });
  const setField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset?.name || '',
        price: asset?.price || '',
      });
    }
  }, [asset]);

  const handleCreateAsset = async () => {
    if (loading) return;

    setLoading(true);

    /* let uploadedImageUrl = null;
    if (image !== undefined) {
      const { url, error } = await uploadImageToSupabaseBucket('branch_thumbnails', image);
      if (error) {
        console.log('image upload error', error);
      } else {
        uploadedImageUrl = url;
      }
    } */
    /* 
    // if there is a new image or user wants to delete own image
    if (uploadedImageUrl) {
      // delete image from bucket
      const { error } = await deleteImage('avatars/' + tempImage);
        if (error) {
          console.log('error deleting image', error);
        }
    } */

    if (asset) {
      const { error } = await supabase
        .from('asset')
        .update({
          ...formData,
          branch_id: branch?.id,
        })
        .eq('id', asset?.id);

      if (error) {
        Alert.alert('Error update', error.message);
        console.log('error update', error.message);
        setLoading(false);
        return;
      }
    } else {
      const { data, error } = await supabase.from('asset').insert({
        ...formData,
        branch_id: branch?.id,
      });

      if (error) {
        Alert.alert('Error create', error.message);
        console.log('error create', error.message);
        setLoading(false);
        return;
      } else {
        setFormData({
          name: '',
          price: '',
        });
      }
    }

    setLoading(false);
    onCreate();
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setFormData({
      name: asset?.name || '',
      price: asset?.price || '',
    });
    setLoading(false);
    setRefreshing(false);
  }, [asset]);

  return (
    <>
      <BottomSheet ref={ref} snapPoints={['33%', '66%']}>
        <BottomSheetView>
          <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View className="gap-4 p-7">
              {/* <View>
                <Label nativeID="thumbnail">Küçük Resim</Label>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={pickImage}
                  className="aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-background">
                  {formData.thumbnail || image ? (
                    <Image
                      source={image ? { uri: image.uri } : { uri: formData.thumbnail }}
                      className="h-full w-full"
                    />
                  ) : (
                    <Iconify
                      icon="solar:gallery-add-bold-duotone"
                      size={32}
                      className=" text-slate-400"
                    />
                  )}
                </TouchableOpacity>
                {formData.thumbnail && image ? (
                  <TouchableOpacity
                    onPress={() => {
                      setImage(undefined);
                    }}>
                    <Text className="text-destructive">Seçilen Resmi Kaldır</Text>
                  </TouchableOpacity>
                ) : null}
              </View> */}
              <View className="gap-1">
                <Label nativeID="name" style={{ textTransform: 'capitalize' }}>
                  {getSectorItem(branch?.sector?.value)?.singular} Adı
                </Label>
                <Input
                  placeholder={getSectorItem(branch?.sector?.value)?.placeholder}
                  value={formData.name}
                  onChangeText={(value) => setField('name', value)}
                  aria-labelledby="name"
                  aria-errormessage="name"
                />
              </View>

              <View className="gap-1">
                <View className="flex-row items-center gap-2">
                  <Label nativeID="price">Ücret</Label>
                  <Tooltip delayDuration={150}>
                    <TooltipTrigger asChild>
                      <Pressable>
                        <Iconify
                          icon="solar:question-circle-bold"
                          size={20}
                          className=" text-slate-400"
                        />
                      </Pressable>
                    </TooltipTrigger>
                    <TooltipContent insets={contentInsets}>
                      <Text className="text-sm text-slate-700">
                        Bu {getSectorItem(branch?.sector?.value)?.singular} için başlangıç ücreti.
                      </Text>
                    </TooltipContent>
                  </Tooltip>
                </View>
                <Input
                  placeholder="200"
                  keyboardType="numeric"
                  value={formData.price}
                  onChangeText={(value) => {
                    setField('price', value);
                  }}
                  aria-labelledby="price"
                  aria-errormessage="price"
                />
              </View>
              <Button onPress={handleCreateAsset} disabled={loading}>
                <Text className="text-slate-100">{asset ? 'Kaydet' : 'Oluştur'}</Text>
              </Button>
            </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
});

export default AssetFormBottomSheet;
