import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

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

const CreateBranchModal = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { image, setImage, pickImage } = useImagePicker();
  const { session } = useGlobalContext();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    country: '',
    city: '',
    location: '',
    thumbnail: '',
    reservation_period: 0,
    sector: '',
  });
  const setField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };
  // variables
  const snapPoints = useMemo(() => ['50%', '75%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <>
      <TouchableOpacity activeOpacity={0.75} onPress={handlePresentModalPress}>
        <Iconify icon="solar:add-circle-line-duotone" size={32} className=" text-slate-400" />
      </TouchableOpacity>
      <BottomSheetModal
        backgroundStyle={{ backgroundColor: 'rgb(248 250 252)' }}
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}>
        <BottomSheetView>
          <ScrollView>
            <View className="gap-4 p-7">
              <View>
                <Label nativeID="thumbnail">Küçük Resim</Label>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={pickImage}
                  className="aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-background">
                  {formData.thumbnail || image ? (
                    <Image
                      source={
                        image
                          ? { uri: image.uri }
                          : formData.thumbnail
                            ? { uri: formData.thumbnail }
                            : require('~/assets/no-image.png')
                      }
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
                <Select>
                  <SelectTrigger>
                    <SelectValue className="text-stone-400" placeholder="Select a sector" />
                  </SelectTrigger>
                  <SelectContent insets={contentInsets} className="w-full">
                    <SelectGroup>
                      <SelectLabel>Sektörler</SelectLabel>
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
                  value={formData.phone}
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
                  value={formData.phone}
                  onChangeText={(value) => {
                    setField('city', value);
                  }}
                  aria-labelledby="city"
                  aria-errormessage="city"
                />
              </View>
              <View className="gap-1">
                <Label nativeID="reservation_period">Rezervasyon Periyodu</Label>
                <Input
                  placeholder="60"
                  keyboardType="numeric"
                  value={formData.phone}
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

              <Button onPress={() => {}} disabled={loading}>
                <Text className="text-slate-100">Kaydet</Text>
              </Button>
            </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default CreateBranchModal;
