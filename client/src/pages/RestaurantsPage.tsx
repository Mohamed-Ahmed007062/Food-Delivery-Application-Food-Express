import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChefHat, InfoIcon, Wheat, X, Plus, Minus, ShoppingCart, Clock, Check, Globe } from 'lucide-react';
import { mealService } from '../features/meals/services/mealService';
import { cartService } from '../features/cart/services/cartService';
import SkeletonCard from '../components/common/SkeletonCard';
import MealCard from '../features/meals/components/MealCard';
import { useAuth } from '../providers/AuthProvider';

export interface ICountryOption {
  name: string;
  flag: string;
  label: string;
}

const COUNTRY_OPTIONS: ICountryOption[] = [
  { name: 'Egyptian', flag: '🇪🇬', label: 'Egypt (مصر)' },
  { name: 'Italian', flag: '🇮🇹', label: 'Italy (إيطاليا)' },
  { name: 'French', flag: '🇫🇷', label: 'France (فرنسا)' },
  { name: 'Spanish', flag: '🇪🇸', label: 'Spain (إسبانيا)' },
  { name: 'Japanese', flag: '🇯🇵', label: 'Japan (اليابان)' },
  { name: 'American', flag: '🇺🇸', label: 'USA (أمريكا)' },
  { name: 'Mexican', flag: '🇲🇽', label: 'Mexico (المكسيك)' },
  { name: 'Indian', flag: '🇮🇳', label: 'India (الهند)' },
  { name: 'Turkish', flag: '🇹🇷', label: 'Turkey (تركيا)' },
  { name: 'Moroccan', flag: '🇲🇦', label: 'Morocco (المغرب)' },
  { name: 'Greek', flag: '🇬🇷', label: 'Greece (اليونان)' },
  { name: 'Thai', flag: '🇹🇭', label: 'Thailand (تايلاند)' },
  { name: 'Vietnamese', flag: '🇻🇳', label: 'Vietnam (فيتنام)' },
  { name: 'Chinese', flag: '🇨🇳', label: 'China (الصين)' },
  { name: 'British', flag: '🇬🇧', label: 'UK (بريطانيا)' },
  { name: 'Canadian', flag: '🇨🇦', label: 'Canada (كندا)' },
  { name: 'Tunisian', flag: '🇹🇳', label: 'Tunisia (تونس)' },
  { name: 'Jamaican', flag: '🇯🇲', label: 'Jamaica (جاميكا)' },
  { name: 'Malaysian', flag: '🇲🇾', label: 'Malaysia (ماليزيا)' },
  { name: 'Polish', flag: '🇵🇱', label: 'Poland (بولندا)' },
  { name: 'Portuguese', flag: '🇵🇹', label: 'Portugal (البرتغال)' },
  { name: 'Russian', flag: '🇷🇺', label: 'Russia (روسيا)' },
  { name: 'Irish', flag: '🇮🇪', label: 'Ireland (أيرلندا)' },
  { name: 'Croatian', flag: '🇭🇷', label: 'Croatia (كرواتيا)' },
  { name: 'Dutch', flag: '🇳🇱', label: 'Netherlands (هولندا)' },
  { name: 'Filipino', flag: '🇵🇭', label: 'Philippines (الفلبين)' },
  { name: 'Kenyan', flag: '🇰🇪', label: 'Kenya (كينيا)' },
  { name: 'Ukrainian', flag: '🇺🇦', label: 'Ukraine (أوكرانيا)' },
];

