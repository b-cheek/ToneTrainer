import { Stack } from "expo-router";
import Storage from 'expo-sqlite/kv-store';
import { Exercises } from '@/constants/Exercises';

Storage.multiGet(Object.keys(Exercises)).then(async (db) => {
  // Default-initialize entries for missing exercises
  let nullPairs = db.filter(([_, data]) => data === null);
  await Storage.multiSet(nullPairs.map(([exercise, _]) => [exercise, JSON.stringify({ completed: 0, correct: 0 })]));
});

export default function RootLayout() {
  return <Stack screenOptions={{ headerTitleAlign: "center" }} />;
}