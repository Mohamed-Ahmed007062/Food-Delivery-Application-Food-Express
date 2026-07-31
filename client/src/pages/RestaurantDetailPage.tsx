import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantService } from '../features/restaurants/services/restaurantService.js';
import { mealService, IMeal } from '../features/meals/services/mealService.js';
import { reviewService } from '../features/reviews/services/reviewService.js';
import { categoryService } from '../features/categories/services/categoryService.js';
import { cartService } from '../features/cart/services/cartService.js';
import { MealCard } from '../features/meals/components/MealCard.js';
import { StarRating } from '../components/common/StarRating.js';
import { SkeletonGrid } from '../components/common/SkeletonCard.js';
import { useAuth } from '../providers/AuthProvider.js';
import { Clock, DollarSign, MapPin, Phone, Star, X, Send, ShoppingBag, Plus, Minus, Flame, ShieldAlert, Check } from 'lucide-react';

export const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<IMeal | null>(null);
  const [mealQuantity, setMealQuantity] = useState<number>(1);
  const [cartAddedMsg, setCartAddedMsg] = useState<string | null>(null);

  // Review Form state
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState<string | null>(null);
  const [reviewErr, setReviewErr] = useState<string | null>(null);

  // Fetch Restaurant Details
  const { data: restaurant, isLoading: isLoadingRest } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => restaurantService.getById(id!),
    enabled: !!id,
  });

  // Fetch Categories for this restaurant
  const { data: categories } = useQuery({
    queryKey: ['categories', id],
    queryFn: () => categoryService.getCategories(id),
    enabled: !!id,
  });

  // Fetch Meals for this restaurant
  const { data: mealsData, isLoading: isLoadingMeals } = useQuery({
    queryKey: ['meals', { restaurantId: id, categoryId: selectedCategory }],
    queryFn: () =>
      mealService.getMeals({
        restaurantId: id,
        categoryId: selectedCategory || undefined,
        limit: 50,
      }),
    enabled: !!id,
  });

  // Fetch Reviews for this restaurant
  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewService.getRestaurantReviews(id!),
    enabled: !!id,
  });

  // Add to Cart Mutation
  const addToCartMutation = useMutation({
    mutationFn: (data: { mealId: string; quantity: number }) => cartService.addItem(data.mealId, data.quantity),
    onSuccess: () => {
      setCartAddedMsg('Added to cart!');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setTimeout(() => setCartAddedMsg(null), 2500);
    },
  });

  // Create Review Mutation
  const reviewMutation = useMutation({
    mutationFn: (data: { restaurant: string; rating: number; comment: string }) =>
      reviewService.createReview(data),
    onSuccess: () => {
      setReviewMsg('Review submitted successfully!');
      setReviewComment('');
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      queryClient.invalidateQueries({ queryKey: ['restaurant', id] });
    },
    onError: (error: Error) => {
      setReviewErr(error.message);
    },
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setReviewMsg(null);
    setReviewErr(null);
    reviewMutation.mutate({
      restaurant: id,
      rating: reviewRating,
      comment: reviewComment,
    });
  };

  const handleOpenMealModal = (meal: IMeal) => {
    setSelectedMeal(meal);
    setMealQuantity(1);
    setCartAddedMsg(null);
  };

  const handleAddToCart = () => {
    if (!selectedMeal) return;
    addToCartMutation.mutate({
      mealId: selectedMeal._id,
      quantity: mealQuantity,
    });
  };

  if (isLoadingRest) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
        Loading restaurant details...
      </div>
    );
  }

  if (!restaurant) return null;

  const defaultBanner =
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Header */}
      <div className="relative h-64 w-full bg-muted md:h-80">
        <img
          src={restaurant.coverImage || defaultBanner}
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="container absolute bottom-6 left-1/2 -translate-x-1/2 px-4 text-white">
          <div className="flex items-end space-x-4">
            {restaurant.logo && (
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="h-20 w-20 rounded-2xl border-4 border-background bg-card object-cover shadow-lg"
              />
            )}
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl font-heading">
                {restaurant.name}
              </h1>
              <p className="mt-1 text-sm text-gray-200">
                {restaurant.cuisine?.join(' • ')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="border-b bg-card py-4 shadow-sm">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center space-x-6">
            <StarRating rating={restaurant.rating} totalReviews={restaurant.totalReviews} size="md" />
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-primary" />
              <span>{restaurant.estimatedDeliveryTime} mins delivery</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4 text-secondary" />
              <span>
                {restaurant.deliveryFee === 0
                  ? 'Free Delivery'
                  : `$${restaurant.deliveryFee.toFixed(2)} Fee`}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{restaurant.address}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span>{restaurant.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 py-8">
        {/* Category Filter Tabs */}
        {categories && categories.length > 0 && (
          <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-none">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === null
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              All Menu Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat._id
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Menu Grid */}
        <div className="mt-6">
          <h2 className="text-xl font-bold font-heading">Menu ({mealsData?.data.length || 0} Meals Available)</h2>
          {isLoadingMeals && <SkeletonGrid count={6} />}
          {mealsData && (
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mealsData.data.map((m: IMeal) => (
                <MealCard
                  key={m._id}
                  meal={m}
                  onClick={() => handleOpenMealModal(m)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t pt-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-heading">Customer Reviews</h2>
              <p className="text-sm text-muted-foreground">
                Read authentic ratings and experiences from verified customers
              </p>
            </div>
          </div>

          {/* Add Review Form */}
          {user ? (
            <form
              onSubmit={handleReviewSubmit}
              className="mt-6 rounded-2xl border bg-card p-6 shadow-sm"
            >
              <h3 className="text-base font-semibold font-heading">Write a Review</h3>

              {reviewErr && (
                <div className="mt-2 text-xs text-destructive">{reviewErr}</div>
              )}
              {reviewMsg && (
                <div className="mt-2 text-xs text-green-600 dark:text-green-400">{reviewMsg}</div>
              )}

              <div className="mt-4 flex items-center space-x-2">
                <span className="text-xs font-medium text-muted-foreground">Rating:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`h-5 w-5 cursor-pointer ${
                        star <= reviewRating
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <textarea
                required
                minLength={5}
                maxLength={500}
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share details of your meal and service experience..."
                className="mt-3 w-full rounded-xl border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <button
                type="submit"
                disabled={reviewMutation.isPending}
                className="mt-3 flex items-center space-x-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Review</span>
              </button>
            </form>
          ) : (
            <div className="mt-6 rounded-2xl border bg-card p-4 text-center text-xs text-muted-foreground">
              Please sign in to leave a review for this restaurant.
            </div>
          )}

          {/* Review List */}
          <div className="mt-6 space-y-4">
            {reviewsData && reviewsData.data.length === 0 && (
              <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
            )}
            {reviewsData &&
              reviewsData.data.map((review: any) => (
                <div key={review._id} className="rounded-xl border bg-card p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-semibold">{review.user?.name || 'Customer'}</span>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{review.comment}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Enhanced Rich Meal Detail Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setSelectedMeal(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image Header */}
            <div className="relative h-56 w-full overflow-hidden rounded-2xl">
              <img
                src={
                  selectedMeal.image ||
                  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
                }
                alt={selectedMeal.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <span className="flex items-center space-x-1 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>{selectedMeal.preparationTime || 15} mins prep</span>
                </span>
              </div>
            </div>

            {/* Title & Price */}
            <div className="mt-4 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-extrabold font-heading text-foreground">{selectedMeal.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{selectedMeal.description}</p>
              </div>
              <span className="text-2xl font-black font-heading text-primary">
                ${selectedMeal.price.toFixed(2)}
              </span>
            </div>

            {/* Ingredients */}
            {selectedMeal.ingredients && selectedMeal.ingredients.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Ingredients
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedMeal.ingredients.map((ing, i) => (
                    <span key={i} className="rounded-lg bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Allergens */}
            {selectedMeal.allergens && selectedMeal.allergens.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Allergens Warning</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedMeal.allergens.map((alg, i) => (
                    <span key={i} className="rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {alg}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition Facts Grid */}
            {selectedMeal.nutritionInfo && (
              <div className="mt-4 border-t pt-4">
                <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  <span>Nutrition Facts (Per Serving)</span>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2 text-center">
                  <div className="rounded-xl bg-muted p-2">
                    <span className="block text-xs font-bold text-foreground">{selectedMeal.nutritionInfo.calories || 650}</span>
                    <span className="text-[10px] text-muted-foreground">Calories</span>
                  </div>
                  <div className="rounded-xl bg-muted p-2">
                    <span className="block text-xs font-bold text-foreground">{selectedMeal.nutritionInfo.protein || 35}g</span>
                    <span className="text-[10px] text-muted-foreground">Protein</span>
                  </div>
                  <div className="rounded-xl bg-muted p-2">
                    <span className="block text-xs font-bold text-foreground">{selectedMeal.nutritionInfo.carbs || 75}g</span>
                    <span className="text-[10px] text-muted-foreground">Carbs</span>
                  </div>
                  <div className="rounded-xl bg-muted p-2">
                    <span className="block text-xs font-bold text-foreground">{selectedMeal.nutritionInfo.fat || 24}g</span>
                    <span className="text-[10px] text-muted-foreground">Fat</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart Action */}
            <div className="mt-6 border-t pt-4">
              {cartAddedMsg ? (
                <div className="flex items-center justify-center space-x-2 rounded-xl bg-green-600/10 py-3 text-sm font-bold text-green-600 dark:text-green-400">
                  <Check className="h-5 w-5" />
                  <span>{cartAddedMsg}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  {/* Quantity controls */}
                  <div className="flex items-center rounded-xl border bg-muted p-1">
                    <button
                      onClick={() => setMealQuantity(Math.max(1, mealQuantity - 1))}
                      className="rounded-lg p-2 text-foreground hover:bg-card"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{mealQuantity}</span>
                    <button
                      onClick={() => setMealQuantity(mealQuantity + 1)}
                      className="rounded-lg p-2 text-foreground hover:bg-card"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending}
                    className="flex flex-1 items-center justify-center space-x-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add to Cart • ${(selectedMeal.price * mealQuantity).toFixed(2)}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
