export type AuthMode = "login" | "register" | "forgot";

export type SocialProvider = "google" | "facebook";

export interface PasswordStrengthResult {
  score: number;
  text: string;
  color: string;
  textCol: string;
}
