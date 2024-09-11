import { Link, Tabs } from 'expo-router';
import { Home } from '~/lib/icons/Home';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: ({ focused }) => (
            <Home className={focused ? 'text-primary' : 'text-zinc-700'} />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ focused }) => (
            <Home className={focused ? 'text-primary' : 'text-zinc-700'} />
          ),
        }}
      />
    </Tabs>
  );
}
