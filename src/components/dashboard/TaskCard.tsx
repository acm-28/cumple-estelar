import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Check, DollarSign, Edit2, Calendar } from "lucide-react-native";
import tw from "twrnc";
import type { Task } from "@/lib/types";

const CATEGORY_COLORS: Record<Task["category"], string> = {
  venue: "#00e5ff",
  food: "#ffd700",
  decoration: "#ff00c8",
  invitation: "#a78bfa",
  entertainment: "#fb923c",
  other: "#9098c0",
};

const CATEGORY_LABELS: Record<Task["category"], string> = {
  venue: "🏠 Lugar",
  food: "🍕 Comida",
  decoration: "🎈 Deco",
  invitation: "📩 Invites",
  entertainment: "🎪 Show",
  other: "⭐ Otro",
};

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
}

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

export function TaskCard({ task, onToggle, onEdit }: TaskCardProps) {
  const isDone = task.status === "done";
  const color = CATEGORY_COLORS[task.category];
  const priorityGlow = task.priority === "high" && !isDone;

  const handleToggle = () => {
    onToggle(task.id);
  };

  return (
    <View
      style={[
        tw`bg-[#12102a] rounded-[20px] border p-4 flex-row items-center mb-2`,
        isDone ? tw`border-[#2a2050] opacity-60` : priorityGlow ? tw`border-[#00e5ff]/30` : tw`border-[#2a2050]`,
      ]}
    >
      {/* Checkbox */}
      <TouchableOpacity
        onPress={handleToggle}
        style={[
          tw`w-9 h-9 rounded-full border-2 items-center justify-center mr-3`,
          isDone ? tw`bg-[#00e5ff]/20 border-[#00e5ff]` : tw`border-[#2a2050]`
        ]}
      >
        {isDone && <Check size={16} color="#00e5ff" />}
      </TouchableOpacity>

      {/* Content */}
      <View style={tw`flex-1`}>
        <View style={tw`flex-row items-center mb-1`}>
          <View style={[tw`px-2 py-0.5 rounded-full mr-2`, { backgroundColor: `${color}20` }]}>
            <Text style={[tw`text-[9px] font-semibold`, { color }]}>
              {CATEGORY_LABELS[task.category]}
            </Text>
          </View>
          {task.priority === "high" && !isDone && (
            <View style={tw`px-2 py-0.5 rounded-full bg-[#ff00c8]/20`}>
              <Text style={tw`text-[9px] font-semibold text-[#ff00c8]`}>🔥 Urgente</Text>
            </View>
          )}
        </View>
        <Text style={[tw`text-sm font-bold`, isDone ? tw`line-through text-[#9098c0]` : tw`text-[#f0f4ff]`]}>
          {task.title}
        </Text>
        <Text style={tw`text-[#9098c0] text-xs mt-0.5`}>{task.description}</Text>
        {task.dueDate && (
          <View style={tw`flex-row items-center mt-1.5 gap-1`}>
            <Calendar size={10} color={isDone ? "#9098c0" : "#a78bfa"} />
            <Text style={[tw`text-[10px] font-medium`, { color: isDone ? "#9098c0" : "#a78bfa" }]}>
              {formatDate(task.dueDate)}
            </Text>
          </View>
        )}
      </View>

      {/* Cost */}
      <View style={tw`items-center ml-2 mr-2`}>
        <DollarSign size={12} color={isDone ? "#9098c0" : "#ffd700"} />
        <Text style={[tw`text-xs font-bold`, isDone ? tw`text-[#9098c0]` : tw`text-[#ffd700]`]}>
          ${task.cost}
        </Text>
      </View>

      {/* Edit Button */}
      <TouchableOpacity onPress={() => onEdit(task)} style={tw`p-2`}>
        <Edit2 size={16} color="#9098c0" />
      </TouchableOpacity>
    </View>
  );
}
