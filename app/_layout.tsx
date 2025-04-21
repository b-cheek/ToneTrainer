import { Stack } from "expo-router";
import DatabaseProvider from "@/components/DatabaseProvider";

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <Stack screenOptions={{ title: "", headerTitleAlign: "center" }} />
    </DatabaseProvider>
  );
}