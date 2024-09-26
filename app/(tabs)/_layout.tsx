import { Redirect, Tabs } from 'expo-router';

import { useGlobalContext } from '~/context/GlobalProvider';
import TabBar from '~/components/TabBar';

export default function TabLayout() {
  const { session, branch } = useGlobalContext();

  if (!session) return <Redirect href="/auth" />;

  return (
    <Tabs
      tabBar={TabBar}
      sceneContainerStyle={{ backgroundColor: 'white', paddingBottom: 70 }}
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: 'white' },
        headerShadowVisible: false,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: 'rgb(101 115 134)',
        tabBarActiveTintColor: 'hsl(260 51% 41%)',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Keşfet',
          headerShown: false,
          tabBarButton: branch ? () => <></> : undefined,
        }}
      />
      <Tabs.Screen
        name="branch"
        options={{
          title: 'Şube',
          headerShown: false,
          tabBarButton: branch ? undefined : () => <></>,
        }}
      />
      <Tabs.Screen
        name="my-reservations"
        options={{
          headerShown: false,
          tabBarButton: branch ? () => <></> : undefined,
        }}
      />
      <Tabs.Screen
        name="branch-reservations"
        options={{
          headerShown: false,
          tabBarButton: branch ? undefined : () => <></>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
        }}
      />
    </Tabs>
  );
}
