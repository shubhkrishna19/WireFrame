import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';
import { usePageTracking } from '../hooks/usePageTracking';
import { SEO } from '../components/SEO';
import { pageMetadata } from '../utils/seoConfig';

const SizeGuide: React.FC = () => {
  const { theme } = useTheme();
  usePageTracking('Size Guide');

  const sizeChart = {
    seating: [
      { type: '1-Seater Sofa', width: '30-36"', depth: '30-36"', height: '30-36"' },
      { type: '2-Seater Sofa', width: '50-60"', depth: '30-36"', height: '30-36"' },
      { type: '3-Seater Sofa', width: '72-84"', depth: '30-36"', height: '30-36"' },
      { type: 'Accent Chair', width: '25-30"', depth: '28-32"', height: '32-38"' },
      { type: 'Dining Chair', width: '18-22"', depth: '20-24"', height: '36-40"' },
    ],
    storage: [
      { type: '2-Door Wardrobe', width: '30-36"', depth: '20-24"', height: '72-80"' },
      { type: '3-Door Wardrobe', width: '45-54"', depth: '20-24"', height: '72-80"' },
      { type: 'Bookshelf (Small)', width: '24-30"', depth: '12-16"', height: '36-48"' },
      { type: 'Bookshelf (Large)', width: '30-36"', depth: '12-16"', height: '60-72"' },
      { type: 'TV Unit', width: '48-72"', depth: '16-20"', height: '18-24"' },
    ],
  };

  return (
    <>
      <SEO
        title={pageMetadata.sizeGuide.title}
        description={pageMetadata.sizeGuide.description}
      />
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.backgroundPrimary} 0%, ${theme.colors.backgroundSecondary} 50%, ${theme.colors.backgroundPrimary} 100%)`,
          color: theme.colors.textPrimary,
        }}
      >
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1
            className="text-4xl font-black mb-8"
            style={{ color: theme.colors.textPrimary }}
          >
            Furniture Dimensions Guide
          </h1>

          {/* How to Measure */}
          <section className="mb-16">
            <h2
              className="text-3xl font-bold mb-6"
              style={{ color: theme.colors.textPrimary }}
            >
              How to Measure Your Space
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div
                className="border-2 rounded-creative p-6"
                style={{
                  backgroundColor: theme.colors.cardBackground,
                  borderColor: theme.colors.borderPrimary,
                }}
              >
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ color: theme.colors.textPrimary }}
                >
                  Measuring the Area
                </h3>
                <ul className="space-y-2" style={{ color: theme.colors.textSecondary }}>
                  <li><strong>Width:</strong> Measure the available floor space from side to side.</li>
                  <li><strong>Depth:</strong> Measure from the wall outwards into the room.</li>
                  <li><strong>Height:</strong> Measure from the floor to the ceiling or any overhead obstruction (windows, shelves).</li>
                </ul>
              </div>
              <div
                className="border-2 rounded-creative p-6"
                style={{
                  backgroundColor: theme.colors.cardBackground,
                  borderColor: theme.colors.borderPrimary,
                }}
              >
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ color: theme.colors.textPrimary }}
                >
                  Entryway Clearance
                </h3>
                <ul className="space-y-2" style={{ color: theme.colors.textSecondary }}>
                  <li><strong>Doorways:</strong> Measure the width and height of all doorways the furniture must pass through.</li>
                  <li><strong>Hallways:</strong> Check for tight turns or narrow corridors.</li>
                  <li><strong>Stairwells:</strong> Measure the width of the staircase and clearance height.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Size Charts */}
          <section className="mb-16">
            <h2
              className="text-3xl font-bold mb-6"
              style={{ color: theme.colors.textPrimary }}
            >
              Standard Dimensions
            </h2>

            {/* Seating Chart */}
            <div className="mb-12">
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: theme.colors.textPrimary }}
              >
                Seating
              </h3>
              <div className="overflow-x-auto">
                <table
                  className="w-full border-2 rounded-creative"
                  style={{ borderColor: theme.colors.borderPrimary }}
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: theme.colors.backgroundSecondary,
                      }}
                    >
                      <th
                        className="px-6 py-4 text-left font-bold"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        Type
                      </th>
                      <th
                        className="px-6 py-4 text-left font-bold"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        Width
                      </th>
                      <th
                        className="px-6 py-4 text-left font-bold"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        Depth
                      </th>
                      <th
                        className="px-6 py-4 text-left font-bold"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        Height
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChart.seating.map((row, index) => (
                      <tr
                        key={index}
                        className="border-t-2"
                        style={{
                          borderColor: theme.colors.borderPrimary,
                          backgroundColor: index % 2 === 0 ? theme.colors.cardBackground : theme.colors.backgroundSecondary,
                        }}
                      >
                        <td className="px-6 py-4 font-semibold" style={{ color: theme.colors.textPrimary }}>
                          {row.type}
                        </td>
                        <td className="px-6 py-4" style={{ color: theme.colors.textSecondary }}>
                          {row.width}
                        </td>
                        <td className="px-6 py-4" style={{ color: theme.colors.textSecondary }}>
                          {row.depth}
                        </td>
                        <td className="px-6 py-4" style={{ color: theme.colors.textSecondary }}>
                          {row.height}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Storage Chart */}
            <div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: theme.colors.textPrimary }}
              >
                Storage & Tables
              </h3>
              <div className="overflow-x-auto">
                <table
                  className="w-full border-2 rounded-creative"
                  style={{ borderColor: theme.colors.borderPrimary }}
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: theme.colors.backgroundSecondary,
                      }}
                    >
                      <th
                        className="px-6 py-4 text-left font-bold"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        Type
                      </th>
                      <th
                        className="px-6 py-4 text-left font-bold"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        Width
                      </th>
                      <th
                        className="px-6 py-4 text-left font-bold"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        Depth
                      </th>
                      <th
                        className="px-6 py-4 text-left font-bold"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        Height
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChart.storage.map((row, index) => (
                      <tr
                        key={index}
                        className="border-t-2"
                        style={{
                          borderColor: theme.colors.borderPrimary,
                          backgroundColor: index % 2 === 0 ? theme.colors.cardBackground : theme.colors.backgroundSecondary,
                        }}
                      >
                        <td className="px-6 py-4 font-semibold" style={{ color: theme.colors.textPrimary }}>
                          {row.type}
                        </td>
                        <td className="px-6 py-4" style={{ color: theme.colors.textSecondary }}>
                          {row.width}
                        </td>
                        <td className="px-6 py-4" style={{ color: theme.colors.textSecondary }}>
                          {row.depth}
                        </td>
                        <td className="px-6 py-4" style={{ color: theme.colors.textSecondary }}>
                          {row.height}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Space Planning Tips */}
          <section
            className="border-2 rounded-creative p-8"
            style={{
              backgroundColor: theme.colors.cardBackground,
              borderColor: theme.colors.borderPrimary,
            }}
          >
            <h2
              className="text-3xl font-bold mb-6"
              style={{ color: theme.colors.textPrimary }}
            >
              Space Planning Tips
            </h2>
            <div className="space-y-4" style={{ color: theme.colors.textSecondary }}>
              <p className="text-lg">
                <strong style={{ color: theme.colors.textPrimary }}>Traffic Flow:</strong> Allow at least 30-36 inches of walkway between furniture pieces for easy movement.
              </p>
              <p className="text-lg">
                <strong style={{ color: theme.colors.textPrimary }}>Coffee Tables:</strong> Place coffee tables 14-18 inches from the sofa for comfortable reach.
              </p>
              <p className="text-lg">
                <strong style={{ color: theme.colors.textPrimary }}>Dining Chairs:</strong> Allow 24 inches of width per person at a dining table for comfortable seating.
              </p>
              <p className="text-lg">
                <strong style={{ color: theme.colors.textPrimary }}>TV Viewing:</strong> The ideal viewing distance is 1.5 to 2.5 times the diagonal screen size of your TV.
              </p>
            </div>
          </section>

          {/* Help Section */}
          <section className="mt-12 text-center">
            <p className="mb-4" style={{ color: theme.colors.textSecondary }}>
              Need help planning your space?
            </p>
            <a
              href="/contact-us"
              className="inline-block px-8 py-4 rounded-creative font-bold uppercase tracking-wider transition-all"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                color: '#FFFFFF',
              }}
            >
              Contact Us for Assistance
            </a>
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
};

export { SizeGuide };
export default SizeGuide;

