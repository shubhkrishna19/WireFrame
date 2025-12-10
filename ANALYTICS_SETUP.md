# Analytics Setup Guide

This guide explains how to set up user tracking and analytics for your e-commerce site.

## 📊 What's Tracked

The analytics system automatically tracks:

- **Page Views**: Every page navigation
- **Time on Page**: How long users stay on each page (tracked every 30 seconds)
- **Product Views**: When users view product detail pages
- **Button Clicks**: All button interactions with context
- **Add to Cart**: Product additions with price and quantity
- **Wishlist Actions**: Add/remove from wishlist
- **Search Queries**: What users search for
- **Filter Usage**: Which filters users apply
- **Checkout Flow**: Cart value and item count
- **Purchases**: Completed orders with transaction details
- **Form Interactions**: Form starts and submissions
- **Errors**: Any errors that occur

## 🚀 Quick Setup

### Option 1: Google Analytics 4 (Recommended - Free)

1. **Create a Google Analytics account**:
   - Go to https://analytics.google.com
   - Create a new property for your website
   - Get your Measurement ID (format: `G-XXXXXXXXXX`)

2. **Add to your `.env` file**:
   ```env
   VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_ANALYTICS_ENABLED=true
   ```

3. **That's it!** Analytics will start tracking automatically.

### Option 2: Custom Analytics Endpoint

If you want to send data to your own backend:

1. **Create an analytics endpoint** on your backend that accepts POST requests
2. **Add to your `.env` file**:
   ```env
   VITE_ANALYTICS_ENDPOINT=https://your-api.com/analytics
   VITE_ANALYTICS_ENABLED=true
   ```

3. Your endpoint will receive JSON data like:
   ```json
   {
     "type": "event",
     "event_name": "add_to_cart",
     "product_id": "prod-1",
     "product_name": "Premium Merino Wool T-Shirt",
     "price": 2499,
     "quantity": 1,
     "timestamp": 1234567890,
     "url": "https://yoursite.com/products",
     "path": "/products"
   }
   ```

### Option 3: Both (Recommended for Production)

Use both Google Analytics and your custom endpoint:

```env
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ANALYTICS_ENDPOINT=https://your-api.com/analytics
VITE_ANALYTICS_ENABLED=true
```

## 📝 Environment Variables

Create a `.env` file in your project root:

```env
# Analytics Configuration
VITE_ANALYTICS_ENABLED=true
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ANALYTICS_ENDPOINT=https://your-api.com/analytics
```

## 🔍 Viewing Analytics Data

### Google Analytics Dashboard

1. Go to https://analytics.google.com
2. Select your property
3. Navigate to **Reports** → **Realtime** to see live data
4. Navigate to **Reports** → **Engagement** → **Events** to see all tracked events

### Custom Endpoint

Store the data in your database and create your own dashboard.

## 📈 Tracked Events Reference

### Product Events
- `view_product` - User views a product detail page
- `click_product` - User clicks on a product card
- `add_to_cart` - User adds product to cart
- `remove_from_cart` - User removes product from cart

### Wishlist Events
- `add_to_wishlist` - User adds product to wishlist
- `remove_from_wishlist` - User removes product from wishlist

### Navigation Events
- `page_view` - User visits a page
- `time_on_page` - User stays on page (every 30 seconds)
- `page_exit` - User leaves a page
- `navigation` - User clicks navigation links

### Search & Filter Events
- `search` - User performs a search
- `apply_filter` - User applies a filter

### Checkout Events
- `begin_checkout` - User starts checkout process
- `purchase` - User completes a purchase

### Interaction Events
- `button_click` - User clicks any button
- `form_start` - User starts filling a form
- `form_submit` - User submits a form
- `error` - An error occurs

## 💻 Using Analytics in Code

### Track Custom Events

```typescript
import { analytics } from './utils/analytics';

// Track a button click
analytics.buttonClick('Subscribe', 'Newsletter Form');

// Track a custom event
analytics.trackEvent('custom_event', {
  custom_param: 'value',
});
```

### Track Page Views

The `usePageTracking` hook automatically tracks page views. It's already integrated in `AnalyticsWrapper`.

### Manual Page Tracking

```typescript
import { trackPageView } from './utils/analytics';

trackPageView('/products', 'Products Page');
```

## 🎯 Best Practices

1. **Don't track sensitive data**: Never track passwords, credit card numbers, or personal information
2. **Respect privacy**: Consider adding a cookie consent banner
3. **Test in development**: Check console logs to verify events are firing
4. **Monitor performance**: Analytics shouldn't slow down your site

## 🐛 Debugging

In development mode, all analytics events are logged to the console. Look for messages like:

```
📊 Page View: { path: '/products', title: 'Products', ... }
📊 Event: { event_name: 'add_to_cart', ... }
```

## 🔒 Privacy & GDPR

If you're serving users in the EU, you may need to:
- Add a cookie consent banner
- Allow users to opt-out of tracking
- Update your privacy policy

## 📚 Additional Resources

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)

## ❓ Need Help?

The analytics system is already integrated and will work automatically once you add your Google Analytics ID to the `.env` file. All tracking happens in the background without any additional code changes needed.

