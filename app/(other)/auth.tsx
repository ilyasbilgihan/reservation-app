import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Redirect, router } from 'expo-router';
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  FadeInUp,
  FadeOutUp,
} from 'react-native-reanimated';
import { useGlobalContext } from '~/context/GlobalProvider';

import { supabase } from '~/lib/supabase';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

const SignIn = () => {
  const { session } = useGlobalContext();

  if (session) return <Redirect href="/" />;

  const [formState, setFormState] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    if (formData.email === '' || formData.password === '') {
      console.log('fill fields');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    if (error) {
      console.log('error', error.message);
    }

    /* router.push('/'); */
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);

    if (formData.email === '' || formData.password === '') {
      console.log('fill fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirm_password) {
      console.log('passwords do not match');
      setLoading(false);
      return;
    }

    const {
      data: { session },
      error: signUpError,
    } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });
    if (signUpError) {
      console.log('error', signUpError.message);
      setLoading(false);
      return;
    }
    const { data, error: profileError } = await supabase.from('profile').insert({
      id: session?.user.id,
      email: session?.user.email,
    });

    if (profileError) {
      console.log('error', profileError.message);
      setLoading(false);
      return;
    }

    setLoading(false);

    //router.push('/');
  }

  const setField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };
  const paddingTop = useSharedValue(0);

  const handleAuth = () => {
    if (formState === 'login') {
      signInWithEmail();
    } else {
      signUpWithEmail();
    }
  };

  return (
    <SafeAreaView>
      <View className="h-16 flex-row items-center justify-center px-7">
        <Text animateOnChange className="text-2xl">
          {formState === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
        </Text>
      </View>
      <ScrollView className="h-full">
        <View className="gap-4 px-7 pb-24">
          <View className="items-center">
            <Image source={require('~/assets/splash.webp')} className="my-8 h-72 w-72" />
          </View>
          <View>
            <Label nativeID="email">E-posta</Label>
            <Input
              placeholder="janedoe@mail.com"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(value) => setField('email', value)}
              aria-labelledby="email"
              aria-errormessage="email"
            />
          </View>
          <View>
            <Label nativeID="password">Şifre</Label>
            <Input
              placeholder="********"
              secureTextEntry
              value={formData.password}
              onChangeText={(value) => setField('password', value)}
              aria-labelledby="password"
              aria-errormessage="password"
            />
          </View>
          <Animated.View className="relative" style={{ paddingTop }}>
            {formState === 'register' ? (
              <Animated.View
                className="absolute w-full gap-4"
                entering={FadeInUp.duration(500)}
                exiting={FadeOutUp.duration(250)}>
                <View>
                  <Label nativeID="confirm_password">Şifre Tekrar</Label>
                  <Input
                    placeholder="********"
                    secureTextEntry
                    value={formData.confirm_password}
                    onChangeText={(value) => setField('confirm_password', value)}
                    aria-labelledby="confirm_password"
                    aria-errormessage="confirm_password"
                  />
                </View>
              </Animated.View>
            ) : null}
            <View className="gap-4">
              <Button onPress={handleAuth} disabled={loading}>
                <Text animateOnChange className="text-slate-100">
                  {formState === 'login' ? 'Giriş' : 'Kayıt Ol'}
                </Text>
              </Button>
              <TouchableOpacity
                onPress={() => {
                  if (formState === 'login') {
                    setFormState('register');
                    paddingTop.value = withTiming(80, {
                      duration: 500,
                      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                    });
                  } else {
                    setFormState('login');
                    paddingTop.value = withTiming(0, {
                      duration: 500,
                      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                    });
                  }
                }}>
                <Text className="text-slate-900">
                  {formState === 'login' ? 'Henüz hesabın yok mu?' : 'Zaten bir hesabın var mı?'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
