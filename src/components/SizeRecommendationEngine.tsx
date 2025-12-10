import React, { useState, useEffect } from 'react';
import { Product } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';

interface SizeRecommendationEngineProps {
  product: Product;
  onSizeRecommended: (size: string) => void;
}

interface UserMeasurements {
  height: number;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  shoulderWidth: number;
  armLength: number;
  bodyType: 'ectomorph' | 'mesomorph' | 'endomorph';
  fitPreference: 'slim' | 'regular' | 'loose';
}

export const SizeRecommendationEngine: React.FC<SizeRecommendationEngineProps> = ({
  product,
  onSizeRecommended
}) => {
  const { theme } = useTheme();
  const [measurements, setMeasurements] = useState<UserMeasurements | null>(null);
  const [recommendedSize, setRecommendedSize] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [showForm, setShowForm] = useState(false);

  // Load saved measurements from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('userMeasurements');
    if (saved) {
      const parsed = JSON.parse(saved);
      setMeasurements(parsed);
      calculateRecommendation(parsed);
    }
  }, [product]);

  const calculateRecommendation = (userMeasurements: UserMeasurements) => {
    // AI-powered size calculation based on measurements and product type
    const { chest, waist, hips, bodyType, fitPreference } = userMeasurements;

    let baseSize = 'M'; // Default
    let confidenceScore = 75; // Base confidence

    // Calculate BMI for initial sizing


    // Size calculation logic based on product category
    if (product.categoryId === 'cat-1') { // T-Shirts
      // Chest measurement is key for tops
      if (chest < 86) baseSize = 'S';
      else if (chest < 91) baseSize = 'M';
      else if (chest < 96) baseSize = 'L';
      else if (chest < 101) baseSize = 'XL';
      else baseSize = 'XXL';

      // Adjust for fit preference
      if (fitPreference === 'slim' && baseSize !== 'S') {
        baseSize = String.fromCharCode(baseSize.charCodeAt(0) - 1);
      } else if (fitPreference === 'loose' && baseSize !== 'XXL') {
        baseSize = String.fromCharCode(baseSize.charCodeAt(0) + 1);
      }

    } else if (product.categoryId === 'cat-2') { // Jeans/Pants
      // Waist measurement is key for bottoms
      if (waist < 76) baseSize = '28';
      else if (waist < 81) baseSize = '30';
      else if (waist < 86) baseSize = '32';
      else if (waist < 91) baseSize = '34';
      else baseSize = '36';

      // Adjust for hips if significantly different
      if (hips > waist + 10) {
        // Wider hips, might need larger size
        const sizeNum = parseInt(baseSize);
        if (sizeNum < 36) baseSize = (sizeNum + 2).toString();
      }

    } else if (product.categoryId === 'cat-4') { // Hoodies
      // Similar to t-shirts but slightly looser
      if (chest < 88) baseSize = 'S';
      else if (chest < 93) baseSize = 'M';
      else if (chest < 98) baseSize = 'L';
      else if (chest < 103) baseSize = 'XL';
      else baseSize = 'XXL';

      // Hoodies are typically more relaxed
      if (fitPreference === 'regular') {
        // Keep as is
      } else if (fitPreference === 'loose' && baseSize !== 'XXL') {
        baseSize = String.fromCharCode(baseSize.charCodeAt(0) + 1);
      }
    }

    // Adjust confidence based on measurement completeness and body type
    if (bodyType === 'ectomorph') confidenceScore += 5; // Easier to fit
    if (bodyType === 'endomorph') confidenceScore -= 5; // More variation

    // Check if measurements are recent (within 6 months)
    const measurementAge = Date.now() - (userMeasurements as any).timestamp;
    if (measurementAge > 180 * 24 * 60 * 60 * 1000) {
      confidenceScore -= 10;
    }

    setRecommendedSize(baseSize);
    setConfidence(Math.max(0, Math.min(100, confidenceScore)));
    onSizeRecommended(baseSize);
  };

  const handleMeasurementSubmit = (newMeasurements: UserMeasurements) => {
    const measurementsWithTimestamp = {
      ...newMeasurements,
      timestamp: Date.now()
    };

    localStorage.setItem('userMeasurements', JSON.stringify(measurementsWithTimestamp));
    setMeasurements(measurementsWithTimestamp);
    calculateRecommendation(measurementsWithTimestamp);
    setShowForm(false);
  };

  const getConfidenceColor = () => {
    if (confidence >= 80) return theme.colors.stateSuccess;
    if (confidence >= 60) return theme.colors.stateWarning;
    return theme.colors.brandPrimary;
  };

  const getConfidenceText = () => {
    if (confidence >= 80) return 'High Confidence';
    if (confidence >= 60) return 'Medium Confidence';
    return 'Low Confidence - Consider measuring again';
  };

  return (
    <div className="space-y-4">
      {/* Size Recommendation Display */}
      {measurements && recommendedSize && (
        <div
          className="border-2 rounded-creative p-4"
          style={{
            backgroundColor: theme.colors.cardBackground,
            borderColor: theme.colors.borderPrimary,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-lg font-semibold"
              style={{ color: theme.colors.textPrimary }}
            >
              AI Size Recommendation
            </h3>
            <div className="flex items-center gap-2">
              <div
                className="px-3 py-1 text-sm font-medium rounded-full"
                style={{
                  backgroundColor: getConfidenceColor() + '20',
                  color: getConfidenceColor(),
                }}
              >
                {getConfidenceText()}
              </div>
              <span className="text-sm font-medium" style={{ color: theme.colors.textSecondary }}>
                {confidence}% match
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="px-6 py-3 border-2 font-bold text-xl rounded-creative"
              style={{
                backgroundColor: theme.colors.buttonPrimary,
                borderColor: theme.colors.buttonPrimary,
                color: '#FFFFFF',
              }}
            >
              {recommendedSize}
            </div>
            <div>
              <p
                className="font-medium"
                style={{ color: theme.colors.textPrimary }}
              >
                Recommended Size: {recommendedSize}
              </p>
              <p
                className="text-sm"
                style={{ color: theme.colors.textSecondary }}
              >
                Based on your measurements and {product.fitType?.toLowerCase()} fit
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="mt-3 text-sm underline"
            style={{ color: theme.colors.buttonPrimary }}
          >
            Update measurements
          </button>
        </div>
      )}

      {/* Get Started Button */}
      {!measurements && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full px-6 py-4 border-2 rounded-creative font-semibold transition-all hover:scale-105"
          style={{
            backgroundColor: theme.colors.buttonPrimary,
            borderColor: theme.colors.buttonPrimary,
            color: '#FFFFFF',
          }}
        >
          ðŸš€ Get AI Size Recommendation
        </button>
      )}

      {/* Measurement Form Modal */}
      {showForm && (
        <MeasurementForm
          onSubmit={handleMeasurementSubmit}
          onCancel={() => setShowForm(false)}
          initialMeasurements={measurements}
        />
      )}
    </div>
  );
};

