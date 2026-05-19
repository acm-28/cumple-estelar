import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { AlertTriangle, X } from "lucide-react-native";
import tw from "twrnc";

const FORGOTTEN_ITEMS = [
  { emoji: "🕯️", text: "Velas de la torta" },
  { emoji: "🔥", text: "Fósforos o encendedor" },
  { emoji: "🎁", text: "Bolsitas de souvenirs" },
  { emoji: "🍽️", text: "Platos y vasos descartables" },
  { emoji: "🧴", text: "Servilletas extras" },
  { emoji: "📷", text: "Cargar la batería de la cámara" },
  { emoji: "🎵", text: "Playlist preparada" },
  { emoji: "💊", text: "Botiquín básico" },
  { emoji: "🛍️", text: "Bolsas para basura extra" },
  { emoji: "🎈", text: "Cinta y ganchitos para globos" },
];

export function PanicButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOpen(true)}
        style={tw`w-full bg-[#ff00c8]/10 border border-[#ff00c8]/30 rounded-[24px] p-4 flex-row items-center`}
      >
        <View style={tw`w-10 h-10 rounded-full bg-[#ff00c8]/20 flex items-center justify-center mr-3`}>
          <AlertTriangle size={18} color="#ff00c8" />
        </View>
        <View style={tw`flex-1`}>
          <Text style={tw`text-[#ff00c8] font-bold text-sm`}>Botón de Pánico</Text>
          <Text style={tw`text-[#9098c0] text-xs`}>¿Me olvidé de algo? Chequeá la lista</Text>
        </View>
        <Text style={tw`text-xl`}>🚨</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View style={tw`flex-1 justify-end bg-black/70`}>
          <TouchableOpacity style={tw`flex-1`} onPress={() => setOpen(false)} activeOpacity={1} />
          <View style={tw`bg-[#0f1530] border-t border-[#2a2050] rounded-t-[32px] p-6 max-h-[70%]`}>
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <View>
                <Text style={tw`text-[#ff00c8] font-bold text-lg`}>🚨 Clásicos Olvidados</Text>
                <Text style={tw`text-[#9098c0] text-xs`}>Las cosas que siempre se olvidan</Text>
              </View>
              <TouchableOpacity
                onPress={() => setOpen(false)}
                style={tw`w-8 h-8 rounded-full bg-[#2a2050] flex items-center justify-center`}
              >
                <X size={16} color="#9098c0" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {FORGOTTEN_ITEMS.map((item, i) => (
                <View
                  key={i}
                  style={tw`flex-row items-center bg-[#12102a] rounded-2xl px-4 py-3 border border-[#2a2050] mb-2`}
                >
                  <Text style={tw`text-xl mr-3`}>{item.emoji}</Text>
                  <Text style={tw`text-[#f0f4ff] text-sm`}>{item.text}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
