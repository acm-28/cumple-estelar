import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Rocket, Star } from "lucide-react-native";
import { useApp } from "@/lib/store";
import type { OnboardingData, TeamType, BudgetLevel } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import tw from "twrnc";

type Step = 0 | 1 | 2 | 3 | 4 | 5;

interface Message {
  type: "bot" | "user";
  text: string;
}

const THEMES = [
  { id: "astronautas", label: "🚀 Astronautas", emoji: "🚀" },
  { id: "dinosaurios", label: "🦕 Dinosaurios", emoji: "🦕" },
  { id: "superheroes", label: "🦸 Superhéroes", emoji: "🦸" },
  { id: "princesas", label: "👑 Princesas", emoji: "👑" },
  { id: "unicornios", label: "🦄 Unicornios", emoji: "🦄" },
  { id: "sirenitas", label: "🧜 Sirenitas", emoji: "🧜" },
  { id: "piratas", label: "🏴‍☠️ Piratas", emoji: "🏴‍☠️" },
  { id: "animales", label: "🦁 Animales", emoji: "🦁" },
];

const TEAMS: { id: TeamType; label: string; desc: string; icon: string }[] = [
  { id: "hacetodo", label: "Team Hago Todo", desc: "Ideas caseras, DIY y juegos propios", icon: "🛠️" },
  { id: "intermedio", label: "Team Intermedio", desc: "Alquilo el lugar, me encargo de lo demás", icon: "⚖️" },
  { id: "resolutiva", label: "Team Resolutiva", desc: "Salón que lo resuelva todo", icon: "✨" },
];

const BUDGETS: { id: BudgetLevel; label: string; desc: string; icon: string }[] = [
  { id: "ahorro", label: "Ahorro Inteligente", desc: "Foco en DIY y bajo costo", icon: "🪙" },
  { id: "equilibrado", label: "Equilibrado", desc: "Gasto moderado en puntos clave", icon: "⭐" },
  { id: "atodo", label: "A Todo Trapo", desc: "Sin restricciones, máxima comodidad", icon: "💫" },
];

