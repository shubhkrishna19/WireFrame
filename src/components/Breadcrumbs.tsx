import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

interface BreadcrumbItem {
    label: string;
    path: string;
}

interface BreadcrumbsProps {
    items?: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    const location = useLocation();
    const { theme } = useTheme();

    // Auto-generate breadcrumbs from path if not provided
    const generateBreadcrumbs = (): BreadcrumbItem[] => {
        const paths = location.pathname.split('/').filter(Boolean);
        const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', path: '/' }];

        let currentPath = '';
        paths.forEach((path, index) => {
            currentPath += `/${path}`;

            // Format label: capitalize and replace hyphens
            const label = path
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            // Don't add the last item as it's the current page
            if (index < paths.length - 1 || items) {
                breadcrumbs.push({ label, path: currentPath });
            }
        });

        return breadcrumbs;
    };

    const breadcrumbItems = items || generateBreadcrumbs();

    if (breadcrumbItems.length <= 1) {
        return null; // Don't show breadcrumbs on home page
    }

    return (
        <nav aria-label="Breadcrumb" className="py-4">
            <ol className="flex items-center space-x-2 text-sm">
                {breadcrumbItems.map((item, index) => {
                    const isLast = index === breadcrumbItems.length - 1;

                    return (
                        <li key={item.path} className="flex items-center">
                            {index > 0 && (
                                <svg
                                    className="w-4 h-4 mx-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    style={{ color: theme.colors.textTertiary }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            )}
                            {isLast ? (
                                <span
                                    className="font-medium"
                                    style={{ color: theme.colors.textPrimary }}
                                    aria-current="page"
                                >
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    to={item.path}
                                    className="hover:underline transition-colors"
                                    style={{ color: theme.colors.textSecondary }}
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
