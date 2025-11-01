import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buyerService } from '../../services/buyerService';
import { useCartStore } from '../../store/cartStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { COLORS } from '../../constants/theme';
import { ShoppingCart, MapPin, Calendar, Clock, ArrowLeft } from 'lucide-react';
import type { Product } from '../../types';
import { toast } from 'react-toastify';

type TimeSlot = {
  start: string;
  end: string;
};

type DeliverySlot = {
  date: string;
  timeSlot: TimeSlot;
};

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<DeliverySlot | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setIsLoading(true);
      const response = await buyerService.getProduct(id!);
      if (response.success && response.data) {
        setProduct(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch product', error);
      toast.error('Failed to load product details');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate available delivery slots (10AM-11PM, 2-hour intervals, next 5 days)
  const generateDeliverySlots = (): DeliverySlot[] => {
    const slots: DeliverySlot[] = [];
    const timeSlots: TimeSlot[] = [
      { start: '10:00', end: '12:00' },
      { start: '12:00', end: '14:00' },
      { start: '14:00', end: '16:00' },
      { start: '16:00', end: '18:00' },
      { start: '18:00', end: '20:00' },
      { start: '20:00', end: '22:00' },
      { start: '22:00', end: '23:00' },
    ];

    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      timeSlots.forEach((timeSlot) => {
        slots.push({ date: dateStr, timeSlot });
      });
    }

    return slots;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-BD', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    const [hour] = time.split(':');
    const h = parseInt(hour);
    return h >= 12 ? `${h === 12 ? 12 : h - 12}:00 PM` : `${h}:00 AM`;
  };

  const groupSlotsByDate = (slots: DeliverySlot[]) => {
    return slots.reduce((acc, slot) => {
      const dateKey = slot.date;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(slot);
      return acc;
    }, {} as Record<string, DeliverySlot[]>);
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedSlot) {
      toast.error('Please select a delivery slot');
      return;
    }

    if (quantity > product.availableQuantity) {
      toast.error(`Only ${product.availableQuantity} units available`);
      return;
    }

    addItem(product, quantity, selectedSlot);
    toast.success('Added to cart!');
    navigate('/buyer/cart');
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  const availableSlots = generateDeliverySlots();
  const groupedSlots = groupSlotsByDate(availableSlots);

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Product Details */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{product.name}</CardTitle>
                <div className="flex gap-2">
                  <Badge style={{ backgroundColor: COLORS.primary }}>{product.category}</Badge>
                  <Badge variant="outline">{product.quality}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}

            <div className="space-y-3">
              <div>
                <Label className="text-gray-600">Description</Label>
                <p className="text-sm mt-1">{product.description}</p>
              </div>

              <div className="flex justify-between items-center py-2 border-t">
                <span className="text-gray-600">Price:</span>
                <span className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                  ৳{product.price}/{product.unit}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-t">
                <span className="text-gray-600">Available Stock:</span>
                <span className="font-semibold">
                  {product.availableQuantity} {product.unit}
                </span>
              </div>

              {product.harvestDate && (
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-gray-600">Harvest Date:</span>
                  <span>{new Date(product.harvestDate).toLocaleDateString()}</span>
                </div>
              )}

              {typeof product.farmerId === 'object' && (
                <>
                  <div className="flex justify-between items-center py-2 border-t">
                    <span className="text-gray-600">Farmer:</span>
                    <span className="font-medium">{product.farmerId.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 py-2 border-t">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {product.farmerId.location?.area}, {product.farmerId.location?.city}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Slot Selection & Add to Cart */}
        <div className="space-y-4">
          {/* Delivery Slots */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" style={{ color: COLORS.primary }} />
                Select Delivery Slot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.keys(groupedSlots).map((dateKey) => (
                  <div key={dateKey} className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-700">
                      {formatDate(new Date(dateKey))}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {groupedSlots[dateKey].map((slot, idx) => {
                        const isSelected =
                          selectedSlot?.date === slot.date &&
                          selectedSlot?.timeSlot.start === slot.timeSlot.start &&
                          selectedSlot?.timeSlot.end === slot.timeSlot.end;

                        return (
                          <button
                            key={`${slot.date}-${slot.timeSlot.start}-${idx}`}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              isSelected
                                ? 'border-green-600 bg-green-50'
                                : 'border-gray-300 hover:border-green-400'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              <span className="text-xs font-medium">
                                {formatTime(slot.timeSlot.start)} - {formatTime(slot.timeSlot.end)}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quantity & Add to Cart */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Quantity ({product.unit})</Label>
                <Input
                  type="number"
                  min="1"
                  max={product.availableQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="flex justify-between items-center py-2 border-t">
                <span className="font-semibold">Subtotal:</span>
                <span className="text-xl font-bold" style={{ color: COLORS.primary }}>
                  ৳{(product.price * quantity).toFixed(2)}
                </span>
              </div>

              <Button
                className="w-full"
                onClick={handleAddToCart}
                style={{ backgroundColor: COLORS.primary }}
                disabled={product.availableQuantity === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product.availableQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
