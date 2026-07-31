import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  // The marketplace also sells live TheMealDB recipes whose IDs are not Mongo ObjectIds.
  meal: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  restaurant?: mongoose.Types.ObjectId;
  items: ICartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  couponCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    meal: {
      type: String,
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    image: { type: String, default: '' },
  },
  { _id: true }
);

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
    },
    items: [CartItemSchema],
    subtotal: { type: Number, default: 0, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, default: 0, min: 0 },
    couponCode: { type: String, uppercase: true, trim: true },
  },
  {
    timestamps: true,
  }
);

export const Cart: Model<ICart> = mongoose.model<ICart>('Cart', CartSchema);
