import type { Artisan } from "../../types/heritage";

export interface BookingFormData {
  name: string;
  phone: string;
  visitDate: string;
  guestsCount: string;
  experienceType: string;
  notes: string;
}

export interface WorkshopItem {
  id: string;
  artisanId: number;
  villageBadge: string;
  badgeClass: string;
  title: string;
  description: string;
  duration: string;
  experienceType: string;
  actionClass: string;
}

export interface VillageTab {
  id: string;
  label: string;
  count: number;
}

export type BookingTarget = Artisan;
