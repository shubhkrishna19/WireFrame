import React from 'react';

export const Testimonials: React.FC = () => {
    const testimonials = [
        {
            name: 'Priya Sharma',
            location: 'Mumbai',
            avatar: 'https://i.pravatar.cc/60?img=33',
            review: 'The Maltein wardrobe exceeded my expectations! It has perfect storage space and the brown maple finish looks premium. Assembly was surprisingly easy.',
            product: 'Maltein 3-Door Wardrobe'
        },
        {
            name: 'Rajesh Kumar',
            location: 'Bangalore',
            avatar: 'https://i.pravatar.cc/60?img=14',
            review: 'Bluewud Primax TV unit transformed my living room. The wenge finish is gorgeous and it holds my 55" TV perfectly. Highly recommend!',
            product: 'Primax TV Unit'
        },
        {
            name: 'Anjali Mehta',
            location: 'Delhi',
            avatar: 'https://i.pravatar.cc/60?img=47',
            review: 'Finally found a study table that fits my small apartment! The Mallium design is sleek, functional, and quality is top-notch. Worth every rupee.',
            product: 'Mallium Study Table'
        }
    ];

    return (
        <section className="py-20 bg-neutral-950 text-neutral-100">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center mb-12">What Our Customers Say</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t) => (
                        <div key={t.name} className="bg-neutral-900/70 rounded-lg p-6 shadow-lg backdrop-blur-sm flex flex-col items-center text-center border border-neutral-800 hover:border-neutral-700 transition-colors">
                            <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-4 border-2 border-blue-500/30" />
                            <p className="italic mb-4 text-neutral-300">"{t.review}"</p>
                            <span className="font-semibold text-neutral-100">- {t.name}</span>
                            <span className="text-xs text-neutral-400 mt-1">{t.location}</span>
                            <span className="text-xs text-blue-400 mt-2 font-medium">{t.product}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
