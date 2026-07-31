import mongoose from 'mongoose';
import { Meal, IMeal } from './meal.model.js';
import { CreateMealInput, UpdateMealInput, QueryMealInput } from './meal.validation.js';
import { Restaurant } from '../restaurants/restaurant.model.js';
import { Category } from '../categories/category.model.js';
import { MealDBService } from '../../shared/services/mealDbService.js';
import { NotFoundError, ForbiddenError } from '../../shared/errors/appError.js';
import { logger } from '../../shared/utils/logger.js';

export const DEMO_MEALS: any[] = [];

export class MealService {
  static async getAreas() {
    return MealDBService.fetchAreas();
  }

  private static async filterMeals(query: QueryMealInput) {
    if (query.area) {
      const areaMeals = await MealDBService.fetchMealsByCountry(query.area);
      return areaMeals;
    }

    if (query.search) {
      const q = query.search.trim().toLowerCase();

      const countryMeals = await MealDBService.fetchMealsByCountry(q);
      if (countryMeals && countryMeals.length > 0) return countryMeals;

      const searchedLive = await MealDBService.searchMeals(query.search.trim());
      return searchedLive;
    }

    return await MealDBService.fetchMealsByCountry('Italian');
  }

  static async getMeals(query: QueryMealInput) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '50', 10);
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (query.restaurantId) {
      filter.restaurant = query.restaurantId;
    }

    if (query.categoryId) {
      filter.category = query.categoryId;
    }

    if (query.isPopular) {
      filter.isPopular = query.isPopular === 'true';
    }

    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }

    let dbMeals: any[] = [];
    if (mongoose.connection.readyState === 1) {
      dbMeals = await Meal.find(filter)
        .populate('category', 'name')
        .populate('restaurant', 'name slug logo')
        .sort({ createdAt: -1 })
        .lean();

      if (query.area) {
        const areaLower = query.area.toLowerCase();
        dbMeals = dbMeals.filter((m) => {
          const catName = (typeof m.category === 'object' ? m.category?.name : m.category) || '';
          return catName.toLowerCase().includes(areaLower) || areaLower.includes(catName.toLowerCase());
        });
      }
    }

    // Fetch live recipes from TheMealDB API if area or search query is present, or if general browsing
    let apiMeals: any[] = [];
    if (query.area || query.search || !query.restaurantId) {
      apiMeals = await this.filterMeals(query);
    }

    // Combine DB meals (custom created) with Live Country Recipes from TheMealDB
    // Filter out duplicates by name if any
    const dbMealNames = new Set(dbMeals.map((m) => m.name.toLowerCase()));
    const uniqueApiMeals = apiMeals.filter((m) => !dbMealNames.has(m.name.toLowerCase()));

    const combinedMeals = [...dbMeals, ...uniqueApiMeals];

    const total = combinedMeals.length;
    const paginatedMeals = combinedMeals.slice(skip, skip + limit);

    return {
      meals: paginatedMeals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    };
  }

  static async getPopular(): Promise<IMeal[]> {
    if (mongoose.connection.readyState !== 1) {
      const meals = await MealDBService.fetchMealsByCountry('Italy');
      return meals.filter(m => m.isPopular) as unknown as IMeal[];
    }
    const popular = await Meal.find({ isPopular: true, isAvailable: true })
      .populate('restaurant', 'name slug logo')
      .limit(12)
      .lean();

    if (popular.length === 0) {
      const meals = await MealDBService.fetchMealsByCountry('Italy');
      return meals.filter(m => m.isPopular) as unknown as IMeal[];
    }
    return popular as unknown as IMeal[];
  }

  static async getById(mealId: string): Promise<IMeal> {
    if (mealId.startsWith('mealdb_')) {
      const rawId = mealId.replace('mealdb_', '');
      try {
        const meal = await MealDBService.lookupById(rawId);
        if (meal) {
          return meal as unknown as IMeal;
        }
      } catch {
        // Fallback
      }
    }

    if (mongoose.connection.readyState !== 1) {
      throw new NotFoundError('Meal not found');
    }

    const meal = await Meal.findById(mealId)
      .populate('category', 'name')
      .populate('restaurant', 'name slug deliveryFee')
      .lean();
    if (!meal) {
      throw new NotFoundError('Meal not found');
    }
    return meal as unknown as IMeal;
  }

  static async create(input: CreateMealInput | any): Promise<IMeal> {
    if (!input.slug && input.name) {
      input.slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `meal-${Date.now()}`;
    }

    if (!input.category || !mongoose.Types.ObjectId.isValid(input.category)) {
      let category = await Category.findOne({ name: { $regex: new RegExp(input.category || 'Main Course', 'i') } });
      if (!category) {
        category = await Category.create({
          name: input.category || 'Main Course',
          slug: (input.category || 'Main Course').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        });
      }
      input.category = category._id;
    }

    if (!input.restaurant || !mongoose.Types.ObjectId.isValid(input.restaurant)) {
      let rest = await Restaurant.findOne();
      if (!rest) {
        rest = await Restaurant.create({
          name: 'Global Kitchen Express',
          slug: 'global-kitchen-express',
          cuisineType: ['Global'],
          address: { street: '123 Gourmet St', city: 'Cairo', state: 'Cairo', zipCode: '11511', country: 'Egypt' },
          phone: '+201000000000',
          email: 'info@globalkitchen.com',
          owner: new mongoose.Types.ObjectId(),
        });
      }
      input.restaurant = rest._id;
    }

    const meal = new Meal(input);
    return meal.save();
  }

  static async update(
    mealId: string,
    input: UpdateMealInput,
    userId?: string,
    userRole?: string
  ): Promise<IMeal> {
    const meal = await Meal.findById(mealId);
    if (!meal) {
      if (mongoose.connection.readyState !== 1) {
        return { _id: mealId, ...input } as unknown as IMeal;
      }
      throw new NotFoundError('Meal not found');
    }

    if (userRole && userRole !== 'admin' && userId) {
      const restaurant = await Restaurant.findById(meal.restaurant);
      if (restaurant && restaurant.owner && restaurant.owner.toString() !== userId && userRole === 'customer') {
        throw new ForbiddenError('You can only update meals in your restaurant');
      }
    }

    // Convert string category name (e.g. 'Burgers') to Category ObjectId
    if (input.category) {
      const catStr = typeof input.category === 'string' ? input.category : (input.category as any)?.name;
      if (catStr && !mongoose.Types.ObjectId.isValid(catStr)) {
        let categoryDoc = await Category.findOne({ name: { $regex: new RegExp(catStr, 'i') } });
        if (!categoryDoc) {
          categoryDoc = await Category.create({
            name: catStr,
            slug: catStr.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          });
        }
        input.category = categoryDoc._id as any;
      }
    }

    // Ensure price is parsed as float if string
    if (input.price !== undefined) {
      input.price = typeof input.price === 'string' ? parseFloat(input.price) : input.price;
    }

    Object.assign(meal, input);
    return await meal.save();
  }

  static async delete(mealId: string, userId?: string, userRole?: string): Promise<void> {
    const meal = await Meal.findById(mealId);
    if (!meal) return;

    if (userRole && userRole !== 'admin' && userId) {
      const restaurant = await Restaurant.findById(meal.restaurant);
      if (restaurant && restaurant.owner && restaurant.owner.toString() !== userId) {
        logger.info(`Owner ${userId} deleting meal ${mealId}`);
      }
    }

    await Meal.findByIdAndDelete(mealId);
  }
}
