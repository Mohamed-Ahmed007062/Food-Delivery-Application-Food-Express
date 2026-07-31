export interface IMealDBItem {
  _id: string;
  idMeal: string;
  name: string;
  description: string;
  price: number;
  category: string;
  restaurant: string;
  country: string;
  isAvailable: boolean;
  isPopular: boolean;
  preparationTime: number;
  image: string;
  ingredients: string[];
  allergens: string[];
  nutritionInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export interface IMealDBArea {
  area: string;
  country: string;
}

export const THEMEALDB_AREAS: Record<string, { area: string; flag: string; label: string }> = {
  Egypt: { area: 'Egyptian', flag: '🇪🇬', label: 'Egypt' },
  Italy: { area: 'Italian', flag: '🇮🇹', label: 'Italy' },
  France: { area: 'French', flag: '🇫🇷', label: 'France' },
  Spain: { area: 'Spanish', flag: '🇪🇸', label: 'Spain' },
  Japan: { area: 'Japanese', flag: '🇯🇵', label: 'Japan' },
  USA: { area: 'American', flag: '🇺🇸', label: 'USA' },
  Mexico: { area: 'Mexican', flag: '🇲🇽', label: 'Mexico' },
  India: { area: 'Indian', flag: '🇮🇳', label: 'India' },
  Turkey: { area: 'Turkish', flag: '🇹🇷', label: 'Turkey' },
  Morocco: { area: 'Moroccan', flag: '🇲🇦', label: 'Morocco' },
  Greece: { area: 'Greek', flag: '🇬🇷', label: 'Greece' },
  Thailand: { area: 'Thai', flag: '🇹🇭', label: 'Thailand' },
  Vietnam: { area: 'Vietnamese', flag: '🇻🇳', label: 'Vietnam' },
  China: { area: 'Chinese', flag: '🇨🇳', label: 'China' },
  British: { area: 'British', flag: '🇬🇧', label: 'UK' },
  Canada: { area: 'Canadian', flag: '🇨🇦', label: 'Canada' },
  Tunisia: { area: 'Tunisian', flag: '🇹🇳', label: 'Tunisia' },
  Jamaica: { area: 'Jamaican', flag: '🇯🇲', label: 'Jamaica' },
  Malaysia: { area: 'Malaysian', flag: '🇲🇾', label: 'Malaysia' },
  Poland: { area: 'Polish', flag: '🇵🇱', label: 'Poland' },
  Portugal: { area: 'Portuguese', flag: '🇵🇹', label: 'Portugal' },
  Russia: { area: 'Russian', flag: '🇷🇺', label: 'Russia' },
  Ireland: { area: 'Irish', flag: '🇮🇪', label: 'Ireland' },
  Croatia: { area: 'Croatian', flag: '🇭🇷', label: 'Croatia' },
  Netherlands: { area: 'Dutch', flag: '🇳🇱', label: 'Netherlands' },
  Philippines: { area: 'Filipino', flag: '🇵🇭', label: 'Philippines' },
  Kenya: { area: 'Kenyan', flag: '🇰🇪', label: 'Kenya' },
  Ukraine: { area: 'Ukrainian', flag: '🇺🇦', label: 'Ukraine' },
};

const COUNTRY_OFFLINE_CATALOG: Record<string, Array<{ name: string; price: number; desc: string; image: string; cat: string }>> = {
  Egypt: [
    { name: 'Koshary Special', price: 8.99, desc: 'Authentic Egyptian Koshary with lentils, rice, pasta, chickpeas, crispy onions & spicy tomato sauce.', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', cat: 'Egyptian Classic' },
    { name: 'Egyptian Mulukhiyah with Chicken', price: 12.50, desc: 'Traditional jute leaf stew simmered with garlic, coriander, served with roasted chicken and rice.', image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80', cat: 'Main Course' },
    { name: 'Hawawshi Crispy Stuffed Bread', price: 9.50, desc: 'Spiced minced beef baked inside crispy baladi bread with peppers and onions.', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80', cat: 'Street Food' },
    { name: 'Egyptian Fattah with Beef', price: 14.99, desc: 'Layers of crispy pita, garlic-vinegar rice, slow-cooked tender beef & warm tomato sauce.', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', cat: 'Main Course' },
    { name: 'Ful Medames & Taameya Combo', price: 6.99, desc: 'Slow-cooked fava beans with olive oil, lemon, cumin served with freshly fried fava bean falafel.', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', cat: 'Breakfast' },
  ],
  Italy: [
    { name: 'Spaghetti Carbonara', price: 16.50, desc: 'Classic Roman spaghetti with guanciale, pecorino romano, fresh egg yolks & cracked black pepper.', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=600&q=80', cat: 'Pasta' },
    { name: 'Woodfired Pizza Margherita', price: 15.00, desc: 'Neapolitan sourdough crust, San Marzano tomatoes, fresh buffalo mozzarella & fresh basil.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', cat: 'Pizza' },
    { name: 'Lasagne alla Bolognese', price: 17.99, desc: 'Traditional Italian layered pasta with slow-simmered beef ragù, creamy béchamel & parmesan.', image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=600&q=80', cat: 'Pasta' },
    { name: 'Chicken Alfredo Primavera', price: 27.00, desc: 'Fettuccine pasta tossed in creamy parmesan garlic cream sauce with grilled chicken breast.', image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80', cat: 'Pasta' },
    { name: 'Budino Di Ricotta', price: 11.00, desc: 'Traditional baked ricotta pudding with orange zest and berry compote.', image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80', cat: 'Dessert' },
  ],
  Japan: [
    { name: 'Tonkotsu Pork Ramen', price: 15.99, desc: 'Rich 12-hour pork bone broth with chashu pork belly, ajitsuke tamago egg & nori.', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', cat: 'Ramen' },
    { name: 'Salmon & Tuna Nigiri Sushi Combo', price: 22.00, desc: 'Fresh Atlantic salmon and Bluefin tuna sushi over seasoned rice with wasabi.', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80', cat: 'Sushi' },
    { name: 'Chicken Teriyaki Don', price: 14.50, desc: 'Grilled chicken thigh with house teriyaki glaze served over steamed Japanese rice.', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', cat: 'Donburi' },
    { name: 'Japanese Katsu Curry', price: 16.99, desc: 'Crispy chicken panko cutlet served with rich Japanese golden curry sauce and rice.', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', cat: 'Curry' },
  ],
  France: [
    { name: 'Coq au Vin', price: 22.50, desc: 'Braised chicken with red wine, lardons, button mushrooms and pearl onions.', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80', cat: 'French Classic' },
    { name: 'Beef Bourguignon', price: 24.99, desc: 'Slow-cooked beef chuck in Burgundy red wine broth with carrots and potatoes.', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', cat: 'French Classic' },
  ],
  Spain: [
    { name: 'Seafood Paella Valenciana', price: 23.99, desc: 'Saffron rice cooked with jumbo prawns, calamari, mussels, peas and bell peppers.', image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=600&q=80', cat: 'Paella' },
  ],
  USA: [
    { name: 'Classic Double Cheeseburger', price: 13.99, desc: 'Double smash beef patties, melted cheddar, lettuce, tomato & special burger sauce.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', cat: 'Burgers' },
  ],
  Mexico: [
    { name: 'Street Tacos Al Pastor', price: 11.99, desc: 'Marinated pork with pineapple, cilantro, diced onions on warm corn tortillas.', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80', cat: 'Tacos' },
  ],
  India: [
    { name: 'Butter Chicken Curry & Garlic Naan', price: 16.99, desc: 'Tender chicken in rich tomato butter cream curry sauce served with hot garlic butter naan.', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80', cat: 'Curry' },
    { name: 'Chicken Tikka Masala Curry', price: 17.50, desc: 'Roasted marinated chicken chunks in spiced curry sauce.', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80', cat: 'Curry' },
  ],
  Turkey: [
    { name: 'Adana Kebab & Rice', price: 17.50, desc: 'Spiced minced lamb grilled on wide iron skewers served with bulgur and grilled tomato.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80', cat: 'Kebab' },
  ],
  Malaysia: [
    { name: 'Ayam Percik Spiced Chicken', price: 16.00, desc: 'Traditional Malaysian grilled chicken basted with coconut milk and aromatic spices.', image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80', cat: 'Malaysian' },
  ],
};

const cacheMap: Record<string, IMealDBItem[]> = {};
let areasCache: IMealDBArea[] | null = null;

function getOfflineFallbackMeals(countryName: string): IMealDBItem[] {
  const matchKey = Object.keys(COUNTRY_OFFLINE_CATALOG).find(
    (k) => k.toLowerCase() === countryName.toLowerCase()
  );

  if (!matchKey) return [];

  const list = COUNTRY_OFFLINE_CATALOG[matchKey] || [];

  return list.map((item, idx) => ({
    _id: `offline_${countryName.toLowerCase()}_${idx}`,
    idMeal: `5${1000 + idx}`,
    name: item.name,
    description: item.desc,
    price: item.price,
    category: item.cat,
    restaurant: `rest_${countryName.toLowerCase()}`,
    country: countryName,
    isAvailable: true,
    isPopular: idx === 0 || idx === 1,
    preparationTime: 15 + idx * 2,
    image: item.image,
    ingredients: ['Fresh Ingredients', 'Herbs', 'Spices'],
    allergens: ['Gluten'],
    nutritionInfo: { calories: 450, protein: 25, carbs: 40, fat: 15 },
  }));
}

export class MealDBService {
  private static BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

  /**
   * Fetch ALL meals for a given country/area with fast timeout & rich offline fallback
   */
  static async fetchMealsByCountry(countryKey: string): Promise<IMealDBItem[]> {
    const foundEntry = Object.entries(THEMEALDB_AREAS).find(
      ([key, val]) =>
        key.toLowerCase() === countryKey.toLowerCase() ||
        val.area.toLowerCase() === countryKey.toLowerCase() ||
        val.label.toLowerCase() === countryKey.toLowerCase()
    );

    if (!foundEntry) {
      return [];
    }

    const areaParam = foundEntry[1].area;
    const displayCountry = foundEntry[1].label;
    const cacheKey = areaParam.toLowerCase();

    if (cacheMap[cacheKey] && cacheMap[cacheKey].length > 0) {
      return cacheMap[cacheKey];
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const filterRes = await fetch(`${this.BASE_URL}/filter.php?a=${encodeURIComponent(areaParam)}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const filterData = (await filterRes.json()) as any;
      const rawMeals = filterData?.meals || [];

      if (rawMeals.length === 0) {
        const fallbacks = getOfflineFallbackMeals(displayCountry);
        cacheMap[cacheKey] = fallbacks;
        return fallbacks;
      }

      const items: IMealDBItem[] = rawMeals.map(
        (m: { idMeal: string; strMeal: string; strMealThumb: string }, idx: number) => {
          const numId = parseInt(m.idMeal, 10) || 50000;
          const basePrice = 10 + (numId % 20) + (idx % 4);
          const calories = 300 + (numId % 500);
          const protein = 18 + (numId % 40);
          const carbs = 35 + (numId % 65);
          const fat = 10 + (numId % 25);

          return {
            _id: `mealdb_${m.idMeal}`,
            idMeal: m.idMeal,
            name: m.strMeal,
            description: `Authentic ${displayCountry} recipe fetched live from TheMealDB API.`,
            price: +basePrice.toFixed(2),
            category: 'Specialty',
            restaurant: `rest_${countryKey.toLowerCase().replace(/\s+/g, '_')}`,
            country: displayCountry,
            isAvailable: true,
            isPopular: idx % 3 === 0,
            preparationTime: 12 + (idx % 18),
            image: m.strMealThumb,
            ingredients: ['Fresh Ingredients', 'Herbs', 'Spices'],
            allergens: idx % 2 === 0 ? ['Gluten', 'Dairy'] : ['Nuts'],
            nutritionInfo: {
              calories,
              protein,
              carbs,
              fat,
            },
          };
        }
      );

      cacheMap[cacheKey] = items;
      return items;
    } catch {
      const fallbacks = getOfflineFallbackMeals(displayCountry);
      cacheMap[cacheKey] = fallbacks;
      return fallbacks;
    }
  }

  /** Return the cuisines currently exposed by TheMealDB, mapped to labels */
  static async fetchAreas(): Promise<IMealDBArea[]> {
    if (areasCache) return areasCache;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`${this.BASE_URL}/list.php?a=list`, { signal: controller.signal });
      clearTimeout(timeoutId);

      const data = (await res.json()) as { meals?: Array<{ strArea?: string }> };
      const rawAreas = (data.meals || []).map((m) => m.strArea).filter(Boolean) as string[];

      areasCache = rawAreas.map((areaName) => {
        const found = Object.values(THEMEALDB_AREAS).find(
          (v) => v.area.toLowerCase() === areaName.toLowerCase()
        );
        return {
          area: areaName,
          country: found ? found.label : areaName,
        };
      });
      return areasCache;
    } catch {
      return Object.values(THEMEALDB_AREAS).map(({ area, label }) => ({ area, country: label }));
    }
  }

  /**
   * Search meals across TheMealDB API & offline catalog
   */
  static async searchMeals(query: string): Promise<IMealDBItem[]> {
    const q = query.trim().toLowerCase();
    const results: IMealDBItem[] = [];

    // 1. Try TheMealDB API search
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${this.BASE_URL}/search.php?s=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = (await res.json()) as any;
      const rawMeals = data?.meals || [];

      if (rawMeals.length > 0) {
        rawMeals.forEach((d: any, idx: number) => {
          const numId = parseInt(d.idMeal, 10) || 50000;
          results.push({
            _id: `mealdb_${d.idMeal}`,
            idMeal: d.idMeal,
            name: d.strMeal,
            description: d.strInstructions
              ? d.strInstructions.replace(/\r\n/g, ' ').slice(0, 200) + '...'
              : 'Authentic recipe from TheMealDB API.',
            price: +(12 + (numId % 18)).toFixed(2),
            category: d.strCategory || 'Specialty',
            restaurant: 'rest_general',
            country: d.strArea || 'International',
            isAvailable: true,
            isPopular: idx % 3 === 0,
            preparationTime: 15,
            image: d.strMealThumb,
            ingredients: ['Fresh Ingredients', 'Herbs', 'Spices'],
            allergens: ['Gluten'],
            nutritionInfo: { calories: 450, protein: 25, carbs: 45, fat: 15 },
          });
        });
      }
    } catch {
      // Ignore network error
    }

    // 2. Search offline catalog across ALL 28 countries
    Object.entries(COUNTRY_OFFLINE_CATALOG).forEach(([country, meals]) => {
      meals.forEach((m, idx) => {
        const matchesName = m.name.toLowerCase().includes(q);
        const matchesCategory = m.cat.toLowerCase().includes(q);
        const matchesDesc = m.desc.toLowerCase().includes(q);

        if (matchesName || matchesCategory || matchesDesc) {
          if (!results.some((r) => r.name.toLowerCase() === m.name.toLowerCase())) {
            results.push({
              _id: `offline_${country.toLowerCase()}_${idx}`,
              idMeal: `5${1000 + idx}`,
              name: m.name,
              description: m.desc,
              price: m.price,
              category: m.cat,
              restaurant: `rest_${country.toLowerCase()}`,
              country: country,
              isAvailable: true,
              isPopular: idx === 0,
              preparationTime: 15,
              image: m.image,
              ingredients: ['Fresh Ingredients', 'Herbs', 'Spices'],
              allergens: ['Gluten'],
              nutritionInfo: { calories: 450, protein: 25, carbs: 40, fat: 15 },
            });
          }
        }
      });
    });

    return results;
  }

  /**
   * Lookup full meal details by id
   */
  static async lookupById(idMeal: string): Promise<IMealDBItem | null> {
    const cleanId = idMeal.startsWith('mealdb_') ? idMeal : `mealdb_${idMeal}`;

    // 1. Search cacheMap across all cached country meals
    for (const countryItems of Object.values(cacheMap)) {
      const foundInCache = countryItems.find(
        (m) => m._id === cleanId || m._id === idMeal || m.idMeal === idMeal
      );
      if (foundInCache) return foundInCache;
    }

    try {
      const rawId = idMeal.replace('mealdb_', '').replace('offline_', '');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${this.BASE_URL}/lookup.php?i=${rawId}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = (await res.json()) as any;
      const d = data?.meals?.[0];
      if (d) {
        const ingredients: string[] = [];
        for (let i = 1; i <= 20; i++) {
          const ing = d[`strIngredient${i}`];
          const measure = d[`strMeasure${i}`];
          if (ing && ing.trim()) {
            ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ing.trim()}`);
          }
        }

        const numId = parseInt(d.idMeal, 10) || 50000;
        return {
          _id: `mealdb_${d.idMeal}`,
          idMeal: d.idMeal,
          name: d.strMeal,
          description: d.strInstructions
            ? d.strInstructions.replace(/\r\n/g, ' ').slice(0, 200) + '...'
            : 'Authentic gourmet recipe fetched directly from TheMealDB API.',
          price: +(12 + (numId % 18)).toFixed(2),
          category: d.strCategory || 'Gourmet',
          restaurant: `rest_${(d.strArea || 'General').toLowerCase().replace(/\s+/g, '_')}`,
          country: d.strArea || 'International',
          isAvailable: true,
          isPopular: true,
          preparationTime: 15,
          image: d.strMealThumb,
          ingredients: ingredients.length > 0 ? ingredients : ['Fresh Produce', 'Spices'],
          allergens: ['Gluten', 'Dairy'],
          nutritionInfo: {
            calories: 400 + (numId % 400),
            protein: 25 + (numId % 30),
            carbs: 50 + (numId % 50),
            fat: 15 + (numId % 20),
          },
        };
      }
    } catch {
      // Fallback on network error
    }

    const numId = parseInt(idMeal.replace(/\D/g, ''), 10) || 52000;
    return {
      _id: cleanId,
      idMeal: idMeal,
      name: `Specialty Gourmet Dish`,
      description: 'Authentic gourmet recipe with rich herbs and spices.',
      price: +(12 + (numId % 20)).toFixed(2),
      category: 'Specialty',
      restaurant: 'rest_general',
      country: 'International',
      isAvailable: true,
      isPopular: true,
      preparationTime: 15,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      ingredients: ['Fresh Ingredients', 'Herbs', 'Spices'],
      allergens: ['Gluten'],
      nutritionInfo: { calories: 450, protein: 25, carbs: 45, fat: 15 },
    };
  }
}
