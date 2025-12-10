import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Breadcrumb } from '../components/Breadcrumb';
import { useTheme } from '../contexts/ThemeContext';
import { usePageTracking } from '../hooks/usePageTracking';
import { SEO } from '../components/SEO';

export const ReturnsPolicy: React.FC = () => {
  const { theme } = useTheme();
  usePageTracking('Returns Policy');

  return (
    <>
      <SEO
        title="Returns & Refund Policy | Bluewud"
        description="Learn about Bluewud's returns and refund policy, including eligibility, timeframes, and procedures for furniture items."
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
            <Breadcrumb items={[{ label: 'Returns Policy' }]} />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1
            className="text-4xl font-black mb-8"
            style={{ color: theme.colors.textPrimary }}
          >
            Returns & Refund Policy
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
                1. Return Eligibility
              </h2>
              <p style={{ color: theme.colors.textSecondary }}>
                We accept returns within 7 days of delivery for items that are:
              </p>
              <ul className="list-disc pl-6 mb-4" style={{ color: theme.colors.textSecondary }}>
                <li>In original condition and packaging</li>
                <li>Not assembled or installed</li>
                <li>Not damaged or altered by the customer</li>
                <li>Not custom-made or made-to-order</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: theme.colors.textPrimary }}
              >
                2. Return Process
              </h2>
              <p style={{ color: theme.colors.textSecondary }}>
                To initiate a return:
              </p>
              <ol className="list-decimal pl-6 mb-4" style={{ color: theme.colors.textSecondary }}>
                <li>Log into your account and go to Order History</li>
                <li>Select the order you wish to return</li>
                <li>Click "Return Items" and provide reason/photos</li>
                <li>Our team will review your request within 24 hours</li>
                <li>Once approved, we will arrange a reverse pickup</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: theme.colors.textPrimary }}
              >
                3. Refund Processing
              </h2>
              <p style={{ color: theme.colors.textSecondary }}>
                Once we receive and inspect your returned items:
              </p>
              <ul className="list-disc pl-6 mb-4" style={{ color: theme.colors.textSecondary }}>
                <li>Refunds will be processed within 7-10 business days after pickup</li>
                <li>Refunds will be issued to the original payment method</li>
                <li>Shipping and assembly charges are non-refundable</li>
                <li>You will receive an email confirmation when your refund is processed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: theme.colors.textPrimary }}
              >
                4. Exchanges
              </h2>
              <p style={{ color: theme.colors.textSecondary }}>
                We currently do not offer direct exchanges. To exchange an item, please return the original item and place a new order for the desired item.
              </p>
            </section>

            <section className="mb-8">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: theme.colors.textPrimary }}
              >
                5. Damaged or Defective Items
              </h2>
              <p style={{ color: theme.colors.textSecondary }}>
                If you receive a damaged or defective item, please contact us within 48 hours of delivery at support@bluewud.com with photos of the damage. We will arrange for a free replacement of the damaged part or the entire unit.
              </p>
            </section>

            <section className="mb-8">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: theme.colors.textPrimary }}
              >
                6. Non-Returnable Items
              </h2>
              <p style={{ color: theme.colors.textSecondary }}>
                The following items cannot be returned:
              </p>
              <ul className="list-disc pl-6 mb-4" style={{ color: theme.colors.textSecondary }}>
                <li>Custom-made or personalized furniture</li>
                <li>Items that have been assembled or installed</li>
                <li>Items without original packaging</li>
                <li>Items returned after 7 days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: theme.colors.textPrimary }}
              >
                7. Contact Us
              </h2>
              <p style={{ color: theme.colors.textSecondary }}>
                For questions about returns or refunds, please contact us at:
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

