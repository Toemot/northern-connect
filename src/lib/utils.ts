import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a phone number for display */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

/** Truncate text to a max length with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

/** Format a datetime string to a friendly date */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Format a datetime string to a friendly time */
export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
