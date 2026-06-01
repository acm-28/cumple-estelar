import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Rocket, Plus, Calendar, CheckCircle2 } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useApp, getProgress, isPartyActive } from "@/lib/store";
import { themeEmoji } from "@/lib/themes";
import type { Party } from "@/lib/types";
import tw from "twrnc";

function formatShortDate(iso?: string): string {
  if (!iso) return "Sin fecha";
  return new Date(iso + "T12:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
}

function countdown(iso?: string): string | null {
  if (!iso) return null;
  const days = Math.ceil((new Date(iso + "T23:59:59").getTime() - Date.now()) / 86400000);
  if (days > 1) return `Faltan ${days} días`;
  if (days === 1) return "¡Falta 1 día!";
  if (days === 0) return "¡Es hoy! 🎉";
  return "Finalizado";
}

function PartyCard({ party, finished, onPress }: { party: Party; finished?: boolean; onPress: () => void }) {
  const total = party.tasks.length;
  const done = party.tasks.filter((t) => t.status === "done").length;
  const progress = getProgress(party.tasks);
  const cd = countdown(party.onboarding.eventDate);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        tw`w-[48%] bg-[#12102a] border border-[#2a2050] rounded-[24px] p-4 mb-3`,
        finished && tw`opacity-60`,
      ]}
    >
      <View style={tw`flex-row items-center justify-between mb-2`}>
        <Text style={tw`text-3xl`}>{themeEmoji(party.onboarding.theme)}</Text>
        {finished ? (
          <View style={tw`bg-[#2a2050] rounded-full px-2 py-0.5`}>
            <Text style={tw`text-[#9098c0] text-[10px] font-semibold`}>Finalizado</Text>
          </View>
        ) : cd ? (
          <View style={tw`flex-row items-center bg-[#00e5ff]/10 border border-[#00e5ff]/30 rounded-full px-2 py-0.5`}>
            <Calendar size={10} color="#00e5ff" />
            <Text style={tw`text-[#00e5ff] text-[10px] font-semibold ml-1`}>{cd}</Text>
          </View>
        ) : null}
      </View>

      <Text style={tw`text-[#f0f4ff] font-bold text-base`} numberOfLines={1}>
        {party.onboarding.kidName}
      </Text>
      <Text style={tw`text-[#9098c0] text-xs`}>
        {party.onboarding.kidAge} años · {formatShortDate(party.onboarding.eventDate)}
      </Text>
      <Text style={tw`text-[#9098c0] text-xs capitalize mt-0.5`} numberOfLines={1}>
        🎨 {party.onboarding.theme}
      </Text>

      {/* Progress */}
      <View style={tw`mt-3`}>
        <View style={tw`h-2 bg-[#1a1035] rounded-full overflow-hidden`}>
          <LinearGradient
            colors={["#00e5ff", "#00b8d4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[tw`h-full rounded-full`, { width: `${progress}%` }]}
          />
        </View>
        <View style={tw`flex-row items-center mt-1.5`}>
          <CheckCircle2 size={12} color="#9098c0" />
          <Text style={tw`text-[#9098c0] text-[11px] ml-1`}>{done}/{total} tareas</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { isLoaded, parties } = useApp();

  if (!isLoaded) return null;

  const active = parties.filter(isPartyActive);
  const finished = parties.filter((p) => !isPartyActive(p));

  return (
    <View style={tw`flex-1 bg-[#080c1a]`}>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pb-28`}>
        {/* Header */}
        <View style={tw`px-5 pt-12 pb-4 flex-row items-center justify-between`}>
          <View>
            <Text style={tw`text-[#9098c0] text-xs font-medium`}>Tu base espacial 👩‍🚀</Text>
            <Text style={tw`font-bold text-2xl text-[#f0f4ff]`}>Mis Cumples 🎉</Text>
          </View>
          <View style={tw`w-12 h-12 rounded-[16px] bg-[#00e5ff]/10 border border-[#00e5ff]/30 items-center justify-center`}>
            <Rocket size={22} color="#00e5ff" style={{ transform: [{ rotate: "-45deg" }] }} />
          </View>
        </View>

        <View style={tw`px-4`}>
          {parties.length === 0 && (
            <View style={tw`items-center justify-center py-20 px-6`}>
              <Text style={tw`text-5xl mb-3`}>🚀</Text>
              <Text style={tw`text-[#f0f4ff] font-bold text-center text-base mb-1`}>Todavía no hay cumples</Text>
              <Text style={tw`text-[#9098c0] text-center text-sm`}>Tocá "Nuevo cumple" para empezar a organizar el primero.</Text>
            </View>
          )}

          {active.length > 0 && (
            <View style={tw`flex-row flex-wrap justify-between`}>
              {active.map((p) => (
                <PartyCard key={p.id} party={p} onPress={() => router.push(`/party/${p.id}`)} />
              ))}
            </View>
          )}

          {finished.length > 0 && (
            <View style={tw`mt-2`}>
              <Text style={tw`text-[#9098c0] text-xs font-semibold uppercase tracking-wider px-1 mb-3`}>
                ✅ Finalizados
              </Text>
              <View style={tw`flex-row flex-wrap justify-between`}>
                {finished.map((p) => (
                  <PartyCard key={p.id} party={p} finished onPress={() => router.push(`/party/${p.id}`)} />
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* New party button */}
      <TouchableOpacity
        onPress={() => router.push("/onboarding")}
        activeOpacity={0.85}
        style={tw`absolute bottom-6 left-6 right-6 bg-[#00e5ff] rounded-full py-4 flex-row items-center justify-center shadow-lg shadow-[#00e5ff]/50`}
      >
        <Plus size={20} color="#080c1a" strokeWidth={3} />
        <Text style={tw`text-[#080c1a] font-bold text-base ml-2`}>Nuevo cumple</Text>
      </TouchableOpacity>
    </View>
  );
}