export function OnboardingFlow() {
  const router = useRouter();
  const { setOnboarding } = useApp();
  const [step, setStep] = useState<Step>(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const [kidName, setKidName] = useState("");
  const [kidAge, setKidAge] = useState<number>(5);
  const [team, setTeam] = useState<TeamType | null>(null);
  const [guestKids, setGuestKids] = useState("15-20");
  const [guestAdults, setGuestAdults] = useState("10-15");
  const [budget, setBudget] = useState<BudgetLevel | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const addBotMessage = async (text: string, delay = 800) => {
    setIsTyping(true);
    setShowOptions(false);
    await new Promise((r) => setTimeout(r, delay));
    setIsTyping(false);
    setMessages((prev) => [...prev, { type: "bot", text }]);
    await new Promise((r) => setTimeout(r, 200));
    scrollToBottom();
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { type: "user", text }]);
    scrollToBottom();
  };

  useEffect(() => {
    const init = async () => {
      await addBotMessage("¡Hola! Soy Nova, tu organizadora espacial galáctica 🚀✨", 500);
      await addBotMessage("Juntas vamos a hacer el cumple más épico del universo. ¡Empecemos!", 1200);
      await addBotMessage("Primera pregunta... ¿a quién vamos a agasajar? ¿Cuál es el nombre del festejado/a y cuántos años cumple?", 1500);
      setShowOptions(true);
      setStep(1);
    };
    init();
  }, []);

  const handleStep1 = async () => {
    if (!kidName.trim()) return;
    addUserMessage(`${kidName}, cumple ${kidAge} años 🎂`);
    await addBotMessage(`¡${kidName}! Qué nombre tan hermoso 💫 ¡${kidAge} añitos, qué emoción!`);
    await addBotMessage(`Ahora contame... ¿en qué "Team" estás para este cumple? ¿Qué nivel de ayuda necesitás?`);
    setShowOptions(true);
    setStep(2);
  };

  const handleStep2 = async (selected: TeamType) => {
    setTeam(selected);
    const t = TEAMS.find((t) => t.id === selected)!;
    addUserMessage(`${t.icon} ${t.label}`);
    await addBotMessage(`¡Perfecto! ${t.desc}. ¡Eso lo tenemos claro! 💪`);
    await addBotMessage(`Ahora... ¿cuántos invitados aproximadamente? ¿Cuántos nenes y cuántos adultos?`);
    setShowOptions(true);
    setStep(3);
  };

  const handleStep3 = async (kids: string, adults: string) => {
    setGuestKids(kids);
    setGuestAdults(adults);
    addUserMessage(`Aprox. ${kids} nenes y ${adults} adultos 👥`);
    await addBotMessage(`¡Anotado! Con esos números ya puedo calcular comida, espacio y souvenirs automáticamente 🧮`);
    await addBotMessage(`¿Y cuál es tu "número mágico" de presupuesto? Elegí el nivel de comodidad que te representa:`);
    setShowOptions(true);
    setStep(4);
  };

  const handleStep4 = async (selected: BudgetLevel) => {
    setBudget(selected);
    const b = BUDGETS.find((b) => b.id === selected)!;
    addUserMessage(`${b.icon} ${b.label}`);
    await addBotMessage(`Buenísimo, ${b.desc}. ¡Ya sé cómo optimizar cada peso! 💰`);
    await addBotMessage(`¡Última pregunta! ¿Cuál es la temática soñada de ${kidName}?`);
    setShowOptions(true);
    setStep(5);
  };

  const handleStep5 = async (theme: string) => {
    setSelectedTheme(theme);
    const t = THEMES.find((t) => t.id === theme)!;
    addUserMessage(`${t.label}`);
    setShowOptions(false);
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 600));
    setIsTyping(false);
    setMessages((prev) => [...prev, { type: "bot", text: `¡${t.emoji} Temática ${t.label.split(" ")[1]} activada! Preparando tu plan estelar...` }]);
    scrollToBottom();

    await new Promise((r) => setTimeout(r, 1500));

    const data: OnboardingData = {
      kidName,
      kidAge,
      team: team!,
      guestKids,
      guestAdults,
      budget: budget!,
      theme,
    };
    setOnboarding(data);

    await new Promise((r) => setTimeout(r, 600));
    router.replace("/dashboard");
  };

  const GUEST_OPTIONS = [
    { kids: "5-10", adults: "5-8" },
    { kids: "15-20", adults: "10-15" },
    { kids: "25-30", adults: "15-20" },
    { kids: "+40", adults: "+25" },
  ];

  return (
    <KeyboardAvoidingView 
      style={tw`flex-1 bg-[#080c1a]`} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={tw`flex-row items-center px-5 pt-12 pb-4 border-b border-[#2a2050]`}>
        <View style={tw`w-10 h-10 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 items-center justify-center mr-3`}>
          <Rocket size={20} color="#00e5ff" />
        </View>
        <View style={tw`flex-1`}>
          <Text style={tw`font-bold text-[#f0f4ff] text-sm`}>Nova</Text>
          <Text style={tw`text-[#9098c0] text-xs`}>Organizadora Galáctica ✨</Text>
        </View>
        <View style={tw`flex-row items-center ml-auto`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                tw`w-2 h-2 rounded-full mx-0.5`,
                i < step - 1
                  ? tw`bg-[#00e5ff]`
                  : i === step - 1
                  ? tw`bg-[#ffd700] w-2.5 h-2.5`
                  : tw`bg-[#2a2050]`
              ]}
            />
          ))}
        </View>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={tw`flex-1 px-4 py-4`}
        contentContainerStyle={tw`pb-4`}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, i) => (
          <View
            key={i}
            style={[tw`flex-row mb-3`, msg.type === "user" ? tw`justify-end` : tw`justify-start`]}
          >
            {msg.type === "bot" && (
              <View style={tw`w-7 h-7 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 items-center justify-center mr-2 mt-1`}>
                <Star size={12} color="#00e5ff" />
              </View>
            )}
            <View
              style={[
                tw`max-w-[78%] px-4 py-3 rounded-[20px]`,
                msg.type === "bot"
                  ? tw`bg-[#1a1035] border border-[#2a2050] rounded-tl-sm`
                  : tw`bg-[#00e5ff]/15 border border-[#00e5ff]/30 rounded-tr-sm`
              ]}
            >
              <Text style={[tw`text-sm leading-5`, msg.type === "bot" ? tw`text-[#f0f4ff]` : tw`text-[#00e5ff] font-medium`]}>
                {msg.text}
              </Text>
            </View>
          </View>
        ))}

        {isTyping && (
          <View style={tw`flex-row items-center mb-3`}>
            <View style={tw`w-7 h-7 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 items-center justify-center mr-2`}>
              <Star size={12} color="#00e5ff" />
            </View>
            <View style={tw`bg-[#1a1035] border border-[#2a2050] rounded-[20px] rounded-tl-sm px-4 py-3 flex-row items-center`}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={tw`w-1.5 h-1.5 rounded-full bg-[#00e5ff]/60 mx-0.5`} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Options area */}
      {showOptions && (
        <View style={tw`px-4 pb-8 pt-3 border-t border-[#2a2050]`}>
          {step === 1 && (
            <View style={tw`gap-3`}>
              <TextInput
                placeholder="Nombre del festejado/a..."
                placeholderTextColor="#9098c0"
                value={kidName}
                onChangeText={setKidName}
                style={tw`bg-[#1a1035] border border-[#2a2050] text-[#f0f4ff] px-4 py-3 rounded-[16px] text-sm`}
                onSubmitEditing={handleStep1}
              />
              <View style={tw`flex-row items-center gap-3 justify-center mb-2`}>
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
              <Button variant="cyan" onPress={handleStep1} disabled={!kidName.trim()}>
                ¡Ese es! 🎉
              </Button>
            </View>
          )}

          {step === 2 && (
            <View style={tw`gap-2`}>
              {TEAMS.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => handleStep2(t.id)}
                  style={tw`w-full bg-[#1a1035] border border-[#2a2050] px-4 py-3 rounded-[16px] flex-row items-center`}
                >
                  <Text style={tw`text-2xl mr-3`}>{t.icon}</Text>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-[#f0f4ff] font-semibold text-sm`}>{t.label}</Text>
                    <Text style={tw`text-[#9098c0] text-xs`}>{t.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step === 3 && (
            <View style={tw`gap-2`}>
              <Text style={tw`text-[#9098c0] text-xs px-1 mb-1`}>Seleccioná el rango aproximado:</Text>
              <View style={tw`flex-row flex-wrap justify-between`}>
                {GUEST_OPTIONS.map((opt, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => handleStep3(opt.kids, opt.adults)}
                    style={tw`w-[48%] bg-[#1a1035] border border-[#2a2050] px-3 py-3 rounded-[16px] items-center mb-2`}
                  >
                    <Text style={tw`text-[#00e5ff] font-bold text-base`}>{opt.kids}</Text>
                    <Text style={tw`text-[#9098c0] text-xs`}>nenes</Text>
                    <Text style={tw`text-[#f0f4ff] text-xs mt-1`}>{opt.adults} adultos</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 4 && (
            <View style={tw`gap-2`}>
              {BUDGETS.map((b) => (
                <TouchableOpacity
                  key={b.id}
                  onPress={() => handleStep4(b.id)}
                  style={tw`w-full bg-[#1a1035] border border-[#2a2050] px-4 py-3 rounded-[16px] flex-row items-center`}
                >
                  <Text style={tw`text-2xl mr-3`}>{b.icon}</Text>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-[#f0f4ff] font-semibold text-sm`}>{b.label}</Text>
                    <Text style={tw`text-[#9098c0] text-xs`}>{b.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step === 5 && (
            <View style={tw`flex-row flex-wrap justify-between gap-y-2`}>
              {THEMES.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => handleStep5(t.id)}
                  style={tw`w-[48%] bg-[#1a1035] border border-[#2a2050] px-3 py-3 rounded-[16px] items-center`}
                >
                  <Text style={tw`text-2xl mb-1`}>{t.emoji}</Text>
                  <Text style={tw`text-[#f0f4ff] text-xs font-medium`}>{t.label.split(" ").slice(1).join(" ")}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
