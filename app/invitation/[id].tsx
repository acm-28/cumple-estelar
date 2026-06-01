import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Platform, Linking, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Clock, MapPin, Share2, MessageCircle } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { useApp } from "@/lib/store";
import type { InvitationData } from "@/lib/types";
import { themeEmoji, themeGradient } from "@/lib/themes";
import { Button } from "@/components/ui/Button";
import tw from "twrnc";

const pad = (n: number) => String(n).padStart(2, "0");
const formatTime = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const timeToDate = (hhmm: string): Date => {
  const d = new Date();
  const [h, m] = hhmm.split(":").map((x) => parseInt(x));
  if (!isNaN(h)) d.setHours(h, isNaN(m) ? 0 : m, 0, 0);
  return d;
};

const formatLongDate = (iso?: string) =>
  iso ? new Date(iso + "T12:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "2-digit", month: "long" }) : "Fecha a confirmar";

export default function InvitationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLoaded, getParty, updateInvitation } = useApp();
  const cardRef = useRef<View>(null);

  const party = id ? getParty(id) : undefined;

  const [address, setAddress] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [message, setMessage] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  useEffect(() => {
    if (party?.invitation) {
      setAddress(party.invitation.address);
      setTimeFrom(party.invitation.timeFrom);
      setTimeTo(party.invitation.timeTo);
      setMessage(party.invitation.message ?? "");
      setRsvpPhone(party.invitation.rsvpPhone ?? "");
    }
  }, [party?.id]);

  useEffect(() => {
    if (isLoaded && !party) router.replace("/home");
  }, [isLoaded, party, router]);

  if (!isLoaded || !party) return null;

  const { kidName, kidAge, eventDate, theme } = party.onboarding;
  const [gFrom, gTo] = themeGradient(theme);
  const emoji = themeEmoji(theme);

  const persist = (over: Partial<InvitationData> = {}) =>
    updateInvitation(party.id, {
      address,
      timeFrom,
      timeTo,
      message: message.trim() || undefined,
      rsvpPhone: rsvpPhone.trim() || undefined,
      ...over,
    });
  const save = () => persist();

  const timeText = timeFrom && timeTo ? `De ${timeFrom} a ${timeTo} hs` : timeFrom ? `Desde las ${timeFrom} hs` : "Horario a confirmar";

  const buildText = () =>
    `¡Te invito a mi cumpleaños! 🎉\n\n` +
    (message.trim() ? `${message.trim()}\n\n` : "") +
    `${emoji} ${kidName} cumple ${kidAge} 🎂\n` +
    `📅 ${formatLongDate(eventDate)}\n` +
    `🕐 ${timeText}\n` +
    `📍 ${address || "Lugar a confirmar"}\n\n` +
    (rsvpPhone.trim()
      ? `¡Confirmá tu asistencia! 📲 https://wa.me/${rsvpPhone.replace(/\D/g, "")}`
      : `¡Confirmá tu asistencia! 💌`);

  const shareText = async () => {
    const url = `https://wa.me/?text=${encodeURIComponent(buildText())}`;
    const ok = await Linking.canOpenURL(url).catch(() => false);
    Linking.openURL(ok ? url : `whatsapp://send?text=${encodeURIComponent(buildText())}`).catch(() =>
      Alert.alert("No se pudo abrir WhatsApp", "Asegurate de tener WhatsApp instalado.")
    );
  };

  const shareImage = async () => {
    save();
    if (Platform.OS === "web") {
      shareText();
      return;
    }
    try {
      const uri = await captureRef(cardRef, { format: "png", quality: 1 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: "image/png", dialogTitle: "Compartir invitación", UTI: "public.png" });
      } else {
        shareText();
      }
    } catch (e) {
      shareText();
    }
  };

  return (
    <View style={tw`flex-1 bg-[#080c1a]`}>
      <ScrollView contentContainerStyle={tw`pb-10`} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={tw`px-5 pt-12 pb-2`}>
          <TouchableOpacity onPress={() => router.back()} style={tw`flex-row items-center mb-3`}>
            <ArrowLeft size={16} color="#9098c0" />
            <Text style={tw`text-[#9098c0] text-xs ml-1`}>Volver</Text>
          </TouchableOpacity>
          <Text style={tw`font-bold text-2xl text-[#f0f4ff]`}>Invitación 💌</Text>
          <Text style={tw`text-[#9098c0] text-xs mt-0.5`}>Completá los datos y compartila por WhatsApp</Text>
        </View>

        {/* Preview card (captured as image) */}
        <View style={tw`px-4 py-3`}>
          <View ref={cardRef} collapsable={false} style={tw`rounded-[28px] overflow-hidden`}>
            <LinearGradient colors={[gFrom, gTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={tw`px-6 py-8 items-center`}>
              <Text style={tw`text-white/90 font-bold text-base text-center mb-4`}>¡Te invito a mi cumpleaños!</Text>
              <View style={tw`w-28 h-28 rounded-full bg-white/15 items-center justify-center mb-4`}>
                <Text style={tw`text-6xl`}>{emoji}</Text>
              </View>
              <Text style={tw`text-white font-bold text-3xl text-center`}>{kidName}</Text>
              <Text style={tw`text-white/80 text-sm ${message.trim() ? "mb-3" : "mb-5"}`}>cumple {kidAge} 🎂</Text>
              {message.trim() ? (
                <Text style={tw`text-white/90 text-sm text-center italic mb-4 px-2`}>{message.trim()}</Text>
              ) : null}

              <View style={tw`w-full bg-white/10 rounded-[20px] px-5 py-4 gap-2.5`}>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-base mr-2`}>📅</Text>
                  <Text style={tw`text-white text-sm flex-1 capitalize`}>{formatLongDate(eventDate)}</Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-base mr-2`}>🕐</Text>
                  <Text style={tw`text-white text-sm flex-1`}>{timeText}</Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-base mr-2`}>📍</Text>
                  <Text style={tw`text-white text-sm flex-1`}>{address || "Lugar a confirmar"}</Text>
                </View>
              </View>

              <Text style={tw`text-white font-bold text-base text-center mt-5`}>
                ¡Confirmá tu asistencia! {rsvpPhone.trim() ? "📲" : "💌"}
              </Text>
              {rsvpPhone.trim() ? (
                <Text style={tw`text-white/90 text-sm text-center mt-1`}>{rsvpPhone.trim()}</Text>
              ) : null}
            </LinearGradient>
          </View>
        </View>

        {/* Form */}
        <View style={tw`px-4 gap-4 mt-2`}>
          <View>
            <Text style={tw`text-[#9098c0] text-sm mb-1 ml-1`}>📍 Dirección del lugar</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              onEndEditing={save}
              placeholder="Ej: Av. Siempreviva 742, Salón Estelar"
              placeholderTextColor="#5a5f80"
              style={tw`bg-[#1a1035] border border-[#2a2050] rounded-[16px] px-4 py-3 text-[#f0f4ff] text-sm`}
            />
          </View>

          <View style={tw`flex-row gap-3`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-[#9098c0] text-sm mb-1 ml-1`}>Hora desde</Text>
              <TouchableOpacity
                onPress={() => setShowFrom(true)}
                style={tw`bg-[#1a1035] border border-[#2a2050] rounded-[16px] px-4 py-3 flex-row items-center gap-2`}
              >
                <Clock size={15} color={timeFrom ? "#00e5ff" : "#9098c0"} />
                <Text style={{ color: timeFrom ? "#00e5ff" : "#9098c0", fontWeight: timeFrom ? "600" : "400" }}>
                  {timeFrom || "--:--"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-[#9098c0] text-sm mb-1 ml-1`}>Hora hasta</Text>
              <TouchableOpacity
                onPress={() => setShowTo(true)}
                style={tw`bg-[#1a1035] border border-[#2a2050] rounded-[16px] px-4 py-3 flex-row items-center gap-2`}
              >
                <Clock size={15} color={timeTo ? "#00e5ff" : "#9098c0"} />
                <Text style={{ color: timeTo ? "#00e5ff" : "#9098c0", fontWeight: timeTo ? "600" : "400" }}>
                  {timeTo || "--:--"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {showFrom && (
            <DateTimePicker
              value={timeFrom ? timeToDate(timeFrom) : new Date(new Date().setHours(16, 0, 0, 0))}
              mode="time"
              is24Hour
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(e: DateTimePickerEvent, sel?: Date) => {
                setShowFrom(Platform.OS === "ios");
                if (e.type !== "dismissed" && sel) {
                  setTimeFrom(formatTime(sel));
                  persist({ timeFrom: formatTime(sel) });
                }
              }}
            />
          )}
          {showTo && (
            <DateTimePicker
              value={timeTo ? timeToDate(timeTo) : new Date(new Date().setHours(19, 0, 0, 0))}
              mode="time"
              is24Hour
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(e: DateTimePickerEvent, sel?: Date) => {
                setShowTo(Platform.OS === "ios");
                if (e.type !== "dismissed" && sel) {
                  setTimeTo(formatTime(sel));
                  persist({ timeTo: formatTime(sel) });
                }
              }}
            />
          )}

          <View>
            <Text style={tw`text-[#9098c0] text-sm mb-1 ml-1`}>💬 Mensaje personalizado (opcional)</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              onEndEditing={save}
              multiline
              placeholder="Ej: ¡Te espero para festejar juntos!"
              placeholderTextColor="#5a5f80"
              style={tw`bg-[#1a1035] border border-[#2a2050] rounded-[16px] px-4 py-3 text-[#f0f4ff] text-sm h-20`}
            />
          </View>

          <View>
            <Text style={tw`text-[#9098c0] text-sm mb-1 ml-1`}>📲 Teléfono para confirmar (opcional)</Text>
            <TextInput
              value={rsvpPhone}
              onChangeText={setRsvpPhone}
              onEndEditing={save}
              keyboardType="phone-pad"
              placeholder="Ej: +54 9 11 1234 5678"
              placeholderTextColor="#5a5f80"
              style={tw`bg-[#1a1035] border border-[#2a2050] rounded-[16px] px-4 py-3 text-[#f0f4ff] text-sm`}
            />
            <Text style={tw`text-[#9098c0] text-[11px] mt-1 ml-1`}>
              Los invitados podrán confirmarte directo por WhatsApp a este número.
            </Text>
          </View>

          {/* Share actions */}
          <View style={tw`gap-3 mt-2`}>
            <Button variant="cyan" onPress={shareImage}>
              <View style={tw`flex-row items-center justify-center`}>
                <Share2 size={18} color="#080c1a" />
                <Text style={tw`text-[#080c1a] font-bold ml-2`}>
                  {Platform.OS === "web" ? "Compartir por WhatsApp" : "Compartir invitación 📲"}
                </Text>
              </View>
            </Button>
            <TouchableOpacity
              onPress={shareText}
              style={tw`bg-[#25D366]/15 border border-[#25D366]/40 rounded-[16px] py-3.5 flex-row items-center justify-center`}
            >
              <MessageCircle size={18} color="#25D366" />
              <Text style={tw`text-[#25D366] font-bold ml-2`}>Enviar solo el texto</Text>
            </TouchableOpacity>
          </View>
          <Text style={tw`text-[#9098c0] text-[11px] text-center px-4`}>
            {Platform.OS === "web"
              ? "En web se comparte como texto. Para enviar la imagen, usá la app en tu teléfono."
              : "“Compartir invitación” genera la imagen y abre WhatsApp (y otras apps)."}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
