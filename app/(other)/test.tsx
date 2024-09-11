import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Text } from '~/components/ui/text';

export default function Test() {
  return (
    <>
      <Text>test</Text>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
