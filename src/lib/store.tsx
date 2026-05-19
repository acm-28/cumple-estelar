import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { OnboardingData, Task } from "./types";

const STORAGE_KEY = "cumple-estelar-data";

const DEFAULT_TASKS: Task[] = [
  { id: "1", title: "Elegir y reservar el lugar", description: "Salón, casa o espacio al aire libre", status: "pending", priority: "high", daysBeforeEvent: 45, category: "venue", cost: 25000 },
  { id: "2", title: "Definir lista de invitados", description: "Armar la lista completa con contactos", status: "pending", priority: "high", daysBeforeEvent: 40, category: "invitation", cost: 0 },
  { id: "3", title: "Diseñar y enviar invitaciones", description: "Con foto del festejado/a y tema elegido", status: "pending", priority: "high", daysBeforeEvent: 30, category: "invitation", cost: 2000 },
  { id: "4", title: "Confirmar animación / entretenimiento", description: "Payaso, show, inflable o juegos", status: "pending", priority: "high", daysBeforeEvent: 30, category: "entertainment", cost: 15000 },
  { id: "5", title: "Planificar el menú", description: "Comida para niños y adultos, torta", status: "pending", priority: "medium", daysBeforeEvent: 21, category: "food", cost: 12000 },
  { id: "6", title: "Decoración y globos", description: "Comprar o alquilar según la temática", status: "pending", priority: "medium", daysBeforeEvent: 14, category: "decoration", cost: 5000 },
  { id: "7", title: "Confirmar asistentes (RSVP)", description: "Hacer seguimiento de confirmaciones", status: "pending", priority: "medium", daysBeforeEvent: 10, category: "invitation", cost: 0 },
  { id: "8", title: "Preparar bolsitas de souvenirs", description: "Un recuerdo para cada invitado", status: "pending", priority: "low", daysBeforeEvent: 7, category: "other", cost: 3500 },
  { id: "9", title: "Comprar velas y fósforos", description: "¡El clásico olvidado!", status: "pending", priority: "low", daysBeforeEvent: 3, category: "other", cost: 500 },
  { id: "10", title: "Armar cronograma del día", description: "Horarios de juegos, comida y torta", status: "pending", priority: "medium", daysBeforeEvent: 5, category: "other", cost: 0 },
];

interface AppState {
  isLoaded: boolean;
  onboarding: OnboardingData | null;
  tasks: Task[];
  spentBudget: number;
  setOnboarding: (data: OnboardingData) => void;
  toggleTask: (id: string) => void;
  addTask: (task: Omit<Task, "id" | "status">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getProgress: () => number;
  getOrganizerLevel: () => string;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [onboarding, setOnboardingState] = useState<OnboardingData | null>(null);
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [spentBudget, setSpentBudget] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          if (data.onboarding) setOnboardingState(data.onboarding);
          if (data.tasks) {
            // Migrate old tasks that had `xp` instead of `cost`
            const migratedTasks = data.tasks.map((t: any) => ({
              ...t,
              cost: t.cost ?? t.xp ?? 0,
            }));
            setTasks(migratedTasks);
          }
          if (data.spentBudget) setSpentBudget(data.spentBudget);
        }
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  const persist = async (update: Partial<{ onboarding: OnboardingData | null; tasks: Task[]; spentBudget: number }>) => {
    try {
      const currentString = await AsyncStorage.getItem(STORAGE_KEY);
      const current = currentString ? JSON.parse(currentString) : {};
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...update }));
    } catch (e) {
      console.error("Failed to save data", e);
    }
  };

  const setOnboarding = (data: OnboardingData) => {
    setOnboardingState(data);
    persist({ onboarding: data });
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => {
      let costChange = 0;
      const updated = prev.map((t) => {
        if (t.id === id) {
          if (t.status === "done") {
            costChange = -t.cost;
            return { ...t, status: "pending" as const };
          } else {
            costChange = t.cost;
            return { ...t, status: "done" as const };
          }
        }
        return t;
      });
      
      if (costChange !== 0) {
        setSpentBudget((spent) => {
          const newSpent = Math.max(0, spent + costChange);
          persist({ spentBudget: newSpent });
          return newSpent;
        });
      }
      persist({ tasks: updated });
      return updated;
    });
  };

  const addTask = (task: Omit<Task, "id" | "status">) => {
    setTasks((prev) => {
      const newTask: Task = { ...task, id: Date.now().toString(), status: "pending" };
      const updated = [...prev, newTask];
      persist({ tasks: updated });
      return updated;
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
      persist({ tasks: updated });
      return updated;
    });
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => {
      const taskToDelete = prev.find((t) => t.id === id);
      const updated = prev.filter((t) => t.id !== id);
      
      if (taskToDelete && taskToDelete.status === "done") {
        setSpentBudget((spent) => {
          const newSpent = Math.max(0, spent - taskToDelete.cost);
          persist({ spentBudget: newSpent });
          return newSpent;
        });
      }
      persist({ tasks: updated });
      return updated;
    });
  };

  const getProgress = () => {
    const done = tasks.filter((t) => t.status === "done").length;
    return Math.round((done / tasks.length) * 100);
  };

  const getOrganizerLevel = () => {
    const progress = getProgress();
    if (progress >= 70) return "Comandante del Festejo";
    if (progress >= 35) return "Piloto de Fiestas";
    return "Cadete Espacial";
  };

  return (
    <AppContext.Provider value={{ isLoaded, onboarding, tasks, spentBudget, setOnboarding, toggleTask, addTask, updateTask, deleteTask, getProgress, getOrganizerLevel }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
