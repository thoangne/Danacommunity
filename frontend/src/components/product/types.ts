export type ProductSortOption = "featured" | "price-asc" | "price-desc" | "name";

export interface ProductOrderFormData {
  fullName: string;
  phone: string;
  email: string;
  requestType: string;
  notes: string;
}
