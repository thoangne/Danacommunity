import type { PasswordStrengthResult } from "./types";

/**
 * Calculates password strength on a 0-4 scale:
 * +1 if length >= 6
 * +1 if length >= 8
 * +1 if contains both uppercase and lowercase letters
 * +1 if contains digits or special characters
 */
export function calculatePasswordStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

/**
 * Maps numeric strength score (0-4) to Vietnamese label and Tailwind color classes.
 */
export function getStrengthLabel(score: number): Omit<PasswordStrengthResult, "score"> {
  switch (score) {
    case 0:
    case 1:
      return { text: "Yếu", color: "bg-red-500", textCol: "text-red-500" };
    case 2:
      return { text: "Trung bình", color: "bg-amber-500", textCol: "text-amber-500" };
    case 3:
      return { text: "Khá", color: "bg-lime-500", textCol: "text-lime-600" };
    case 4:
      return { text: "Rất mạnh", color: "bg-emerald-600", textCol: "text-emerald-600" };
    default:
      return { text: "", color: "bg-stone-200", textCol: "" };
  }
}

/**
 * Evaluates password and returns combined score and label metadata.
 */
export function evaluatePassword(password: string): PasswordStrengthResult {
  const score = calculatePasswordStrength(password);
  const label = getStrengthLabel(score);
  return {
    score,
    ...label,
  };
}
