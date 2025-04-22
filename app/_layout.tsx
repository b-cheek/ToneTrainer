import { Stack } from "expo-router";
import GlobalsProvider from "@/components/GlobalsProvider";

export default function RootLayout() {
  return (
    <GlobalsProvider>
      <Stack screenOptions={{ title: "", headerTitleAlign: "center" }} />
    </GlobalsProvider>
  );
}