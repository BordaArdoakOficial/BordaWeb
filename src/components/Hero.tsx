import React from 'react';
import { ArrowRight, Users } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background with AI Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/hero/vineyard.png"
                    alt="Zarautz Vineyard"
                    className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#FDFCFB]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white pt-20">
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#722F37] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#722F37]"></span>
                    </span>
                    <span className="text-xs font-semibold tracking-wider uppercase">Zarautzeko Hosteleritza Zerbitzuak</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    Kalitatea, <span className="font-light italic text-white/90">Tradizioa</span> <br /> eta Arreta Bakarra.
                </h1>

                <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/80 mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                    Borda Ardoak-en ardo eta gourmet produktuen aukeraketarik onena eskaintzen dizugu, Zarautzen bihotzetik zure mahaira.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
                    <a
                        href="/produktuak"
                        className="group px-8 py-4 bg-[#722F37] hover:bg-[#8B2323] text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-2xl flex items-center"
                    >
                        Ikusi Produktuak
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </a>
                    <a
                        href="/nor-gara"
                        className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-full font-bold text-lg transition-all flex items-center"
                    >
                        Nor Gara
                        <div className="ml-3 p-1.5 bg-white text-[#722F37] rounded-full">
                            <Users className="h-4 w-4" />
                        </div>
                    </a>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 animate-bounce opacity-50">
                <span className="text-[10px] uppercase tracking-widest font-bold text-white">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
            </div>
        </section>
    );
};

export default Hero;
