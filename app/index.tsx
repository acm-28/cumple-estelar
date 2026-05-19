import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useApp } from "@/lib/store";
import tw from "twrnc";

export default function IndexScreen() {
  const router = useRouter();
  const { isLoaded, onboarding } = useApp();

  useEffect(() => {
    if (isLoaded) {
      if (!onboarding) {
        router.replace("/onboarding");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [isLoaded, onboarding]);

  return (
    <View style={tw`flex-1 items-center justify-center bg-[#080c1a]`}>
      <ActivityIndicator size="large" color="#00e5ff" />
    </View>
  );
}
