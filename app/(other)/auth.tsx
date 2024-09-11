import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Redirect, router, useNavigation } from 'expo-router';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { useGlobalContext } from '~/context/GlobalProvider';

import { supabase } from '~/utils/supabase';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';

const SignIn = () => {
  const { session } = useGlobalContext();
  if (session) return <Redirect href="/" />;

  const [formState, setFormState] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    username: '',
  });
  const navigation = useNavigation();
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
    /* const { data, error: profileError } = await supabase.from('profile').insert({
      username: formData.username,
      id: session?.user.id,
      email: session?.user.email,
      role: 'admin', // test
    });

    if (profileError) {
      console.log('error', profileError.message);
      setLoading(false);
      return;
    } */

    setLoading(false);

    //router.push('/');
  }

  const setField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };
  const top = useSharedValue(-50);

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
        <Text className="text-2xl">{formState === 'login' ? 'Login' : 'Register'}</Text>
      </View>
      <ScrollView>
        <View className="gap-4 px-7 pb-7">
          <View>
            <Label nativeID="email">E-posta</Label>
            <Input
              placeholder="janedoe@mail.com"
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
              value={formData.password}
              onChangeText={(value) => setField('password', value)}
              aria-labelledby="password"
              aria-errormessage="password"
            />
          </View>
          {formState === 'register' ? (
            <Animated.View
              className="gap-4"
              style={{
                top,
              }}>
              <View>
                <Label nativeID="confirm_password">Şifre Tekrar</Label>
                <Input
                  placeholder="********"
                  value={formData.confirm_password}
                  onChangeText={(value) => setField('confirm_password', value)}
                  aria-labelledby="confirm_password"
                  aria-errormessage="confirm_password"
                />
              </View>
              <Button onPress={handleAuth} disabled={loading}>
                <Text className="text-slate-100">Register</Text>
              </Button>
              <TouchableOpacity
                onPress={() => {
                  top.value = withSpring(top.value - 50);
                  setFormState('login');
                }}>
                <Text className="text-slate-900">Already have an account?</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <>
              <Button onPress={handleAuth} disabled={loading}>
                <Text className="text-slate-100">Login</Text>
              </Button>
              <TouchableOpacity
                onPress={() => {
                  top.value = withSpring(top.value + 50);
                  setFormState('register');
                }}>
                <Text className="text-slate-900">Don't have an account?</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
