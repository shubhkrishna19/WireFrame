import React from 'react';

interface AnnouncementBarProps {
    message?: string;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
    message = "Bluewud Winter Sale is Live. Avail Flat Discount of 10% . Use Coupon Code \"WINTER10\". Hurry: Offer valid for limited time!!"
}) => {
    return (
        <div
            className="w-full py-2 px-4 text-center text-sm font-medium text-white"
            style={{ backgroundColor: '#1E88E5' }}
        >
            <p className="max-w-7xl mx-auto">{message}</p>
        </div>
    );
};
