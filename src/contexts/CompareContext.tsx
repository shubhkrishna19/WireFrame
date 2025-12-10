import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../data/mockData';
import { useToast } from '../components/Toast';

interface CompareContextType {
    compareList: Product[];
    addToCompare: (product: Product) => void;
    removeFromCompare: (productId: string) => void;
    isInCompare: (productId: string) => boolean;
    clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [compareList, setCompareList] = useState<Product[]>([]);
    const { success, error, info } = useToast();

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('bluewud_compare');
        if (saved) {
            try {
                setCompareList(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse compare list', e);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('bluewud_compare', JSON.stringify(compareList));
    }, [compareList]);

    const addToCompare = (product: Product) => {
        if (compareList.length >= 4) {
            error('You can compare up to 4 products only');
            return;
        }
        if (compareList.some(p => p._id === product._id)) {
            info('Product already in comparison list');
            return;
        }
        setCompareList(prev => [...prev, product]);
        success(`${product.name} added to comparison`);
    };

    const removeFromCompare = (productId: string) => {
        setCompareList(prev => prev.filter(p => p._id !== productId));
        info('Product removed from comparison');
    };

    const isInCompare = (productId: string) => {
        return compareList.some(p => p._id === productId);
    };

    const clearCompare = () => {
        setCompareList([]);
        info('Comparison list cleared');
    };

    return (
        <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, isInCompare, clearCompare }}>
            {children}
        </CompareContext.Provider>
    );
};

export const useCompare = () => {
    const context = useContext(CompareContext);
    if (context === undefined) {
        throw new Error('useCompare must be used within a CompareProvider');
    }
    return context;
};
