import React, { useState, useEffect } from 'react';
import {
    Briefcase,
    ChevronDown,
    Gift,
    Info,
    Menu,
    Phone,
    ShoppingBag,
    Wine,
    X,
} from 'lucide-react';

interface NavbarProps {
    pathname?: string;
}

const Navbar = ({ pathname = '/' }: NavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [expandedLinks, setExpandedLinks] = useState<Record<string, boolean>>({});

    const isHome = pathname === '/';

    const toggleExpanded = (name: string) => {
        setExpandedLinks(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Hasiera', href: '/', icon: Wine },
        {
            name: 'Produktuak',
            href: '/produktuak',
            icon: ShoppingBag,
            children: [
                {
                    name: 'Edariak',
                    items: [
                        {
                            name: 'Ardoak',
                            href: '/produktuak#ardoak',
                            subItems: [
                                { name: 'Gorriak', href: '/produktuak#ardoak-gorriak' },
                                { name: 'Txuriak', href: '/produktuak#ardoak-txuriak' },
                                { name: 'Urtekoak', href: '/produktuak#ardoak-urtekoak' },
                            ],
                        },
                        { name: 'Cava', href: '/produktuak#cava' },
                        { name: 'Garagardoak', href: '/produktuak#garagardoak' },
                        { name: 'Sagardoak', href: '/produktuak#sagardoak' },
                        { name: 'Txakolinak', href: '/produktuak#txakolinak' },
                        { name: 'Xanpainak', href: '/produktuak#xanpainak' },
                        { name: 'Freskagarriak', href: '/produktuak#freskagarriak' },
                        { name: 'Likoreak', href: '/produktuak#likoreak' },
                        { name: 'Urak', href: '/produktuak#urak' },
                    ],
                },
                {
                    name: 'Elikagaiak',
                    items: [
                        { name: 'Esneak', href: '/produktuak#esneak' },
                        { name: 'Kontserbak', href: '/produktuak#kontserbak' },
                    ],
                },
            ],
        },
        { name: 'Gabonetako Katalogoa', href: '/gabonetako-katalogoa', icon: Gift },
        { name: 'Zerbitzuak', href: '/zerbitzuak', icon: Briefcase },
        { name: 'Nor Gara', href: '/nor-gara', icon: Info },
    ];

    const useDarkStyle = isScrolled || !isHome;

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <a href="/" className="flex items-center">
                            <img
                                src="/images/bordalogo.png"
                                alt="Borda Ardoak Logo"
                                className="h-12 w-auto transition-all"
                            />
                        </a>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => {
                            const hasChildren = Boolean(link.children?.length);
                            const showDropdown = hasChildren;
                            return (
                                <div key={link.name} className="relative group">
                                    <a
                                        href={link.href}
                                        className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                                            useDarkStyle
                                                ? 'text-[#1A1A1A] hover:text-[#722F37] hover:bg-[#722F37]/10'
                                                : 'text-white hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        {link.name}
                                    </a>
                                    {showDropdown && (
                                        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                                            <div className="w-[520px] rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 border border-white/70 p-6 flex gap-6">
                                                {link.children?.map((section) => (
                                                    <div key={section.name} className="flex-1 min-w-[200px]">
                                                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#722F37] mb-3">
                                                            {section.name}
                                                        </p>
                                                        <div className="space-y-2">
                                                            {section.items?.map((item) => (
                                                                <div key={item.name} className="group/item">
                                                                    <a
                                                                        href={item.href}
                                                                        className="flex items-start justify-between gap-2 rounded-xl px-3 py-2 text-sm text-[#1A1A1A] hover:bg-[#722F37]/8 hover:text-[#722F37] transition-colors"
                                                                    >
                                                                        <span>{item.name}</span>
                                                                    </a>
                                                                    {item.subItems && (
                                                                        <div className="pl-3 pt-1 flex flex-wrap gap-2">
                                                                            {item.subItems.map((sub) => (
                                                                                <a
                                                                                    key={sub.name}
                                                                                    href={sub.href}
                                                                                    className="text-xs rounded-full bg-gray-100 px-3 py-1 text-[#4B4B4B] hover:bg-[#722F37]/10 hover:text-[#722F37] transition-colors"
                                                                                >
                                                                                    {sub.name}
                                                                                </a>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <a
                            href="/kontaktua"
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all transform hover:scale-105 active:scale-95 ${useDarkStyle
                                ? 'bg-[#722F37] text-white shadow-lg hover:bg-[#8B2323]'
                                : 'bg-white text-[#722F37] shadow-xl hover:bg-gray-100'
                                }`}
                        >
                            Kontaktua
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 rounded-md ${useDarkStyle ? 'text-[#1A1A1A]' : 'text-white'}`}
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-2xl animate-in slide-in-from-top duration-300 max-h-[85vh] overflow-y-auto">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <div key={link.name} className="border-b border-gray-50 last:border-0">
                                <div className="flex items-center justify-between px-3 py-4">
                                    <a
                                        href={link.href}
                                        className="flex items-center space-x-3 text-base font-medium text-[#1A1A1A] hover:text-[#722F37] transition-colors flex-grow"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.icon && <link.icon className="h-5 w-5 text-[#722F37]" />}
                                        <span>{link.name}</span>
                                    </a>
                                    {link.children && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleExpanded(link.name);
                                            }}
                                            className={`p-2 rounded-lg transition-all ${
                                                expandedLinks[link.name] 
                                                    ? 'bg-[#722F37]/10 text-[#722F37] rotate-180' 
                                                    : 'text-gray-400'
                                            }`}
                                        >
                                            <ChevronDown className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                                {link.children && expandedLinks[link.name] && (
                                    <div className="pl-6 space-y-4 pb-4">
                                        {link.children.map((section) => (
                                            <div key={section.name} className="space-y-2">
                                                <div 
                                                    className="flex items-center justify-between pr-3 py-1 cursor-pointer"
                                                    onClick={() => toggleExpanded(section.name)}
                                                >
                                                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#722F37]/80">
                                                        {section.name}
                                                    </p>
                                                    <ChevronDown className={`h-4 w-4 text-[#722F37]/40 transition-transform duration-200 ${expandedLinks[section.name] ? 'rotate-180' : ''}`} />
                                                </div>
                                                
                                                {expandedLinks[section.name] && (
                                                    <div className="space-y-1">
                                                        {section.items?.map((item) => (
                                                            <div key={item.name} className="pl-2">
                                                                <div className="flex items-center justify-between pr-3">
                                                                    <a
                                                                        href={item.href}
                                                                        className="block px-3 py-2 text-sm text-[#4B4B4B] hover:text-[#722F37] font-medium"
                                                                        onClick={() => setIsOpen(false)}
                                                                    >
                                                                        {item.name}
                                                                    </a>
                                                                    {item.subItems && (
                                                                        <button 
                                                                            onClick={() => toggleExpanded(item.name)}
                                                                            className={`p-2 transition-transform duration-200 ${expandedLinks[item.name] ? 'rotate-180' : ''}`}
                                                                        >
                                                                            <ChevronDown className="h-4 w-4 text-gray-300" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                
                                                                {item.subItems && expandedLinks[item.name] && (
                                                                    <div className="pl-4 pb-2 flex flex-wrap gap-2">
                                                                        {item.subItems.map((sub) => (
                                                                            <a
                                                                                key={sub.name}
                                                                                href={sub.href}
                                                                                className="text-[11px] rounded-full bg-gray-50 px-3 py-1.5 text-[#666] hover:bg-[#722F37]/10 hover:text-[#722F37] border border-gray-100 transition-colors"
                                                                                onClick={() => setIsOpen(false)}
                                                                            >
                                                                                {sub.name}
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className="pt-4 px-3">
                            <a
                                href="/kontaktua"
                                className="block w-full text-center px-4 py-4 bg-[#722F37] text-white rounded-2xl font-bold shadow-lg shadow-[#722F37]/20"
                                onClick={() => setIsOpen(false)}
                            >
                                Kontaktua
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