// Measurement Form Component
interface MeasurementFormProps {
  onSubmit: (measurements: UserMeasurements) => void;
  onCancel: () => void;
  initialMeasurements?: UserMeasurements | null;
}

const MeasurementForm: React.FC<MeasurementFormProps> = ({
  onSubmit,
  onCancel,
  initialMeasurements
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<UserMeasurements>({
    height: initialMeasurements?.height || 170,
    weight: initialMeasurements?.weight || 70,
    chest: initialMeasurements?.chest || 90,
    waist: initialMeasurements?.waist || 80,
    hips: initialMeasurements?.hips || 95,
    shoulderWidth: initialMeasurements?.shoulderWidth || 45,
    armLength: initialMeasurements?.armLength || 60,
    bodyType: initialMeasurements?.bodyType || 'mesomorph',
    fitPreference: initialMeasurements?.fitPreference || 'regular',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 rounded-creative p-6"
        style={{
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.borderPrimary,
        }}
      >
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: theme.colors.textPrimary }}
        >
          Body Measurements
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Measurements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.textPrimary }}>
                Height (cm)
              </label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                className="w-full px-3 py-2 border-2 rounded"
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.borderPrimary,
                  color: theme.colors.textPrimary,
                }}
                placeholder="Enter height in cm"
                aria-label="Height in centimeters"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.textPrimary }}>
                Weight (kg)
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                className="w-full px-3 py-2 border-2 rounded"
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.borderPrimary,
                  color: theme.colors.textPrimary,
                }}
                placeholder="Enter weight in kg"
                aria-label="Weight in kilograms"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.textPrimary }}>
                Chest (cm)
              </label>
              <input
                type="number"
                value={formData.chest}
                onChange={(e) => setFormData({ ...formData, chest: Number(e.target.value) })}
                className="w-full px-3 py-2 border-2 rounded"
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.borderPrimary,
                  color: theme.colors.textPrimary,
                }}
                placeholder="Enter chest measurement in cm"
                aria-label="Chest measurement in centimeters"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.textPrimary }}>
                Waist (cm)
              </label>
              <input
                type="number"
                value={formData.waist}
                onChange={(e) => setFormData({ ...formData, waist: Number(e.target.value) })}
                className="w-full px-3 py-2 border-2 rounded"
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.borderPrimary,
                  color: theme.colors.textPrimary,
                }}
                placeholder="Enter waist measurement in cm"
                aria-label="Waist measurement in centimeters"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.textPrimary }}>
                Hips (cm)
              </label>
              <input
                type="number"
                value={formData.hips}
                onChange={(e) => setFormData({ ...formData, hips: Number(e.target.value) })}
                className="w-full px-3 py-2 border-2 rounded"
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.borderPrimary,
                  color: theme.colors.textPrimary,
                }}
                placeholder="Enter hips measurement in cm"
                aria-label="Hips measurement in centimeters"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.textPrimary }}>
                Shoulder Width (cm)
              </label>
              <input
                type="number"
                value={formData.shoulderWidth}
                onChange={(e) => setFormData({ ...formData, shoulderWidth: Number(e.target.value) })}
                className="w-full px-3 py-2 border-2 rounded"
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.borderPrimary,
                  color: theme.colors.textPrimary,
                }}
                placeholder="Enter shoulder width in cm"
                aria-label="Shoulder width in centimeters"
                required
              />
            </div>
          </div>

          {/* Body Type & Fit Preference */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.textPrimary }}>
                Body Type
              </label>
              <select
                value={formData.bodyType}
                onChange={(e) => setFormData({ ...formData, bodyType: e.target.value as any })}
                className="w-full px-3 py-2 border-2 rounded"
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.borderPrimary,
                  color: theme.colors.textPrimary,
                }}
                aria-label="Body type selection"
              >
                <option value="ectomorph">Ectomorph (Slim, lean)</option>
                <option value="mesomorph">Mesomorph (Muscular, athletic)</option>
                <option value="endomorph">Endomorph (Stockier, softer)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.textPrimary }}>
                Fit Preference
              </label>
              <select
                value={formData.fitPreference}
                onChange={(e) => setFormData({ ...formData, fitPreference: e.target.value as any })}
                className="w-full px-3 py-2 border-2 rounded"
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.borderPrimary,
                  color: theme.colors.textPrimary,
                }}
                aria-label="Fit preference selection"
              >
                <option value="slim">Slim Fit</option>
                <option value="regular">Regular Fit</option>
                <option value="loose">Loose Fit</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 font-semibold rounded-creative transition-all"
              style={{
                backgroundColor: theme.colors.buttonPrimary,
                color: '#FFFFFF',
              }}
            >
              Save Measurements
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border-2 font-semibold rounded-creative transition-all"
              style={{
                borderColor: theme.colors.borderPrimary,
                color: theme.colors.textPrimary,
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

