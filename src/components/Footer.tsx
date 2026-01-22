import React from 'react';
import { Wine, Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#1A1A1A] text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center">
                            <img src="/images/bordalogo.png" alt="Borda Ardoak" className="h-10 w-auto brightness-0 invert" />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Ardoaren eta gourmet produktuen banaketan adituak Zarautzen. Kalitatea eta arretarik onena zuretzat.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Lotura Azkarrak</h4>
                        <ul className="space-y-4">
                            <li><a href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Hasiera</a></li>
                            <li><a href="/produktuak" className="text-gray-400 hover:text-white transition-colors text-sm">Produktuak</a></li>
                            <li><a href="/nor-gara" className="text-gray-400 hover:text-white transition-colors text-sm">Nor Gara</a></li>
                            <li><a href="/kontaktua" className="text-gray-400 hover:text-white transition-colors text-sm">Kontaktua</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Harremanetan Jarri</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-[#722F37] shrink-0" />
                                <span className="text-gray-400 text-sm">Zarautz, Gipuzkoa</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-[#722F37] shrink-0" />
                                <span className="text-gray-400 text-sm">+34 000 000 000</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-[#722F37] shrink-0" />
                                <span className="text-gray-400 text-sm">info@bordaardoak.eus</span>
                            </li>
                        </ul>
                    </div>

                    {/* NextGen Logo */}
                    <div className="flex items-center justify-start lg:justify-end">
                        <img 
                            src="/images/nextgen-logo.svg" 
                            alt="Plan de Recuperación, Transformación y Resiliencia" 
                            className="w-full max-w-[250px] opacity-90 hover:opacity-100 transition-opacity" 
                        />
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-gray-500 text-xs text-center md:text-left">
                        © {new Date().getFullYear()} Borda Ardoak. Eskubide guztiak erreserbatuta.
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs">Lege Oharra</a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs">Pribatutasun Politika</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
