import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Calendar } from "lucide-react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import tw from "twrnc";

export interface DateFieldProps {
  value: string | null; // ISO yyyy-mm-dd
  onChange: (iso: string) => void;
  minimumDate?: Date;
  placeholder?: string;
}

export function DateField({ value, onChange, minimumDate, placeholder = "Tocá para elegir la fecha" }: DateFieldProps) {
  const [show, setShow] = useState(false);
  const date = value ? new Date(value + "T12:00:00") : null;
  const label = date
    ? date.toLocaleDateString("es-AR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })
    : placeholder;

  return (
    <View>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={tw`bg-[#1a1035] border border-[#2a2050] rounded-[16px] px-4 py-3 flex-row items-center gap-3`}
      >
        <Calendar size={18} color={date ? "#00e5ff" : "#9098c0"} />
        <Text style={{ color: date ? "#00e5ff" : "#9098c0", fontWeight: date ? "600" : "400", textTransform: "capitalize" }}>
          {label}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={date ?? new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          minimumDate={minimumDate}
          onChange={(e: DateTimePickerEvent, sel?: Date) => {
            setShow(Platform.OS === "ios");
            if (e.type !== "dismissed" && sel) onChange(sel.toISOString().split("T")[0]);
          }}
          style={Platform.OS === "ios" ? tw`bg-[#1a1035] rounded-[16px] mt-2` : undefined}
        />
      )}
    </View>
  );
}
