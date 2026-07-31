import React from 'react';
import { Link } from 'react-router-dom';
import { IRestaurant } from '../services/restaurantService.js';
import { StarRating } from '../../../components/common/StarRating.js';
import { Clock, DollarSign } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: IRestaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const defaultImage =
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80';

  return (
    <Link
      to={`/restaurants/${restaurant.slug || restaurant._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-44 w-full overflow-hidden bg-muted">
        <img
          src={restaurant.coverImage || restaurant.logo || defaultImage}
          alt={restaurant.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute right-3 top-3 rounded-full bg-background/90 px-2.5 py-1 backdrop-blur shadow-sm">
          <StarRating rating={restaurant.rating} totalReviews={restaurant.totalReviews} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold tracking-tight text-foreground font-heading group-hover:text-primary">
          {restaurant.name}
        </h3>

        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
          {restaurant.cuisine?.join(' • ') || 'Various Cuisines'}
        </p>

        <div className="mt-auto flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>{restaurant.estimatedDeliveryTime} min</span>
          </div>

          <div className="flex items-center space-x-1">
            <DollarSign className="h-3.5 w-3.5 text-secondary" />
            <span>
              {restaurant.deliveryFee === 0
                ? 'Free Delivery'
                : `$${restaurant.deliveryFee.toFixed(2)} Fee`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