const getEnrichedIngredients = (meal: any): string[] => {
  if (meal?.ingredients && Array.isArray(meal.ingredients) && meal.ingredients.length > 3 && !meal.ingredients.includes('Fresh Ingredients')) {
    return meal.ingredients;
  }

  const mealNameLower = (meal?.name || '').toLowerCase();

  if (mealNameLower.includes('ayam') || mealNameLower.includes('percik')) {
    return [
      '6 Chicken Thighs',
      '16 Shallots',
      '1 1/2 Ginger',
      '6 Garlic Clove',
      '8 Cayenne Pepper',
      '2 Tbs Turmeric',
      '1 1/2 Cumin',
      '1 1/2 Coriander',
      '1 1/2 Fennel',
      '2 Tbs Tamarind Paste',
      '1 Can Coconut Milk',
      '1 Tsp Sugar',
      '1 Cup Water',
    ];
  }

  if (mealNameLower.includes('ramen') || mealNameLower.includes('tonkotsu')) {
    return [
      '200g Ramen Noodles',
      '4 Slices Pork Chashu',
      '2 Ajitsuke Tamago Egg',
      '2 Sheets Nori',
      '4 Cups Pork Bone Broth',
      '2 Tbs Soy Sauce',
      '2 Green Onions',
      '1 Tsp Sesame Oil',
    ];
  }

  if (mealNameLower.includes('carbonara') || mealNameLower.includes('spaghetti')) {
    return [
      '400g Spaghetti',
      '150g Guanciale',
      '4 Egg Yolks',
      '100g Pecorino Romano',
      '1 Tsp Cracked Black Pepper',
      '2 Tbs Extra Virgin Olive Oil',
    ];
  }

  if (mealNameLower.includes('koshary') || mealNameLower.includes('koshari')) {
    return [
      '1 Cup Rice',
      '1 Cup Brown Lentils',
      '1 Cup Macaroni Pasta',
      '1/2 Cup Chickpeas',
      '2 Crispy Shallots',
      '4 Garlic Clove',
      '2 Cups Tomato Sauce',
      '1 Tsp Cumin',
      '1 Tbs White Vinegar',
    ];
  }

  if (mealNameLower.includes('mulukhiyah') || mealNameLower.includes('molokhia')) {
    return [
      '500g Fresh Jute Leaves',
      '1 Whole Roasted Chicken',
      '8 Garlic Clove',
      '2 Tbs Coriander',
      '2 Tbs Ghee',
      '4 Cups Chicken Broth',
    ];
  }

  if (mealNameLower.includes('pizza') || mealNameLower.includes('pepperoni') || mealNameLower.includes('margherita')) {
    return [
      '300g Pizza Dough',
      '150g San Marzano Tomato Sauce',
      '200g Fresh Buffalo Mozzarella',
      '10 Slices Pepperoni',
      '10 Fresh Basil Leaves',
      '2 Tbs Extra Virgin Olive Oil',
    ];
  }

  if (mealNameLower.includes('tacos') || mealNameLower.includes('pastor') || mealNameLower.includes('birria')) {
    return [
      '500g Pork Shoulder',
      '1/2 Fresh Pineapple',
      '8 Corn Tortillas',
      '1/2 White Onion',
      '1/2 Cup Fresh Cilantro',
      '2 Tbs Achiote Paste',
    ];
  }

  if (mealNameLower.includes('burger') || mealNameLower.includes('smash')) {
    return [
      '2 Beef Patties (300g)',
      '2 Slices Sharp Cheddar',
      '1 Brioche Bun',
      '2 Slices Tomato',
      '2 Crisp Lettuce Leaves',
      '2 Tbs Truffle Aioli Burger Sauce',
    ];
  }

  if (mealNameLower.includes('butter chicken') || mealNameLower.includes('tikka')) {
    return [
      '500g Chicken Thighs',
      '1 Cup Heavy Cream',
      '2 Tbs Butter',
      '1 Cup Tomato Puree',
      '1 Tbs Garam Masala',
      '4 Garlic Clove',
      '1 Tbs Ginger',
    ];
  }

  if (mealNameLower.includes('paella') || mealNameLower.includes('seafood')) {
    return [
      '400g Bomba Rice',
      '8 Jumbo Prawns',
      '200g Calamari',
      '200g Mussels',
      '1 Pinch Saffron',
      '1 Cup Green Peas',
      '1 Red Bell Pepper',
    ];
  }

  return [
    '300g Main Protein / Ingredient',
    '2 Tbs Extra Virgin Olive Oil',
    '4 Garlic Clove',
    '1 Diced Shallot',
    '1 Tsp Sea Salt & Black Pepper',
    '1 Tbs Fresh Herbs',
    '1 Cup Homemade Broth',
  ];
};

