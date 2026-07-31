import mongoose from 'mongoose';
import { Category, ICategory } from './category.model.js';
import { Restaurant } from '../restaurants/restaurant.model.js';
import { CreateCategoryInput, UpdateCategoryInput } from './category.validation.js';
import { NotFoundError } from '../../shared/errors/appError.js';

export class CategoryService {
  private static slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }

  static async getCategories(restaurantId?: string): Promise<ICategory[]> {
    if (mongoose.connection.readyState !== 1) {
      return [];
    }

    const filter: Record<string, unknown> = { isActive: true };

    if (restaurantId) {
      let targetId = restaurantId;
      if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
        const rest = await Restaurant.findOne({ slug: restaurantId.toLowerCase() });
        if (rest) {
          targetId = rest._id.toString();
        } else {
          return [];
        }
      }
      filter.$or = [{ restaurant: targetId }, { restaurant: null }];
    } else {
      filter.restaurant = null;
    }

    return Category.find(filter).sort({ sortOrder: 1, name: 1 }).lean() as unknown as ICategory[];
  }

  static async getById(id: string): Promise<ICategory> {
    const category = await Category.findById(id).lean();
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    return category as unknown as ICategory;
  }

  static async create(input: CreateCategoryInput): Promise<ICategory> {
    let slug = this.slugify(input.name);
    const existing = await Category.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const category = new Category({
      ...input,
      slug,
    });
    return category.save();
  }

  static async update(id: string, input: UpdateCategoryInput): Promise<ICategory> {
    const category = await Category.findById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    if (input.name && input.name !== category.name) {
      category.slug = this.slugify(input.name);
    }

    Object.assign(category, input);
    return category.save();
  }

  static async delete(id: string): Promise<void> {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }
  }
}
