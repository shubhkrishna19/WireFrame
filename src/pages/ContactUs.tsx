
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { pageMetadata } from '../utils/seoConfig';
import { useToast } from '../components/Toast';
import { FormField } from '../components/FormField';
import { sanitizeEmail } from '../utils/sanitize';
import { validationSchemas } from '../utils/formValidation';

const contactSchema = z.object({
  name: validationSchemas.name,
  email: validationSchemas.email,
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactUs: React.FC = () => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const sanitizedEmail = sanitizeEmail(data.email);
      if (!sanitizedEmail) {
        setError('Invalid email address');
        setIsSubmitting(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Thank you for contacting us! We will get back to you soon.');
      reset();
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title={pageMetadata.contact.title}
        description={pageMetadata.contact.description}
      />
      <div className="min-h-screen gradient-background">
        <Navbar />
        <div className="container-primary section-padding">
          <h1 className="heading-primary mb-8">Contact Us</h1>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contact Info */}
            <div>
              <h2 className="heading-secondary mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-tertiary flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div>
                      <h3 className="text-primary font-semibold mb-2">Email</h3>
                      <p className="text-secondary">support@bluewud.com</p>
                      <p className="caption mt-1">We reply within 24 hours</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-tertiary flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📞</span>
                    </div>
                    <div>
                      <h3 className="text-primary font-semibold mb-2">Phone</h3>
                      <p className="text-secondary">+91 1800-XXX-XXXX</p>
                      <p className="caption mt-1">Toll Free • Mon-Sat 9AM-6PM</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-tertiary flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📍</span>
                    </div>
                    <div>
                      <h3 className="text-primary font-semibold mb-2">Address</h3>
                      <p className="text-secondary">
                        Bluewud Furniture Pvt. Ltd.<br />
                        [Your Business Address]<br />
                        India
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-tertiary flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🕐</span>
                    </div>
                    <div>
                      <h3 className="text-primary font-semibold mb-2">Business Hours</h3>
                      <p className="text-secondary">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday: 10:00 AM - 4:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="heading-secondary mb-6">Send us a Message</h2>
              <div className="card p-8">
                {error && (
                  <div className="mb-4 p-4 rounded-lg border-2 bg-red-50 border-red-500 text-red-700">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <FormField label="Name" required error={errors.name?.message}>
                    <input
                      type="text"
                      id="name"
                      {...register('name')}
                      className="input-primary w-full focus-ring"
                      style={{
                        borderColor: errors.name ? '#EF4444' : undefined,
                      }}
                    />
                  </FormField>

                  <FormField label="Email" required error={errors.email?.message}>
                    <input
                      type="email"
                      id="email"
                      {...register('email')}
                      className="input-primary w-full focus-ring"
                      style={{
                        borderColor: errors.email ? '#EF4444' : undefined,
                      }}
                    />
                  </FormField>

                  <FormField label="Subject" required error={errors.subject?.message}>
                    <select
                      id="subject"
                      {...register('subject')}
                      className="input-primary w-full focus-ring"
                      style={{
                        borderColor: errors.subject ? '#EF4444' : undefined,
                      }}
                    >
                      <option value="">Select a subject</option>
                      <option value="order">Order Inquiry</option>
                      <option value="assembly">Assembly Support</option>
                      <option value="return">Return/Refund</option>
                      <option value="product">Product Question</option>
                      <option value="delivery">Delivery Question</option>
                      <option value="bulk">Bulk Orders</option>
                      <option value="other">Other</option>
                    </select>
                  </FormField>

                  <FormField
                    label="Message"
                    required
                    error={errors.message?.message}
                    hint="Minimum 10 characters, maximum 1000 characters"
                  >
                    <textarea
                      id="message"
                      {...register('message')}
                      rows={6}
                      className="input-primary w-full focus-ring resize-none"
                      style={{
                        borderColor: errors.message ? '#EF4444' : undefined,
                      }}
                    />
                  </FormField>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* FAQ Quick Links */}
          <div className="mt-12 card p-8">
            <h2 className="heading-tertiary mb-6 text-center">Quick Answers</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '📦', title: 'Track Your Order', link: '/track-order' },
                { icon: '↩️', title: 'Returns & Refunds', link: '/shipping' },
                { icon: '❓', title: 'FAQs', link: '/faq' },
              ].map((item) => (
                <a
                  key={item.title}
                  href={item.link}
                  className="flex flex-col items-center text-center p-6 border-2 border-primary rounded-lg hover-border-accent hover-lift transition-all-smooth"
                >
                  <span className="text-4xl mb-3">{item.icon}</span>
                  <h3 className="text-primary font-bold">{item.title}</h3>
                </a>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};
