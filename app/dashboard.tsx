import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Rocket, Star, TrendingUp, Plus } from "lucide-react-native";
import { SpaceshipProgress } from "@/components/dashboard/SpaceshipProgress";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { PanicButton } from "@/components/dashboard/PanicButton";
import { TaskModal } from "@/components/dashboard/TaskModal";
import type { Task } from "@/lib/types";
import { useApp } from "@/lib/store";
import { LinearGradient } from "expo-linear-gradient";
import tw from "twrnc";

export default function DashboardScreen() {
  const router = useRouter();
  const { isLoaded, onboarding, tasks, spentBudget, toggleTask, addTask, updateTask, deleteTask, getProgress, getOrganizerLevel } = useApp();
  const [isModalVisible, setModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setModalVisible(true);
  };

  const handleSave = (taskData: Omit<Task, "id" | "status">) => {
    if (taskToEdit) {
      updateTask(taskToEdit.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  const handleAddNew = () => {
    setTaskToEdit(null);
    setModalVisible(true);
  };

  useEffect(() => {
    if (isLoaded && !onboarding) {
      router.replace("/onboarding");
    }
  }, [isLoaded, onboarding, router]);

  if (!isLoaded || !onboarding) return null;

  const progress = getProgress();
  const level = getOrganizerLevel();
  const pendingTasks = tasks.filter((t) => t.status !== "done");
  const doneTasks = tasks.filter((t) => t.status === "done");
  const nextPriority = pendingTasks.find((t) => t.priority === "high") || pendingTasks[0];
  const BUDGET_LIMITS = {
    ahorro: 50000,
    equilibrado: 150000,
    atodo: 500000,
  };
  const maxBudget = BUDGET_LIMITS[onboarding.budget as keyof typeof BUDGET_LIMITS] || 150000;
  const budgetSpentPct = Math.min(100, Math.round((spentBudget / maxBudget) * 100));

  return (
    <View style={tw`flex-1 bg-[#080c1a]`}>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pb-28`}>
      {/* Header */}
      <View style={tw`px-5 pt-12 pb-4`}>
        <View style={tw`flex-row items-center justify-between mb-1`}>
          <View>
            <Text style={tw`text-[#9098c0] text-xs font-medium`}>¡Hola, Comandante! 👩‍🚀</Text>
            <Text style={tw`font-bold text-2xl text-[#f0f4ff]`}>
              Cumple de {onboarding.kidName} 🎂
            </Text>
          </View>
          <View style={tw`w-12 h-12 rounded-[16px] bg-[#00e5ff]/10 border border-[#00e5ff]/30 items-center justify-center`}>
            <Rocket size={22} color="#00e5ff" style={{ transform: [{ rotate: '-45deg' }] }} />
          </View>
        </View>
        <View style={tw`flex-row gap-3 mt-3`}>
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
            <Text style={tw`text-[#9098c0] text-xs capitalize`}>
              {onboarding.budget === "ahorro" ? "Ahorro Inteligente" : onboarding.budget === "equilibrado" ? "Equilibrado" : "A Todo Trapo"}
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
              <TaskCard key={task.id} task={task} onToggle={toggleTask} onEdit={handleEdit} />
            ))}
            {doneTasks.length > 0 && (
              <>
                <Text style={tw`text-[#9098c0] text-xs px-1 pt-2 mb-2`}>✅ Completadas</Text>
                {doneTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onToggle={toggleTask} onEdit={handleEdit} />
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
        onDelete={deleteTask}
        taskToEdit={taskToEdit}
      />
    </View>
  );
}
