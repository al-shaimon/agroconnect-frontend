import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuth } from '../../hooks/useAuth';
import { buyerService } from '../../services/buyerService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { COLORS } from '../../constants/theme';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Package,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
} from 'lucide-react';
import { toast } from 'react-toastify';

type TimeSlot = {
  start: string;
  end: string;
};

type DeliverySlot = {
  date: string;
  timeSlot: TimeSlot;
};

export const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, updateSlot, getTotalAmount, clearCart } =
    useCartStore();

  const [deliveryAddress, setDeliveryAddress] = useState({
    street: user?.location?.area || '',
    city: user?.location?.city || '',
    district: '',
    phone: user?.phone || '',
    additionalNotes: '',
  });

  const [showCheckout, setShowCheckout] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bkashNumber, setBkashNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const isVerified = user?.verificationStatus === 'approved';
  const deliveryFee = 50;
  const totalAmount = getTotalAmount();
  const grandTotal = totalAmount + deliveryFee;

  // Generate delivery slots
  const generateDeliverySlots = (): DeliverySlot[] => {
    const slots: DeliverySlot[] = [];
    const timeSlots: TimeSlot[] = [
      { start: '10:00', end: '12:00' },
      { start: '12:00', end: '14:00' },
      { start: '14:00', end: '16:00' },
      { start: '16:00', end: '18:00' },
      { start: '18:00', end: '20:00' },
      { start: '20:00', end: '22:00' },
    ];

    // Get current time in Bangladesh timezone (UTC+6)
    const bdTimeString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
    const bdTime = new Date(bdTimeString);
    const currentHour = bdTime.getHours();
    const currentMinutes = bdTime.getMinutes();

    // Show only next 2 days
    for (let i = 0; i < 2; i++) {
      const date = new Date(bdTime);
      date.setDate(date.getDate() + i);

      // Format date as YYYY-MM-DD in Bangladesh timezone
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const isToday = i === 0;

      timeSlots.forEach((timeSlot) => {
        // If it's today, only show slots where end time hasn't passed yet
        if (isToday) {
          const slotEndHour = parseInt(timeSlot.end.split(':')[0]);
          const slotEndMinutes = parseInt(timeSlot.end.split(':')[1]);

          // Skip if slot end time has already passed
          if (
            slotEndHour < currentHour ||
            (slotEndHour === currentHour && slotEndMinutes <= currentMinutes)
          ) {
            return;
          }
        }

        slots.push({ date: dateStr, timeSlot });
      });
    }

    return slots;
  };

  const handleSelectSlot = (productId: string, slot: DeliverySlot) => {
    updateSlot(productId, slot);
    toast.success('Delivery slot selected');
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const item = items.find((i) => i.product._id === productId);
    if (!item) return;

    // Guard if availableQuantity is undefined
    if (item.product.availableQuantity != null && newQuantity > item.product.availableQuantity) {
      toast.error(`Only ${item.product.availableQuantity} units available`);
      return;
    }

    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }

    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
    toast.success('Item removed from cart');
  };

  const handleProceedToCheckout = () => {
    if (!isVerified) {
      toast.error('Please complete verification first');
      navigate('/profile');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Check if all items have delivery slots
    const itemsWithoutSlot = items.filter((item) => !item.selectedSlot);
    if (itemsWithoutSlot.length > 0) {
      toast.error('Please select delivery slots for all items');
      return;
    }

    setShowCheckout(true);
  };

  const handlePlaceOrder = () => {
    // Validate delivery address
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.phone) {
      toast.error('Please fill in all delivery address fields');
      return;
    }

    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!bkashNumber || !transactionId) {
      toast.error('Please enter bKash number and transaction ID');
      return;
    }

    try {
      setIsProcessing(true);

      // Group items by farmer
      const ordersByFarmer = items.reduce((acc, item) => {
        const farmerId =
          typeof item.product.farmerId === 'object'
            ? item.product.farmerId._id
            : item.product.farmerId;

        // Skip items without a valid farmerId
        if (!farmerId) return acc;

        if (!acc[farmerId]) {
          acc[farmerId] = [];
        }
        acc[farmerId].push(item);
        return acc;
      }, {} as Record<string, typeof items>);

      // Place separate orders for each farmer
      const orderPromises = Object.entries(ordersByFarmer).map(async ([farmerId, farmerItems]) => {
        const orderData = {
          farmerId,
          items: farmerItems.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
            deliverySlot: item.selectedSlot,
          })),
          deliveryAddress: {
            area: deliveryAddress.street,
            city: deliveryAddress.city,
            details: `${deliveryAddress.district ? deliveryAddress.district + ', ' : ''}Phone: ${
              deliveryAddress.phone
            }${deliveryAddress.additionalNotes ? ', ' + deliveryAddress.additionalNotes : ''}`,
          },
          notes: deliveryAddress.additionalNotes,
          paymentDetails: {
            bkashNumber: bkashNumber,
            transactionId: transactionId,
          },
        };

        return buyerService.placeOrder(orderData);
      });

      const results = await Promise.all(orderPromises);

      const allSuccess = results.every((result) => result.success);

      if (allSuccess) {
        toast.success('Orders placed successfully! Waiting for payment verification by farmer.');
        clearCart();
        setShowPaymentModal(false);
        setShowCheckout(false);
        navigate('/buyer/orders');
      } else {
        toast.error('Some orders failed. Please try again.');
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateStr: string) => {
    // Parse the date string and display in Bangladesh timezone
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    // Get current BD date to check if it's today or tomorrow
    const bdTimeString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
    const bdTime = new Date(bdTimeString);
    const today = new Date(bdTime.getFullYear(), bdTime.getMonth(), bdTime.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.getTime() === today.getTime()) {
      return 'Today';
    } else if (date.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    }

    return date.toLocaleDateString('en-BD', {
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

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate('/buyer/marketplace')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>

        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some fresh products to get started!</p>
            <Button
              onClick={() => navigate('/buyer/marketplace')}
              style={{ backgroundColor: COLORS.primary }}
            >
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => setShowCheckout(false)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Delivery Address */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" style={{ color: COLORS.primary }} />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street/Area *</Label>
                    <Input
                      id="street"
                      value={deliveryAddress.street}
                      onChange={(e) =>
                        setDeliveryAddress({ ...deliveryAddress, street: e.target.value })
                      }
                      placeholder="Enter street or area"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={deliveryAddress.city}
                      onChange={(e) =>
                        setDeliveryAddress({ ...deliveryAddress, city: e.target.value })
                      }
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      value={deliveryAddress.district}
                      onChange={(e) =>
                        setDeliveryAddress({ ...deliveryAddress, district: e.target.value })
                      }
                      placeholder="Enter district"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={deliveryAddress.phone}
                      onChange={(e) =>
                        setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })
                      }
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={deliveryAddress.additionalNotes}
                    onChange={(e) =>
                      setDeliveryAddress({ ...deliveryAddress, additionalNotes: e.target.value })
                    }
                    placeholder="Any special delivery instructions..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" style={{ color: COLORS.primary }} />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => {
                    const price = item.product.price ?? 0;
                    return (
                      <div key={item.product._id} className="flex gap-4 p-4 border rounded-lg">
                        {item.product.imageUrl && (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.product.name}</h4>
                          <p className="text-sm text-gray-600">
                            ৳{price} × {item.quantity} = ৳{(price * item.quantity).toFixed(2)}
                          </p>
                          {item.selectedSlot && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(item.selectedSlot.date)}
                              <Clock className="h-3 w-3 ml-2" />
                              {formatTime(item.selectedSlot.timeSlot.start)} -{' '}
                              {formatTime(item.selectedSlot.timeSlot.end)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>৳{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span>৳{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span style={{ color: COLORS.primary }}>৳{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handlePlaceOrder}
                  style={{ backgroundColor: COLORS.primary }}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Proceed to Payment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* bKash Payment Modal */}
        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded flex items-center justify-center"
                  style={{ backgroundColor: '#E2136E' }}
                >
                  <span className="text-white font-bold text-sm">bK</span>
                </div>
                bKash Payment
              </DialogTitle>
              <DialogDescription>
                Complete your payment using bKash to place the order
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Payment Instructions:</strong>
                  <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                    <li>Open your bKash app</li>
                    <li>
                      Send Money to: <strong>01XXXXXXXXX</strong>
                    </li>
                    <li>
                      Amount: <strong>৳{grandTotal.toFixed(2)}</strong>
                    </li>
                    <li>Complete the payment</li>
                    <li>Enter your bKash number and transaction ID below</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bkash-number">Your bKash Number *</Label>
                  <Input
                    id="bkash-number"
                    value={bkashNumber}
                    onChange={(e) => setBkashNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transaction-id">Transaction ID *</Label>
                  <Input
                    id="transaction-id"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter bKash transaction ID"
                  />
                </div>

                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-semibold">Amount to Pay:</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">৳{grandTotal.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmPayment}
                  className="flex-1"
                  style={{ backgroundColor: COLORS.primary }}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Confirm Payment'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-1">{items.length} items in your cart</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/buyer/marketplace')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Button>
      </div>

      {!isVerified && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You must be verified to place orders. Please complete verification in{' '}
            <button onClick={() => navigate('/profile')} className="underline font-semibold">
              Profile
            </button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => {
            const farmer = typeof item.product.farmerId === 'object' ? item.product.farmerId : null;
            const price = item.product.price ?? 0;

            return (
              <Card key={item.product._id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {item.product.imageUrl && (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{item.product.name}</h3>
                          <div className="flex gap-2 mt-1">
                            <Badge style={{ backgroundColor: COLORS.primary }} className="text-xs">
                              {item.product.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.product.quality}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.product._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {farmer && (
                        <p className="text-sm text-gray-600">
                          Farmer: <span className="font-medium">{farmer.name}</span>
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(item.product._id, item.quantity - 1)
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-4 font-semibold">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(item.product._id, item.quantity + 1)
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <span className="text-sm text-gray-600">{item.product.unit}</span>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            ৳{price} × {item.quantity}
                          </p>
                          <p className="text-lg font-bold" style={{ color: COLORS.primary }}>
                            ৳{(price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {item.selectedSlot ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-green-600" />
                              <span className="font-medium">
                                {formatDate(item.selectedSlot.date)}
                              </span>
                              <Clock className="h-4 w-4 text-green-600 ml-2" />
                              <span>
                                {formatTime(item.selectedSlot.timeSlot.start)} -{' '}
                                {formatTime(item.selectedSlot.timeSlot.end)}
                              </span>
                            </div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Change Slot
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80" align="end">
                                <div className="space-y-3">
                                  <h4 className="font-semibold">Select Delivery Time</h4>
                                  {generateDeliverySlots()
                                    .reduce((acc, slot) => {
                                      const existing = acc.find((s) => s.date === slot.date);
                                      if (existing) {
                                        existing.slots.push(slot);
                                      } else {
                                        acc.push({ date: slot.date, slots: [slot] });
                                      }
                                      return acc;
                                    }, [] as { date: string; slots: DeliverySlot[] }[])
                                    .map((group) => (
                                      <div key={group.date} className="space-y-2">
                                        <h5 className="text-sm font-medium text-gray-700">
                                          {formatDate(group.date)}
                                        </h5>
                                        <div className="grid grid-cols-2 gap-2">
                                          {group.slots.map((slot, idx) => (
                                            <button
                                              key={idx}
                                              onClick={() =>
                                                handleSelectSlot(item.product._id, slot)
                                              }
                                              className="p-2 text-xs border rounded hover:border-green-500 hover:bg-green-50 transition-colors text-left"
                                            >
                                              <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span>
                                                  {formatTime(slot.timeSlot.start)} -{' '}
                                                  {formatTime(slot.timeSlot.end)}
                                                </span>
                                              </div>
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      ) : (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              Select Delivery Slot
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80" align="start">
                            <div className="space-y-3">
                              <h4 className="font-semibold">Select Delivery Time</h4>
                              {generateDeliverySlots()
                                .reduce((acc, slot) => {
                                  const existing = acc.find((s) => s.date === slot.date);
                                  if (existing) {
                                    existing.slots.push(slot);
                                  } else {
                                    acc.push({ date: slot.date, slots: [slot] });
                                  }
                                  return acc;
                                }, [] as { date: string; slots: DeliverySlot[] }[])
                                .map((group) => (
                                  <div key={group.date} className="space-y-2">
                                    <h5 className="text-sm font-medium text-gray-700">
                                      {formatDate(group.date)}
                                    </h5>
                                    <div className="grid grid-cols-2 gap-2">
                                      {group.slots.map((slot, idx) => (
                                        <button
                                          key={idx}
                                          onClick={() => handleSelectSlot(item.product._id, slot)}
                                          className="p-2 text-xs border rounded hover:border-green-500 hover:bg-green-50 transition-colors text-left"
                                        >
                                          <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            <span>
                                              {formatTime(slot.timeSlot.start)} -{' '}
                                              {formatTime(slot.timeSlot.end)}
                                            </span>
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items ({items.length}):</span>
                  <span>৳{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span>৳{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span style={{ color: COLORS.primary }}>৳{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleProceedToCheckout}
                style={{ backgroundColor: COLORS.primary }}
                disabled={!isVerified || items.some((item) => !item.selectedSlot)}
              >
                Proceed to Checkout
              </Button>

              {items.some((item) => !item.selectedSlot) && (
                <p className="text-xs text-center text-red-600">
                  Select delivery slots for all items
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
