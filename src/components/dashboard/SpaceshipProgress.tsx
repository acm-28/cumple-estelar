import React from "react";
import { View, Text } from "react-native";
import { Rocket } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import tw from "twrnc";

interface SpaceshipProgressProps {
  progress: number;
  level: string;
  spentBudget: number;
}

export function SpaceshipProgress({ progress, level, spentBudget }: SpaceshipProgressProps) {
  const planets = [
    { label: "Inicio", pos: 0, emoji: "🌍" },
    { label: "Lugar", pos: 25, emoji: "🪐" },
    { label: "Invites", pos: 50, emoji: "⭐" },
    { label: "¡Cumple!", pos: 100, emoji: "🎉" },
  ];

  return (
    <View style={tw`bg-[#12102a] rounded-[24px] border border-[#2a2050] p-5`}>
      <View style={tw`flex-row items-center justify-between mb-1`}>
        <View>
          <Text style={tw`text-[#9098c0] text-xs font-medium uppercase tracking-wider`}>Trayectoria Estelar</Text>
          <Text style={tw`text-[#f0f4ff] font-bold text-lg leading-tight`}>{level}</Text>
        </View>
        <View style={tw`items-end`}>
          <Text style={tw`text-[#ffd700] font-bold text-xl`}>{progress}%</Text>
          <Text style={tw`text-[#9098c0] text-xs`}>Gastados ${spentBudget} 💸</Text>
        </View>
      </View>

      {/* Track */}
      <View style={tw`relative mt-4 mb-2`}>
        {/* Base track */}
        <View style={tw`h-3 bg-[#1a1035] rounded-full border border-[#2a2050] overflow-hidden`}>
          <LinearGradient
            colors={['#00e5ff', '#00b8d4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[tw`h-full rounded-full`, { width: `${progress}%` }]}
          />
        </View>

        {/* Rocket */}
        <View
          style={[
            tw`absolute -top-2.5`,
            { left: `${Math.max(0, Math.min(95, progress))}%`, transform: [{ translateX: -16 }] }
          ]}
        >
          <View style={tw`w-8 h-8 rounded-full bg-[#080c1a] border-2 border-[#00e5ff] flex items-center justify-center`}>
            <Rocket size={14} color="#00e5ff" style={{ transform: [{ rotate: '-45deg' }] }} />
          </View>
        </View>
      </View>

      {/* Planets */}
      <View style={tw`relative h-8 mt-3`}>
        {planets.map((planet) => (
          <View
            key={planet.label}
            style={[
              tw`absolute flex items-center`,
              { left: `${planet.pos}%`, transform: [{ translateX: -15 }] }
            ]}
          >
            <Text style={tw`text-base`}>{planet.emoji}</Text>
            <Text style={tw`text-[9px] text-[#9098c0] mt-0.5`}>{planet.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
