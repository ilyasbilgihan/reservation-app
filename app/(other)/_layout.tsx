import { Link, Tabs, Stack } from 'expo-router';
import { Home } from '~/lib/icons/Home';

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="auth" />
    </Stack>
  );
}
