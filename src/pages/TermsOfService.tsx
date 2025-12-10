import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Breadcrumb } from '../components/Breadcrumb';
import { useTheme } from '../contexts/ThemeContext';
import { usePageTracking } from '../hooks/usePageTracking';
import { SEO } from '../components/SEO';

const TermsOfService: React.FC = () => {
  usePageTracking('Terms of Service');
  const { theme } = useTheme();

  return (
    <>
      <SEO
        title="Terms of Service | Bluewud"
        description="Read Bluewud's Terms of Service to understand the rules and guidelines for using our website and services."
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
            <Breadcrumb items={[{ label: 'Terms of Service' }]} />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div
            className="rounded-creative p-8 lg:p-12 shadow-card"
            style={{
              backgroundColor: theme.colors.cardBackground,
              borderColor: theme.colors.borderPrimary,
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <h1
              className="text-4xl lg:text-5xl font-extrabold mb-6"
              style={{ color: theme.colors.textPrimary }}
            >
              Terms of Service
            </h1>
            <p className="text-sm mb-8" style={{ color: theme.colors.textSecondary }}>
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="space-y-8" style={{ color: theme.colors.textPrimary }}>
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  1. Acceptance of Terms
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  By accessing and using the Bluewud website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  2. Use License
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  Permission is granted to temporarily download one copy of the materials on Bluewud's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4" style={{ color: theme.colors.textSecondary }}>
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                  <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  3. Account Registration
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  To access certain features of our website, you may be required to register for an account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4" style={{ color: theme.colors.textSecondary }}>
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and update your information to keep it accurate, current, and complete</li>
                  <li>Maintain the security of your password and identification</li>
                  <li>Accept all responsibility for all activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  4. Products and Pricing
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  We strive to provide accurate product descriptions, images, and pricing information. However, we do not warrant that product descriptions or other content on this site is accurate, complete, reliable, current, or error-free. Prices are subject to change without notice. We reserve the right to refuse or cancel any order at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  5. Payment Terms
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  All payments must be made through our approved payment methods. By placing an order, you agree to pay the full amount including taxes and shipping charges. We reserve the right to change our prices at any time without prior notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  6. Shipping and Delivery
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  We will make every effort to deliver products within the estimated delivery time. However, delivery times are estimates only and are not guaranteed. We are not responsible for delays caused by shipping carriers or circumstances beyond our control.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  7. Returns and Refunds
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  Please review our Returns & Refunds Policy for detailed information about returning products and obtaining refunds. Returns must be initiated within the specified time period and in accordance with our return policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  8. Prohibited Uses
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  You may not use our website:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4" style={{ color: theme.colors.textSecondary }}>
                  <li>In any way that violates any applicable law or regulation</li>
                  <li>To transmit any malicious code, viruses, or harmful data</li>
                  <li>To impersonate or attempt to impersonate the company or any employee</li>
                  <li>To engage in any automated use of the system</li>
                  <li>To interfere with or disrupt the website or servers</li>
                  <li>To collect or track personal information of others</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  9. Intellectual Property
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  All content on this website, including text, graphics, logos, images, and software, is the property of Bluewud or its content suppliers and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works from any content without our express written permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  10. Limitation of Liability
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  In no event shall Bluewud or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Bluewud's website, even if Bluewud or a Bluewud authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  11. Indemnification
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  You agree to indemnify, defend, and hold harmless Bluewud, its officers, directors, employees, agents, and third parties from any losses, costs, liabilities, and expenses (including reasonable attorney's fees) relating to or arising out of your use of or inability to use the website, your violation of any terms of this agreement, or your violation of any rights of a third party.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  12. Governing Law
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  13. Changes to Terms
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms of Service on this page and updating the "Last Updated" date. Your continued use of the website after any such changes constitutes your acceptance of the new Terms of Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  14. Contact Information
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="mt-4 space-y-2" style={{ color: theme.colors.textSecondary }}>
                  <p><strong>Email:</strong> legal@bluewud.com</p>
                  <p><strong>Phone:</strong> +91 1800-XXX-XXXX</p>
                  <p><strong>Address:</strong> Bluewud Furniture Pvt. Ltd., Bangalore, Karnataka, India</p>
                </div>
              </section>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export { TermsOfService };
export default TermsOfService;
