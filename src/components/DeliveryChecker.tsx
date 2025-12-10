import React, { useState } from 'react';
import * as dataStore from '../store/dataStore';

interface DeliveryCheckerProps {
  // productId?: string; // Reserved for future use
}

export const DeliveryChecker: React.FC<DeliveryCheckerProps> = () => {
  const [pincode, setPincode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<{
    serviceable: boolean;
    estimatedDays?: number;
    message?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check delivery using dataStore
  const checkDelivery = async (pin: string) => {
    setIsChecking(true);
    setError(null);
    setDeliveryInfo(null);

    // Validate pincode (6 digits for India)
    if (!/^\d{6}$/.test(pin)) {
      setError('Please enter a valid 6-digit pincode');
      setIsChecking(false);
      return;
    }

    // Simulate API call delay
    setTimeout(async () => {
      const result = await dataStore.checkPincodeServiceable(pin);

      setDeliveryInfo({
        serviceable: result.serviceable,
        estimatedDays: result.estimatedDays,
        message: result.serviceable
          ? `Delivery available in ${result.estimatedDays} business days`
          : 'Delivery not available for this pincode',
      });
      setIsChecking(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim()) {
      checkDelivery(pincode.trim());
    }
  };

  return (
    <div className="mt-6 p-6 bg-neutral-900/50 backdrop-blur-sm rounded-2xl border-2 border-neutral-800">
      <h3 className="text-lg font-bold text-neutral-100 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        Check Delivery
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="Enter 6-digit pincode"
          maxLength={6}
          className="flex-1 px-4 py-3 border border-neutral-700 bg-neutral-900 text-neutral-100 placeholder-neutral-500 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
          aria-label="Enter pincode for delivery check"
        />
        <button
          type="submit"
          disabled={isChecking || pincode.length !== 6}
          className={`px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${isChecking || pincode.length !== 6 ? '' : 'hover:shadow-lg'}`}
          aria-label="Check delivery availability"
        >
          {isChecking ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking...
            </span>
          ) : (
            'Check'
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {deliveryInfo && (
        <div className={`mt-4 p-4 rounded-lg border ${deliveryInfo.serviceable
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-red-500/10 border-red-500/30'
          }`}>
          <div className="flex items-start gap-3">
            {deliveryInfo.serviceable ? (
              <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <div>
              <p className={`font-semibold ${deliveryInfo.serviceable ? 'text-green-400' : 'text-red-400'
                }`}>
                {deliveryInfo.message}
              </p>
              {deliveryInfo.serviceable && deliveryInfo.estimatedDays && (
                <p className="text-sm text-neutral-400 mt-1">
                  Estimated delivery: {new Date(Date.now() + deliveryInfo.estimatedDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-neutral-500">
        * Currently checking all India pincodes. Serviceable pincodes list will be updated from admin panel.
      </p>
    </div>
  );
};
