import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import {
  getCart,
  clearCart,
  CartItem,
} from '../store/cartStore';
import { logger } from '../utils/logger';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { usePageTracking } from '../hooks/usePageTracking';
import { SEO } from '../components/SEO';
import { pageMetadata } from '../utils/seoConfig';
import { LoadingSpinner } from '../components/LoadingSpinner';
import * as dataStore from '../store/dataStore';
import { Breadcrumb } from '../components/Breadcrumb';
import { UserAddress } from '../data/mockData';
import { sanitizeFormData } from '../utils/security';
import { analytics } from '../utils/analytics';
import { processPayment } from '../utils/paymentService';
import { sendOrderConfirmation } from '../utils/emailService';
import { orderService } from '../services/orderService';
import { GuestCheckoutForm, GuestCheckoutData } from '../components/GuestCheckoutForm';
import { getOrCreateGuestSession, updateGuestEmail, addGuestOrder } from '../store/guestSessionStore';

export const Checkout: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();
  usePageTracking('Checkout');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'upi'>('cod');
  const [loading, setLoading] = useState(false);
  const [guestData, setGuestData] = useState<GuestCheckoutData | null>(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [giftWrapping, setGiftWrapping] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  const GIFT_WRAP_PRICE = 99; // â‚¹99

  // Remove authentication requirement - allow guest checkout
  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const cart = await getCart();
      if (cart.length === 0) {
        navigate('/cart');
        return;
      }
      setCartItems(cart);

      // Calculate order totals
      const cartSubtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      const cartShipping = 0; // Free shipping for MVP
      const cartTax = Math.round((cartSubtotal + cartShipping) * 0.18 * 100) / 100; // 18% GST
      const cartDiscount = 0; // Can be calculated from coupons
      const cartTotal = cartSubtotal + cartShipping + cartTax - cartDiscount;

      setSubtotal(cartSubtotal);
      setShipping(cartShipping);
      setTax(cartTax);
      // Note: Total will be recalculated when rendering to include gift wrapping
      setTotal(cartTotal);

      if (user) {
        const userAddresses = await dataStore.getUserAddresses();
        setAddresses(userAddresses);
        const defaultAddress = userAddresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
        } else if (userAddresses.length > 0) {
          setSelectedAddressId(userAddresses[0]._id);
        }
      }
    } catch (error) {
      logger.error('Error loading checkout data:', error);
      toast.error('Failed to load checkout data. Please try again.');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSubmit = (data: GuestCheckoutData) => {
    setGuestData(data);
    // Automatically trigger order placement after form validation
    handlePlaceOrder(data);
  };

  const handlePlaceOrder = async (submittedGuestData?: GuestCheckoutData) => {
    // Use submitted data if available (from form submit), otherwise use state
    const currentGuestData = submittedGuestData || guestData;

    // Guest checkout requires form data
    if (!isAuthenticated && !currentGuestData) {
      // This path should be handled by the form's onSubmit, but as a fallback:
      toast.warning('Please fill in your contact and shipping information');
      return;
    }

    // Authenticated users need an address selected
    if (isAuthenticated && !selectedAddressId) {
      toast.warning('Please select a delivery address');
      return;
    }

    if (cartItems.length === 0) {
      toast.warning('Your cart is empty');
      navigate('/cart');
      return;
    }

    // Validate payment method
    if (!['cod', 'card', 'upi'].includes(paymentMethod)) {
      toast.error('Invalid payment method');
      return;
    }

    // Validate total
    if (total <= 0) {
      toast.error('Invalid order total');
      return;
    }

    setLoading(true);

    // Track checkout start
    analytics.beginCheckout({
      items: cartItems.map(item => ({
        product_id: item.productId,
        product_name: item.name,
        quantity: item.quantity,
        price: item.unitPrice,
      })),
      total,
      currency: 'INR',
    });

    try {
      // Validate stock availability before proceeding
      for (const item of cartItems) {
        const product = await dataStore.getProductById(item.productId);
        if (!product) {
          toast.error(`Product ${item.name} is no longer available`);
          setLoading(false);
          return;
        }
        if (product.stock < item.quantity) {
          toast.error(`Insufficient stock for ${item.name}. Only ${product.stock} available.`);
          setLoading(false);
          return;
        }
      }

      let shippingAddress;
      let customerEmail = '';
      let customerName = '';
      let customerPhone = '';

      if (isAuthenticated && user) {
        const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);
        if (!selectedAddress) {
          toast.error('Selected address is invalid');
          setLoading(false);
          return;
        }
        const sanitizedAddress = sanitizeFormData(selectedAddress);

        shippingAddress = {
          fullName: user.name,
          phone: user.phone || '',
          street: sanitizedAddress.street,
          city: sanitizedAddress.city,
          state: sanitizedAddress.state,
          postalCode: sanitizedAddress.zipCode,
          country: 'India',
        };
        customerEmail = user.email;
        customerName = user.name;
        customerPhone = user.phone || '';
      } else if (currentGuestData) {
        shippingAddress = {
          fullName: currentGuestData.name,
          phone: currentGuestData.phone,
          street: currentGuestData.street,
          city: currentGuestData.city,
          state: currentGuestData.state,
          postalCode: currentGuestData.zipCode,
          country: 'India',
        };
        customerEmail = currentGuestData.email;
        customerName = currentGuestData.name;
        customerPhone = currentGuestData.phone;

        // Update guest session
        updateGuestEmail(currentGuestData.email);
      } else {
        // Should not happen due to checks above
        setLoading(false);
        return;
      }

      // Process payment for non-COD methods
      // Note: In a real app, we would create the order first as "pending payment" 
      // and then process payment, but for this MVP flow we'll keep it simple
      if (paymentMethod !== 'cod') {
        const paymentResult = await processPayment({
          amount: total,
          currency: 'INR',
          orderId: `temp-${Date.now()}`, // Temporary ID until order is created
          paymentMethod: paymentMethod as 'card' | 'upi',
          customerDetails: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
          },
        });

        if (!paymentResult.success) {
          toast.error(paymentResult.message || 'Payment failed. Please try again.');
          setLoading(false);
          return;
        }
      }

      // Create order data payload
      const orderData = {
        shippingAddress,
        paymentMethod,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.unitPrice,
          size: item.size,
          color: item.color,
        })),
      };

      let createdOrder;

      if (isAuthenticated) {
        createdOrder = await orderService.createOrder(orderData);
      } else {
        const session = getOrCreateGuestSession();
        createdOrder = await orderService.createGuestOrder(
          customerEmail,
          session.id,
          orderData
        );
        addGuestOrder(createdOrder.id);
      }

      // Send order confirmation email (mock)
      if (customerEmail) {
        await sendOrderConfirmation(customerEmail, {
          orderNumber: createdOrder.orderNumber,
          orderId: createdOrder.id,
          total: createdOrder.total,
          items: createdOrder.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.unitPrice,
          })),
          shippingAddress: {
            name: shippingAddress.fullName,
            street: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            zipCode: shippingAddress.postalCode,
          },
        });
      }

      // Clear cart
      await clearCart();

      // Track purchase completion
      analytics.purchase({
        transaction_id: createdOrder.id,
        value: createdOrder.total,
        currency: 'INR',
        items: createdOrder.items.map(item => ({
          product_id: item.productId,
          product_name: item.name,
          quantity: item.quantity,
          price: item.unitPrice,
        })),
      });

      // Navigate to confirmation
      navigate(`/order-confirmation/${createdOrder.id}`);
    } catch (error) {
      logger.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  } else if (cartItems.length === 0) {
    return null;
  }

  return (
    <>
      <SEO
        title={pageMetadata.checkout.title}
        description={pageMetadata.checkout.description}
        noindex={true}
      />
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.backgroundPrimary} 0%, ${theme.colors.backgroundSecondary} 50%, ${theme.colors.backgroundPrimary} 100%)`,
          color: theme.colors.textPrimary,
        }}
      >
        <Navbar />

        {/* Breadcrumb */}
        <div
          className="border-b-2"
          style={{
            backgroundColor: theme.colors.backgroundSecondary,
            borderColor: theme.colors.borderPrimary,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Breadcrumb items={[{ label: 'Checkout' }]} />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1
            className="text-4xl font-black mb-8"
            style={{ color: theme.colors.textPrimary }}
          >
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address / Guest Form */}
              <div
                className="border-2 rounded-creative shadow-card p-8"
                style={{
                  backgroundColor: theme.colors.cardBackground,
                  borderColor: theme.colors.borderPrimary,
                }}
              >
                <h2
                  className="text-2xl font-black mb-6"
                  style={{ color: theme.colors.textPrimary }}
                >
                  {isAuthenticated ? 'Delivery Address' : 'Guest Checkout'}
                </h2>

                {!isAuthenticated ? (
                  <GuestCheckoutForm
                    onSubmit={handleGuestSubmit}
                    initialData={guestData || undefined}
                  />
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p
                      className="mb-4"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      No addresses found
                    </p>
                    <button
                      onClick={() => navigate('/profile?tab=addresses')}
                      className="px-8 py-4 font-extrabold uppercase tracking-wider rounded-creative transition-all shadow-elegant transform hover:scale-105"
                      style={{
                        background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                        color: '#FFFFFF',
                      }}
                    >
                      Add Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map(address => (
                      <label
                        key={address._id}
                        className="block p-5 border-2 rounded-creative cursor-pointer transition-all shadow-sm"
                        style={{
                          borderColor: selectedAddressId === address._id
                            ? theme.colors.buttonPrimary
                            : theme.colors.borderPrimary,
                          backgroundColor: selectedAddressId === address._id
                            ? theme.colors.backgroundTertiary
                            : theme.colors.cardBackground,
                        }}
                        onMouseEnter={(e) => {
                          if (selectedAddressId !== address._id) {
                            e.currentTarget.style.borderColor = theme.colors.buttonPrimary;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedAddressId !== address._id) {
                            e.currentTarget.style.borderColor = theme.colors.borderPrimary;
                          }
                        }}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={address._id}
                          checked={selectedAddressId === address._id}
                          onChange={e => setSelectedAddressId(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="font-bold capitalize"
                                style={{ color: theme.colors.textPrimary }}
                              >
                                {address.type}
                              </span>
                              {address.isDefault && (
                                <span
                                  className="text-xs px-2 py-0.5 font-bold"
                                  style={{
                                    backgroundColor: theme.colors.brandPrimary,
                                    color: '#FFFFFF',
                                  }}
                                >
                                  DEFAULT
                                </span>
                              )}
                            </div>
                            <p style={{ color: theme.colors.textSecondary }}>
                              {address.street}, {address.city}, {address.state} {address.zipCode}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                    <button
                      onClick={() => navigate('/profile?tab=addresses')}
                      className="font-semibold transition-colors hover:opacity-80"
                      style={{ color: theme.colors.buttonPrimary }}
                    >
                      + Add New Address
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div
                className="border-2 rounded-creative shadow-card p-8"
                style={{
                  backgroundColor: theme.colors.cardBackground,
                  borderColor: theme.colors.borderPrimary,
                }}
              >
                <h2
                  className="text-2xl font-black mb-6"
                  style={{ color: theme.colors.textPrimary }}
                >
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label
                    className="block p-5 border-2 rounded-creative cursor-pointer transition-all shadow-sm"
                    style={{
                      borderColor: paymentMethod === 'cod'
                        ? theme.colors.buttonPrimary
                        : theme.colors.borderPrimary,
                      backgroundColor: paymentMethod === 'cod'
                        ? theme.colors.backgroundTertiary
                        : theme.colors.cardBackground,
                    }}
                    onMouseEnter={(e) => {
                      if (paymentMethod !== 'cod') {
                        e.currentTarget.style.borderColor = theme.colors.buttonPrimary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (paymentMethod !== 'cod') {
                        e.currentTarget.style.borderColor = theme.colors.borderPrimary;
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={e => setPaymentMethod(e.target.value as 'cod')}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <span
                          className="font-bold"
                          style={{ color: theme.colors.textPrimary }}
                        >
                          Cash on Delivery
                        </span>
                        <p
                          className="text-sm"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          Pay when you receive
                        </p>
                      </div>
                    </div>
                  </label>
                  <label
                    className="block p-5 border-2 rounded-creative cursor-pointer transition-all shadow-sm"
                    style={{
                      borderColor: paymentMethod === 'card'
                        ? theme.colors.buttonPrimary
                        : theme.colors.borderPrimary,
                      backgroundColor: paymentMethod === 'card'
                        ? theme.colors.backgroundTertiary
                        : theme.colors.cardBackground,
                    }}
                    onMouseEnter={(e) => {
                      if (paymentMethod !== 'card') {
                        e.currentTarget.style.borderColor = theme.colors.buttonPrimary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (paymentMethod !== 'card') {
                        e.currentTarget.style.borderColor = theme.colors.borderPrimary;
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={e => setPaymentMethod(e.target.value as 'card')}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <span
                          className="font-bold"
                          style={{ color: theme.colors.textPrimary }}
                        >
                          Credit/Debit Card
                        </span>
                        <p
                          className="text-sm"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          Secure payment gateway
                        </p>
                      </div>
                    </div>
                  </label>
                  <label
                    className="block p-5 border-2 rounded-creative cursor-pointer transition-all shadow-sm"
                    style={{
                      borderColor: paymentMethod === 'upi'
                        ? theme.colors.buttonPrimary
                        : theme.colors.borderPrimary,
                      backgroundColor: paymentMethod === 'upi'
                        ? theme.colors.backgroundTertiary
                        : theme.colors.cardBackground,
                    }}
                    onMouseEnter={(e) => {
                      if (paymentMethod !== 'upi') {
                        e.currentTarget.style.borderColor = theme.colors.buttonPrimary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (paymentMethod !== 'upi') {
                        e.currentTarget.style.borderColor = theme.colors.borderPrimary;
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={e => setPaymentMethod(e.target.value as 'upi')}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <span
                          className="font-bold"
                          style={{ color: theme.colors.textPrimary }}
                        >
                          UPI
                        </span>
                        <p
                          className="text-sm"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          Pay via UPI apps
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div
                className="border-2 rounded-creative shadow-card p-8"
                style={{
                  backgroundColor: theme.colors.cardBackground,
                  borderColor: theme.colors.borderPrimary,
                }}
              >
                <h2
                  className="text-2xl font-black mb-4"
                  style={{ color: theme.colors.textPrimary }}
                >
                  Order Notes
                </h2>
                <p
                  className="text-sm mb-4"
                  style={{ color: theme.colors.textSecondary }}
                >
                  Special instructions for delivery (optional)
                </p>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Example: Leave at door, Call before delivery, Fragile - handle with care..."
                  className="w-full p-4 border-2 rounded-lg resize-none focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: theme.colors.backgroundPrimary,
                    borderColor: theme.colors.borderPrimary,
                    color: theme.colors.textPrimary,
                  }}
                  rows={3}
                  maxLength={500}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.buttonPrimary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.borderPrimary;
                  }}
                />
                <p
                  className="text-xs mt-2 text-right"
                  style={{ color: theme.colors.textTertiary }}
                >
                  {orderNotes.length}/500 characters
                </p>
              </div>

              {/* Gift Wrapping */}
              <div
                className="border-2 rounded-creative shadow-card p-8"
                style={{
                  backgroundColor: theme.colors.cardBackground,
                  borderColor: theme.colors.borderPrimary,
                }}
              >
                <h2
                  className="text-2xl font-black mb-6"
                  style={{ color: theme.colors.textPrimary }}
                >
                  Gift Options
                </h2>

                {/* Gift Wrapping Checkbox */}
                <label
                  className="flex items-start gap-4 p-5 border-2 rounded-creative cursor-pointer transition-all shadow-sm mb-4"
                  style={{
                    borderColor: giftWrapping
                      ? theme.colors.buttonPrimary
                      : theme.colors.borderPrimary,
                    backgroundColor: giftWrapping
                      ? theme.colors.backgroundTertiary
                      : theme.colors.cardBackground,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={giftWrapping}
                    onChange={(e) => {
                      setGiftWrapping(e.target.checked);
                      if (!e.target.checked) {
                        setGiftMessage('');
                      }
                    }}
                    className="mt-1 w-5 h-5 rounded border-2 cursor-pointer transition-all"
                    style={{
                      accentColor: theme.colors.buttonPrimary,
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="font-bold text-lg"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        ðŸŽ Add Gift Wrapping
                      </span>
                      <span
                        className="font-bold text-lg"
                        style={{ color: theme.colors.buttonPrimary }}
                      >
                        +â‚¹99
                      </span>
                    </div>
                    <p
                      className="text-sm"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      Beautiful gift wrapping with ribbon and personalized card
                    </p>
                  </div>
                </label>

                {/* Gift Message (only shown if gift wrapping is selected) */}
                {giftWrapping && (
                  <div className="mt-4 animate-fade-in-up">
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: theme.colors.textPrimary }}
                    >
                      Gift Message (optional)
                    </label>
                    <textarea
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      placeholder="Write a personalized message for your gift card..."
                      className="w-full p-4 border-2 rounded-lg resize-none focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: theme.colors.backgroundPrimary,
                        borderColor: theme.colors.borderPrimary,
                        color: theme.colors.textPrimary,
                      }}
                      rows={3}
                      maxLength={200}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = theme.colors.buttonPrimary;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = theme.colors.borderPrimary;
                      }}
                    />
                    <p
                      className="text-xs mt-2 text-right"
                      style={{ color: theme.colors.textTertiary }}
                    >
                      {giftMessage.length}/200 characters
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div
                className="border-2 rounded-creative shadow-card p-8 sticky top-24"
                style={{
                  backgroundColor: theme.colors.cardBackground,
                  borderColor: theme.colors.borderPrimary,
                }}
              >
                <h2
                  className="text-2xl font-black mb-6"
                  style={{ color: theme.colors.textPrimary }}
                >
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop&auto=format'}
                        alt={item.name}
                        className="w-16 h-16 object-cover border-2 rounded-creative"
                        style={{ borderColor: theme.colors.borderPrimary }}
                        loading="lazy"
                      />
                      <div className="flex-1">
                        <p
                          className="font-semibold text-sm"
                          style={{ color: theme.colors.textPrimary }}
                        >
                          {item.name}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          {item.color} â€¢ {item.size} â€¢ Qty: {item.quantity}
                        </p>
                        <p
                          className="text-sm font-bold mt-1"
                          style={{ color: theme.colors.textPrimary }}
                        >
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="border-t-2 pt-4 space-y-2 mb-6"
                  style={{ borderColor: theme.colors.borderPrimary }}
                >
                  <div
                    className="flex justify-between"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div
                    className="flex justify-between"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    <span>Shipping</span>
                    <span className="font-semibold">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  <div
                    className="flex justify-between"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    <span>Tax (18%)</span>
                    <span className="font-semibold">{formatPrice(tax)}</span>
                  </div>
                  {giftWrapping && (
                    <div
                      className="flex justify-between"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      <span>ðŸŽ Gift Wrapping</span>
                      <span className="font-semibold">{formatPrice(GIFT_WRAP_PRICE)}</span>
                    </div>
                  )}
                  <div
                    className="border-t-2 pt-2 flex justify-between"
                    style={{ borderColor: theme.colors.borderPrimary }}
                  >
                    <span
                      className="text-xl font-bold"
                      style={{ color: theme.colors.textPrimary }}
                    >
                      Total
                    </span>
                    <span
                      className="text-2xl font-black"
                      style={{ color: theme.colors.textPrimary }}
                    >
                      {formatPrice(total + (giftWrapping ? GIFT_WRAP_PRICE : 0))}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      // Trigger form submission via DOM event or ref would be better, 
                      // but for now we rely on the user clicking the submit button inside the form?
                      // Actually, we need the main button to trigger the form submit.
                      // Let's use a ref or simply hide this button for guests and let the form have its own button?
                      // Better UX: This button should trigger the form submit.
                      // Since the form is in a child component, we can use a ref or context.
                      // For simplicity in this MVP, let's just use a form ID and form attribute on the button.
                      const form = document.querySelector('form');
                      if (form) form.requestSubmit();
                    } else {
                      handlePlaceOrder();
                    }
                  }}
                  disabled={loading || (isAuthenticated && !selectedAddressId)}
                  className="w-full py-5 font-extrabold uppercase tracking-wider rounded-creative transition-all shadow-elegant transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                    color: '#FFFFFF',
                  }}
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


