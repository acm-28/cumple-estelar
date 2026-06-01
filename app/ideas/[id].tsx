import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, ExternalLink, Search, Play } from "lucide-react-native";
import { useApp } from "@/lib/store";
import { themeEmoji } from "@/lib/themes";
import tw from "twrnc";

interface Idea {
  emoji: string;
  title: string;
  desc: string;
}

const GENERAL_GAMES: Idea[] = [
  { emoji: "🏃", title: "Carrera de embolsados", desc: "Saltar dentro de una bolsa hasta la meta. Clásico que nunca falla." },
  { emoji: "🪑", title: "Las sillas musicales", desc: "Una silla menos que jugadores; cuando para la música, todos a sentarse." },
  { emoji: "🪅", title: "Piñata", desc: "Rellenala con la temática del cumple. ¡El momento más esperado!" },
  { emoji: "🕺", title: "Estatuas musicales", desc: "Bailar y congelarse cuando para la música. El que se mueve, sale." },
  { emoji: "🎈", title: "El globo que no toque el piso", desc: "Mantener el globo en el aire entre todos, sin que caiga." },
  { emoji: "🗺️", title: "Búsqueda del tesoro", desc: "Pistas escondidas que llevan a un premio final. Adaptala a la temática." },
];

const THEME_GAMES: Record<string, Idea[]> = {
  astronautas: [
    { emoji: "☄️", title: "Búsqueda de meteoritos", desc: "Escondé piedras forradas en papel aluminio para que los astronautas las junten." },
    { emoji: "🚀", title: "Carrera de cohetes", desc: "Carrera saltando en bolsas o con globos como propulsores." },
    { emoji: "🌙", title: "Aterrizaje lunar", desc: "Embocar pelotas (planetas) dentro de aros o cajas." },
  ],
  dinosaurios: [
    { emoji: "🦴", title: "Excavación de fósiles", desc: "Esconder huesos o figuras en arena o gelatina para 'excavar'." },
    { emoji: "🥚", title: "Huevos de dino", desc: "Búsqueda de huevos escondidos por todo el espacio." },
    { emoji: "🦕", title: "Pisadas gigantes", desc: "Rayuela usando huellas de dinosaurio de cartón." },
  ],
  superheroes: [
    { emoji: "💪", title: "Entrenamiento de héroes", desc: "Circuito de obstáculos para 'graduarse' de superhéroe." },
    { emoji: "🕸️", title: "Telaraña láser", desc: "Cruzar entre hilos cruzados sin tocarlos, estilo misión secreta." },
    { emoji: "🦸", title: "Rescate heroico", desc: "Encontrar y 'salvar' muñecos escondidos contra reloj." },
  ],
  superhéroes: [
    { emoji: "💪", title: "Entrenamiento de héroes", desc: "Circuito de obstáculos para 'graduarse' de superhéroe." },
    { emoji: "🕸️", title: "Telaraña láser", desc: "Cruzar entre hilos cruzados sin tocarlos, estilo misión secreta." },
    { emoji: "🦸", title: "Rescate heroico", desc: "Encontrar y 'salvar' muñecos escondidos contra reloj." },
  ],
  princesas: [
    { emoji: "👑", title: "Búsqueda de la corona", desc: "Tesoro de joyas y coronas escondidas por el castillo." },
    { emoji: "💃", title: "Baile del castillo", desc: "Estatuas musicales con vestuario de gala." },
    { emoji: "🪄", title: "Decorá tu varita", desc: "Manualidad: armar coronas o varitas con brillos." },
  ],
  unicornios: [
    { emoji: "🦄", title: "Ponele el cuerno al unicornio", desc: "Versión mágica del clásico 'ponele la cola al burro'." },
    { emoji: "🌈", title: "Búsqueda del arcoíris", desc: "Juntar objetos de cada color del arcoíris." },
    { emoji: "✨", title: "Taller de slime mágico", desc: "Hacer slime brillante para llevar de souvenir." },
  ],
  sirenitas: [
    { emoji: "🦪", title: "Búsqueda de perlas", desc: "Juntar perlas y caracoles escondidos en el 'fondo del mar'." },
    { emoji: "💧", title: "Guerra de globos de agua", desc: "Ideal para cumples al aire libre en verano." },
    { emoji: "🧜", title: "Carrera de colas de sirena", desc: "Carrera saltando con las piernas dentro de una bolsa (la cola)." },
  ],
  piratas: [
    { emoji: "🗺️", title: "Búsqueda del tesoro", desc: "Mapa con pistas hasta el cofre con el botín." },
    { emoji: "🪵", title: "Caminar la tabla", desc: "Juego de equilibrio sobre una 'tabla' (línea en el piso)." },
    { emoji: "💣", title: "Cañonazo al barco", desc: "Embocar pelotas (balas de cañón) en baldes." },
  ],
  animales: [
    { emoji: "📸", title: "Safari fotográfico", desc: "Buscar animales de juguete escondidos por todos lados." },
    { emoji: "🐾", title: "Imitá al animal", desc: "Mímica y sonidos: adivinar qué animal es." },
    { emoji: "🌴", title: "Carrera de la selva", desc: "Circuito de obstáculos saltando como cada animal." },
  ],
};

