import { Redirect, Tabs } from 'expo-router';
import { View, TouchableOpacity } from 'react-native';
import { useGlobalContext } from '~/context/GlobalProvider';
import { Iconify } from '~/lib/icons/Iconify';

export default function TabLayout() {
  const { session, branch } = useGlobalContext();

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
          title: 'Keşfet',
          headerShown: false,
          tabBarButton(props) {
            return branch ? null : <TouchableOpacity {...props} />;
          },
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Iconify
                icon="solar:compass-bold-duotone"
                size={24}
                className={focused ? 'text-primary' : 'text-zinc-700'}
              />
            ) : (
              <Iconify
                icon="solar:compass-line-duotone"
                size={24}
                className={focused ? 'text-primary' : 'text-zinc-700'}
              />
            ),
        }}
      />
      <Tabs.Screen
        name="branch"
        options={{
          title: 'Şube',
          tabBarButton(props) {
            return branch ? <TouchableOpacity {...props} /> : null;
          },
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Iconify
                icon="solar:shop-bold-duotone"
                size={24}
                className={focused ? 'text-primary' : 'text-zinc-700'}
              />
            ) : (
              <Iconify
                icon="solar:shop-line-duotone"
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
