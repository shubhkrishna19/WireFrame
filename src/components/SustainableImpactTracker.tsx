import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';


interface ImpactMetrics {
  carbonFootprint: number; // kg CO2
  waterSaved: number; // liters
  wasteReduced: number; // kg
  treesPlanted: number;
  energySaved: number; // kWh
}

interface SustainableProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  sustainabilityScore: number; // 0-100
  carbonFootprint: number; // kg CO2 per unit
  waterUsage: number; // liters per unit
  recycledMaterials: number; // percentage
  biodegradable: boolean;
  fairTrade: boolean;
  organic: boolean;
}

export const SustainableImpactTracker: React.FC = () => {
  const { theme } = useTheme();


  const [userImpact, setUserImpact] = useState<ImpactMetrics>({
    carbonFootprint: 0,
    waterSaved: 0,
    wasteReduced: 0,
    treesPlanted: 0,
    energySaved: 0,
  });

  const [sustainableProducts, setSustainableProducts] = useState<SustainableProduct[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [showProductDetails, setShowProductDetails] = useState(false);

  // Mock sustainable products data
  useEffect(() => {
    const mockProducts: SustainableProduct[] = [
      {
        id: 'sust-1',
        name: 'Bamboo Cotton T-Shirt',
        brand: 'EcoWear',
        category: 'T-Shirts',
        sustainabilityScore: 95,
        carbonFootprint: 2.1,
        waterUsage: 150,
        recycledMaterials: 70,
        biodegradable: true,
        fairTrade: true,
        organic: true,
      },
      {
        id: 'sust-2',
        name: 'Organic Merino Wool Hoodie',
        brand: 'GreenThreads',
        category: 'Hoodies',
        sustainabilityScore: 92,
        carbonFootprint: 3.8,
        waterUsage: 280,
        recycledMaterials: 0,
        biodegradable: false,
        fairTrade: true,
        organic: true,
      },
      {
        id: 'sust-3',
        name: 'Recycled Polyester Joggers',
        brand: 'EarthFit',
        category: 'Pants',
        sustainabilityScore: 88,
        carbonFootprint: 4.2,
        waterUsage: 320,
        recycledMaterials: 85,
        biodegradable: false,
        fairTrade: false,
        organic: false,
      },
      {
        id: 'sust-4',
        name: 'Hemp Canvas Sneakers',
        brand: 'PlanetWalk',
        category: 'Shoes',
        sustainabilityScore: 90,
        carbonFootprint: 5.5,
        waterUsage: 180,
        recycledMaterials: 60,
        biodegradable: true,
        fairTrade: true,
        organic: true,
      },
    ];

    setSustainableProducts(mockProducts);

    // Mock user impact data
    setUserImpact({
      carbonFootprint: 45.2, // kg CO2 saved
      waterSaved: 12500, // liters
      wasteReduced: 8.7, // kg
      treesPlanted: 12,
      energySaved: 89.5, // kWh
    });
  }, [selectedTimeframe]);

  const getImpactIcon = (metric: keyof ImpactMetrics) => {
    switch (metric) {
      case 'carbonFootprint':
        return 'ðŸŒ±';
      case 'waterSaved':
        return 'ðŸ’§';
      case 'wasteReduced':
        return 'â™»ï¸';
      case 'treesPlanted':
        return 'ðŸŒ³';
      case 'energySaved':
        return 'âš¡';
      default:
        return 'ðŸ“Š';
    }
  };

  const getImpactLabel = (metric: keyof ImpactMetrics) => {
    switch (metric) {
      case 'carbonFootprint':
        return 'COâ‚‚ Saved';
      case 'waterSaved':
        return 'Water Saved';
      case 'wasteReduced':
        return 'Waste Reduced';
      case 'treesPlanted':
        return 'Trees Planted';
      case 'energySaved':
        return 'Energy Saved';
      default:
        return metric;
    }
  };

  const getImpactValue = (metric: keyof ImpactMetrics) => {
    const value = userImpact[metric];
    switch (metric) {
      case 'carbonFootprint':
        return `${value.toFixed(1)} kg`;
      case 'waterSaved':
        return `${(value / 1000).toFixed(1)}k L`;
      case 'wasteReduced':
        return `${value.toFixed(1)} kg`;
      case 'treesPlanted':
        return `${value}`;
      case 'energySaved':
        return `${value.toFixed(1)} kWh`;
      default:
        return value.toString();
    }
  };

  const getSustainabilityBadge = (score: number) => {
    if (score >= 90) return { text: 'Excellent', color: theme.colors.stateSuccess };
    if (score >= 80) return { text: 'Very Good', color: theme.colors.stateWarning };
    if (score >= 70) return { text: 'Good', color: '#F59E0B' };
    return { text: 'Fair', color: '#EF4444' };
  };

  const getEquivalentText = (metric: keyof ImpactMetrics, value: number) => {
    switch (metric) {
      case 'carbonFootprint':
        return `Equivalent to ${Math.round(value * 20)} km driven by car`;
      case 'waterSaved':
        return `Enough water for ${Math.round(value / 2000)} showers`;
      case 'wasteReduced':
        return `Equivalent to ${Math.round(value * 50)} plastic bottles`;
      case 'treesPlanted':
        return `Absorbs COâ‚‚ equivalent to ${value * 20} cars per year`;
      case 'energySaved':
        return `Powers ${Math.round(value / 10)} LED bulbs for a year`;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div
        className="text-center py-12 px-6 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.stateSuccess}20 0%, ${theme.colors.brandDark}20 100%)`,
          border: `2px solid ${theme.colors.borderPrimary}`,
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h1
            className="text-4xl font-black mb-4"
            style={{ color: theme.colors.textPrimary }}
          >
            ðŸŒ± Your Sustainable Impact
          </h1>
          <p
            className="text-xl mb-8"
            style={{ color: theme.colors.textSecondary }}
          >
            See how your fashion choices are making a positive impact on the planet
          </p>

          {/* Timeframe Selector */}
          <div className="flex justify-center gap-2 mb-8">
            {(['week', 'month', 'year'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${selectedTimeframe === timeframe ? 'scale-105' : 'hover:scale-105'
                  }`}
                style={{
                  backgroundColor: selectedTimeframe === timeframe
                    ? theme.colors.buttonPrimary
                    : theme.colors.backgroundSecondary,
                  color: selectedTimeframe === timeframe
                    ? '#FFFFFF'
                    : theme.colors.textPrimary,
                  border: `1px solid ${theme.colors.borderPrimary}`,
                }}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(userImpact).map((metric) => (
          <div
            key={metric}
            className="p-6 rounded-creative border-2 hover:shadow-card transition-all"
            style={{
              backgroundColor: theme.colors.cardBackground,
              borderColor: theme.colors.borderPrimary,
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="text-3xl">{getImpactIcon(metric as keyof ImpactMetrics)}</div>
              <div>
                <h3
                  className="text-lg font-bold"
                  style={{ color: theme.colors.textPrimary }}
                >
                  {getImpactLabel(metric as keyof ImpactMetrics)}
                </h3>
                <p
                  className="text-2xl font-black"
                  style={{ color: theme.colors.stateSuccess }}
                >
                  {getImpactValue(metric as keyof ImpactMetrics)}
                </p>
              </div>
            </div>
            <p
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              {getEquivalentText(metric as keyof ImpactMetrics, userImpact[metric as keyof ImpactMetrics])}
            </p>
          </div>
        ))}
      </div>

      {/* Sustainable Products */}
      <div
        className="border-2 rounded-creative p-6"
        style={{
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.borderPrimary,
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-2xl font-bold"
              style={{ color: theme.colors.textPrimary }}
            >
              ðŸŒ¿ Sustainable Products
            </h2>
            <p
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              Shop our eco-friendly collection
            </p>
          </div>
          <button
            onClick={() => setShowProductDetails(!showProductDetails)}
            className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors hover:opacity-80"
            style={{
              backgroundColor: theme.colors.buttonPrimary,
              color: '#FFFFFF',
            }}
          >
            {showProductDetails ? 'Hide Details' : 'View Details'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sustainableProducts.map((product) => {
            const badge = getSustainabilityBadge(product.sustainabilityScore);
            return (
              <div
                key={product.id}
                className="p-4 rounded-lg border-2 hover:shadow-card transition-all"
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.borderPrimary,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3
                      className="font-bold text-lg mb-1"
                      style={{ color: theme.colors.textPrimary }}
                    >
                      {product.name}
                    </h3>
                    <p
                      className="text-sm mb-2"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {product.brand} â€¢ {product.category}
                    </p>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: badge.color,
                      color: '#FFFFFF',
                    }}
                  >
                    {badge.text}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="text-center">
                    <div
                      className="text-lg font-bold"
                      style={{ color: theme.colors.stateSuccess }}
                    >
                      {product.sustainabilityScore}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      Score
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-lg font-bold"
                      style={{ color: theme.colors.brandDark }}
                    >
                      {product.carbonFootprint}kg
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      COâ‚‚
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-lg font-bold"
                      style={{ color: theme.colors.stateWarning }}
                    >
                      {product.waterUsage}L
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      Water
                    </div>
                  </div>
                </div>

                {showProductDetails && (
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      {product.organic && (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          ðŸŒ± Organic
                        </span>
                      )}
                      {product.fairTrade && (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          ðŸ¤ Fair Trade
                        </span>
                      )}
                      {product.biodegradable && (
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                          â™»ï¸ Biodegradable
                        </span>
                      )}
                      {product.recycledMaterials > 0 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                          ðŸ”„ {product.recycledMaterials}% Recycled
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <button
                  className="w-full px-4 py-2 font-semibold rounded-lg transition-all hover:scale-105"
                  style={{
                    backgroundColor: theme.colors.buttonPrimary,
                    color: '#FFFFFF',
                  }}
                >
                  View Product
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Impact Calculator */}
      <div
        className="border-2 rounded-creative p-6"
        style={{
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.borderPrimary,
        }}
      >
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: theme.colors.textPrimary }}
        >
          ðŸ’¡ Environmental Impact Calculator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: theme.colors.textPrimary }}
            >
              Traditional Fashion vs Sustainable Fashion
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg"
                style={{ backgroundColor: theme.colors.backgroundSecondary }}>
                <span style={{ color: theme.colors.textSecondary }}>Cotton T-Shirt Production</span>
                <div className="text-right">
                  <div className="font-bold" style={{ color: '#EF4444' }}>2,700L water</div>
                  <div className="text-xs" style={{ color: theme.colors.textTertiary }}>Traditional</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg"
                style={{ backgroundColor: theme.colors.backgroundSecondary }}>
                <span style={{ color: theme.colors.textSecondary }}>Bamboo T-Shirt Production</span>
                <div className="text-right">
                  <div className="font-bold" style={{ color: theme.colors.stateSuccess }}>150L water</div>
                  <div className="text-xs" style={{ color: theme.colors.textTertiary }}>Sustainable</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg"
                style={{ backgroundColor: theme.colors.backgroundSecondary }}>
                <span style={{ color: theme.colors.textSecondary }}>COâ‚‚ per kg textile</span>
                <div className="text-right">
                  <div className="font-bold" style={{ color: '#EF4444' }}>23kg COâ‚‚</div>
                  <div className="text-xs" style={{ color: theme.colors.textTertiary }}>Traditional</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg"
                style={{ backgroundColor: theme.colors.backgroundSecondary }}>
                <span style={{ color: theme.colors.textSecondary }}>Organic Cotton COâ‚‚</span>
                <div className="text-right">
                  <div className="font-bold" style={{ color: theme.colors.stateSuccess }}>5.5kg COâ‚‚</div>
                  <div className="text-xs" style={{ color: theme.colors.textTertiary }}>Sustainable</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: theme.colors.textPrimary }}
            >
              Your Impact This Month
            </h3>
            <div className="space-y-4">
              <div className="text-center p-6 rounded-lg"
                style={{ backgroundColor: theme.colors.backgroundSecondary }}>
                <div className="text-4xl mb-2">ðŸŒ</div>
                <div
                  className="text-2xl font-black mb-1"
                  style={{ color: theme.colors.stateSuccess }}
                >
                  {Math.round(userImpact.carbonFootprint * 100 / 23)}%
                </div>
                <div
                  className="text-sm"
                  style={{ color: theme.colors.textSecondary }}
                >
                  Less COâ‚‚ than traditional fashion
                </div>
              </div>
              <div className="text-center p-6 rounded-lg"
                style={{ backgroundColor: theme.colors.backgroundSecondary }}>
                <div className="text-4xl mb-2">ðŸ’§</div>
                <div
                  className="text-2xl font-black mb-1"
                  style={{ color: theme.colors.brandDark }}
                >
                  {Math.round(userImpact.waterSaved / 270)}x
                </div>
                <div
                  className="text-sm"
                  style={{ color: theme.colors.textSecondary }}
                >
                  Times less water usage
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div
        className="text-center py-8 px-6 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.stateSuccess}30 0%, ${theme.colors.brandDark}30 100%)`,
          border: `2px solid ${theme.colors.borderPrimary}`,
        }}
      >
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: theme.colors.textPrimary }}
        >
          Make Every Purchase Count ðŸŒ±
        </h2>
        <p
          className="text-lg mb-6"
          style={{ color: theme.colors.textSecondary }}
        >
          Choose sustainable fashion and track your positive impact on the planet
        </p>
        <button
          className="px-8 py-4 font-extrabold text-lg uppercase tracking-wider rounded-creative transition-all hover:scale-105 shadow-elegant"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.stateSuccess} 0%, ${theme.colors.brandDark} 100%)`,
            color: '#FFFFFF',
          }}
        >
          Shop Sustainable Collection
        </button>
      </div>
    </div>
  );
};

