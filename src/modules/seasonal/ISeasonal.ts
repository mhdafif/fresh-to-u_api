export interface SeasonalFood {
  id: string;
  name: string;
  category:
    | "FRUIT"
    | "VEGETABLE"
    | "PROTEIN"
    | "GRAIN"
    | "HERB"
    | "DAIRY"
    | "OTHER";
  description?: string;
  image?: string;
  months: number[];
  season?: string;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    vitamins?: string[];
  };
  tips?: string[];
  storage?: {
    method: string;
    duration: string;
  };
  locale?: string;
}

export interface SeasonalMonth {
  month: number;
  monthName: string;
  foods: SeasonalFood[];
}

export interface LocationBasedParams {
  latitude: number;
  longitude: number;
  country?: string;
  region?: string;
  limit?: number;
  offset?: number;
}

export interface SeasonalParams {
  month?: number;
  location?: {
    latitude?: number;
    longitude?: number;
    country?: string;
    region?: string;
  };
  limit?: number;
  offset?: number;
}
