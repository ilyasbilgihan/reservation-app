import { Redirect, Tabs } from 'expo-router';
import { View } from 'react-native';
import { useGlobalContext } from '~/context/GlobalProvider';
import { Iconify } from '~/lib/icons/Iconify';

export default function TabLayout() {
  const { session } = useGlobalContext();

  if (!session) return <Redirect href="/auth" />;

  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        tabBarHideOnKeyboard: true,
        tabBarIconStyle: {
          paddingVertical: 0,
        },
        tabBarLabelStyle: {
          height: 20,
          fontSize: 11,
        },
        tabBarStyle: {
          height: 60,
          borderColor: '#FAF9FB',
          backgroundColor: '#FAF9FB',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Iconify
                icon="solar:home-2-bold-duotone"
                size={24}
                className={focused ? 'text-primary' : 'text-zinc-700'}
              />
            ) : (
              <Iconify
                icon="solar:home-2-line-duotone"
                size={24}
                className={focused ? 'text-primary' : 'text-zinc-700'}
              />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Iconify
                icon="solar:user-bold-duotone"
                size={24}
                className={focused ? 'text-primary' : 'text-zinc-700'}
              />
            ) : (
              <Iconify
                icon="solar:user-line-duotone"
                size={24}
                className={focused ? 'text-primary' : 'text-zinc-700'}
              />
            ),
        }}
      />
    </Tabs>
  );
}
