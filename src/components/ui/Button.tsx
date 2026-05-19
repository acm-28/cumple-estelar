import React from "react";
import { TouchableOpacity, Text, ViewStyle, TextStyle } from "react-native";
import tw from "twrnc";

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "cyan" | "fuchsia" | "gold" | "ghost";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  children,
  onPress,
  variant = "cyan",
  size = "md",
  glow = true,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const variants = {
    cyan: tw`bg-[#00e5ff]`,
    fuchsia: tw`bg-[#ff00c8]`,
    gold: tw`bg-[#ffd700]`,
    ghost: tw`bg-transparent border border-[#2a2050]`,
  };

  const textVariants = {
    cyan: tw`text-[#080c1a]`,
    fuchsia: tw`text-white`,
    gold: tw`text-[#080c1a]`,
    ghost: tw`text-[#f0f4ff]`,
  };

  const sizes = {
    sm: tw`px-4 py-2`,
    md: tw`px-6 py-3`,
    lg: tw`px-8 py-4`,
  };

  const textSizes = {
    sm: tw`text-sm`,
    md: tw`text-base`,
    lg: tw`text-lg`,
  };

  const glowStyle = {
    cyan: tw`shadow-[0_0_15px_rgba(0,229,255,0.6)]`,
    fuchsia: tw`shadow-[0_0_15px_rgba(255,0,200,0.6)]`,
    gold: tw`shadow-[0_0_15px_rgba(255,215,0,0.6)]`,
    ghost: {},
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        tw`rounded-full items-center justify-center flex-row`,
        variants[variant],
        sizes[size],
        glow && glowStyle[variant],
        disabled && tw`opacity-40`,
        style,
      ]}
    >
      <Text style={[tw`font-bold`, textVariants[variant], textSizes[size], textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}
