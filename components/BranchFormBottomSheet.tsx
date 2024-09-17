import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, Platform, Pressable } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import { BottomSheetView, BottomSheetModal, BottomSheetFooterProps } from '@gorhom/bottom-sheet';
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
import { supabase, uploadImageToSupabaseBucket } from '~/utils/supabase';
import { getSectorLabel } from '~/utils/getLabels';

const BranchFormBottomSheet = forwardRef<
  BottomSheetModal,
  {
    branch?: any;
    onCreate: () => void;
  }
>(({ onCreate, branch }, ref) => {
  const { image, setImage, pickImage } = useImagePicker();
  const { session } = useGlobalContext();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: branch?.name || '',
    phone: branch?.phone || '',
    country: branch?.country || '',
    city: branch?.city || '',
    location: branch?.location || '',
    thumbnail: branch?.thumbnail || '',
    reservation_period: branch?.reservation_period || '',
    sector: branch?.sector || '',
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

  const handleCreateBranch = async () => {
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
    /* 
    // if there is a new image or user wants to delete own image
    if (uploadedImageUrl) {
      // delete image from bucket
      const { error } = await deleteImage('avatars/' + tempImage);
        if (error) {
          console.log('error deleting image', error);
        }
    } */

    if (branch) {
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
        Alert.alert('Error update', error.message);
        console.log('error update', error.message);
      }
    } else {
      const { data, error } = await supabase
        .from('branch')
        .insert({
          name: formData.name,
          phone: formData.phone,
          country: formData.country,
          city: formData.city,
          location: formData.location,
          thumbnail: uploadedImageUrl,
          reservation_period: formData.reservation_period,
          sector: formData.sector.value,
          owner_id: session?.user.id,
        })
        .select('id')
        .single();

      if (error) {
        Alert.alert('Error create', error.message);
        console.log('error create', error.message);
      } else {
        const { error } = await supabase.from('working_hour').insert([
          { branch_id: data.id, day: 'Monday' },
          { branch_id: data.id, day: 'Tuesday' },
          { branch_id: data.id, day: 'Wednesday' },
          { branch_id: data.id, day: 'Thursday' },
          { branch_id: data.id, day: 'Friday' },
          { branch_id: data.id, day: 'Saturday' },
          { branch_id: data.id, day: 'Sunday' },
        ]);
        console.log(data.id, error);
      }
    }

    setLoading(false);
    onCreate();
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
      <BottomSheet ref={ref}>
        <BottomSheetView>
          <ScrollView>
            <View className="gap-4 p-7">
              <View>
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
              </View>
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
                  defaultValue={formData.sector}
                  onValueChange={(item: any) => {
                    let lbl = getSectorLabel(item.value);
                    setField('sector', { value: item.value, label: lbl });
                  }}>
                  <SelectTrigger>
                    <SelectValue
                      style={{ color: formData.sector ? 'black' : 'rgb(163 163 163)' }}
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
                <View className="flex-row items-center gap-2">
                  <Label nativeID="reservation_period">Rezervasyon Periyodu</Label>
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
                        Dakika cinsinden alınabilecek en kısa rezervasyon süresi.
                      </Text>
                    </TooltipContent>
                  </Tooltip>
                </View>
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
              </View>

              <Button onPress={handleCreateBranch} disabled={loading}>
                <Text className="text-slate-100">{branch ? 'Kaydet' : 'Oluştur'}</Text>
              </Button>
            </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
});

export default BranchFormBottomSheet;
