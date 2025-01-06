import React, { useCallback, useState } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';

import { useFocusEffect } from 'expo-router';

import { useGlobalContext } from '~/context/GlobalProvider';

import { deleteImage, supabase, uploadImageToSupabaseBucket } from '~/utils/supabase';
import useImagePicker from '~/utils/useImagePicker';
import { Text } from '../ui/text';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';

const IndividualTabContent = () => {
  const { session } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [tempImage, setTempImage] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    avatar: '',
  });

  const { pickImage, image, setImage } = useImagePicker();

  const setField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleProfileUpdate = async () => {
    if (loading) return;

    let isValid = isValidForm();
    if (!isValid) return;

    setLoading(true);

    let uploadedImageUrl = null;
    if (image !== undefined) {
      //@ts-ignore
      const { url, error } = await uploadImageToSupabaseBucket('avatars', image);
      if (error) {
        console.log('image upload error', error);
      } else {
        uploadedImageUrl = url;
      }
    }

    // if there is a new image or user wants to delete own image
    if (uploadedImageUrl || formData.avatar == '') {
      // delete image from bucket
      if (tempImage) {
        const { error } = await deleteImage('avatars/' + tempImage);
        if (error) {
          console.log('error deleting image', error);
        }
      }
    }

    const { error } = await supabase
      .from('profile')
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        avatar: uploadedImageUrl || formData.avatar,
      })
      .eq('id', session?.user.id);

    if (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const isValidForm = useCallback(() => {
    let name = formData.full_name?.trim();

    // regex to check phone number
    let regex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}$/;

    if (name == '' || !regex.test(formData.phone)) {
      return false;
    }
    return true;
  }, [formData.phone, formData.full_name]);

  const fetchProfileDetails = async () => {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('id', session?.user.id)
      .single();
    if (data) {
      if (data.avatar) {
        setTempImage(data.avatar.split('avatars/')[1]);
      }
      setFormData({
        full_name: data.full_name,
        phone: data.phone,
        avatar: data.avatar,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfileDetails();
      setImage(undefined);
    }, [])
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProfileDetails();
    setImage(undefined);
    setRefreshing(false);
  }, []);

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View className="gap-4">
        <Text className="text-2xl ">Hesap Bilgilerim</Text>
        <View className="my-8 items-center gap-3">
          <TouchableOpacity activeOpacity={0.75} onPress={pickImage}>
            <Image
              source={
                image
                  ? { uri: Array.isArray(image) ? image[0].uri : image.uri }
                  : formData.avatar
                    ? { uri: formData.avatar }
                    : require('~/assets/no-image.png')
              }
              className="h-32 w-32 rounded-full border border-slate-200"
            />
          </TouchableOpacity>
          {formData.avatar || image ? (
            <TouchableOpacity
              onPress={() => {
                setField('avatar', '');
                setImage(undefined);
              }}>
              <Text className="text-destructive">Avatarı Kaldır</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View className="gap-1">
          <Label nativeID="full_name">Ad Soyad</Label>
          <Input
            placeholder="Mehmet Yılmaz"
            value={formData.full_name}
            onChangeText={(value) => setField('full_name', value)}
            aria-labelledby="full_name"
            aria-errormessage="full_name"
          />
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
        <Button onPress={handleProfileUpdate} disabled={loading}>
          <Text className="text-slate-100">Kaydet</Text>
        </Button>
        {!isValidForm() ? (
          <Text className="text-destructive">
            * Hesap bilgilerinizi eksiksiz doldurmadığınız sürece rezervasyon alamayacağınızı
            hatırlatmak isteriz.
          </Text>
        ) : null}
        <Button
          variant="destructive"
          onPress={() => {
            supabase.auth.signOut();
          }}
          disabled={loading}>
          <Text className="text-slate-100">Çıkış Yap</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default IndividualTabContent;
