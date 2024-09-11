import { Stack, Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import * as React from 'react';
import { Text } from '~/components/ui/text';
export default function Home() {
  return (
    <>
      <Link href="/(other)/test" className="text-red-500">
        asdasd
      </Link>
    </>
  );
}
