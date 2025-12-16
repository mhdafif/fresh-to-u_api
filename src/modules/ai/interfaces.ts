export interface AIIdentifyRequest {
  image: string; // base64
  locale?: "id" | "en";
  type?: "SCAN" | "SEARCH";
}

export interface AIIdentifyResponse {
  name: string | null;
  category: "FRUIT" | "VEGETABLE" | "PROTEIN" | "OTHER";
  confidence: number;
  locale: "id" | "en";
  selection_tips: string[];
  storage: {
    method: string;
    duration_hint: string;
  };
  estimated_price: {
    value: number | null;
    currency: "IDR";
    unit: "per_kg" | "per_piece" | "per_100g" | "per_bunch";
    city: string | null;
    month: number | null;
    confidence: number;
    notes: string | null;
  };
  notes: {
    variety_guess: string | null;
    uncertainty: string | null;
  };
  nutrition: {
    per_100g: string[];
    benefits: string[];
  };
  imageUrl?: string | null; // URL to the stored image in R2
}
