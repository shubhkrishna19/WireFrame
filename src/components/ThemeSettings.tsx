import React, { useState } from 'react';
import { useTheme, ThemeColors } from '../contexts/ThemeContext';
import { useToast } from './Toast';

export const ThemeSettings: React.FC = () => {
  const { theme, updateColors, resetTheme, toggleMode } = useTheme();
  const toast = useToast();
  const [activeSection, setActiveSection] = useState<'background' | 'text' | 'accent' | 'buttons' | 'furniture'>('background');

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    updateColors({ [key]: value });
    toast.success('Color updated!');
  };

  const handleReset = () => {
    resetTheme();
    toast.success('Theme reset to defaults!');
  };

  const colorGroups = {
    background: {
      title: 'Background Colors',
      description: 'Control the main background colors of the site',
      colors: [
        { key: 'backgroundPrimary', label: 'Primary Background', value: theme.colors.backgroundPrimary },
        { key: 'backgroundSecondary', label: 'Secondary Background', value: theme.colors.backgroundSecondary },
        { key: 'backgroundTertiary', label: 'Tertiary Background', value: theme.colors.backgroundTertiary },
        { key: 'cardBackground', label: 'Card Background', value: theme.colors.cardBackground },
      ] as Array<{ key: keyof ThemeColors; label: string; value: string }>,
    },
    text: {
      title: 'Text Colors',
      description: 'Control text colors for readability',
      colors: [
        { key: 'textPrimary', label: 'Primary Text', value: theme.colors.textPrimary },
        { key: 'textSecondary', label: 'Secondary Text', value: theme.colors.textSecondary },
        { key: 'textTertiary', label: 'Tertiary Text', value: theme.colors.textTertiary },
      ] as Array<{ key: keyof ThemeColors; label: string; value: string }>,
    },
    accent: {
      title: 'Accent Colors',
      description: 'Main accent colors for highlights',
      colors: [
        { key: 'accentPrimary', label: 'Primary Accent', value: theme.colors.accentPrimary },
        { key: 'accentSecondary', label: 'Secondary Accent', value: theme.colors.accentSecondary },
        { key: 'accentTertiary', label: 'Tertiary Accent', value: theme.colors.accentTertiary },
      ] as Array<{ key: keyof ThemeColors; label: string; value: string }>,
    },
    buttons: {
      title: 'Button Colors',
      description: 'Colors for buttons and CTAs',
      colors: [
        { key: 'buttonPrimary', label: 'Primary Button', value: theme.colors.buttonPrimary },
        { key: 'buttonSecondary', label: 'Secondary Button', value: theme.colors.buttonSecondary },
        { key: 'buttonHover', label: 'Button Hover', value: theme.colors.buttonHover },
        { key: 'borderPrimary', label: 'Primary Border', value: theme.colors.borderPrimary },
        { key: 'borderSecondary', label: 'Secondary Border', value: theme.colors.borderSecondary },
      ] as Array<{ key: keyof ThemeColors; label: string; value: string }>,
    },
    furniture: {
      title: 'Furniture & Brand',
      description: 'Brand-specific colors for furniture categories and states',
      colors: [
        { key: 'brandPrimary', label: 'Brand Primary', value: theme.colors.brandPrimary },
        { key: 'brandSecondary', label: 'Brand Secondary', value: theme.colors.brandSecondary },
        { key: 'brandDark', label: 'Brand Dark', value: theme.colors.brandDark },
        { key: 'accentWarm', label: 'Warm Accent (Wood)', value: theme.colors.accentWarm },
        { key: 'accentCool', label: 'Cool Accent', value: theme.colors.accentCool },
        { key: 'stateSuccess', label: 'Success/Stock', value: theme.colors.stateSuccess },
        { key: 'stateWarning', label: 'Warning/Low Stock', value: theme.colors.stateWarning },
      ] as Array<{ key: keyof ThemeColors; label: string; value: string }>,
    },
  };

  const currentGroup = colorGroups[activeSection];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold mb-2" style={{ color: theme.colors.textPrimary }}>
          Theme & Colors
        </h2>
        <p className="text-base" style={{ color: theme.colors.textSecondary }}>
          Centralized control for all site colors. Changes apply immediately across the entire site.
        </p>
      </div>

      {/* Theme Mode Toggle */}
      <div
        className="p-6 rounded-creative border-2"
        style={{
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.borderPrimary,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1" style={{ color: theme.colors.textPrimary }}>
              Theme Mode
            </h3>
            <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
              Switch between dark and light themes
            </p>
          </div>
          <button
            onClick={toggleMode}
            className="px-6 py-3 rounded-creative font-bold uppercase tracking-wider transition-all hover:scale-105"
            style={{
              backgroundColor: theme.colors.buttonPrimary,
              color: '#FFFFFF',
            }}
          >
            Switch to {theme.mode === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        </div>
      </div>

      {/* Color Groups Navigation */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(colorGroups).map(([key, group]) => (
          <button
            key={key}
            onClick={() => setActiveSection(key as any)}
            className={`px-4 py-2 rounded-creative font-semibold transition-all ${activeSection === key ? 'border-2' : 'border-2 border-transparent'
              }`}
            style={{
              backgroundColor: activeSection === key ? theme.colors.cardBackground : 'transparent',
              borderColor: activeSection === key ? theme.colors.borderPrimary : 'transparent',
              color: activeSection === key ? theme.colors.textPrimary : theme.colors.textSecondary,
            }}
          >
            {group.title}
          </button>
        ))}
      </div>

      {/* Current Color Group */}
      <div
        className="p-6 rounded-creative border-2"
        style={{
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.borderPrimary,
        }}
      >
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-1" style={{ color: theme.colors.textPrimary }}>
            {currentGroup.title}
          </h3>
          <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
            {currentGroup.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentGroup.colors.map((color) => (
            <div key={color.key} className="space-y-2">
              <label
                className="block text-sm font-semibold"
                style={{ color: theme.colors.textPrimary }}
              >
                {color.label}
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={color.value}
                  onChange={(e) => handleColorChange(color.key, e.target.value)}
                  className="w-16 h-10 rounded-creative border-2 cursor-pointer"
                  style={{ borderColor: theme.colors.borderPrimary }}
                  aria-label={`Color picker for ${color.label}`}
                  title={`Select color for ${color.label}`}
                />
                <input
                  type="text"
                  value={color.value}
                  onChange={(e) => handleColorChange(color.key, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-creative border-2 font-mono text-sm"
                  style={{
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderColor: theme.colors.borderPrimary,
                    color: theme.colors.textPrimary,
                  }}
                  placeholder="#000000"
                />
              </div>
              <div
                className="h-12 rounded-creative border-2 flex items-center justify-center"
                style={{
                  backgroundColor: color.value,
                  borderColor: theme.colors.borderPrimary,
                }}
              >
                <span
                  className="text-xs font-bold px-2 py-1 rounded"
                  style={{
                    color: color.value,
                    backgroundColor: theme.colors.cardBackground,
                  }}
                >
                  Preview
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-end">
        <button
          onClick={handleReset}
          className="px-6 py-3 rounded-creative font-bold uppercase tracking-wider transition-all hover:scale-105 border-2"
          style={{
            backgroundColor: theme.colors.backgroundSecondary,
            borderColor: theme.colors.borderPrimary,
            color: theme.colors.textPrimary,
          }}
        >
          Reset to Defaults
        </button>
      </div>

      {/* Preview Section */}
      <div
        className="p-6 rounded-creative border-2"
        style={{
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.borderPrimary,
        }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
          Live Preview
        </h3>
        <div className="space-y-4">
          <div
            className="p-4 rounded-creative border-2"
            style={{
              backgroundColor: theme.colors.backgroundPrimary,
              borderColor: theme.colors.borderPrimary,
            }}
          >
            <p style={{ color: theme.colors.textPrimary }} className="font-bold mb-2">
              Primary Background with Primary Text
            </p>
            <p style={{ color: theme.colors.textSecondary }} className="text-sm mb-2">
              Secondary text color preview
            </p>
            <p style={{ color: theme.colors.textTertiary }} className="text-xs">
              Tertiary text color preview
            </p>
          </div>
          <button
            className="px-6 py-3 rounded-creative font-bold uppercase tracking-wider transition-all hover:scale-105"
            style={{
              backgroundColor: theme.colors.buttonPrimary,
              color: '#FFFFFF',
            }}
          >
            Primary Button
          </button>
          <button
            className="px-6 py-3 rounded-creative font-bold uppercase tracking-wider transition-all hover:scale-105 border-2"
            style={{
              backgroundColor: 'transparent',
              borderColor: theme.colors.borderPrimary,
              color: theme.colors.textPrimary,
            }}
          >
            Secondary Button
          </button>
        </div>
      </div>
    </div>
  );
};

