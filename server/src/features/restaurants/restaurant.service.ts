import mongoose from 'mongoose';
import { Restaurant, IRestaurant } from './restaurant.model.js';
import {
  CreateRestaurantInput,
  UpdateRestaurantInput,
  QueryRestaurantInput,
} from './restaurant.validation.js';
import { WORLD_RESTAURANTS } from './worldRestaurantsData.js';
import { NotFoundError, ForbiddenError } from '../../shared/errors/appError.js';

export const DEMO_RESTAURANTS = WORLD_RESTAURANTS;

export class RestaurantService {
  private static slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }

  private static filterDemoData(query: QueryRestaurantInput) {
    let filtered = [...DEMO_RESTAURANTS];
    if (query.search) {
      const q = query.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.country.toLowerCase().includes(q) ||
          r.cuisine.some((c) => c.toLowerCase().includes(q))
      );
    }
    if (query.cuisine) {
      const qCuisine = query.cuisine.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.country.toLowerCase().includes(qCuisine) ||
          r.cuisine.some((c) => c.toLowerCase().includes(qCuisine))
      );
    }
    if (query.minRating) {
      filtered = filtered.filter((r) => r.rating >= parseFloat(query.minRating!));
    }
    return filtered;
  }

  static async getRestaurants(query: QueryRestaurantInput) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '12', 10);
    const skip = (page - 1) * limit;

    if (mongoose.connection.readyState !== 1) {
      const filtered = this.filterDemoData(query);
      return {
        restaurants: filtered.slice(skip, skip + limit),
        pagination: {
          page,
          limit,
          total: filtered.length,
          pages: Math.ceil(filtered.length / limit) || 1,
        },
      };
    }

    const filter: Record<string, unknown> = {
      isApproved: true,
      isActive: true,
    };

    if (query.search) {
      filter.$text = { $search: query.search };
    }

    if (query.cuisine) {
      filter.cuisine = { $in: [new RegExp(query.cuisine, 'i')] };
    }

    if (query.minRating) {
      filter.rating = { $gte: parseFloat(query.minRating) };
    }

    if (query.maxDeliveryFee) {
      filter.deliveryFee = { $lte: parseFloat(query.maxDeliveryFee) };
    }

    const sortField = query.sort || '-rating';

    let restaurants = await Restaurant.find(filter)
      .sort(sortField)
      .skip(skip)
      .limit(limit)
      .lean();

    let total = await Restaurant.countDocuments(filter);

    if (restaurants.length === 0) {
      const filtered = this.filterDemoData(query);
      return {
        restaurants: filtered.slice(skip, skip + limit),
        pagination: {
          page,
          limit,
          total: filtered.length,
          pages: Math.ceil(filtered.length / limit) || 1,
        },
      };
    }

    return {
      restaurants,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    };
  }

  static async getFeatured(): Promise<IRestaurant[]> {
    if (mongoose.connection.readyState !== 1) {
      return DEMO_RESTAURANTS as unknown as IRestaurant[];
    }
    const featured = await Restaurant.find({ isApproved: true, isActive: true })
      .sort({ rating: -1, totalReviews: -1 })
      .limit(6)
      .lean();

    if (featured.length === 0) {
      return DEMO_RESTAURANTS as unknown as IRestaurant[];
    }
    return featured as unknown as IRestaurant[];
  }

  static async getByIdOrSlug(identifier: string): Promise<IRestaurant> {
    if (mongoose.connection.readyState !== 1) {
      const found = DEMO_RESTAURANTS.find(
        (r) => r._id === identifier || r.slug === identifier
      );
      if (!found) {
        return DEMO_RESTAURANTS[0] as unknown as IRestaurant;
      }
      return found as unknown as IRestaurant;
    }

    const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };

    const restaurant = await Restaurant.findOne(query).populate('owner', 'name email').lean();
    if (!restaurant) {
      const foundDemo = DEMO_RESTAURANTS.find((r) => r.slug === identifier || r._id === identifier);
      return (foundDemo || DEMO_RESTAURANTS[0]) as unknown as IRestaurant;
    }
    return restaurant as unknown as IRestaurant;
  }

  static async create(ownerId: string, input: CreateRestaurantInput): Promise<IRestaurant> {
    if (mongoose.connection.readyState !== 1) {
      return { _id: new mongoose.Types.ObjectId().toString(), owner: ownerId, ...input } as unknown as IRestaurant;
    }

    let slug = this.slugify(input.name);
    const existing = await Restaurant.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const restaurant = new Restaurant({
      ...input,
      owner: ownerId,
      slug,
      isApproved: false,
    });

    return restaurant.save();
  }

  static async update(
    restaurantId: string,
    userId: string,
    userRole: string,
    input: UpdateRestaurantInput
  ): Promise<IRestaurant> {
    if (mongoose.connection.readyState !== 1) {
      return { _id: restaurantId, ...input } as unknown as IRestaurant;
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      throw new NotFoundError('Restaurant not found');
    }

    if (userRole !== 'admin' && restaurant.owner.toString() !== userId) {
      throw new ForbiddenError('You can only update your own restaurant');
    }

    if (input.name && input.name !== restaurant.name) {
      restaurant.slug = this.slugify(input.name);
    }

    Object.assign(restaurant, input);
    return restaurant.save();
  }

  static async delete(restaurantId: string, userId: string, userRole: string): Promise<void> {
    if (mongoose.connection.readyState !== 1) return;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      throw new NotFoundError('Restaurant not found');
    }

    if (userRole !== 'admin' && restaurant.owner.toString() !== userId) {
      throw new ForbiddenError('You can only delete your own restaurant');
    }

    await Restaurant.findByIdAndDelete(restaurantId);
  }

  static async approve(restaurantId: string, isApproved: boolean): Promise<IRestaurant> {
    if (mongoose.connection.readyState !== 1) {
      return { _id: restaurantId, isApproved } as unknown as IRestaurant;
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { isApproved },
      { new: true }
    );
    if (!restaurant) {
      throw new NotFoundError('Restaurant not found');
    }
    return restaurant;
  }
}
