import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { deleteImage, supabase, uploadImageToSupabaseBucket } from '~/utils/supabase';
import { useFocusEffect } from 'expo-router';

const CreateBranchModal = ({ onCreate, branch }: any) => {
  const { image, setImage, pickImage } = useImagePicker();
  const { session, setBranch } = useGlobalContext();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: branch?.name,
    phone: branch?.phone,
    country: branch?.country,
    city: branch?.city,
    location: branch?.location,
    thumbnail: branch?.thumbnail,
    reservation_period: branch?.reservation_period,
    sector: branch?.sector?.value,
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

  useFocusEffect(
    useCallback(() => {
      setFormData({
        name: branch?.name,
        phone: branch?.phone,
        country: branch?.country,
        city: branch?.city,
        location: branch?.location,
        thumbnail: branch?.thumbnail,
        reservation_period: branch?.reservation_period,
        sector: branch?.sector,
      });
    }, [branch])
  );

  const handleUpdateBranch = async () => {
    if (loading) return;

    let phoneValidation = isValidPhone();
    if (!phoneValidation) {
      Alert.alert('Error', 'Invalid phone number');
      return;
    }

    setLoading(true);

    let uploadedImageUrl = null;
    if (image !== undefined) {
      const { url, error } = await uploadImageToSupabaseBucket('branch_thumbnails', image);
      if (error) {
        console.log('image upload error', error);
      } else {
        uploadedImageUrl = url;
      }
    }

    // if there is a new image or user wants to delete own image
    if (uploadedImageUrl) {
      // delete image from bucket
      const { error } = await deleteImage(
        'branch_thumbnails/' + branch.thumbnail.split('branch_thumbnails/')[1]
      );
      if (error) {
        console.log('error deleting image', error);
      }
    }

    const { error } = await supabase
      .from('branch')
      .update({
        name: formData.name,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        location: formData.location,
        thumbnail: uploadedImageUrl || formData.thumbnail,
        reservation_period: formData.reservation_period,
        sector: formData.sector.value,
        owner_id: session?.user.id,
      })
      .eq('id', branch?.id);

    if (error) {
      Alert.alert('Error', error.message);
      console.log('error', error.message);
    } else {
      setBranch({
        id: branch?.id,
        name: formData.name,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        location: formData.location,
        thumbnail: uploadedImageUrl || formData.thumbnail,
        reservation_period: formData.reservation_period,
        sector: formData.sector,
        owner_id: session?.user.id,
      });
    }

    setLoading(false);
  };

  const isValidPhone = useCallback(() => {
    // regex to check phone number
    let regex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}$/;

    if (regex.test(formData.phone)) {
      return true;
    }
    return false;
  }, [formData.phone]);

  return (
    <>
      <ScrollView>
        <View className="gap-4 py-7">
          <View className="gap-1">
            <Label nativeID="name">Şube Adı</Label>
            <Input
              placeholder="Fatih Berber Salonu"
              value={formData.name}
              onChangeText={(value) => setField('name', value)}
              aria-labelledby="name"
              aria-errormessage="name"
            />
          </View>
          <View className="gap-1">
            <Label nativeID="sector">Sektör</Label>
            <Select
              value={formData.sector}
              onValueChange={(item: any) => {
                // @ts-ignore
                let lbl = {
                  Accommodation: 'Konaklama Hizmetleri',
                  Rental: 'Kiralama Hizmetleri',
                  Grooming: 'Bakım Hizmetleri',
                  Food: 'Yemek Hizmetleri',
                }[item.value];
                setField('sector', { value: item.value, label: lbl });
              }}>
              <SelectTrigger>
                <SelectValue
                  style={{ color: formData.sector != null ? 'black' : 'rgb(163 163 163)' }}
                  className="text-lg text-muted-foreground "
                  placeholder="Şubeyle ilgili bir sektör seç"
                />
              </SelectTrigger>
              <SelectContent insets={contentInsets} className="w-full">
                <SelectGroup>
                  <SelectLabel className="text-stone-400">Sektörler</SelectLabel>
                  <SelectItem label="Bakım Hizmetleri" value="Grooming">
                    Bakım Hizmetleri
                  </SelectItem>
                  <SelectItem label="Konaklama Hizmetleri" value="Accommodation">
                    Konaklama Hizmetleri
                  </SelectItem>
                  <SelectItem label="Kiralama Hizmetleri" value="Rental">
                    Kiralama Hizmetleri
                  </SelectItem>
                  <SelectItem label="Yemek Hizmetleri" value="Food">
                    Yemek Hizmetleri
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </View>
          <View className="gap-1">
            <Label nativeID="phone">Telefon</Label>
            <Input
              placeholder="+90 555 123 45 67"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(value) => {
                setField('phone', value);
              }}
              aria-labelledby="phone"
              aria-errormessage="phone"
            />
          </View>
          <View className="gap-1">
            <Label nativeID="country">Ülke</Label>
            <Input
              placeholder="Türkiye"
              value={formData.country}
              onChangeText={(value) => {
                setField('country', value);
              }}
              aria-labelledby="country"
              aria-errormessage="country"
            />
          </View>
          <View className="gap-1">
            <Label nativeID="city">Şehir</Label>
            <Input
              placeholder="Denizli"
              value={formData.city}
              onChangeText={(value) => {
                setField('city', value);
              }}
              aria-labelledby="city"
              aria-errormessage="city"
            />
          </View>
          <View className="gap-1">
            <Label nativeID="reservation_period">Rezervasyon Periyodu </Label>
            <Input
              placeholder="60"
              keyboardType="numeric"
              value={'' + formData.reservation_period}
              onChangeText={(value) => {
                setField('reservation_period', value);
              }}
              aria-labelledby="reservation_period"
              aria-errormessage="reservation_period"
            />
            <Text className="text-sm italic text-slate-500">
              * Dakika cinsinden alınabilecek en kısa rezervasyon süresi.
            </Text>
          </View>

          <Button onPress={handleUpdateBranch} disabled={loading}>
            <Text className="text-slate-100">Kaydet</Text>
          </Button>
        </View>
      </ScrollView>
    </>
  );
};

export default CreateBranchModal;
