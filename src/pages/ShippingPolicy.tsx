import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Breadcrumb } from '../components/Breadcrumb';
import { useTheme } from '../contexts/ThemeContext';
import { usePageTracking } from '../hooks/usePageTracking';
import { SEO } from '../components/SEO';

export const ShippingPolicy: React.FC = () => {
  const { theme } = useTheme();
  usePageTracking('Shipping Policy');

  return (
    <>
      <SEO
        title="Shipping Policy | Bluewud"
        description="Learn about Bluewud's shipping policy, including delivery times, furniture handling, and tracking information."
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
            <Breadcrumb items={[{ label: 'Shipping Policy' }]} />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1
            className="text-4xl font-black mb-8"
            style={{ color: theme.colors.textPrimary }}
          >
            Shipping Policy
          </h1>
          <div
            className="prose prose-lg max-w-none"
            style={{
              color: theme.colors.textSecondary,
            }}
          >
            <p className="text-sm mb-6" style={{ color: theme.colors.textTertiary }}>
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: theme.colors.textPrimary }}
              >
                1. Shipping Locations
              </h2>
              <p style={{ color: theme.colors.textSecondary }}>
                We currently ship to most major cities and towns within India. Please enter your pincode on the product page to check delivery availability to your location.
              </p>
            </section>

            <section className="mb-8">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: theme.colors.textPrimary }}
              >
                2. Processing Time
              </h2>
              <p style={{ color: theme.colors.textSecondary }}>
                Orders are typically processed within 2-3 business days. Custom or made-to-order furniture pieces may require additional processing time, which will be communicated at the time of order.
              </p>
            </section>

            <section className="mb-8">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: theme.colors.textPrimary }}
              >
                3. Delivery Timeframes
              </h2>
              <p style={{ color: theme.colors.textSecondary }}>
                Estimated delivery times:
              </p>
              <ul className="list-disc pl-6 mb-4" style={{ color: theme.colors.textSecondary }}>
                <li><strong>Small Items (Decor, Accessories):</strong> 5-7 business days</li>
                <li><strong>Large Furniture (Beds, Wardrobes):</strong> 10-15 business days</li>
                <li><strong>Custom Orders:</strong> 15-20 business days</li>
              </ul>
              <p style={{ color: theme.colors.textSecondary }}>
                Delivery times are estimates and may vary based on your location and carrier delays.
              </p>
            </section>

            <section className="mb-8">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: theme.colors.textPrimary }}
              >
                4. Shipping Costs
              </h2>
              <p style={{ color: theme.colors.textSecondary }}>
                Shipping costs are calculated at checkout based on:
              </p>
              <ul className="list-disc pl-6 mb-4" style={{ color: theme.colors.textSecondary }}>
                <li>Delivery location</li>
                <li>Package weight and dimensions</li>
                <li>Selected shipping method</li>
              </ul>
              <p style={{ color: theme.colors.textSecondary }}>
                We offer free shipping on all orders above ₹5,000. For orders below ₹5,000, a nominal shipping fee of ₹499 applies to cover safe handling and insurance of furniture items.
              </p>
            </section>

            <section className="mb-8">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: theme.colors.textPrimary }}
              >
                5. Order Tracking
              </h2>
              <p style={{ color: theme.colors.textSecondary }}>
                Once your order ships, you will receive a tracking number via email. You can track your order status in your account under "Order History" or using the tracking link provided.
              </p>
            </section>

            <section className="mb-8">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: theme.colors.textPrimary }}
              >
                6. Delivery Issues
              </h2>
              <p style={{ color: theme.colors.textSecondary }}>
                If you experience any issues with delivery:
              </p>
              <ul className="list-disc pl-6 mb-4" style={{ color: theme.colors.textSecondary }}>
                <li>Check your tracking information for updates</li>
                <li>Ensure someone is available to receive the package</li>
                <li>Contact the carrier directly if the package is delayed</li>
                <li>Ensure someone is available to receive the package</li>
                <li>Inspect the package for any external damage before accepting</li>
                <li>Contact us at support@bluewud.com immediately if you notice any damage</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: theme.colors.textPrimary }}
              >
                7. Undeliverable Packages
              </h2>
              <p style={{ color: theme.colors.textSecondary }}>
                If a package cannot be delivered due to an incorrect address or other issues, it will be returned to us. We will contact you to arrange reshipment (additional shipping charges may apply) or provide a refund.
              </p>
            </section>

            <section className="mb-8">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: theme.colors.textPrimary }}
              >
                8. Contact Us
              </h2>
              <p style={{ color: theme.colors.textSecondary }}>
                For shipping inquiries, please contact us at:
              </p>
              <p style={{ color: theme.colors.textSecondary }}>
                Email: support@bluewud.com<br />
                Phone: +91 1800-XXX-XXXX<br />
                Address: Bluewud Furniture Pvt. Ltd., India
              </p>
            </section>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

