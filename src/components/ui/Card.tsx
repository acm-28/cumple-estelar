import React from "react";
import { View, ViewStyle } from "react-native";
import tw from "twrnc";

interface CardProps {
  children: React.ReactNode;
  glow?: "cyan" | "fuchsia" | "gold" | "none";
  style?: ViewStyle;
}

export function Card({ children, glow = "none", style }: CardProps) {
  const glowMap = {
    cyan: tw`border-[#00e5ff]/40 shadow-[0_0_15px_rgba(0,229,255,0.2)]`,
    fuchsia: tw`border-[#ff00c8]/40 shadow-[0_0_15px_rgba(255,0,200,0.2)]`,
    gold: tw`border-[#ffd700]/40 shadow-[0_0_15px_rgba(255,215,0,0.2)]`,
    none: tw`border-[#2a2050]`,
  };

  return (
    <View
      style={[
        tw`bg-[#12102a] rounded-[24px] border p-4`,
        glowMap[glow],
        style,
      ]}
    >
      {children}
    </View>
  );
}
