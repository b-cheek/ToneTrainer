import { useEffect } from 'react';
import { Stack } from "expo-router";
import { loadDatabase } from '@/utils/Database';

export default function RootLayout() {
  useEffect(() => loadDatabase(), []);
  return <Stack screenOptions={{ title: "", headerTitleAlign: "center" }} />;
}