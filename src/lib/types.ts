export type TeamType = "hacetodo" | "intermedio" | "resolutiva";
export type BudgetLevel = "ahorro" | "equilibrado" | "atodo";

export interface OnboardingData {
  kidName: string;
  kidAge: number;
  team: TeamType;
  guestKids: string;
  guestAdults: string;
  budget: BudgetLevel;
  theme: string;
  eventDate?: string;
}

export type TaskStatus = "pending" | "in-progress" | "done";
export type TaskPriority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  daysBeforeEvent: number;
  category: "venue" | "food" | "decoration" | "invitation" | "entertainment" | "other";
  cost: number;
  dueDate?: string; // ISO date string, e.g. "2025-12-01"
}

export type OrganizerLevel =
  | "Cadete Espacial"
  | "Piloto de Fiestas"
  | "Comandante del Festejo";
