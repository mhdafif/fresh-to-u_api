import {
  LocationBasedParams,
  SeasonalFood,
  SeasonalMonth,
  SeasonalParams,
} from "./ISeasonal";

// Mock seasonal food database - in a real app, this would come from a database or external API
const mockSeasonalFoods: SeasonalFood[] = [
  // January
  {
    id: "1",
    name: "Apples",
    category: "FRUIT",
    description:
      "Crisp and sweet winter apples, perfect for baking and snacking",
    months: [1, 2, 10, 11, 12],
    season: "Winter",
    nutrition: {
      calories: 52,
      fiber: 2.4,
      vitamins: ["Vitamin C", "Fiber"],
    },
    tips: ["Store in a cool, dark place", "Check for firmness before buying"],
    storage: {
      method: "Refrigerator crisper",
      duration: "1-2 months",
    },
  },
  {
    id: "2",
    name: "Oranges",
    category: "FRUIT",
    description: "Juicy citrus fruits packed with vitamin C",
    months: [1, 2, 12],
    season: "Winter",
    nutrition: {
      calories: 47,
      fiber: 2.4,
      vitamins: ["Vitamin C", "Folate"],
    },
    tips: [
      "Look for heavy fruits with thin skin",
      "Store at room temperature for a week",
    ],
    storage: {
      method: "Room temperature or refrigerator",
      duration: "3-4 weeks",
    },
  },
  {
    id: "3",
    name: "Kale",
    category: "VEGETABLE",
    description: "Nutrient-dense leafy green that becomes sweeter after frost",
    months: [1, 2, 3, 11, 12],
    season: "Winter",
    nutrition: {
      calories: 49,
      protein: 4.3,
      fiber: 3.6,
      vitamins: ["Vitamin K", "Vitamin A", "Vitamin C"],
    },
    tips: [
      "Remove tough stems before cooking",
      "Massage with olive oil for salads",
    ],
    storage: {
      method: "Refrigerator",
      duration: "5-7 days",
    },
  },
  {
    id: "4",
    name: "Brussels Sprouts",
    category: "VEGETABLE",
    description: "Small cabbage-like vegetables that are sweetest after frost",
    months: [1, 2, 11, 12],
    season: "Winter",
    nutrition: {
      calories: 43,
      protein: 3.4,
      fiber: 3.8,
      vitamins: ["Vitamin K", "Vitamin C"],
    },
    tips: ["Trim ends and remove outer leaves", "Roast for best flavor"],
    storage: {
      method: "Refrigerator",
      duration: "1-2 weeks",
    },
  },

  // February
  {
    id: "5",
    name: "Grapefruit",
    category: "FRUIT",
    description: "Tangy citrus fruit with many health benefits",
    months: [1, 2, 3, 12],
    season: "Winter",
    nutrition: {
      calories: 42,
      fiber: 1.6,
      vitamins: ["Vitamin C", "Vitamin A"],
    },
    tips: ["Best at room temperature", "Avoid if taking certain medications"],
    storage: {
      method: "Room temperature or refrigerator",
      duration: "2-3 weeks",
    },
  },
  {
    id: "6",
    name: "Leeks",
    category: "VEGETABLE",
    description: "Mild onion-like vegetables with a subtle sweetness",
    months: [1, 2, 3, 11, 12],
    season: "Winter",
    nutrition: {
      calories: 61,
      fiber: 1.8,
      vitamins: ["Vitamin K", "Vitamin C", "Folate"],
    },
    tips: ["Clean thoroughly between layers", "Use both white and green parts"],
    storage: {
      method: "Refrigerator",
      duration: "1-2 weeks",
    },
  },

  // March
  {
    id: "7",
    name: "Spinach",
    category: "VEGETABLE",
    description: "Tender leafy green rich in iron and vitamins",
    months: [3, 4, 5, 9, 10, 11],
    season: "Spring",
    nutrition: {
      calories: 23,
      protein: 2.9,
      fiber: 2.2,
      vitamins: ["Iron", "Vitamin K", "Vitamin A"],
    },
    tips: ["Wash thoroughly before use", "Baby spinach requires less cooking"],
    storage: {
      method: "Refrigerator",
      duration: "3-5 days",
    },
  },
  {
    id: "8",
    name: "Asparagus",
    category: "VEGETABLE",
    description: "Tender spring vegetable with unique flavor",
    months: [3, 4, 5],
    season: "Spring",
    nutrition: {
      calories: 20,
      protein: 2.2,
      fiber: 2.1,
      vitamins: ["Vitamin K", "Folate"],
    },
    tips: ["Choose thin spears", "Snap to test freshness"],
    storage: {
      method: "Refrigerator wrapped in damp paper",
      duration: "2-3 days",
    },
  },
  {
    id: "9",
    name: "Strawberries",
    category: "FRUIT",
    description: "Sweet and juicy berries packed with vitamin C",
    months: [3, 4, 5, 6],
    season: "Spring",
    nutrition: {
      calories: 32,
      fiber: 2.0,
      vitamins: ["Vitamin C", "Manganese"],
    },
    tips: ["Look for bright red color", "Don't wash until ready to use"],
    storage: {
      method: "Refrigerator",
      duration: "2-3 days",
    },
  },

  // April
  {
    id: "10",
    name: "Radishes",
    category: "VEGETABLE",
    description: "Crunchy root vegetables with peppery flavor",
    months: [4, 5],
    season: "Spring",
    nutrition: {
      calories: 16,
      fiber: 1.6,
      vitamins: ["Vitamin C"],
    },
    tips: ["Remove tops before storing", "Best eaten raw"],
    storage: {
      method: "Refrigerator",
      duration: "1 week",
    },
  },
  {
    id: "11",
    name: "Peas",
    category: "VEGETABLE",
    description: "Sweet green legumes perfect for spring dishes",
    months: [4, 5, 6],
    season: "Spring",
    nutrition: {
      calories: 81,
      protein: 5.4,
      fiber: 2.8,
      vitamins: ["Vitamin K", "Vitamin C"],
    },
    tips: ["Look for bright green pods", "Cook briefly to preserve sweetness"],
    storage: {
      method: "Refrigerator",
      duration: "3-5 days",
    },
  },

  // May
  {
    id: "12",
    name: "Cherries",
    category: "FRUIT",
    description: "Sweet stone fruits with antioxidant benefits",
    months: [5, 6, 7],
    season: "Summer",
    nutrition: {
      calories: 63,
      fiber: 2.1,
      vitamins: ["Vitamin C", "Potassium"],
    },
    tips: ["Look for deep red color", "Stem should be green and fresh"],
    storage: {
      method: "Refrigerator",
      duration: "5-7 days",
    },
  },
  {
    id: "13",
    name: "Arugula",
    category: "VEGETABLE",
    description: "Peppery leafy green popular in salads",
    months: [5, 6, 7, 8, 9],
    season: "Summer",
    nutrition: {
      calories: 25,
      fiber: 1.6,
      vitamins: ["Vitamin K", "Vitamin C"],
    },
    tips: [
      "Use younger leaves for milder flavor",
      "Wash thoroughly before use",
    ],
    storage: {
      method: "Refrigerator",
      duration: "2-3 days",
    },
  },

  // June
  {
    id: "14",
    name: "Blueberries",
    category: "FRUIT",
    description: "Antioxidant-rich berries with sweet flavor",
    months: [6, 7, 8],
    season: "Summer",
    nutrition: {
      calories: 57,
      fiber: 2.4,
      vitamins: ["Vitamin K", "Vitamin C", "Manganese"],
    },
    tips: ["Look for deep blue color", "Check for firmness"],
    storage: {
      method: "Refrigerator",
      duration: "7-10 days",
    },
  },
  {
    id: "15",
    name: "Zucchini",
    category: "VEGETABLE",
    description: "Versatile summer squash perfect for grilling",
    months: [6, 7, 8, 9],
    season: "Summer",
    nutrition: {
      calories: 17,
      fiber: 1.0,
      vitamins: ["Vitamin A", "Vitamin C"],
    },
    tips: [
      "Choose smaller zucchini for better texture",
      "Can be eaten raw or cooked",
    ],
    storage: {
      method: "Refrigerator",
      duration: "4-5 days",
    },
  },

  // July
  {
    id: "16",
    name: "Peaches",
    category: "FRUIT",
    description: "Juicy stone fruits with fuzzy skin",
    months: [7, 8, 9],
    season: "Summer",
    nutrition: {
      calories: 39,
      fiber: 1.5,
      vitamins: ["Vitamin C", "Vitamin A"],
    },
    tips: ["Smell for sweetness", "Gentle pressure should yield slightly"],
    storage: {
      method: "Room temperature until ripe, then refrigerator",
      duration: "3-5 days",
    },
  },
  {
    id: "17",
    name: "Corn",
    category: "VEGETABLE",
    description: "Sweet summer corn perfect for grilling",
    months: [7, 8, 9],
    season: "Summer",
    nutrition: {
      calories: 86,
      protein: 3.3,
      fiber: 2.7,
      vitamins: ["Vitamin B1", "Vitamin B5"],
    },
    tips: ["Look for tight green husks", "Kernels should be plump and milky"],
    storage: {
      method: "Refrigerator with husks on",
      duration: "3-5 days",
    },
  },

  // August
  {
    id: "18",
    name: "Tomatoes",
    category: "FRUIT",
    description: "Juicy fruits essential for many cuisines",
    months: [7, 8, 9, 10],
    season: "Summer",
    nutrition: {
      calories: 18,
      fiber: 1.2,
      vitamins: ["Vitamin C", "Vitamin K", "Potassium"],
    },
    tips: ["Look for deep red color", "Should be slightly soft"],
    storage: {
      method: "Room temperature away from sunlight",
      duration: "5-7 days",
    },
  },
  {
    id: "19",
    name: "Eggplant",
    category: "VEGETABLE",
    description: "Versatile vegetable with meaty texture",
    months: [8, 9, 10],
    season: "Fall",
    nutrition: {
      calories: 25,
      fiber: 3.0,
      vitamins: ["Vitamin K", "Vitamin B6"],
    },
    tips: ["Look for glossy skin", "Should feel heavy for size"],
    storage: {
      method: "Refrigerator",
      duration: "3-5 days",
    },
  },

  // September
  {
    id: "20",
    name: "Grapes",
    category: "FRUIT",
    description: "Sweet clusters of fruit perfect for snacking",
    months: [8, 9, 10, 11],
    season: "Fall",
    nutrition: {
      calories: 69,
      fiber: 0.9,
      vitamins: ["Vitamin K", "Vitamin C"],
    },
    tips: [
      "Look for plump, firmly attached grapes",
      "Stems should be green and fresh",
    ],
    storage: {
      method: "Refrigerator",
      duration: "1-2 weeks",
    },
  },
  {
    id: "21",
    name: "Pears",
    category: "FRUIT",
    description: "Sweet fruits with buttery texture",
    months: [8, 9, 10, 11, 12],
    season: "Fall",
    nutrition: {
      calories: 57,
      fiber: 3.1,
      vitamins: ["Vitamin C", "Vitamin K"],
    },
    tips: [
      "Check ripeness by pressing near the stem",
      "Buy firm pears to ripen at home",
    ],
    storage: {
      method: "Room temperature until ripe, then refrigerator",
      duration: "3-5 days",
    },
  },

  // October
  {
    id: "22",
    name: "Pumpkins",
    category: "VEGETABLE",
    description: "Iconic fall squash perfect for pies and decorations",
    months: [9, 10, 11, 12],
    season: "Fall",
    nutrition: {
      calories: 26,
      protein: 1.0,
      fiber: 0.5,
      vitamins: ["Vitamin A"],
    },
    tips: [
      "Choose pumpkins with hard, intact stems",
      "Smaller pumpkins are better for cooking",
    ],
    storage: {
      method: "Cool, dark place",
      duration: "2-3 months",
    },
  },
  {
    id: "23",
    name: "Sweet Potatoes",
    category: "VEGETABLE",
    description: "Nutritious root vegetables with sweet flavor",
    months: [10, 11, 12],
    season: "Fall",
    nutrition: {
      calories: 90,
      fiber: 3.3,
      vitamins: ["Vitamin A", "Vitamin C"],
    },
    tips: [
      "Choose firm sweet potatoes without soft spots",
      "Store at room temperature",
    ],
    storage: {
      method: "Cool, dark place",
      duration: "1-2 weeks",
    },
  },

  // November
  {
    id: "24",
    name: "Cranberries",
    category: "FRUIT",
    description: "Tart berries perfect for holiday dishes",
    months: [11, 12],
    season: "Winter",
    nutrition: {
      calories: 46,
      fiber: 3.6,
      vitamins: ["Vitamin C", "Vitamin E"],
    },
    tips: [
      "Look for deep red, firm berries",
      "Can be frozen for long-term storage",
    ],
    storage: {
      method: "Refrigerator",
      duration: "2-4 weeks",
    },
  },
  {
    id: "25",
    name: "Persimmons",
    category: "FRUIT",
    description: "Sweet autumn fruits with honey-like flavor",
    months: [10, 11, 12],
    season: "Fall",
    nutrition: {
      calories: 118,
      fiber: 3.6,
      vitamins: ["Vitamin A", "Vitamin C"],
    },
    tips: [
      "Let fully ripen for best flavor",
      "Fuyu persimmons can be eaten when firm",
    ],
    storage: {
      method: "Room temperature",
      duration: "3-5 days",
    },
  },

  // December
  {
    id: "26",
    name: "Pomegranates",
    category: "FRUIT",
    description: "Jewel-like seeds with antioxidant benefits",
    months: [11, 12, 1],
    season: "Winter",
    nutrition: {
      calories: 83,
      fiber: 4.0,
      vitamins: ["Vitamin K", "Vitamin C"],
    },
    tips: [
      "Look for heavy fruit with deep color",
      "Can be refrigerated for months",
    ],
    storage: {
      method: "Refrigerator",
      duration: "1-2 months",
    },
  },
  {
    id: "27",
    name: "Winter Squash",
    category: "VEGETABLE",
    description: "Hard-shelled squashes with sweet, nutty flesh",
    months: [10, 11, 12, 1, 2],
    season: "Winter",
    nutrition: {
      calories: 40,
      protein: 0.9,
      fiber: 2.8,
      vitamins: ["Vitamin A", "Vitamin C"],
    },
    tips: ["Choose squash with hard, dull skin", "Store in cool, dark place"],
    storage: {
      method: "Cool, dark place",
      duration: "1-3 months",
    },
  },
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export class SeasonalService {
  static async getSeasonalFoods(
    params: SeasonalParams = {}
  ): Promise<SeasonalFood[]> {
    const { month, limit = 50, offset = 0 } = params;

    let filteredFoods = mockSeasonalFoods;

    // Filter by month if specified
    if (month) {
      filteredFoods = filteredFoods.filter((food) =>
        food.months.includes(month)
      );
    }

    // Apply pagination
    const start = offset;
    const end = start + limit;
    return filteredFoods.slice(start, end);
  }

  static async getSeasonalByMonth(month: number): Promise<SeasonalMonth> {
    const foods = mockSeasonalFoods.filter((food) =>
      food.months.includes(month)
    );

    return {
      month,
      monthName: monthNames[month - 1],
      foods,
    };
  }

  static async getLocationBasedSeasonal(
    params: LocationBasedParams
  ): Promise<SeasonalMonth[]> {
    const { latitude, longitude, limit = 12 } = params;

    // In a real app, this would use the location to determine hemisphere
    // and adjust seasonal availability accordingly
    const isNorthernHemisphere = latitude > 0;

    // For now, we'll simulate location-based seasonal data
    // In a real implementation, you would:
    // 1. Use geolocation API to determine country/region
    // 2. Adjust seasons based on hemisphere
    // 3. Consider climate and local growing conditions
    // 4. Potentially integrate with external agricultural APIs

    const seasonalMonths = isNorthernHemisphere
      ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    const monthsWithData = await Promise.all(
      seasonalMonths.slice(0, limit).map(async (month) => {
        const foods = mockSeasonalFoods.filter((food) =>
          food.months.includes(month)
        );

        // Simulate some location-based variations
        // For example, tropical areas might have different seasonal patterns
        if (Math.abs(latitude) < 23.5) {
          // Tropical region
          // Add tropical-specific modifications here
        }

        return {
          month,
          monthName: monthNames[month - 1],
          foods: foods.slice(0, 10), // Limit foods per month
        };
      })
    );

    return monthsWithData;
  }

  static async getFoodDetail(id: string): Promise<SeasonalFood | null> {
    const food = mockSeasonalFoods.find((f) => f.id === id);
    return food || null;
  }
}
