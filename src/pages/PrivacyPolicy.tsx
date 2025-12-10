import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Breadcrumb } from '../components/Breadcrumb';
import { useTheme } from '../contexts/ThemeContext';
import { usePageTracking } from '../hooks/usePageTracking';
import { SEO } from '../components/SEO';

const PrivacyPolicy: React.FC = () => {
  usePageTracking('Privacy Policy');
  const { theme } = useTheme();

  return (
    <>
      <SEO
        title="Privacy Policy | Bluewud"
        description="Read Bluewud's Privacy Policy to understand how we collect, use, and protect your personal information."
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
            <Breadcrumb items={[{ label: 'Privacy Policy' }]} />
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
              Privacy Policy
            </h1>
            <p className="text-sm mb-8" style={{ color: theme.colors.textSecondary }}>
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="space-y-8" style={{ color: theme.colors.textPrimary }}>
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  1. Introduction
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  Welcome to Bluewud. We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  2. Information We Collect
                </h2>
                <h3 className="text-xl font-semibold mb-3 mt-4" style={{ color: theme.colors.textPrimary }}>
                  2.1 Personal Information
                </h3>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4" style={{ color: theme.colors.textSecondary }}>
                  <li>Register for an account</li>
                  <li>Make a purchase</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Contact us for customer support</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  This information may include: name, email address, phone number, shipping address, billing address, payment information, and other contact details.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-4" style={{ color: theme.colors.textPrimary }}>
                  2.2 Automatically Collected Information
                </h3>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  When you visit our website, we automatically collect certain information about your device, including:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4" style={{ color: theme.colors.textSecondary }}>
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Referring website addresses</li>
                  <li>Device identifiers</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  3. How We Use Your Information
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4" style={{ color: theme.colors.textSecondary }}>
                  <li>Process and fulfill your orders</li>
                  <li>Manage your account and provide customer support</li>
                  <li>Send you order confirmations and shipping updates</li>
                  <li>Communicate with you about products, services, and promotions</li>
                  <li>Improve our website and user experience</li>
                  <li>Detect and prevent fraud and abuse</li>
                  <li>Comply with legal obligations</li>
                  <li>Analyze website usage and trends</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  4. Information Sharing and Disclosure
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  We do not sell your personal information. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4" style={{ color: theme.colors.textSecondary }}>
                  <li><strong>Service Providers:</strong> With third-party service providers who perform services on our behalf (payment processing, shipping, email delivery)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>With Your Consent:</strong> When you explicitly consent to sharing</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  5. Data Security
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  6. Your Rights and Choices
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4" style={{ color: theme.colors.textSecondary }}>
                  <li>Access and review your personal information</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Object to processing of your personal information</li>
                  <li>Request data portability</li>
                </ul>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  7. Cookies and Tracking Technologies
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  8. Children's Privacy
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  Our website is not intended for children under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  9. Changes to This Privacy Policy
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  10. Contact Us
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="mt-4 space-y-2" style={{ color: theme.colors.textSecondary }}>
                  <p><strong>Email:</strong> privacy@bluewud.com</p>
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

export { PrivacyPolicy };
export default PrivacyPolicy;
