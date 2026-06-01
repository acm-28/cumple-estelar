import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useApp } from "@/lib/store";
import type { OnboardingData } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { DateField } from "@/components/ui/DateField";
import tw from "twrnc";

export default function EditPartyScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLoaded, getParty, updateOnboarding } = useApp();

  const party = id ? getParty(id) : undefined;

  const [kidName, setKidName] = useState("");
  const [kidAge, setKidAge] = useState(5);
  const [eventDate, setEventDate] = useState<string | null>(null);
  const [theme, setTheme] = useState("");
  const [guestKids, setGuestKids] = useState("");
  const [guestAdults, setGuestAdults] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");

  useEffect(() => {
    if (party) {
      const o = party.onboarding;
      setKidName(o.kidName);
      setKidAge(o.kidAge);
      setEventDate(o.eventDate ?? null);
      setTheme(o.theme);
      setGuestKids(o.guestKids ?? "");
      setGuestAdults(o.guestAdults ?? "");
      setBudgetAmount(o.budgetAmount ? String(o.budgetAmount) : "");
    }
  }, [party?.id]);

  useEffect(() => {
    if (isLoaded && !party) router.replace("/home");
  }, [isLoaded, party, router]);

  if (!isLoaded || !party) return null;

  const handleSave = () => {
    const data: OnboardingData = {
      ...party.onboarding,
      kidName: kidName.trim() || party.onboarding.kidName,
      kidAge,
      eventDate: eventDate ?? undefined,
      theme: theme.trim() || party.onboarding.theme,
      guestKids: guestKids.trim() || "0",
      guestAdults: guestAdults.trim() || "0",
      budgetAmount: parseInt(budgetAmount) || undefined,
    };
    updateOnboarding(party.id, data);
    router.back();
  };

  return (
    <View style={tw`flex-1 bg-[#080c1a]`}>
      <ScrollView contentContainerStyle={tw`pb-10`} keyboardShouldPersistTaps="handled">
        <View style={tw`px-5 pt-12 pb-2`}>
          <TouchableOpacity onPress={() => router.back()} style={tw`flex-row items-center mb-3`}>
            <ArrowLeft size={16} color="#9098c0" />
            <Text style={tw`text-[#9098c0] text-xs ml-1`}>Volver</Text>
          </TouchableOpacity>
          <Text style={tw`font-bold text-2xl text-[#f0f4ff]`}>Editar datos ✏️</Text>
        </View>

        <View style={tw`px-4 gap-4 mt-2`}>
          <View>
            <Text style={tw`text-[#9098c0] text-sm mb-1 ml-1`}>Nombre del festejado/a</Text>
            <TextInput
              value={kidName}
              onChangeText={setKidName}
              placeholderTextColor="#5a5f80"
              style={tw`bg-[#1a1035] border border-[#2a2050] rounded-[16px] px-4 py-3 text-[#f0f4ff] text-sm`}
            />
          </View>

          <View style={tw`flex-row items-center gap-3`}>
            <Text style={tw`text-[#9098c0] text-sm`}>Cumple</Text>
            <View style={tw`flex-row items-center bg-[#1a1035] border border-[#2a2050] rounded-[16px] px-3 py-2`}>
              <TouchableOpacity onPress={() => setKidAge((a) => Math.max(1, a - 1))} style={tw`w-8 h-8 rounded-full bg-[#2a2050] items-center justify-center`}>
                <Text style={tw`text-[#f0f4ff] text-lg`}>−</Text>
              </TouchableOpacity>
              <Text style={tw`text-[#ffd700] font-bold text-lg w-10 text-center`}>{kidAge}</Text>
              <TouchableOpacity onPress={() => setKidAge((a) => Math.min(15, a + 1))} style={tw`w-8 h-8 rounded-full bg-[#2a2050] items-center justify-center`}>
                <Text style={tw`text-[#f0f4ff] text-lg`}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={tw`text-[#9098c0] text-sm`}>años</Text>
          </View>

          <View>
            <Text style={tw`text-[#9098c0] text-sm mb-1 ml-1`}>🗓️ Fecha del cumple</Text>
            <DateField value={eventDate} onChange={setEventDate} minimumDate={new Date()} />
          </View>

          <View>
            <Text style={tw`text-[#9098c0] text-sm mb-1 ml-1`}>🎨 Temática</Text>
            <TextInput
              value={theme}
              onChangeText={setTheme}
              placeholderTextColor="#5a5f80"
              style={tw`bg-[#1a1035] border border-[#2a2050] rounded-[16px] px-4 py-3 text-[#f0f4ff] text-sm`}
            />
          </View>

          <View style={tw`flex-row gap-3`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-[#9098c0] text-sm mb-1 ml-1`}>👶 Nenes</Text>
              <TextInput
                value={guestKids}
                onChangeText={setGuestKids}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#5a5f80"
                style={tw`bg-[#1a1035] border border-[#2a2050] rounded-[16px] px-4 py-3 text-[#00e5ff] font-bold text-center`}
              />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-[#9098c0] text-sm mb-1 ml-1`}>🧑 Adultos</Text>
              <TextInput
                value={guestAdults}
                onChangeText={setGuestAdults}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#5a5f80"
                style={tw`bg-[#1a1035] border border-[#2a2050] rounded-[16px] px-4 py-3 text-[#f0f4ff] font-bold text-center`}
              />
            </View>
          </View>

          <View>
            <Text style={tw`text-[#9098c0] text-sm mb-1 ml-1`}>💰 Presupuesto estimado total</Text>
            <View style={tw`flex-row items-center bg-[#1a1035] border border-[#2a2050] rounded-[16px] px-4`}>
              <Text style={tw`text-[#ffd700] font-bold text-base`}>$</Text>
              <TextInput
                value={budgetAmount}
                onChangeText={setBudgetAmount}
                keyboardType="numeric"
                placeholder="Ej: 120000"
                placeholderTextColor="#5a5f80"
                style={tw`flex-1 py-3 px-2 text-[#ffd700] font-bold text-base`}
              />
            </View>
          </View>

          <View style={tw`mt-2`}>
            <Button variant="cyan" onPress={handleSave}>
              Guardar cambios
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
