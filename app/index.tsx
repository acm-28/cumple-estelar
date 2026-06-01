import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useApp, isPartyActive } from "@/lib/store";
import tw from "twrnc";

export default function IndexScreen() {
  const router = useRouter();
  const { isLoaded, parties } = useApp();

  useEffect(() => {
    if (!isLoaded) return;
    if (parties.length === 0) {
      router.replace("/onboarding");
      return;
    }
    const active = parties.filter(isPartyActive);
    if (active.length === 1) {
      // Single active party → jump straight into it.
      router.replace(`/party/${active[0].id}`);
    } else {
      // Multiple active, or only finished ones → show the grid.
      router.replace("/home");
    }
  }, [isLoaded, parties]);

  return (
    <View style={tw`flex-1 items-center justify-center bg-[#080c1a]`}>
      <ActivityIndicator size="large" color="#00e5ff" />
    </View>
  );
}