function openURL(url: string) {
  Linking.openURL(url).catch(() => {});
}

function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <View style={tw`bg-[#12102a] rounded-[20px] border border-[#2a2050] p-4 flex-row items-start mb-2`}>
      <Text style={tw`text-2xl mr-3`}>{idea.emoji}</Text>
      <View style={tw`flex-1`}>
        <Text style={tw`text-[#f0f4ff] font-bold text-sm`}>{idea.title}</Text>
        <Text style={tw`text-[#9098c0] text-xs mt-0.5 leading-4`}>{idea.desc}</Text>
      </View>
    </View>
  );
}

export default function IdeasScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLoaded, getParty } = useApp();

  const party = id ? getParty(id) : undefined;

  React.useEffect(() => {
    if (isLoaded && !party) router.replace("/home");
  }, [isLoaded, party, router]);

  if (!isLoaded || !party) return null;

  const theme = party.onboarding.theme;
  const themed = THEME_GAMES[theme.trim().toLowerCase()] ?? [];
  const q = encodeURIComponent(`juegos de cumpleaños ${theme}`);
  const qDeco = encodeURIComponent(`decoración cumpleaños ${theme}`);

  return (
    <View style={tw`flex-1 bg-[#080c1a]`}>
      <ScrollView contentContainerStyle={tw`pb-10`}>
        {/* Header */}
        <View style={tw`px-5 pt-12 pb-2`}>
          <TouchableOpacity onPress={() => router.back()} style={tw`flex-row items-center mb-3`}>
            <ArrowLeft size={16} color="#9098c0" />
            <Text style={tw`text-[#9098c0] text-xs ml-1`}>Volver</Text>
          </TouchableOpacity>
          <Text style={tw`font-bold text-2xl text-[#f0f4ff]`}>Ideas de juegos 🎲</Text>
          <Text style={tw`text-[#9098c0] text-xs mt-0.5`}>
            {themeEmoji(theme)} Temática: <Text style={tw`capitalize`}>{theme}</Text>
          </Text>
        </View>

        <View style={tw`px-4 gap-5 mt-2`}>
          {/* Search buttons */}
          <View style={tw`gap-2`}>
            <TouchableOpacity
              onPress={() => openURL(`https://www.pinterest.com/search/pins/?q=${q}`)}
              style={tw`bg-[#e60023]/10 border border-[#e60023]/30 rounded-[16px] py-3.5 px-4 flex-row items-center`}
            >
              <View style={tw`w-8 h-8 rounded-full bg-[#e60023]/20 items-center justify-center mr-3`}>
                <Search size={16} color="#e60023" />
              </View>
              <Text style={tw`text-[#f0f4ff] font-semibold text-sm flex-1`}>Buscar juegos en Pinterest</Text>
              <ExternalLink size={15} color="#9098c0" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openURL(`https://www.pinterest.com/search/pins/?q=${qDeco}`)}
              style={tw`bg-[#e60023]/10 border border-[#e60023]/30 rounded-[16px] py-3.5 px-4 flex-row items-center`}
            >
              <View style={tw`w-8 h-8 rounded-full bg-[#e60023]/20 items-center justify-center mr-3`}>
                <Search size={16} color="#e60023" />
              </View>
              <Text style={tw`text-[#f0f4ff] font-semibold text-sm flex-1`}>Ideas de decoración en Pinterest</Text>
              <ExternalLink size={15} color="#9098c0" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openURL(`https://www.youtube.com/results?search_query=${q}`)}
              style={tw`bg-[#ff0000]/10 border border-[#ff0000]/30 rounded-[16px] py-3.5 px-4 flex-row items-center`}
            >
              <View style={tw`w-8 h-8 rounded-full bg-[#ff0000]/20 items-center justify-center mr-3`}>
                <Play size={16} color="#ff0000" />
              </View>
              <Text style={tw`text-[#f0f4ff] font-semibold text-sm flex-1`}>Ver tutoriales en YouTube</Text>
              <ExternalLink size={15} color="#9098c0" />
            </TouchableOpacity>
          </View>

          {/* Themed games */}
          {themed.length > 0 && (
            <View>
              <Text style={tw`text-[#f0f4ff] font-bold mb-3`}>{themeEmoji(theme)} Juegos para tu temática</Text>
              {themed.map((idea, i) => (
                <IdeaCard key={i} idea={idea} />
              ))}
            </View>
          )}

          {/* General games */}
          <View>
            <Text style={tw`text-[#f0f4ff] font-bold mb-3`}>🎉 Clásicos que nunca fallan</Text>
            {GENERAL_GAMES.map((idea, i) => (
              <IdeaCard key={i} idea={idea} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
