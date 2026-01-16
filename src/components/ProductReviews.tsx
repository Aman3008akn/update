import { useState, useEffect } from 'react';
import { Star, ThumbsUp, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  title: string;
  review_text: string;
  photos: string[];
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReviews(data);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 5) {
      toast({
        title: 'Too many photos',
        description: 'You can upload maximum 5 photos',
        variant: 'destructive',
      });
      return;
    }

    setPhotos([...photos, ...files]);
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
  };

  const submitReview = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to submit a review',
        variant: 'destructive',
      });
      return;
    }

    if (rating === 0 || !reviewText.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please provide a rating and review text',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Upload photos to Supabase Storage (if any)
      let photoUrls: string[] = [];
      if (photos.length > 0) {
        for (const photo of photos) {
          const fileExt = photo.name.split('.').pop();
          const fileName = `${user?.id}_${Date.now()}.${fileExt}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('review-photos')
            .upload(fileName, photo);

          if (!uploadError && uploadData) {
            const { data: { publicUrl } } = supabase.storage
              .from('review-photos')
              .getPublicUrl(fileName);
            photoUrls.push(publicUrl);
          }
        }
      }

      // Insert review
      const { error } = await supabase.from('product_reviews').insert({
        product_id: productId,
        user_id: user?.id,
        user_name: user?.name || 'Anonymous',
        rating,
        title: title || null,
        review_text: reviewText,
        photos: photoUrls,
        verified_purchase: false, // TODO: Check from orders table
      });

      if (error) throw error;

      toast({
        title: 'Review submitted!',
        description: 'Thank you for your feedback',
      });

      // Reset form
      setRating(0);
      setTitle('');
      setReviewText('');
      setPhotos([]);
      setPhotoPreviews([]);
      setShowReviewForm(false);
      
      // Refresh reviews
      fetchReviews();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to mark reviews as helpful',
        variant: 'destructive',
      });
      return;
    }

    // TODO: Implement helpful vote logic
    toast({
      title: 'Marked as helpful',
    });
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0
      ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100
      : 0,
  }));

  return (
    <div className="py-12 border-t-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Rating Summary */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-4 justify-center md:justify-start mb-4">
              <div className="text-5xl font-bold text-primary">{avgRating}</div>
              <div>
                <div className="flex mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(parseFloat(avgRating))
                          ? 'fill-secondary text-secondary'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">Based on {reviews.length} reviews</p>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-bold">{star}</span>
                  <Star className="w-4 h-4 fill-secondary text-secondary" />
                </div>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden border border-black">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-secondary"
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Write Review Button */}
        <div className="mb-8">
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="neo-btn bg-primary text-white"
          >
            Write a Review
          </Button>
        </div>

        {/* Review Form */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12 border-2 border-black rounded-lg p-6 bg-white neo-shadow"
            >
              <h3 className="text-xl font-bold mb-4">Share Your Experience</h3>
              
              {/* Star Rating */}
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating)
                            ? 'fill-secondary text-secondary'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Title */}
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Title (Optional)</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Sum up your experience"
                  className="border-2 border-black"
                />
              </div>

              {/* Review Text */}
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Your Review *</label>
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  rows={5}
                  className="border-2 border-black"
                />
              </div>

              {/* Photo Upload */}
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Add Photos (Max 5)
                </label>
                <div className="flex flex-wrap gap-3">
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded border-2 border-black cursor-pointer"
                        onClick={() => setSelectedImage(preview)}
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 border-2 border-black neo-shadow-sm"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 5 && (
                    <label className="w-20 h-20 border-2 border-dashed border-black rounded flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <Camera className="w-6 h-6 text-gray-400" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  onClick={submitReview}
                  disabled={loading}
                  className="neo-btn bg-primary text-white"
                >
                  {loading ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button
                  onClick={() => setShowReviewForm(false)}
                  variant="outline"
                  className="border-2 border-black"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-2 border-black rounded-lg p-6 bg-white neo-shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-foreground">{review.user_name}</span>
                    {review.verified_purchase && (
                      <Badge className="bg-green-100 text-green-700 border border-green-700 text-xs">
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-secondary text-secondary'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {review.title && (
                <h4 className="font-bold text-lg mb-2">{review.title}</h4>
              )}

              <p className="text-gray-700 mb-4">{review.review_text}</p>

              {/* Review Photos */}
              {review.photos && review.photos.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {review.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`Review photo ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded border-2 border-black cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setSelectedImage(photo)}
                    />
                  ))}
                </div>
              )}

              {/* Helpful Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleHelpful(review.id)}
                className="text-sm hover:bg-transparent"
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Helpful ({review.helpful_count})
              </Button>
            </motion.div>
          ))}
        </div>

        {reviews.length === 0 && !showReviewForm && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage}
              alt="Review photo"
              className="max-w-full max-h-[90vh] object-contain rounded-lg border-4 border-white"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white text-black rounded-full p-2 border-2 border-black neo-shadow hover:scale-110 transition-transform"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
