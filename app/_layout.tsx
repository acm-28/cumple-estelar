import React from "react";
import { Stack } from "expo-router";
import { AppProvider } from "@/lib/store";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
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
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="dashboard" />
        </Stack>
      </View>
    </AppProvider>
  );
}
