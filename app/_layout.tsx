import React from "react";
import { Stack } from "expo-router";
import { AppProvider } from "@/lib/store";
import { StatusBar } from "expo-status-bar";
import { Platform, View } from "react-native";
// Componente de Vercel Web Analytics para React (NO usar /next: requiere Next.js).
import { Analytics } from "@vercel/analytics/react";
import tw from "twrnc";

export default function RootLayout() {
  return (
    <AppProvider>
      <View style={tw`flex-1 bg-[#080c1a]`}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: tw`bg-[#080c1a]`,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="home" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="party/[id]" />
          <Stack.Screen name="invitation/[id]" />
          <Stack.Screen name="edit/[id]" />
          <Stack.Screen name="ideas/[id]" />
        </Stack>
        {/* Solo en web: en nativo no aplica y evita tocar APIs de navegador. */}
        {Platform.OS === "web" && <Analytics />}
      </View>
    </AppProvider>
  );
}
