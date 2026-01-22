import React, { useState, useMemo } from 'react';
import { 
  Wine, 
  Beer, 
  Waves, 
  Fish, 
  ChevronRight, 
  Filter, 
  Search,
  Grid,
  List as ListIcon,
  Milk,
  Apple,
  Droplets,
  GlassWater,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';

interface Product {
  id: string;
  data: {
    name: string;
    category: string;
    price: number;
    image: string;
    description: string;
    type?: string; // e.g., 'red', 'white', 'rosé' for wines
  }
}

interface ProductExplorerProps {
  initialProducts: Product[];
}

const ProductExplorer = ({ initialProducts }: ProductExplorerProps) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { id: 'all', label: 'Guztiak', icon: Grid, count: initialProducts.length },
    { id: 'ardoak', label: 'Ardoak', icon: Wine, count: initialProducts.filter(p => p.data.category.toLowerCase().includes('ardo')).length },
    { id: 'txakolinak', label: 'Txakolinak', icon: Waves, count: initialProducts.filter(p => p.data.category.toLowerCase().includes('txakoli')).length },
    { id: 'garagardoak', label: 'Garagardoak', icon: Beer, count: initialProducts.filter(p => p.data.category.toLowerCase().includes('garagardo')).length },
    { id: 'sagardoak', label: 'Sagardoak', icon: Apple, count: initialProducts.filter(p => p.data.category.toLowerCase().includes('sagardo')).length },
    { id: 'xanpainak', label: 'Xanpainak', icon: Sparkles, count: initialProducts.filter(p => p.data.category.toLowerCase().includes('xanpain')).length },
    { id: 'cava', label: 'Cava', icon: Sparkles, count: initialProducts.filter(p => p.data.category.toLowerCase().includes('cava')).length },
    { id: 'likoreak', label: 'Likoreak', icon: GlassWater, count: initialProducts.filter(p => p.data.category.toLowerCase().includes('likore')).length },
    { id: 'freskagarriak', label: 'Freskagarriak', icon: Zap, count: initialProducts.filter(p => p.data.category.toLowerCase().includes('freskagarri')).length },
    { id: 'urak', label: 'Urak', icon: Droplets, count: initialProducts.filter(p => p.data.category.toLowerCase().includes('ura')).length },
    { id: 'esneak', label: 'Esneak', icon: Milk, count: initialProducts.filter(p => p.data.category.toLowerCase().includes('esne')).length },
    { id: 'kontserbak', label: 'Kontserbak', icon: Fish, count: initialProducts.filter(p => p.data.category.toLowerCase().includes('konserba')).length },
  ];

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const prodCat = product.data.category.toLowerCase();
      const matchesSearch = product.data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.data.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prodCat.includes(searchQuery.toLowerCase());
      
      let matchesCategory = false;
      if (activeCategory === 'all') {
        matchesCategory = true;
      } else if (activeCategory === 'urak') {
        matchesCategory = prodCat.includes('ura');
      } else {
        // Para el resto usamos el ID que coincide con la raíz de la palabra
        matchesCategory = prodCat.includes(activeCategory.replace('ak', '').replace('ek', '').toLowerCase());
      }
      
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, initialProducts]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8">
      {/* Sidebar - Filtros Sticky estilo Amazon/Booking */}
      <aside className="lg:col-span-3 xl:col-span-2 space-y-6 lg:sticky lg:top-28 h-fit">
        {/* Categorías Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm overflow-hidden relative">
          <div className="flex items-center gap-2 mb-4 px-1">
            <Filter size={16} className="text-[#722F37]" />
            <h3 className="font-bold text-[#1A1A1A] tracking-tight uppercase text-xs">Kategoriak</h3>
          </div>

          <nav className="space-y-0.5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-300 group ${
                    isActive 
                      ? 'bg-[#722F37] text-white shadow-md translate-x-1' 
                      : 'hover:bg-gray-50 text-gray-600 hover:text-[#1A1A1A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#722F37]'} />
                    <span className="font-bold text-xs tracking-wide">{cat.label}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Decoración lateral en el card */}
          <div className="absolute top-0 right-0 w-1 h-full bg-[#722F37]/10"></div>
        </div>

        {/* Banner informativo compacto */}
        <div className="bg-[#1A1A1A] rounded-2xl p-6 text-white relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-2xl transition-transform duration-700 group-hover:scale-150"></div>
          <p className="text-[#722F37] font-bold text-[10px] uppercase tracking-widest mb-1">Laguntza?</p>
          <h4 className="font-bold text-sm mb-3">Ez duzu aurkitzen?</h4>
          <a href="/kontaktua" className="text-xs font-bold border-b border-[#722F37] pb-0.5 hover:text-[#722F37] transition-colors inline-block">
            Deitu iezaguzu →
          </a>
        </div>
      </aside>

      {/* Grid de Productos estilo Amazon/Booking */}
      <div className="lg:col-span-9 xl:col-span-10 space-y-6">
        {/* Header del Grid compacto con Buscador 50/50 */}
        <div className="flex flex-col md:flex-row items-center bg-white p-2 rounded-2xl border border-gray-100 shadow-sm gap-4">
          {/* Lado Izquierdo: Buscador */}
          <div className="w-full md:w-1/2 relative group">
            <input
              type="text"
              placeholder="Bilatu produktuak..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#722F37]/10 focus:border-[#722F37]/30 outline-none transition-all placeholder:text-gray-400 text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#722F37] transition-colors" size={16} />
          </div>

          {/* Lado Derecho: Info y Vistas */}
          <div className="w-full md:w-1/2 flex items-center justify-between pl-4">
            <div className="text-sm text-gray-500 font-medium">
              Mostrando <span className="text-[#722F37] font-bold">{filteredProducts.length}</span> produktu
            </div>
            
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl">
               <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#722F37]' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 <Grid size={18} />
               </button>
               <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#722F37]' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 <ListIcon size={18} />
               </button>
            </div>
          </div>
        </div>

        {/* Grid animado con imágenes más pequeñas */}
        {filteredProducts.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
            : "flex flex-col gap-4"
          }>
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className={`group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 ${
                  viewMode === 'list' ? 'flex flex-row items-center gap-4 p-3' : 'p-3'
                }`}
              >
                <div className={`relative overflow-hidden bg-gray-50 rounded-xl ${
                  viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'aspect-square mb-3'
                }`}>
                  <img
                    src={product.data.image}
                    alt={product.data.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <div className={`flex flex-col ${viewMode === 'list' ? 'flex-1' : 'px-2 pb-2'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#722F37] bg-[#722F37]/5 px-2 py-0.5 rounded-md">
                      {product.data.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-[#1A1A1A] group-hover:text-[#722F37] transition-colors mb-2">
                    {product.data.name}
                  </h3>
                  
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed italic">
                    {product.data.description}
                  </p>
                  
                  <div className="flex justify-between items-center mt-auto">
                    <div>
                      <span className="text-xs text-gray-400 block uppercase font-bold tracking-widest">Prezioa</span>
                      <span className="text-xl font-black text-[#1A1A1A]">
                        {product.data.price}€
                      </span>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-3 bg-[#722F37] text-white rounded-xl hover:bg-[#5a252c] transition-all transform active:scale-95 font-bold text-sm shadow-lg shadow-[#722F37]/20">
                      Gehitu
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] py-24 px-6 text-center border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-gray-300" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">Ez da produkturik aurkitu</h3>
            <p className="text-gray-500">Saiatu beste kategoria baten edo bilaketa zehatzago batekin.</p>
            <button 
              onClick={() => {setActiveCategory('all'); setSearchQuery('');}}
              className="mt-8 px-8 py-3 bg-[#1A1A1A] text-white rounded-full font-bold hover:bg-black transition-all"
            >
              Filtroak Garbitu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductExplorer;
