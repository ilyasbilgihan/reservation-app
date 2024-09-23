import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, Alert, Pressable } from 'react-native';

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
import { getSectorItem } from '~/utils/getLabels';
import { Text } from './ui/text';
import LocationPicker from './LocationPicker';
import { Textarea } from './ui/textarea';

const NUM_OF_MAX_IMAGES = 4;

const BranchFormBottomSheet = forwardRef<
  BottomSheetModal,
  {
    branch?: any;
    onCreate: () => void;
  }
>(({ onCreate, branch }, ref) => {
  const { image, setImage, pickImage } = useImagePicker();
  const {
    image: images,
    setImage: setImages,
    pickImage: pickImages,
  } = useImagePicker([1, 1], 2000000, true);
  const { session, setBranch } = useGlobalContext();

  const [loading, setLoading] = useState(false);
  const [existingImages, setExistingImages] = useState(branch?.branch_image || []);
  const [formData, setFormData] = useState({
    name: branch?.name || '',
    phone: branch?.phone || '',
    country: branch?.country || '',
    city: branch?.city || '',
    location: branch?.location || '',
    thumbnail: branch?.thumbnail || '',
    reservation_period: branch?.reservation_period || '',
    sector: branch?.sector || '',
    details: branch?.details || '',
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

  const handleImageGallery = async (id: any) => {
    let tmp = branch?.branch_image;
    let deleted = tmp?.filter((item: any) => !existingImages.includes(item));
    let err = null;

    if (deleted) {
      for (let i = 0; i < deleted.length; i++) {
        const image = deleted[i];
        const { error } = await deleteImage('branch_image/' + image.uri.split('branch_image/')[1]);
        if (error) {
          err = error;
        } else {
          await supabase.from('branch_image').delete().eq('uri', image.uri).select('*');
        }
      }
    }

    if (Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const { url, error } = await uploadImageToSupabaseBucket('branch_image', image);
        if (error) {
          err = error;
        } else {
          const { error: insErr } = await supabase.from('branch_image').insert({
            branch_id: id,
            uri: url,
          });
          if (insErr) {
            err = insErr;
          }
        }
      }
    }

    return { error: err };
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
      //@ts-ignore
      const { url, error } = await uploadImageToSupabaseBucket('branch_thumbnails', image);
      if (error) {
        console.log('image upload error', error);
        setLoading(false);
        return;
      } else {
        uploadedImageUrl = url;
      }
    }

    if (branch) {
      const { error: galleryError } = await handleImageGallery(branch?.id);
      if (galleryError) {
        console.log('gallery error', galleryError);
        setLoading(false);
        return;
      }
      // if there is a new image or user wants to delete own image
      if (uploadedImageUrl) {
        // delete image from bucket
        const { error } = await deleteImage(
          'branch_thumbnails/' + formData.thumbnail.split('branch_thumbnails/')[1]
        );
        if (error) {
          console.log('error deleting image', error);
          setLoading(false);
          return;
        }
      }

      const { error } = await supabase
        .from('branch')
        .update({
          ...formData,
          sector: formData.sector.value,
          thumbnail: uploadedImageUrl || formData.thumbnail,
        })
        .eq('id', branch?.id);

      if (error) {
        Alert.alert('Error update', error.message);
        console.log('error update', error.message);
        setLoading(false);
        return;
      } else {
        setBranch({
          ...formData,
          id: branch?.id,
          thumbnail: uploadedImageUrl || formData.thumbnail,
        });
        setImage(undefined);
        setImages(undefined);
      }
    } else {
      const { data, error } = await supabase
        .from('branch')
        .insert({
          ...formData,
          sector: formData.sector.value,
          thumbnail: uploadedImageUrl || formData.thumbnail,
          owner_id: session?.user.id,
        })
        .select('id')
        .single();

      if (error) {
        Alert.alert('Error create', error.message);
        console.log('error create', error.message);
        setLoading(false);
        return;
      } else {
        const { error: workingHourError } = await supabase.from('working_hour').insert([
          { branch_id: data.id, day: 'Monday' },
          { branch_id: data.id, day: 'Tuesday' },
          { branch_id: data.id, day: 'Wednesday' },
          { branch_id: data.id, day: 'Thursday' },
          { branch_id: data.id, day: 'Friday' },
          { branch_id: data.id, day: 'Saturday' },
          { branch_id: data.id, day: 'Sunday' },
        ]);
        if (workingHourError) {
          console.log('working hour error', workingHourError);
          setLoading(false);
          return;
        }

        const { error } = await handleImageGallery(data.id);
        if (error) {
          console.log('gallery create error', error);
          setLoading(false);
          return;
        }
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

  useEffect(() => {
    setExistingImages(branch?.branch_image || []);
    setFormData({
      name: branch?.name || '',
      phone: branch?.phone || '',
      country: branch?.country || '',
      city: branch?.city || '',
      location: branch?.location || '',
      thumbnail: branch?.thumbnail || '',
      reservation_period: branch?.reservation_period || '',
      sector: branch?.sector || '',
      details: branch?.details || '',
    });
  }, [branch]);

  return (
    <>
      <BottomSheet ref={ref}>
        <BottomSheetView>
          <ScrollView>
            <View className="gap-3.5 p-7">
              <View className="gap-1">
                <Label nativeID="thumbnail">Küçük Resim</Label>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={pickImage}
                  className="aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-background">
                  {formData.thumbnail || image ? (
                    <Image
                      //@ts-ignore
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
                <Label nativeID="gallery">Resim Galerisi</Label>
                <View className="w-full flex-row items-center justify-between gap-3.5">
                  {
                    // array from num_of_max_images
                    Array.from({ length: NUM_OF_MAX_IMAGES }).map((_, index) => {
                      let allImages = [
                        ...(Array.isArray(existingImages) ? existingImages : []),
                        ...(Array.isArray(images) ? images : []),
                      ];
                      return (
                        <TouchableOpacity
                          activeOpacity={0.75}
                          onPress={() => {
                            if (existingImages[index]) {
                              setExistingImages(
                                existingImages.filter((_: any, i: any) => i !== index)
                              );
                            } else if (
                              Array.isArray(images) &&
                              images[index - existingImages.length]
                            ) {
                              setImages(
                                images.filter((_, i) => i !== index - existingImages.length)
                              );
                            } else {
                              pickImages();
                            }
                          }}
                          key={index}
                          className="aspect-square flex-1 items-center justify-center overflow-hidden rounded-lg border border-input bg-background">
                          {allImages[index]?.uri ? (
                            <Image
                              //@ts-ignore
                              source={{ uri: allImages[index]?.uri }}
                              className="h-full w-full"
                            />
                          ) : (
                            <Iconify
                              icon="solar:gallery-add-bold-duotone"
                              size={20}
                              className=" text-slate-400"
                            />
                          )}
                        </TouchableOpacity>
                      );
                    })
                  }
                </View>
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
                <View className="flex-row items-end justify-between">
                  <Label nativeID="details">Şube Detayı</Label>
                  <Text className="text-sm">{formData.details.length}/256</Text>
                </View>
                <Textarea
                  placeholder="Müşterilerinizi etkileyecek bir tanıtım yazısı ekle."
                  value={formData.details}
                  onChangeText={(item: any) => {
                    if (item.length <= 256) {
                      setField('details', item);
                    }
                  }}
                  aria-labelledby="details"
                />
              </View>
              <View className="gap-1">
                <Label nativeID="sector">Sektör</Label>
                <Select
                  defaultValue={formData.sector}
                  onValueChange={(item: any) => {
                    let lbl = getSectorItem(item.value)?.value;
                    setField('sector', { value: item.value, label: lbl });
                  }}>
                  <SelectTrigger>
                    <SelectValue
                      style={{ color: formData.sector ? 'black' : 'rgb(163 163 163)' }}
                      className="font-qs-medium text-muted-foreground "
                      placeholder="Şubeyle ilgili bir sektör seç"
                    />
                  </SelectTrigger>
                  <SelectContent insets={contentInsets} className="w-full">
                    <SelectGroup>
                      <SelectLabel className="text-stone-400">Sektörler</SelectLabel>
                      <SelectItem className="font-qs-medium" label="Bakım" value="Grooming">
                        Bakım
                      </SelectItem>
                      <SelectItem label="Konaklama" value="Accommodation">
                        Konaklama
                      </SelectItem>
                      <SelectItem label="Kiralama" value="Rental">
                        Kiralama
                      </SelectItem>
                      <SelectItem label="Yemek" value="Food">
                        Yemek
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
                <Label nativeID="city">Konum Seç</Label>
                <LocationPicker
                  defaultRegion={{ latitude: branch?.lat, longitude: branch?.long }}
                  hideLabelInput
                  onLocationSelect={(location: any) => {
                    setField('location', `POINT(${location.longitude} ${location.latitude})`);
                  }}>
                  <View className="h-12 flex-row items-center gap-2 rounded-md border border-input bg-background px-4">
                    <Iconify
                      icon="solar:point-on-map-bold-duotone"
                      size={24}
                      className="text-primary"
                    />
                    <Text className="font-qs-semibold text-slate-500">
                      {formData.location ? ' Seçili Konumu Değiştir' : `Haritayı Aç`}
                    </Text>
                  </View>
                </LocationPicker>
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
