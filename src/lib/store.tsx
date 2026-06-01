import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { OnboardingData, Task, Party, InvitationData } from "./types";

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

const createDefaultTasks = (): Task[] => DEFAULT_TASKS.map((t) => ({ ...t }));

// ---- Pure helpers (usable from any component) ----
export function getProgress(tasks: Task[]): number {
  if (!tasks.length) return 0;
  const done = tasks.filter((t) => t.status === "done").length;
  return Math.round((done / tasks.length) * 100);
}

export function getOrganizerLevel(tasks: Task[]): string {
  const progress = getProgress(tasks);
  if (progress >= 70) return "Comandante del Festejo";
  if (progress >= 35) return "Piloto de Fiestas";
  return "Cadete Espacial";
}

/** A party is "active" while its date hasn't passed (or it has no date yet). */
export function isPartyActive(party: Party): boolean {
  if (!party.onboarding.eventDate) return true;
  const end = new Date(party.onboarding.eventDate + "T23:59:59");
  return end.getTime() >= Date.now();
}

interface AppState {
  isLoaded: boolean;
  parties: Party[];
  getParty: (id: string) => Party | undefined;
  addParty: (data: OnboardingData) => string;
  deleteParty: (id: string) => void;
  updateOnboarding: (partyId: string, data: OnboardingData) => void;
  updateInvitation: (partyId: string, data: InvitationData) => void;
  toggleTask: (partyId: string, taskId: string) => void;
  addTask: (partyId: string, task: Omit<Task, "id" | "status">) => void;
  updateTask: (partyId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (partyId: string, taskId: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [parties, setParties] = useState<Party[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          if (Array.isArray(data.parties)) {
            setParties(data.parties.map(normalizeParty));
          } else if (data.onboarding) {
            // Migrate legacy single-party data into one party.
            const migrated: Party = normalizeParty({
              id: Date.now().toString(),
              createdAt: Date.now(),
              onboarding: data.onboarding,
              tasks: data.tasks,
              spentBudget: data.spentBudget,
            });
            setParties([migrated]);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ parties: [migrated] }));
          }
        }
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  const persist = (next: Party[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ parties: next })).catch((e) =>
      console.error("Failed to save data", e)
    );
  };

  const commit = (next: Party[]) => {
    setParties(next);
    persist(next);
  };

  const getParty = (id: string) => parties.find((p) => p.id === id);

  const addParty = (data: OnboardingData): string => {
    const id = Date.now().toString();
    const party: Party = { id, createdAt: Date.now(), onboarding: data, tasks: createDefaultTasks(), spentBudget: 0 };
    setParties((prev) => {
      const next = [party, ...prev];
      persist(next);
      return next;
    });
    return id;
  };

  const deleteParty = (id: string) => {
    setParties((prev) => {
      const next = prev.filter((p) => p.id !== id);
      persist(next);
      return next;
    });
  };

  const updateOnboarding = (partyId: string, data: OnboardingData) => {
    setParties((prev) => {
      const next = prev.map((p) => (p.id === partyId ? { ...p, onboarding: data } : p));
      persist(next);
      return next;
    });
  };

  const updateInvitation = (partyId: string, data: InvitationData) => {
    setParties((prev) => {
      const next = prev.map((p) => (p.id === partyId ? { ...p, invitation: data } : p));
      persist(next);
      return next;
    });
  };

  const updatePartyTasks = (
    partyId: string,
    fn: (party: Party) => { tasks: Task[]; spentBudget: number }
  ) => {
    setParties((prev) => {
      const next = prev.map((p) => (p.id === partyId ? { ...p, ...fn(p) } : p));
      persist(next);
      return next;
    });
  };

  const toggleTask = (partyId: string, taskId: string) => {
    updatePartyTasks(partyId, (p) => {
      let costChange = 0;
      const tasks = p.tasks.map((t) => {
        if (t.id === taskId) {
          if (t.status === "done") {
            costChange = -t.cost;
            return { ...t, status: "pending" as const };
          }
          costChange = t.cost;
          return { ...t, status: "done" as const };
        }
        return t;
      });
      return { tasks, spentBudget: Math.max(0, p.spentBudget + costChange) };
    });
  };

  const addTask = (partyId: string, task: Omit<Task, "id" | "status">) => {
    updatePartyTasks(partyId, (p) => {
      const newTask: Task = { ...task, id: Date.now().toString(), status: "pending" };
      return { tasks: [...p.tasks, newTask], spentBudget: p.spentBudget };
    });
  };

  const updateTask = (partyId: string, taskId: string, updates: Partial<Task>) => {
    updatePartyTasks(partyId, (p) => ({
      tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
      spentBudget: p.spentBudget,
    }));
  };

  const deleteTask = (partyId: string, taskId: string) => {
    updatePartyTasks(partyId, (p) => {
      const target = p.tasks.find((t) => t.id === taskId);
      const spentBudget =
        target && target.status === "done" ? Math.max(0, p.spentBudget - target.cost) : p.spentBudget;
      return { tasks: p.tasks.filter((t) => t.id !== taskId), spentBudget };
    });
  };

  return (
    <AppContext.Provider
      value={{ isLoaded, parties, getParty, addParty, deleteParty, updateOnboarding, updateInvitation, toggleTask, addTask, updateTask, deleteTask }}
    >
      {children}
    </AppContext.Provider>
  );
}

/** Ensure a party loaded from storage has the expected shape (handles legacy `xp` cost). */
function normalizeParty(p: any): Party {
  return {
    id: String(p.id ?? Date.now().toString()),
    createdAt: typeof p.createdAt === "number" ? p.createdAt : Date.now(),
    onboarding: p.onboarding,
    tasks: Array.isArray(p.tasks)
      ? p.tasks.map((t: any) => ({ ...t, cost: t.cost ?? t.xp ?? 0 }))
      : createDefaultTasks(),
    spentBudget: typeof p.spentBudget === "number" ? p.spentBudget : 0,
  };
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
