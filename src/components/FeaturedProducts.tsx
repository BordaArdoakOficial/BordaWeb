import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const products = [
    {
        name: 'Txakoli Egia Etxea',
        category: 'Ardoak',
        price: '12.50€',
        image: '/images/hero/vineyard.png', // Reusing for demo
    },
    {
        name: 'Mahou Bost Izar',
        category: 'Garagardoak',
        price: '1.20€',
        image: '/images/sections/products.png',
    },
    {
        name: 'Bonito del Norte Ortiz',
        category: 'Kontserbak',
        price: '8.90€',
        image: '/images/sections/products.png',
    },
];

const FeaturedProducts = () => {
    return (
        <section className="py-32 bg-[#FDFCFB]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-8 md:space-y-0">
                    <div className="max-w-xl">
                        <h2 className="text-[#722F37] text-sm font-bold uppercase tracking-[0.2em] mb-4">Gure Aukeraketa</h2>
                        <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A]">
                            Ezagutu ditugun <br /> produktu <span className="font-light italic">nabarmenduak</span>.
                        </h3>
                    </div>
                    <a href="/produktuak" className="group flex items-center space-x-2 text-[#722F37] font-bold text-lg">
                        <span>Ikusi Katalogoa</span>
                        <div className="p-2 border-2 border-[#722F37] rounded-full group-hover:bg-[#722F37] group-hover:text-white transition-all">
                            <ArrowUpRight className="h-5 w-5" />
                        </div>
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {products.map((product, idx) => (
                        <div
                            key={idx}
                            className="group relative bg-white p-4 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
                        >
                            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] mb-6">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="px-4 pb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="text-xs font-bold text-[#722F37]/60 uppercase tracking-widest">{product.category}</span>
                                        <h4 className="text-xl font-bold text-[#1A1A1A] mt-1">{product.name}</h4>
                                    </div>
                                    <span className="text-lg font-bold text-[#1A1A1A]">{product.price}</span>
                                </div>
                                <button className="mt-6 w-full py-4 bg-gray-50 text-[#1A1A1A] group-hover:bg-[#722F37] group-hover:text-white rounded-2xl font-bold transition-colors duration-300">
                                    Saskira Gehitu
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
