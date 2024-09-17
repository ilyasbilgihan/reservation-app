import { useCallback, useRef, useState } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { useFocusEffect } from 'expo-router';

import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
} from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler';
import { useGlobalContext } from '~/context/GlobalProvider';
import { deleteImage, supabase, uploadImageToSupabaseBucket } from '~/utils/supabase';
import useImagePicker from '~/utils/useImagePicker';

import BranchFormBottomSheet from '~/components/BranchFormBottomSheet';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Iconify } from '~/lib/icons/Iconify';
import BranchItem from '~/components/BranchItem';

import { BottomSheetModal } from '@gorhom/bottom-sheet';

export default function Profile() {
  const { session, setBranch, branch } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<any>([]);
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

  const [value, setValue] = useState('individual');

  const handleProfileUpdate = async () => {
    if (loading) return;

    let isValid = isValidForm();
    if (!isValid) return;

    setLoading(true);

    let uploadedImageUrl = null;
    if (image !== undefined) {
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
    let name = formData.full_name.trim();

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

  const fetchBranches = async () => {
    const { data, error } = await supabase
      .from('branch')
      .select('*')
      .eq('owner_id', session?.user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setBranches(data);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfileDetails();
      fetchBranches();
      setImage(undefined);
    }, [])
  );

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <Tabs
      value={value}
      onValueChange={setValue}
      className="mx-auto w-full max-w-[400px] flex-col gap-1.5">
      <View className="px-7">
        <TabsList className=" w-full flex-row">
          <TabsTrigger value="individual" className="flex-1">
            <Text>Bireysel</Text>
          </TabsTrigger>
          <TabsTrigger value="company" className="flex-1">
            <Text>Kurumsal</Text>
          </TabsTrigger>
        </TabsList>
      </View>
      <TabsContent value="individual">
        <ScrollView>
          <Animated.View
            className="gap-4 px-7 py-7"
            entering={FadeInLeft.delay(250).duration(250)}
            exiting={FadeOutLeft.duration(500)}>
            <Text className="text-2xl ">Hesap Bilgilerim</Text>
            <View className="my-8 items-center gap-3">
              <TouchableOpacity activeOpacity={0.75} onPress={pickImage}>
                <Image
                  source={
                    image
                      ? { uri: image.uri }
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
          </Animated.View>
        </ScrollView>
      </TabsContent>
      <TabsContent value="company">
        <ScrollView>
          <Animated.View
            className="p-7"
            entering={FadeInRight.delay(250).duration(250)}
            exiting={FadeOutRight.duration(500)}>
            <View className="flex-row items-center justify-between">
              <Text className="font-qs-semibold text-2xl">Şubelerim</Text>
              <TouchableOpacity activeOpacity={0.75} onPress={handlePresentModalPress}>
                <Iconify
                  icon="solar:add-circle-line-duotone"
                  size={32}
                  className=" text-slate-400"
                />
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
              <View className="mt-4 gap-4">
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
                  * Şube görünümüne girmek veya şube görünümünden çıkmak istediğiniz şubenize
                  tıklayınız. Düzenlemek için ise basılı tutunuz.
                </Text>
                {/* <Text>{JSON.stringify(branches, null, 2)}</Text> */}
              </View>
            ) : (
              <View className="items-center gap-4 py-7">
                <Iconify icon="solar:ghost-bold-duotone" size={48} className="text-slate-400" />
                <View className="items-center">
                  <Text className="text-muted-foreground">Henüz bir şube eklememişsin.</Text>
                  <Text className="text-muted-foreground">
                    Eklemek istersen sağ üstteki artı butonuna tıkla.
                  </Text>
                </View>
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </TabsContent>
    </Tabs>
  );
}
