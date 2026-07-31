import React from 'react';
import { Clock, Flame, Globe2 } from 'lucide-react';

export interface IMeal {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: { _id: string; name: string; slug: string } | string;
  restaurant: { _id: string; name: string; slug: string; logo?: string } | string;
  country?: string;
  isAvailable: boolean;
  isPopular: boolean;
  preparationTime: number;
  ingredients: string[];
  allergens: string[];
  nutritionInfo?: { calories?: number; protein?: number; carbs?: number; fat?: number };
}

export interface IMealCardProps {
  meal: IMeal;
  onClick?: () => void;
}

const MealCard: React.FC<IMealCardProps> = ({ meal, onClick }) => {
  const categoryName = typeof meal.category === 'string' ? meal.category : meal.category?.name;

  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden animate-slide-up h-full"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={meal.image || '/placeholder-food.jpg'} 
          alt={meal.name} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80" />
        
        {/* Badges on Image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {categoryName && (
            <span className="glass px-2.5 py-1 rounded-full text-xs font-semibold text-gray-900 dark:text-white flex items-center">
              {categoryName}
            </span>
          )}
          {meal.country && (
            <span className="glass px-2.5 py-1 rounded-full text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1">
              <Globe2 className="w-3 h-3" />
              {meal.country}
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          {meal.isPopular && (
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg shadow-red-500/30">
              <Flame className="w-3.5 h-3.5" />
              Popular
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <div className="flex items-center gap-1 text-white/90 text-sm font-medium">
            <Clock className="w-4 h-4" />
            <span>{meal.preparationTime || 20} min</span>
          </div>
          <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1 rounded-xl font-bold">
            ${meal.price.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {meal.name}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-1 text-pretty">
          {meal.description || 'A delicious meal prepared with the finest ingredients.'}
        </p>
        
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
            {meal.nutritionInfo?.calories ? `${meal.nutritionInfo.calories} kcal` : ''}
          </div>
          <button 
            className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors duration-300"
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) onClick();
            }}
          >
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

export { MealCard };
export default MealCard;
