import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  slug: string;
  description: string;
  cuisine: string[];
  address: string;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  phone: string;
  email: string;
  rating: number;
  totalReviews: number;
  minimumOrder: number;
  deliveryFee: number;
  estimatedDeliveryTime?: number;
  isApproved: boolean;
  isActive: boolean;
  owner: mongoose.Types.ObjectId;
  coverImage?: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new Schema<IRestaurant>(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
      maxlength: [100, 'Restaurant name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    cuisine: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    minimumOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    estimatedDeliveryTime: {
      type: Number,
      default: 30, // in minutes
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

RestaurantSchema.index({ owner: 1 });
RestaurantSchema.index({ isApproved: 1, isActive: 1 });
RestaurantSchema.index({ name: 'text', description: 'text', cuisine: 'text' });

export const Restaurant: Model<IRestaurant> = mongoose.model<IRestaurant>(
  'Restaurant',
  RestaurantSchema
);
