import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INutritionInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface IMeal extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: mongoose.Types.ObjectId;
  restaurant: mongoose.Types.ObjectId;
  isAvailable: boolean;
  isPopular: boolean;
  preparationTime: number; // in minutes
  ingredients: string[];
  allergens: string[];
  nutritionInfo?: INutritionInfo;
  createdAt: Date;
  updatedAt: Date;
}

const NutritionInfoSchema = new Schema<INutritionInfo>(
  {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fat: { type: Number, min: 0 },
  },
  { _id: false }
);

const MealSchema = new Schema<IMeal>(
  {
    name: {
      type: String,
      required: [true, 'Meal name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      default: '',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant is required'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    preparationTime: {
      type: Number,
      default: 15, // minutes
      min: 1,
    },
    ingredients: [
      {
        type: String,
        trim: true,
      },
    ],
    allergens: [
      {
        type: String,
        trim: true,
      },
    ],
    nutritionInfo: NutritionInfoSchema,
  },
  {
    timestamps: true,
  }
);

// Indexes
MealSchema.index({ restaurant: 1, category: 1 });
MealSchema.index({ name: 'text', description: 'text', ingredients: 'text' });
MealSchema.index({ isPopular: -1 });
MealSchema.index({ price: 1 });

export const Meal: Model<IMeal> = mongoose.model<IMeal>('Meal', MealSchema);