const RestaurantsPage: React.FC = () => {
  const [activeCountry, setActiveCountry] = useState<string>('Italian');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [cartSuccess, setCartSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: response, isLoading } = useQuery({
    queryKey: ['meals', searchQuery, activeCountry],
    queryFn: () => mealService.getMeals(searchQuery ? { search: searchQuery } : { area: activeCountry }),
  });

  const meals = Array.isArray(response?.data)
    ? response.data
    : response?.data?.meals || response?.meals || (Array.isArray(response) ? response : []);

  const activeCountryObj = COUNTRY_OPTIONS.find((c) => c.name === activeCountry) || COUNTRY_OPTIONS[1];

  const handleCountryClick = (countryName: string) => {
    setActiveCountry(countryName);
    setSearchQuery('');
  };

  const openMealDetails = async (meal: any) => {
    setSelectedMeal(meal);
    setQuantity(1);
    setCartError(null);
    setCartSuccess(false);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';

    if (meal._id?.startsWith('mealdb_')) {
      try {
        const full = await mealService.getById(meal._id);
        if (full) {
          setSelectedMeal(full);
        }
      } catch {
        // preserve basic meal
      }
    }
  };

  const closeMealDetails = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedMeal(null);
      setCartError(null);
      setCartSuccess(false);
    }, 300);
    document.body.style.overflow = 'unset';
  };

  const addToCartMutation = useMutation({
    mutationFn: (data: { mealId: string; quantity: number }) => cartService.addItem(data.mealId, data.quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setCartSuccess(true);
      setTimeout(() => {
        setCartSuccess(false);
        closeMealDetails();
      }, 1200);
    },
    onError: (error: Error) => setCartError(error.message || 'Failed to add item to cart'),
  });

  const handleAddToCart = () => {
    if (selectedMeal) {
      if (!user) {
        setCartError('Please sign in to add items to your order.');
        return;
      }
      setCartError(null);
      addToCartMutation.mutate({ mealId: selectedMeal._id, quantity });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 px-4 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 mb-6 animate-fade-in">
            <ChefHat className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Powered Live by TheMealDB API</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight animate-slide-up">
            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Kitchen</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto text-balance animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Discover authentic recipes from 28 global cuisines. Click any country flag below to instantly explore its authentic live recipes.
          </p>

          <div className="max-w-2xl mx-auto relative animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative flex items-center w-full h-16 rounded-2xl glass-card overflow-hidden transition-all focus-within:ring-2 focus-within:ring-primary focus-within:shadow-xl">
              <div className="pl-6 text-gray-400">
                <Search className="w-6 h-6" />
              </div>
              <input
                type="text"
                placeholder="Search for a country or dish (e.g. Koshary, Tacos, Pizza, Curry, Sushi)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full bg-transparent border-none focus:outline-none focus:ring-0 px-4 text-lg text-gray-800 dark:text-white placeholder:text-gray-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="pr-6 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modern High-Impact Country Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800 rounded-3xl p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-3 px-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <Globe className="w-4 h-4 text-primary" />
            <span>Select Cuisine Country ({COUNTRY_OPTIONS.length} Countries)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-1">
            {COUNTRY_OPTIONS.map((c) => {
              const isActive = activeCountry === c.name && !searchQuery;
              return (
                <button
                  key={c.name}
                  onClick={() => handleCountryClick(c.name)}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 transform ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-orange-500 text-white shadow-lg shadow-primary/30 scale-105 ring-2 ring-primary/40'
                      : 'bg-gray-100/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105 border border-gray-200/50 dark:border-gray-700/50'
                  }`}
                >
                  <span className="text-lg sm:text-xl leading-none shrink-0">{c.flag}</span>
                  <span className="truncate">{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <span>{searchQuery ? `Results for "${searchQuery}"` : `${activeCountryObj.label} Dishes`}</span>
              {!searchQuery && <span className="text-2xl">{activeCountryObj.flag}</span>}
            </h2>
            <p className="text-gray-500 mt-2">
              {isLoading ? 'Fetching authentic recipes live from TheMealDB...' : `Found ${meals.length} recipes for ${searchQuery || activeCountryObj.label}`}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : meals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {meals.map((meal: any, i: number) => (
              <div key={meal._id} style={{ animationDelay: `${i * 0.05}s` }}>
                <MealCard meal={meal} onClick={() => openMealDetails(meal)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-32 h-32 mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <ChefHat className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No recipes found</h3>
            <p className="text-gray-500 max-w-md">
              We couldn't find any recipes matching your search. Try exploring another cuisine or adjust your search term.
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setActiveCountry('Italian');
              }}
              className="mt-6 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>

      {/* Meal Details Modal */}
      {isModalOpen && selectedMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-950 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-gray-800 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={closeMealDetails}
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left side: Image */}
            <div className="w-full md:w-5/12 relative min-h-[300px] md:min-h-full">
              <img 
                src={selectedMeal.image} 
                alt={selectedMeal.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="glass px-3 py-1 rounded-full text-xs font-bold text-white flex items-center">
                    {typeof selectedMeal.category === 'string' ? selectedMeal.category : selectedMeal.category?.name}
                  </span>
                  {selectedMeal.country && (
                    <span className="glass px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {selectedMeal.country}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white leading-tight">
                  {selectedMeal.name}
                </h2>
                <div className="mt-4 flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1.5 font-medium bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-md">
                    <Clock className="w-4 h-4" />
                    <span>{selectedMeal.preparationTime || 30} mins prep</span>
                  </div>
                  <div className="text-2xl font-black text-white">
                    ${selectedMeal.price.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Content */}
            <div className="w-full md:w-7/12 flex flex-col bg-white dark:bg-gray-950 overflow-y-auto max-h-[60vh] md:max-h-none smooth-scroll">
              <div className="p-6 sm:p-8 flex-1">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <InfoIcon className="w-5 h-5 text-primary" />
                    Recipe Instructions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                    {selectedMeal.description}
                  </p>
                </div>

                {(() => {
                  const ingredientsList = getEnrichedIngredients(selectedMeal);
                  return (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Wheat className="w-5 h-5 text-primary" />
                        Ingredients
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {ingredientsList.map((ingredient: string, idx: number) => {
                          const cleanName = ingredient
                            .replace(/^[\d\/\.\s]+(g|kg|tbs|tbsp|tsp|ml|l|oz|lb|cups?|pinch|handful|sliced|chopped|diced)?\s+/i, '')
                            .trim();
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-colors"
                            >
                              <img
                                src={`https://www.themealdb.com/images/ingredients/${encodeURIComponent(cleanName)}-Small.png`}
                                alt={cleanName}
                                className="w-9 h-9 object-contain drop-shadow-sm shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80';
                                }}
                              />
                              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 capitalize">
                                {ingredient}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Nutrition / Allergens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  {selectedMeal.nutritionInfo && (
                    <div className="bg-orange-50 dark:bg-orange-950/20 rounded-2xl p-4 border border-orange-100 dark:border-orange-900/30">
                      <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-3 text-sm uppercase tracking-wider">Nutrition Info</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex flex-col">
                          <span className="text-orange-500 font-medium">Calories</span>
                          <span className="font-bold text-gray-900 dark:text-white">{selectedMeal.nutritionInfo.calories || '-'} kcal</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-orange-500 font-medium">Protein</span>
                          <span className="font-bold text-gray-900 dark:text-white">{selectedMeal.nutritionInfo.protein || '-'} g</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedMeal.allergens && selectedMeal.allergens.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-950/20 rounded-2xl p-4 border border-red-100 dark:border-red-900/30">
                      <h4 className="font-bold text-red-900 dark:text-red-100 mb-3 text-sm uppercase tracking-wider">Allergens</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMeal.allergens.map((allergen: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-white dark:bg-gray-900 rounded-md text-xs font-bold text-red-600 border border-red-100 dark:border-red-900">
                            {allergen}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="p-4 sm:p-6 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3 sticky bottom-0 z-10">
                {cartError && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-semibold flex items-center justify-between animate-fade-in">
                    <span>{cartError}</span>
                    {!user && (
                      <button 
                        onClick={() => navigate('/login')}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 shrink-0"
                      >
                        Sign In
                      </button>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center justify-between w-full sm:w-auto bg-gray-100 dark:bg-gray-900 rounded-xl p-1">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {cartSuccess ? (
                    <div className="w-full sm:flex-1 bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg animate-scale-in">
                      <Check className="w-6 h-6" />
                      <span>Added to Order!</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      disabled={addToCartMutation.isPending}
                      className="w-full sm:flex-1 bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                    >
                      {addToCartMutation.isPending ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Add to Order • ${(selectedMeal.price * quantity).toFixed(2)}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { RestaurantsPage };
export default RestaurantsPage;
