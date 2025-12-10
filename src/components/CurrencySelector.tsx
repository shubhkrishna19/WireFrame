import React, { useState } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
];

export const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const currentCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border-2 border-neutral-700 rounded-creative hover:bg-neutral-700 hover:border-fashion-burgundy transition-all font-semibold text-neutral-200"
        aria-label="Select currency"
      >
        <span className="text-lg font-bold">{currentCurrency.symbol}</span>
        <span className="text-sm uppercase tracking-wide">{currentCurrency.code}</span>
        <svg
          className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 z-50 bg-neutral-900 border-2 border-neutral-700 rounded-creative shadow-elegant-lg min-w-[200px] overflow-hidden">
            {CURRENCIES.map((curr) => (
              <button
                key={curr.code}
                onClick={() => {
                  setCurrency(curr.code as 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED');
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-neutral-800 transition-colors flex items-center gap-3 ${
                  currency === curr.code
                    ? 'bg-neutral-800 border-l-4 border-fashion-burgundy'
                    : ''
                }`}
              >
                <span className="text-lg font-bold text-neutral-200">{curr.symbol}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-neutral-200 uppercase">{curr.code}</span>
                  <span className="text-xs text-neutral-400">{curr.name}</span>
                </div>
                {currency === curr.code && (
                  <svg className="w-5 h-5 text-fashion-burgundy ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

