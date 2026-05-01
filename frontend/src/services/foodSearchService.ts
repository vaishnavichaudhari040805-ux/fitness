// ─── Indian Food Database ──────────────────────────────────────
export const INDIAN_FOODS = [
  { foodName: "Dal Tadka (1 bowl)",        calories: 180, proteinG: 9,  carbsG: 28, fatsG: 4  },
  { foodName: "Chicken Biryani (1 plate)", calories: 490, proteinG: 28, carbsG: 58, fatsG: 14 },
  { foodName: "Paneer Butter Masala",      calories: 320, proteinG: 14, carbsG: 18, fatsG: 22 },
  { foodName: "Roti (1 piece)",            calories: 80,  proteinG: 3,  carbsG: 15, fatsG: 1  },
  { foodName: "Paratha (1 piece)",         calories: 200, proteinG: 4,  carbsG: 28, fatsG: 8  },
  { foodName: "Aloo Sabzi (1 bowl)",       calories: 150, proteinG: 3,  carbsG: 28, fatsG: 4  },
  { foodName: "Rajma (1 bowl)",            calories: 220, proteinG: 13, carbsG: 38, fatsG: 2  },
  { foodName: "Chole (1 bowl)",            calories: 240, proteinG: 12, carbsG: 40, fatsG: 5  },
  { foodName: "Idli (2 pieces)",           calories: 130, proteinG: 4,  carbsG: 26, fatsG: 1  },
  { foodName: "Dosa (1 piece)",            calories: 168, proteinG: 4,  carbsG: 30, fatsG: 4  },
  { foodName: "Sambar (1 bowl)",           calories: 100, proteinG: 5,  carbsG: 16, fatsG: 2  },
  { foodName: "Rice (1 cup cooked)",       calories: 206, proteinG: 4,  carbsG: 45, fatsG: 0  },
  { foodName: "Palak Paneer (1 bowl)",     calories: 280, proteinG: 14, carbsG: 12, fatsG: 20 },
  { foodName: "Egg Bhurji (2 eggs)",       calories: 180, proteinG: 14, carbsG: 4,  fatsG: 12 },
  { foodName: "Chicken Curry (1 bowl)",    calories: 300, proteinG: 28, carbsG: 10, fatsG: 16 },
  { foodName: "Lassi (1 glass)",           calories: 150, proteinG: 5,  carbsG: 22, fatsG: 5  },
  { foodName: "Poha (1 plate)",            calories: 180, proteinG: 4,  carbsG: 35, fatsG: 4  },
  { foodName: "Upma (1 plate)",            calories: 200, proteinG: 5,  carbsG: 38, fatsG: 4  },
  { foodName: "Puri (2 pieces)",           calories: 200, proteinG: 4,  carbsG: 28, fatsG: 9  },
  { foodName: "Paneer (100g)",             calories: 265, proteinG: 18, carbsG: 4,  fatsG: 20 },
  { foodName: "Mango Lassi (1 glass)",     calories: 220, proteinG: 5,  carbsG: 40, fatsG: 5  },
  { foodName: "Masala Chai (1 cup)",       calories: 60,  proteinG: 2,  carbsG: 9,  fatsG: 2  },
  { foodName: "Aloo Paratha (1 piece)",    calories: 280, proteinG: 6,  carbsG: 42, fatsG: 10 },
  { foodName: "Kadai Chicken (1 bowl)",    calories: 320, proteinG: 30, carbsG: 12, fatsG: 18 },
  { foodName: "Moong Dal (1 bowl)",        calories: 150, proteinG: 10, carbsG: 25, fatsG: 1  },
] as const;

// ─── Types ─────────────────────────────────────────────────────
export interface FoodItem {
  foodName: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  source?: "indian" | "openfoodfacts";
}

// ─── Search Indian Foods ───────────────────────────────────────
export const searchIndianFoods = (query: string): FoodItem[] => {
  if (!query || query.length < 2) return [];
  const lower = query.toLowerCase();
  return INDIAN_FOODS.filter((food) =>
    food.foodName.toLowerCase().includes(lower)
  ).map((f) => ({ ...f, source: "indian" as const }));
};

// ─── Search OpenFoodFacts API ──────────────────────────────────
export const searchOpenFoodFacts = async (
  query: string
): Promise<FoodItem[]> => {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        query
      )}&search_simple=1&action=process&json=1&page_size=8&fields=product_name,nutriments`
    );

    if (!response.ok) return [];

    const data = await response.json();

    return (data.products || [])
      .filter((p: any) => p.product_name && p.nutriments)
      .map((product: any) => ({
        foodName: product.product_name,
        calories: Math.round(product.nutriments["energy-kcal_100g"] || 0),
        proteinG: parseFloat(
          (product.nutriments["proteins_100g"] || 0).toFixed(1)
        ),
        carbsG: parseFloat(
          (product.nutriments["carbohydrates_100g"] || 0).toFixed(1)
        ),
        fatsG: parseFloat((product.nutriments["fat_100g"] || 0).toFixed(1)),
        source: "openfoodfacts" as const,
      }))
      .filter((f: FoodItem) => f.calories > 0);
  } catch {
    return [];
  }
};

// ─── Combined Search ───────────────────────────────────────────
export const searchAllFoods = async (query: string): Promise<FoodItem[]> => {
  const indianResults = searchIndianFoods(query);
  const apiResults    = await searchOpenFoodFacts(query);

  // ─── Indian foods first, then API results ──────────────────
  const combined = [...indianResults, ...apiResults];

  // ─── Remove duplicates by name ──────────────────────────────
  const seen = new Set<string>();
  return combined.filter((food) => {
    const key = food.foodName.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};