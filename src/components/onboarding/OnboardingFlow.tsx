import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Rocket, Star } from "lucide-react-native";
import { useApp } from "@/lib/store";
import type { OnboardingData, TeamType, BudgetLevel } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { DateField } from "@/components/ui/DateField";
import tw from "twrnc";

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

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

const BUDGETS: { id: BudgetLevel; label: string; desc: string; icon: string; suggested: number }[] = [
  { id: "ahorro", label: "Ahorro Inteligente", desc: "Foco en DIY y bajo costo", icon: "🪙", suggested: 50000 },
  { id: "equilibrado", label: "Equilibrado", desc: "Gasto moderado en puntos clave", icon: "⭐", suggested: 150000 },
  { id: "atodo", label: "A Todo Trapo", desc: "Sin restricciones, máxima comodidad", icon: "💫", suggested: 500000 },
];

const GUEST_OPTIONS = [
  { kids: "5-10", adults: "5-8" },
  { kids: "15-20", adults: "10-15" },
  { kids: "25-30", adults: "15-20" },
  { kids: "+40", adults: "+25" },
];

export function OnboardingFlow() {
  const router = useRouter();
  const { addParty } = useApp();
  const [step, setStep] = useState<Step>(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const [kidName, setKidName] = useState("");
  const [kidAge, setKidAge] = useState<number>(5);
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [team, setTeam] = useState<TeamType | null>(null);
  const [guestKids, setGuestKids] = useState("");
  const [guestAdults, setGuestAdults] = useState("");
  const [budget, setBudget] = useState<BudgetLevel | null>(null);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [customTheme, setCustomTheme] = useState("");

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

  const formatDate = (d: Date) =>
    d.toLocaleDateString("es-AR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

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

  // Step 1: name + age
  const handleStep1 = async () => {
    if (!kidName.trim()) return;
    addUserMessage(`${kidName}, cumple ${kidAge} años 🎂`);
    await addBotMessage(`¡${kidName}! Qué nombre tan hermoso 💫 ¡${kidAge} añitos, qué emoción!`);
    await addBotMessage(`¿Para qué fecha estás planeando la fiesta? 🗓️`);
    setShowOptions(true);
    setStep(2);
  };

  // Step 2: event date
  const handleStep2Date = async (skip = false) => {
    if (!skip && !eventDate) return;
    if (skip) {
      addUserMessage("Todavía no tengo fecha 🤔");
      await addBotMessage("¡No hay problema! Después la podés agregar y armo la cuenta regresiva ⏳");
    } else {
      addUserMessage(`📅 ${formatDate(eventDate!)}`);
      await addBotMessage("¡Anotado! Con esa fecha voy a calcular la cuenta regresiva y los plazos de cada misión ⏳");
    }
    await addBotMessage(`Ahora contame... ¿en qué "Team" estás para este cumple? ¿Qué nivel de ayuda necesitás?`);
    setShowOptions(true);
    setStep(3);
  };

  // Step 3: team
  const handleStep3 = async (selected: TeamType) => {
    setTeam(selected);
    const t = TEAMS.find((t) => t.id === selected)!;
    addUserMessage(`${t.icon} ${t.label}`);
    await addBotMessage(`¡Perfecto! ${t.desc}. ¡Eso lo tenemos claro! 💪`);
    await addBotMessage(`Ahora... ¿cuántos invitados aproximadamente? Poné cuántos nenes y cuántos adultos 👇`);
    setShowOptions(true);
    setStep(4);
  };

  // Step 4: guests (free input)
  const handleStep4Guests = async () => {
    const kids = guestKids.trim();
    const adults = guestAdults.trim();
    if (!kids && !adults) return;
    addUserMessage(`Aprox. ${kids || "0"} nenes y ${adults || "0"} adultos 👥`);
    await addBotMessage(`¡Anotado! Con esos números ya puedo estimar comida, espacio y souvenirs 🧮`);
    await addBotMessage(`¿Y cuál es tu "número mágico" de presupuesto? Elegí un nivel o poné tu estimado total:`);
    setShowOptions(true);
    setStep(5);
  };

  // Step 5: budget (level + custom amount)
  const handleStep5Budget = async () => {
    const amount = parseInt(budgetAmount) || 0;
    if (!budget && amount <= 0) return;
    const lvl = budget ?? "equilibrado";
    const b = BUDGETS.find((x) => x.id === lvl)!;
    addUserMessage(amount > 0 ? `💰 $${amount.toLocaleString("es-AR")}` : `${b.icon} ${b.label}`);
    await addBotMessage(`Buenísimo. ¡Ya sé cómo optimizar cada peso! 💰`);
    await addBotMessage(`¡Última pregunta! ¿Cuál es la temática soñada de ${kidName}? Elegí una o escribí la tuya ✏️`);
    setShowOptions(true);
    setStep(6);
  };

  // Step 6: theme (preset or custom) -> finish
  const finishOnboarding = async (themeLabel: string, emoji: string) => {
    addUserMessage(`${emoji} ${themeLabel}`);
    setShowOptions(false);
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 600));
    setIsTyping(false);
    setMessages((prev) => [...prev, { type: "bot", text: `¡${emoji} Temática "${themeLabel}" activada! Preparando tu plan estelar...` }]);
    scrollToBottom();

    await new Promise((r) => setTimeout(r, 1500));

    const data: OnboardingData = {
      kidName,
      kidAge,
      eventDate: eventDate ? eventDate.toISOString().split("T")[0] : undefined,
      team: team!,
      guestKids: guestKids.trim() || "0",
      guestAdults: guestAdults.trim() || "0",
      budget: budget ?? "equilibrado",
      budgetAmount: parseInt(budgetAmount) || undefined,
      theme: themeLabel,
    };
    const id = addParty(data);

    await new Promise((r) => setTimeout(r, 600));
    router.replace(`/party/${id}`);
  };

  const canSubmitCustomTheme = customTheme.trim().length > 0;

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
          {[0, 1, 2, 3, 4, 5].map((i) => (
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
        <ScrollView
          style={tw`max-h-[55%] border-t border-[#2a2050]`}
          contentContainerStyle={tw`px-4 pb-8 pt-3`}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
            <View style={tw`gap-3`}>
              <DateField
                value={eventDate ? eventDate.toISOString().split("T")[0] : null}
                onChange={(iso) => setEventDate(new Date(iso + "T12:00:00"))}
                minimumDate={new Date()}
              />
              <Button variant="cyan" onPress={() => handleStep2Date(false)} disabled={!eventDate}>
                ¡Lista la fecha! 🗓️
              </Button>
              <TouchableOpacity onPress={() => handleStep2Date(true)} style={tw`items-center py-1`}>
                <Text style={tw`text-[#9098c0] text-xs`}>Todavía no la decidí →</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 3 && (
            <View style={tw`gap-2`}>
              {TEAMS.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => handleStep3(t.id)}
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

          {step === 4 && (
            <View style={tw`gap-3`}>
              <View style={tw`flex-row gap-3`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-[#9098c0] text-xs mb-1 ml-1`}>👶 Nenes</Text>
                  <TextInput
                    value={guestKids}
                    onChangeText={setGuestKids}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#5a5f80"
                    style={tw`bg-[#1a1035] border border-[#2a2050] rounded-[16px] px-4 py-3 text-[#00e5ff] font-bold text-center text-base`}
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-[#9098c0] text-xs mb-1 ml-1`}>🧑 Adultos</Text>
                  <TextInput
                    value={guestAdults}
                    onChangeText={setGuestAdults}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#5a5f80"
                    style={tw`bg-[#1a1035] border border-[#2a2050] rounded-[16px] px-4 py-3 text-[#f0f4ff] font-bold text-center text-base`}
                  />
                </View>
              </View>
              <Text style={tw`text-[#9098c0] text-xs px-1`}>O elegí un rango rápido:</Text>
              <View style={tw`flex-row flex-wrap gap-2`}>
                {GUEST_OPTIONS.map((opt, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => { setGuestKids(opt.kids); setGuestAdults(opt.adults); }}
                    style={tw`bg-[#1a1035] border border-[#2a2050] rounded-full px-3 py-2`}
                  >
                    <Text style={tw`text-[#9098c0] text-xs`}>{opt.kids} nenes · {opt.adults} adultos</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Button variant="cyan" onPress={handleStep4Guests} disabled={!guestKids.trim() && !guestAdults.trim()}>
                Continuar 👥
              </Button>
            </View>
          )}

          {step === 5 && (
            <View style={tw`gap-2`}>
              {BUDGETS.map((b) => (
                <TouchableOpacity
                  key={b.id}
                  onPress={() => { setBudget(b.id); setBudgetAmount(String(b.suggested)); }}
                  style={[
                    tw`w-full border px-4 py-3 rounded-[16px] flex-row items-center`,
                    budget === b.id ? tw`bg-[#00e5ff]/15 border-[#00e5ff]` : tw`bg-[#1a1035] border-[#2a2050]`
                  ]}
                >
                  <Text style={tw`text-2xl mr-3`}>{b.icon}</Text>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-[#f0f4ff] font-semibold text-sm`}>{b.label}</Text>
                    <Text style={tw`text-[#9098c0] text-xs`}>{b.desc}</Text>
                  </View>
                  <Text style={tw`text-[#9098c0] text-xs`}>~${b.suggested.toLocaleString("es-AR")}</Text>
                </TouchableOpacity>
              ))}
              <View style={tw`mt-1`}>
                <Text style={tw`text-[#9098c0] text-xs mb-1 ml-1`}>💰 Tu presupuesto estimado total</Text>
                <View style={tw`flex-row items-center bg-[#1a1035] border border-[#2a2050] rounded-[16px] px-4`}>
                  <Text style={tw`text-[#ffd700] font-bold text-base`}>$</Text>
                  <TextInput
                    value={budgetAmount}
                    onChangeText={(v) => { setBudgetAmount(v); setBudget(null); }}
                    keyboardType="numeric"
                    placeholder="Ej: 120000"
                    placeholderTextColor="#5a5f80"
                    style={tw`flex-1 py-3 px-2 text-[#ffd700] font-bold text-base`}
                  />
                </View>
              </View>
              <Button variant="cyan" onPress={handleStep5Budget} disabled={!budget && !(parseInt(budgetAmount) > 0)}>
                Continuar 💰
              </Button>
            </View>
          )}

          {step === 6 && (
            <View style={tw`gap-3`}>
              <View style={tw`flex-row flex-wrap justify-between gap-y-2`}>
                {THEMES.map((t) => {
                  const label = t.label.split(" ").slice(1).join(" ");
                  return (
                    <TouchableOpacity
                      key={t.id}
                      onPress={() => finishOnboarding(label, t.emoji)}
                      style={tw`w-[48%] bg-[#1a1035] border border-[#2a2050] px-3 py-3 rounded-[16px] items-center`}
                    >
                      <Text style={tw`text-2xl mb-1`}>{t.emoji}</Text>
                      <Text style={tw`text-[#f0f4ff] text-xs font-medium`}>{label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={tw`text-[#9098c0] text-xs px-1`}>O escribí la tuya:</Text>
              <View style={tw`flex-row gap-2`}>
                <TextInput
                  value={customTheme}
                  onChangeText={setCustomTheme}
                  placeholder="Ej: Frozen, Bluey, Espacio..."
                  placeholderTextColor="#5a5f80"
                  style={tw`flex-1 bg-[#1a1035] border border-[#2a2050] rounded-[16px] px-4 py-3 text-[#f0f4ff] text-sm`}
                  onSubmitEditing={() => canSubmitCustomTheme && finishOnboarding(customTheme.trim(), "🎨")}
                />
                <TouchableOpacity
                  onPress={() => canSubmitCustomTheme && finishOnboarding(customTheme.trim(), "🎨")}
                  disabled={!canSubmitCustomTheme}
                  style={[
                    tw`px-5 rounded-[16px] items-center justify-center`,
                    canSubmitCustomTheme ? tw`bg-[#00e5ff]` : tw`bg-[#2a2050]`
                  ]}
                >
                  <Text style={[tw`font-bold`, canSubmitCustomTheme ? tw`text-[#080c1a]` : tw`text-[#9098c0]`]}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}
