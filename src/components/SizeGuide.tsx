import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface SizeGuideProps {
  category?: string;
}

export const SizeGuide: React.FC<SizeGuideProps> = ({ category = 'general' }) => {
  const { theme } = useTheme();

  // Size guide data based on category
  const sizeGuides: Record<string, { name: string; measurements: string[] }> = {
    't-shirts': {
      name: 'T-Shirts & Tops',
      measurements: ['Chest', 'Length', 'Shoulder', 'Sleeve Length'],
    },
    'shirts': {
      name: 'Shirts',
      measurements: ['Chest', 'Length', 'Shoulder', 'Sleeve Length', 'Collar'],
    },
    'pants': {
      name: 'Pants & Trousers',
      measurements: ['Waist', 'Hip', 'Inseam', 'Outseam', 'Thigh'],
    },
    'shoes': {
      name: 'Shoes',
      measurements: ['Length', 'Width'],
    },
    'general': {
      name: 'General Sizing',
      measurements: ['Chest', 'Waist', 'Length'],
    },
  };

  const guide = sizeGuides[category] || sizeGuides.general;

  // Size chart data (example - in real app, this would come from backend)
  const sizeChart = [
    { size: 'S', chest: '38', waist: '32', length: '28', shoulder: '16' },
    { size: 'M', chest: '40', waist: '34', length: '29', shoulder: '17' },
    { size: 'L', chest: '42', waist: '36', length: '30', shoulder: '18' },
    { size: 'XL', chest: '44', waist: '38', length: '31', shoulder: '19' },
    { size: 'XXL', chest: '46', waist: '40', length: '32', shoulder: '20' },
  ];

  return (
    <div 
      className="border-2 rounded-creative shadow-card p-6"
      style={{
        backgroundColor: theme.colors.cardBackground,
        borderColor: theme.colors.borderPrimary,
      }}
    >
      <h3 
        className="text-xl font-black mb-4"
        style={{ color: theme.colors.textPrimary }}
      >
        Size Guide - {guide.name}
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr 
              className="border-b-2"
              style={{ borderColor: theme.colors.borderPrimary }}
            >
              <th 
                className="text-left py-3 px-4 font-bold"
                style={{ color: theme.colors.textPrimary }}
              >
                Size
              </th>
              {guide.measurements.map((measurement) => (
                <th 
                  key={measurement}
                  className="text-center py-3 px-4 font-bold"
                  style={{ color: theme.colors.textPrimary }}
                >
                  {measurement} (inches)
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sizeChart.map((row, index) => (
              <tr
                key={row.size}
                className="border-b"
                style={{
                  borderColor: theme.colors.borderPrimary,
                  backgroundColor: index % 2 === 0 
                    ? theme.colors.backgroundSecondary 
                    : 'transparent',
                }}
              >
                <td 
                  className="py-3 px-4 font-bold"
                  style={{ color: theme.colors.textPrimary }}
                >
                  {row.size}
                </td>
                {guide.measurements.map((measurement) => {
                  const key = measurement.toLowerCase().replace(' ', '') as keyof typeof row;
                  return (
                    <td 
                      key={measurement}
                      className="text-center py-3 px-4"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {row[key] || '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div 
        className="mt-6 p-4 rounded-creative"
        style={{
          backgroundColor: theme.colors.backgroundSecondary,
        }}
      >
        <p 
          className="text-sm mb-2 font-semibold"
          style={{ color: theme.colors.textPrimary }}
        >
          💡 How to Measure:
        </p>
        <ul 
          className="text-sm space-y-1 list-disc list-inside"
          style={{ color: theme.colors.textSecondary }}
        >
          <li><strong>Chest:</strong> Measure around the fullest part of your chest</li>
          <li><strong>Waist:</strong> Measure around your natural waistline</li>
          <li><strong>Length:</strong> Measure from shoulder to hem</li>
          <li><strong>Shoulder:</strong> Measure from shoulder seam to shoulder seam</li>
        </ul>
      </div>
    </div>
  );
};

