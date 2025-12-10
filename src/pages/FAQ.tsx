import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const FAQ: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen p-8">
        <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
        <p>FAQ content coming soon...</p>
      </div>
      <Footer />
    </>
  );
};
