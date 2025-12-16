export interface CreateHistoryData {
  userId: string | null;
  guestId: string | null;
  type: "SCAN" | "SEARCH";
  query?: string;
  resultLabel?: string;
  confidence?: number;
  detail: Detail;
}

export interface GetHistoryOptions {
  page: number;
  per_page: number;
  type?: "SCAN" | "SEARCH";
  search?: string;
}

export interface HistoryOwner {
  userId?: string | null;
  guestId?: string | null;
}

export interface Detail {
  name: string;
  category: string;
  confidence: number;
  selection_tips: string[];
  storage: Storage;
  estimated_price: EstimatedPrice;
  nutrition: Nutrition;
  notes: Notes;
  locale: string;
  imageUrl: string;
}

export interface Storage {
  method: string[];
  duration_hint: string[];
}

export interface EstimatedPrice {
  value: number;
  currency: string;
  unit: string;
  city: string;
  month: string;
  confidence: number;
  notes: string;
}

export interface Nutrition {
  per_100g: string[];
  benefits: string[];
}

export interface Notes {
  variety_guess: string;
  uncertainty: string;
}
