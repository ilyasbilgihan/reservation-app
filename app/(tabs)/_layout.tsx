import { Redirect, Tabs } from 'expo-router';

import { useGlobalContext } from '~/context/GlobalProvider';
import TabBar from '~/components/TabBar';

export default function TabLayout() {
  const { session, branch } = useGlobalContext();

  if (!session) return <Redirect href="/auth" />;

  return (
    <Tabs
      tabBar={TabBar}
      sceneContainerStyle={{ backgroundColor: '#FAF9FB' }}
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#FAF9FB' },
        headerShadowVisible: false,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: 'rgb(101 115 135)',
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
        name="profile"
        options={{
          title: 'Profil',
        }}
      />
    </Tabs>
  );
}
