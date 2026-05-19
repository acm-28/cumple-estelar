import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { X, Trash2, Calendar } from "lucide-react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Button } from "@/components/ui/Button";
import tw from "twrnc";
import type { Task } from "@/lib/types";

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, "id" | "status">) => void;
  onDelete?: (id: string) => void;
  taskToEdit?: Task | null;
}

const CATEGORIES = [
  { id: "venue", label: "🏠 Lugar" },
  { id: "food", label: "🍕 Comida" },
  { id: "decoration", label: "🎈 Deco" },
  { id: "invitation", label: "📩 Invites" },
  { id: "entertainment", label: "🎪 Show" },
  { id: "other", label: "⭐ Otro" },
] as const;

const PRIORITIES = [
  { id: "high", label: "Alta 🔥", color: "#ff00c8" },
  { id: "medium", label: "Media ⭐", color: "#ffd700" },
  { id: "low", label: "Baja 🌿", color: "#00e5ff" },
] as const;

export function TaskModal({ visible, onClose, onSave, onDelete, taskToEdit }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Task["category"]>("other");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [cost, setCost] = useState("5000");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description);
        setCategory(taskToEdit.category);
        setPriority(taskToEdit.priority);
        setCost(taskToEdit.cost.toString());
        setDueDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate + "T12:00:00") : null);
      } else {
        setTitle("");
        setDescription("");
        setCategory("other");
        setPriority("medium");
        setCost("5000");
        setDueDate(null);
      }
    }
  }, [visible, taskToEdit]);

  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      title,
      description,
      category,
      priority,
      cost: parseInt(cost) || 0,
      daysBeforeEvent: taskToEdit?.daysBeforeEvent || 10,
      dueDate: dueDate ? dueDate.toISOString().split("T")[0] : undefined,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1 justify-end bg-black/60`}
      >
        <View style={tw`bg-[#12102a] rounded-t-[32px] border-t border-[#2a2050] pt-6 pb-10 px-5 max-h-[90%]`}>
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <Text style={tw`text-xl font-bold text-[#f0f4ff]`}>
              {taskToEdit ? "Editar Misión" : "Nueva Misión"}
            </Text>
            <TouchableOpacity onPress={onClose} style={tw`w-8 h-8 items-center justify-center rounded-full bg-[#1a1035]`}>
              <X size={20} color="#9098c0" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`gap-4`}>
            <View>
              <Text style={tw`text-[#9098c0] text-sm mb-1 ml-1`}>Título</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Ej: Contratar mago..."
                placeholderTextColor="#9098c0"
                style={tw`bg-[#1a1035] border border-[#2a2050] rounded-[16px] px-4 py-3 text-[#f0f4ff] font-medium`}
              />
            </View>

            <View>
              <Text style={tw`text-[#9098c0] text-sm mb-1 ml-1`}>Descripción (opcional)</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Detalles de la misión..."
                placeholderTextColor="#9098c0"
                multiline
                style={tw`bg-[#1a1035] border border-[#2a2050] rounded-[16px] px-4 py-3 text-[#f0f4ff] h-24 text-top`}
              />
            </View>

            <View>
              <Text style={tw`text-[#9098c0] text-sm mb-1 ml-1`}>Categoría</Text>
              <View style={tw`flex-row flex-wrap gap-2`}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setCategory(cat.id)}
                    style={[
                      tw`px-3 py-2 rounded-full border`,
                      category === cat.id ? tw`bg-[#00e5ff]/20 border-[#00e5ff]` : tw`bg-[#1a1035] border-[#2a2050]`
                    ]}
                  >
                    <Text style={[tw`text-xs`, category === cat.id ? tw`text-[#00e5ff] font-bold` : tw`text-[#9098c0]`]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={tw`flex-row gap-4`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-[#9098c0] text-sm mb-1 ml-1`}>Prioridad</Text>
                <View style={tw`flex-row flex-wrap gap-2`}>
                  {PRIORITIES.map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      onPress={() => setPriority(p.id as any)}
                      style={[
                        tw`px-3 py-2 rounded-full border`,
                        priority === p.id ? tw`bg-[#1a1035] border-white` : tw`bg-[#1a1035] border-[#2a2050]`
                      ]}
                    >
                      <Text style={[tw`text-xs font-medium`, { color: p.color }]}>
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={tw`w-32`}>
                <Text style={tw`text-[#9098c0] text-sm mb-1 ml-1`}>Costo Estimado</Text>
                <TextInput
                  value={cost}
                  onChangeText={setCost}
                  keyboardType="numeric"
                  style={tw`bg-[#1a1035] border border-[#2a2050] rounded-[16px] px-4 py-3 text-[#ffd700] font-bold text-center`}
                />
              </View>
            </View>

            {/* Due Date */}
            <View>
              <Text style={tw`text-[#9098c0] text-sm mb-1 ml-1`}>Fecha límite (opcional)</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={tw`bg-[#1a1035] border border-[#2a2050] rounded-[16px] px-4 py-3 flex-row items-center gap-3`}
              >
                <Calendar size={16} color={dueDate ? "#a78bfa" : "#9098c0"} />
                <Text style={{ color: dueDate ? "#a78bfa" : "#9098c0", fontWeight: dueDate ? "600" : "400" }}>
                  {dueDate
                    ? dueDate.toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })
                    : "Sin fecha asignada"}
                </Text>
                {dueDate && (
                  <TouchableOpacity onPress={() => setDueDate(null)} style={tw`ml-auto`}>
                    <X size={14} color="#9098c0" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={dueDate ?? new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  minimumDate={new Date()}
                  onChange={(event: DateTimePickerEvent, selected?: Date) => {
                    setShowDatePicker(Platform.OS === "ios");
                    if (event.type !== "dismissed" && selected) {
                      setDueDate(selected);
                    }
                  }}
                  style={Platform.OS === "ios" ? tw`bg-[#1a1035] rounded-[16px] mt-2` : undefined}
                />
              )}
            </View>

            <View style={tw`mt-4 flex-row gap-3`}>
              {taskToEdit && onDelete && (
                <TouchableOpacity
                  onPress={() => {
                    onDelete(taskToEdit.id);
                    onClose();
                  }}
                  style={tw`w-14 h-14 bg-[#ff0044]/10 border border-[#ff0044]/30 rounded-[16px] items-center justify-center`}
                >
                  <Trash2 size={24} color="#ff0044" />
                </TouchableOpacity>
              )}
              <View style={tw`flex-1`}>
                <Button variant="cyan" onPress={handleSave} disabled={!title.trim()}>
                  {taskToEdit ? "Guardar Cambios" : "Añadir Misión"}
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
