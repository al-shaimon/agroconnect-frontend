import { useEffect, useState } from 'react';
import { reviewService, type Review } from '../../services/reviewService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Star, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';

interface ReviewListProps {
  userId: string;
  userRole: 'farmer' | 'buyer';
  showStats?: boolean;
}

export const ReviewList = ({ userId, userRole, showStats = true }: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<{
    averageRating: number;
    totalReviews: number;
    distribution: Record<number, number>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await reviewService.getUserReviews(userId);
        if (response.success && response.data) {
          setReviews(response.data.reviews);
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [userId]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderCriteriaRatings = (review: Review) => {
    if (userRole === 'farmer') {
      // Reviews from buyers to farmers
      return (
        <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
          {review.ratings?.productQuality && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Quality:</span>
              {renderStars(review.ratings.productQuality)}
            </div>
          )}
          {review.ratings?.accuracy && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Accuracy:</span>
              {renderStars(review.ratings.accuracy)}
            </div>
          )}
          {review.ratings?.communication && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Communication:</span>
              {renderStars(review.ratings.communication)}
            </div>
          )}
          {review.ratings?.packaging && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Packaging:</span>
              {renderStars(review.ratings.packaging)}
            </div>
          )}
          {review.ratings?.timeliness && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Timeliness:</span>
              {renderStars(review.ratings.timeliness)}
            </div>
          )}
        </div>
      );
    } else {
      // Reviews from farmers to buyers
      return (
        <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
          {review.ratings?.paymentPromptness && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Payment:</span>
              {renderStars(review.ratings.paymentPromptness)}
            </div>
          )}
          {review.ratings?.communication && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Communication:</span>
              {renderStars(review.ratings.communication)}
            </div>
          )}
          {review.ratings?.professionalism && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Professionalism:</span>
              {renderStars(review.ratings.professionalism)}
            </div>
          )}
          {review.ratings?.clarity && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Clarity:</span>
              {renderStars(review.ratings.clarity)}
            </div>
          )}
          {review.ratings?.respectfulness && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Respectfulness:</span>
              {renderStars(review.ratings.respectfulness)}
            </div>
          )}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      {showStats && stats && stats.totalReviews > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Rating Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Average Rating */}
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-500">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center my-2">{renderStars(stats.averageRating)}</div>
                <p className="text-sm text-gray-600">{stats.totalReviews} reviews</p>
              </div>

              {/* Rating Distribution */}
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-gray-700 mb-2">Rating Distribution</p>
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = stats.distribution[stars] || 0;
                  const percentage = stats.totalReviews ? (count / stats.totalReviews) * 100 : 0;

                  return (
                    <div key={stars} className="flex items-center gap-2 mb-1">
                      <span className="text-sm w-12">{stars} stars</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No reviews yet</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => {
            const reviewer = typeof review.reviewerId === 'object' ? review.reviewerId : null;

            return (
              <Card key={review._id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {reviewer ? getInitials(reviewer.name) : '?'}
                      </AvatarFallback>
                    </Avatar>

                    {/* Review Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{reviewer?.name || 'Anonymous'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(review.averageRating)}
                            <span className="text-sm font-semibold text-gray-700">
                              {review.averageRating.toFixed(1)}
                            </span>
                            {review.isPublic && (
                              <Badge variant="outline" className="ml-2">
                                Public
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(review.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>

                      {/* Comment */}
                      {review.comment && <p className="mt-3 text-gray-700">{review.comment}</p>}

                      {/* Criteria Ratings */}
                      {renderCriteriaRatings(review)}

                      {/* Response */}
                      {review.response && (
                        <div className="mt-4 pl-4 border-l-2 border-gray-200">
                          <p className="text-sm font-semibold text-gray-700">Response:</p>
                          <p className="text-sm text-gray-600 mt-1">{review.response.text}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(review.response.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
