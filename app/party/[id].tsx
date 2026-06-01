import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Rocket, Star, TrendingUp, Plus, Calendar, ArrowLeft, MessageCircle, Pencil, Gamepad2 } from "lucide-react-native";
import { SpaceshipProgress } from "@/components/dashboard/SpaceshipProgress";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { PanicButton } from "@/components/dashboard/PanicButton";
import { TaskModal } from "@/components/dashboard/TaskModal";
import type { Task } from "@/lib/types";
import { useApp, getProgress, getOrganizerLevel } from "@/lib/store";
import { LinearGradient } from "expo-linear-gradient";
import tw from "twrnc";

export default function PartyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLoaded, getParty, toggleTask, addTask, updateTask, deleteTask } = useApp();
  const [isModalVisible, setModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const party = id ? getParty(id) : undefined;

  useEffect(() => {
    if (isLoaded && !party) {
      router.replace("/home");
    }
  }, [isLoaded, party, router]);

  if (!isLoaded || !party) return null;

  const { onboarding, tasks, spentBudget } = party;

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setModalVisible(true);
  };

  const handleSave = (taskData: Omit<Task, "id" | "status">) => {
    if (taskToEdit) {
      updateTask(party.id, taskToEdit.id, taskData);
    } else {
      addTask(party.id, taskData);
    }
  };

  const handleAddNew = () => {
    setTaskToEdit(null);
    setModalVisible(true);
  };

  const progress = getProgress(tasks);
  const level = getOrganizerLevel(tasks);
  const pendingTasks = tasks.filter((t) => t.status !== "done");
  const doneTasks = tasks.filter((t) => t.status === "done");
  const nextPriority = pendingTasks.find((t) => t.priority === "high") || pendingTasks[0];
  const BUDGET_LIMITS = {
    ahorro: 50000,
    equilibrado: 150000,
    atodo: 500000,
  };
  const maxBudget = onboarding.budgetAmount ?? (BUDGET_LIMITS[onboarding.budget as keyof typeof BUDGET_LIMITS] || 150000);
  const budgetSpentPct = Math.min(100, Math.round((spentBudget / maxBudget) * 100));

  const eventDate = onboarding.eventDate ? new Date(onboarding.eventDate + "T12:00:00") : null;
  const daysUntil = eventDate ? Math.ceil((eventDate.getTime() - Date.now()) / 86400000) : null;
  const countdownLabel =
    daysUntil === null ? null
    : daysUntil > 1 ? `Faltan ${daysUntil} días`
    : daysUntil === 1 ? "¡Falta 1 día!"
    : daysUntil === 0 ? "¡Es hoy! 🎉"
    : "¡Ya pasó!";

  return (
    <View style={tw`flex-1 bg-[#080c1a]`}>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pb-28`}>
      {/* Header */}
      <View style={tw`px-5 pt-12 pb-4`}>
        <View style={tw`flex-row items-center justify-between mb-3`}>
          <TouchableOpacity onPress={() => router.push("/home")} style={tw`flex-row items-center`}>
            <ArrowLeft size={16} color="#9098c0" />
            <Text style={tw`text-[#9098c0] text-xs ml-1`}>Mis cumples</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push(`/edit/${party.id}`)}
            style={tw`flex-row items-center bg-[#1a1035] border border-[#2a2050] rounded-full px-3 py-1.5`}
          >
            <Pencil size={13} color="#9098c0" />
            <Text style={tw`text-[#9098c0] text-xs ml-1.5`}>Editar</Text>
          </TouchableOpacity>
        </View>
        <View style={tw`flex-row items-center justify-between mb-1`}>
          <View style={tw`flex-1 pr-3`}>
            <Text style={tw`text-[#9098c0] text-xs font-medium`}>¡Hola, Comandante! 👩‍🚀</Text>
            <Text style={tw`font-bold text-2xl text-[#f0f4ff]`}>
              Cumple de {onboarding.kidName} 🎂
            </Text>
          </View>
          <View style={tw`w-12 h-12 rounded-[16px] bg-[#00e5ff]/10 border border-[#00e5ff]/30 items-center justify-center`}>
            <Rocket size={22} color="#00e5ff" style={{ transform: [{ rotate: '-45deg' }] }} />
          </View>
        </View>
        <View style={tw`flex-row flex-wrap gap-2 mt-3`}>
          {countdownLabel && (
            <View style={tw`flex-row items-center bg-[#00e5ff]/10 border border-[#00e5ff]/30 rounded-full px-3 py-1`}>
              <Calendar size={12} color="#00e5ff" />
              <Text style={tw`text-[#00e5ff] text-xs font-semibold ml-1.5`}>{countdownLabel}</Text>
            </View>
          )}
          <View style={tw`flex-row items-center bg-[#ffd700]/10 border border-[#ffd700]/20 rounded-full px-3 py-1`}>
            <Star size={12} color="#ffd700" />
            <Text style={tw`text-[#ffd700] text-xs font-semibold ml-1.5`}>${spentBudget} Gastado</Text>
          </View>
          <View style={tw`flex-row items-center bg-[#1a1035] border border-[#2a2050] rounded-full px-3 py-1`}>
            <Text style={tw`text-[#9098c0] text-xs mr-1.5`}>Temática:</Text>
            <Text style={tw`text-[#f0f4ff] text-xs font-medium capitalize`}>{onboarding.theme}</Text>
          </View>
        </View>
      </View>

      <View style={tw`px-4 gap-4`}>
        {/* Spaceship Progress */}
        <SpaceshipProgress progress={progress} level={level} spentBudget={spentBudget} />

        {/* Priority Alert */}
        {nextPriority && (
          <View style={tw`bg-[#00e5ff]/10 border border-[#00e5ff]/30 rounded-[24px] p-4`}>
            <View style={tw`flex-row items-center mb-1`}>
              <TrendingUp size={14} color="#00e5ff" />
              <Text style={tw`text-[#00e5ff] text-xs font-semibold uppercase tracking-wider ml-2`}>Tu Prioridad #1 Hoy</Text>
            </View>
            <Text style={tw`text-[#f0f4ff] font-bold`}>{nextPriority.title}</Text>
            <Text style={tw`text-[#9098c0] text-xs mt-0.5`}>{nextPriority.description}</Text>
          </View>
        )}

        {/* Budget Summary */}
        <View style={tw`bg-[#12102a] rounded-[24px] border border-[#2a2050] p-4`}>
          <View style={tw`flex-row items-center justify-between mb-3`}>
            <Text style={tw`text-[#f0f4ff] font-bold text-sm`}>💰 Resumen de Cofre</Text>
            <Text style={tw`text-[#9098c0] text-xs`}>
              Total ${maxBudget.toLocaleString("es-AR")}
            </Text>
          </View>
          <View style={tw`h-3 bg-[#1a1035] rounded-full overflow-hidden mb-2`}>
            <LinearGradient
              colors={['#ffd700', '#ff00c8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[tw`h-full rounded-full`, { width: `${budgetSpentPct}%` }]}
            />
          </View>
          <View style={tw`flex-row justify-between`}>
            <Text style={tw`text-[#ffd700] text-xs font-medium`}>Gastado ${spentBudget}</Text>
            <Text style={tw`text-[#9098c0] text-xs`}>Te queda ${Math.max(0, maxBudget - spentBudget)}</Text>
          </View>
        </View>

        {/* Invitation */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push(`/invitation/${party.id}`)}
          style={tw`w-full bg-[#25D366]/10 border border-[#25D366]/30 rounded-[24px] p-4 flex-row items-center`}
        >
          <View style={tw`w-10 h-10 rounded-full bg-[#25D366]/20 items-center justify-center mr-3`}>
            <MessageCircle size={18} color="#25D366" />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-[#25D366] font-bold text-sm`}>Crear invitación</Text>
            <Text style={tw`text-[#9098c0] text-xs`}>Armá la tarjeta y compartila por WhatsApp</Text>
          </View>
          <Text style={tw`text-xl`}>💌</Text>
        </TouchableOpacity>

        {/* Game ideas */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push(`/ideas/${party.id}`)}
          style={tw`w-full bg-[#a855f7]/10 border border-[#a855f7]/30 rounded-[24px] p-4 flex-row items-center`}
        >
          <View style={tw`w-10 h-10 rounded-full bg-[#a855f7]/20 items-center justify-center mr-3`}>
            <Gamepad2 size={18} color="#a855f7" />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-[#a855f7] font-bold text-sm`}>Ideas de juegos</Text>
            <Text style={tw`text-[#9098c0] text-xs`}>Juegos por temática + Pinterest y YouTube</Text>
          </View>
          <Text style={tw`text-xl`}>🎲</Text>
        </TouchableOpacity>

        {/* Panic Button */}
        <PanicButton />

        {/* Tasks */}
        <View>
          <View style={tw`flex-row items-center justify-between mb-3`}>
            <Text style={tw`text-[#f0f4ff] font-bold`}>🚀 Misiones Pendientes</Text>
            <Text style={tw`text-[#9098c0] text-xs`}>{doneTasks.length}/{tasks.length}</Text>
          </View>
          <View>
            {pendingTasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={(tid) => toggleTask(party.id, tid)} onEdit={handleEdit} />
            ))}
            {doneTasks.length > 0 && (
              <>
                <Text style={tw`text-[#9098c0] text-xs px-1 pt-2 mb-2`}>✅ Completadas</Text>
                {doneTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onToggle={(tid) => toggleTask(party.id, tid)} onEdit={handleEdit} />
                ))}
              </>
            )}
          </View>
        </View>
      </View>
    </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={handleAddNew}
        style={tw`absolute bottom-6 right-6 w-14 h-14 bg-[#00e5ff] rounded-full items-center justify-center elevation-5 shadow-lg shadow-[#00e5ff]/50`}
      >
        <Plus size={24} color="#080c1a" strokeWidth={3} />
      </TouchableOpacity>

      <TaskModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        onDelete={(tid) => deleteTask(party.id, tid)}
        taskToEdit={taskToEdit}
      />
    </View>
  );
}
