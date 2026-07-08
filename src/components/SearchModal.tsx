'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fetch products when modal opens
  useEffect(() => {
    if (isOpen && !hasFetched) {
      setLoading(true);
      fetch('/api/products')
        .then(res => res.json())
        .then((data: Product[]) => {
          setAllProducts(data);
          setHasFetched(true);
        })
        .catch(err => console.error('Error fetching products for search:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, hasFetched]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Filter products based on query
  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim().length === 0) {
      setResults([]);
      return;
    }
    const normalizedQuery = searchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const filtered = allProducts.filter(product => {
      const normalizedName = product.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const normalizedCategory = product.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return normalizedName.includes(normalizedQuery) || normalizedCategory.includes(normalizedQuery);
    });
    setResults(filtered);
  }, [allProducts]);

  const handleProductClick = (product: Product) => {
    onClose();
    // Navigate to products page — in the future could go to product detail
    router.push('/products');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 mt-20 md:mt-32 bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideDown">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-outline-variant/20">
          <span className="material-symbols-outlined text-secondary text-2xl">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar joias, anéis, brincos..."
            className="flex-1 bg-transparent outline-none font-body-lg text-body-lg text-on-surface placeholder:text-on-surface-variant/50"
          />
          {query.length > 0 && (
            <button
              onClick={() => handleSearch('')}
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 px-3 py-1 text-xs font-semibold text-on-surface-variant bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-on-surface-variant font-body-md">Carregando...</span>
            </div>
          )}

          {!loading && query.length === 0 && (
            <div className="px-6 py-8 text-center">
              <span className="material-symbols-outlined text-4xl text-secondary/40 mb-3 block">diamond</span>
              <p className="text-on-surface-variant font-body-md">
                Digite para buscar entre nossas joias exclusivas
              </p>
              {/* Quick categories */}
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                {['Anéis', 'Brincos', 'Colares', 'Pulseiras', 'Personalizados'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleSearch(cat)}
                    className="px-4 py-2 rounded-full border border-outline-variant/30 text-sm text-on-surface-variant hover:border-primary hover:text-primary transition-all"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && query.length > 0 && results.length === 0 && (
            <div className="px-6 py-12 text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3 block">search_off</span>
              <p className="text-on-surface-variant font-body-md">
                Nenhum resultado para &ldquo;<span className="text-primary font-semibold">{query}</span>&rdquo;
              </p>
              <p className="text-on-surface-variant/60 text-sm mt-2">
                Tente buscar por outro termo ou categoria
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div>
              <div className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-secondary border-b border-outline-variant/10">
                {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
              </div>
              <ul>
                {results.map(product => (
                  <li key={product.id}>
                    <button
                      onClick={() => handleProductClick(product)}
                      className="w-full flex items-center gap-4 px-6 py-4 hover:bg-surface-container-low transition-colors text-left group"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-container flex-shrink-0 border border-outline-variant/10">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=100&auto=format&fit=crop';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-headline-md text-sm text-on-surface truncate group-hover:text-primary transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-xs text-on-surface-variant mt-0.5">{product.category}</p>
                      </div>
                      <span className="font-label-md text-sm text-secondary flex-shrink-0">
                        {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <span className="material-symbols-outlined text-on-surface-variant/30 group-hover:text-primary transition-colors text-lg">
                        arrow_forward
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
