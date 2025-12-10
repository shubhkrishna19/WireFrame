import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles } from 'lucide-react';

interface WheelSegment {
  label: string;
  value: number;
  color: string;
}

const segments: WheelSegment[] = [
  { label: '10% OFF', value: 10, color: '#FF6B6B' },
  { label: '5% OFF', value: 5, color: '#4ECDC4' },
  { label: '15% OFF', value: 15, color: '#FFE66D' },
  { label: 'FREE SHIPPING', value: 0, color: '#95E1D3' },
  { label: '20% OFF', value: 20, color: '#A8E6CF' },
  { label: '5% OFF', value: 5, color: '#FFB6B9' },
  { label: '10% OFF', value: 10, color: '#C7CEEA' },
  { label: 'TRY AGAIN', value: 0, color: '#FFDAC1' },
];

export default function SpinTheWheel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<WheelSegment | null>(null);
  const [email, setEmail] = useState('');
  const [hasSpunToday, setHasSpunToday] = useState(false);

  useEffect(() => {
    // Check if user has already spun today
    const lastSpin = localStorage.getItem('lastSpinDate');
    const today = new Date().toDateString();
    
    if (lastSpin === today) {
      setHasSpunToday(true);
    } else {
      // Show popup after 5 seconds for first-time visitors
      const timer = setTimeout(() => {
        if (!hasSpunToday) {
          setIsOpen(true);
        }
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const spinWheel = () => {
    if (!email || isSpinning) return;

    setIsSpinning(true);
    
    // Random result
    const randomIndex = Math.floor(Math.random() * segments.length);
    const selectedSegment = segments[randomIndex];
    
    // Calculate rotation (5 full spins + target segment)
    const segmentAngle = 360 / segments.length;
    const targetRotation = 360 * 5 + (randomIndex * segmentAngle) + (segmentAngle / 2);
    
    setRotation(targetRotation);
    
    // Show result after spinning
    setTimeout(() => {
      setResult(selectedSegment);
      setIsSpinning(false);
      
      // Save spin date
      localStorage.setItem('lastSpinDate', new Date().toDateString());
      setHasSpunToday(true);
      
      // Save discount code if won
      if (selectedSegment.value > 0) {
        const code = `SPIN${selectedSegment.value}`;
        localStorage.setItem('discountCode', code);
      }
    }, 4000);
  };

  const closeModal = () => {
    setIsOpen(false);
    setResult(null);
    setRotation(0);
  };

  if (hasSpunToday && !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>

            {!result ? (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Spin to Win!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Get a chance to win exclusive discounts
                  </p>
                </div>

                {/* Wheel */}
                <div className="relative w-64 h-64 mx-auto mb-6">
                  <motion.div
                    animate={{ rotate: rotation }}
                    transition={{ duration: 4, ease: "easeOut" }}
                    className="w-full h-full rounded-full relative overflow-hidden shadow-lg"
                    style={{
                      background: `conic-gradient(${segments.map((s, i) => 
                        `${s.color} ${i * (360 / segments.length)}deg ${(i + 1) * (360 / segments.length)}deg`
                      ).join(', ')})`
                    }}
                  >
                    {segments.map((segment, index) => (
                      <div
                        key={index}
                        className="absolute top-1/2 left-1/2 origin-left"
                        style={{
                          transform: `rotate(${index * (360 / segments.length)}deg)`,
                          width: '50%',
                        }}
                      >
                        <div className="text-xs font-bold text-gray-800 ml-4 whitespace-nowrap">
                          {segment.label}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                  
                  {/* Center circle */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white dark:bg-gray-800 rounded-full border-4 border-gray-800 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                  </div>
                  
                  {/* Pointer */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                    <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-red-500"></div>
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    disabled={isSpinning}
                  />
                  <button
                    onClick={spinWheel}
                    disabled={!email || isSpinning}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isSpinning ? 'Spinning...' : 'SPIN NOW!'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mb-4 animate-bounce">
                  <Gift className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Congratulations!
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                  {result.value > 0 ? (
                    <>You won <span className="font-bold text-purple-600">{result.label}</span>!</>
                  ) : (
                    <>You won <span className="font-bold text-blue-600">{result.label}</span>!</>
                  )}
                </p>
                {result.value > 0 && (
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your code:</p>
                    <p className="text-2xl font-mono font-bold text-purple-600 dark:text-purple-400">
                      SPIN{result.value}
                    </p>
                  </div>
                )}
                <button
                  onClick={closeModal}
                  className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
