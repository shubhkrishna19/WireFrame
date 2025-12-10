import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Star, Zap, Check, Gift, Truck, Tag, Sparkles } from 'lucide-react';

interface Tier {
  id: string;
  name: string;
  price: number;
  period: string;
  icon: any;
  color: string;
  gradient: string;
  benefits: string[];
  popular?: boolean;
}

const membershipTiers: Tier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'month',
    icon: Star,
    color: 'gray',
    gradient: 'from-gray-400 to-gray-600',
    benefits: [
      'Basic customer support',
      'Standard shipping rates',
      'Access to sales',
      'Product recommendations',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    period: 'month',
    icon: Zap,
    color: 'blue',
    gradient: 'from-blue-500 to-purple-600',
    popular: true,
    benefits: [
      'Free shipping on all orders',
      'Early access to sales',
      '10% discount on all purchases',
      'Priority customer support',
      'Birthday gift voucher',
      'Exclusive member-only products',
    ],
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 29.99,
    period: 'month',
    icon: Crown,
    color: 'gold',
    gradient: 'from-yellow-500 to-pink-600',
    benefits: [
      'Everything in Premium',
      '20% discount on all purchases',
      'Free express shipping',
      'Personal style consultant',
      'VIP-only events & previews',
      'Complimentary gift wrapping',
      'Price match guarantee',
      'Extended return period (60 days)',
    ],
  },
];

export default function MembershipTiers() {
  const [selectedTier, setSelectedTier] = useState<string>('free');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const getPriceForPeriod = (monthlyPrice: number) => {
    if (billingPeriod === 'yearly') {
      const yearlyPrice = monthlyPrice * 12 * 0.8; // 20% discount for yearly
      return { price: yearlyPrice, savings: monthlyPrice * 12 * 0.2 };
    }
    return { price: monthlyPrice, savings: 0 };
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-pink-600 rounded-full mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Become a Member
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Unlock exclusive benefits and save more with every purchase
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all relative ${
                billingPeriod === 'yearly'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Tier Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {membershipTiers.map((tier, index) => {
            const { price, savings } = getPriceForPeriod(tier.price);
            const Icon = tier.icon;

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden ${
                  tier.popular ? 'ring-4 ring-blue-500 scale-105' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                    Most Popular
                  </div>
                )}

                <div className={`h-32 bg-gradient-to-br ${tier.gradient} p-6 flex items-center justify-center`}>
                  <Icon className="w-16 h-16 text-white" />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {tier.name}
                  </h3>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ${price.toFixed(2)}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        /{billingPeriod === 'yearly' ? 'year' : 'month'}
                      </span>
                    </div>
                    {savings > 0 && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Save ${savings.toFixed(2)}/year
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setSelectedTier(tier.id)}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      tier.popular
                        ? `bg-gradient-to-r ${tier.gradient} text-white hover:shadow-lg`
                        : selectedTier === tier.id
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {selectedTier === tier.id ? 'Current Plan' : tier.price === 0 ? 'Free Forever' : 'Upgrade Now'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid md:grid-cols-4 gap-6 max-w-5xl mx-auto"
        >
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On Premium & VIP tiers' },
            { icon: Tag, title: 'Exclusive Discounts', desc: 'Up to 20% off' },
            { icon: Gift, title: 'Birthday Gifts', desc: 'Special surprises' },
            { icon: Sparkles, title: 'Early Access', desc: 'New collections first' },
          ].map((feature, index) => {
            const FeatureIcon = feature.icon;
            return (
              <div
                key={index}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-3">
                  <FeatureIcon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
