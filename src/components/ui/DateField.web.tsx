import React from "react";

export interface DateFieldProps {
  value: string | null; // ISO yyyy-mm-dd
  onChange: (iso: string) => void;
  minimumDate?: Date;
  placeholder?: string;
}

// On web we use a native <input type="date"> so the OS date picker works
// (the community DateTimePicker has no web support).
export function DateField({ value, onChange, minimumDate }: DateFieldProps) {
  return React.createElement("input", {
    type: "date",
    value: value ?? "",
    min: minimumDate ? minimumDate.toISOString().split("T")[0] : undefined,
    onChange: (e: any) => onChange(e.target.value),
    style: {
      backgroundColor: "#1a1035",
      border: "1px solid #2a2050",
      borderRadius: 16,
      padding: "12px 16px",
      color: "#f0f4ff",
      fontSize: 14,
      width: "100%",
      boxSizing: "border-box",
      colorScheme: "dark",
    },
  });
}
