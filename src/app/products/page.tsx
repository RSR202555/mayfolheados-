'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export default function ProductsPage() {
  const [scrolled, setScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { addToCart, openCart, cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    fetchProducts();

    // Simple Fade In Observer
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, observerOptions);

    if (!loading) {
      const cards = document.querySelectorAll('.product-card');
      cards.forEach(card => observer.observe(card));
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading]);

  const categories = ['Todos', 'Anéis', 'Personalizados', 'Brincos', 'Pulseiras', 'Braceletes', 'Correntes', 'Novidades'];

  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'Todos') return true;
    if (selectedCategory === 'Novidades') return product.isNew;
    return product.category === selectedCategory;
  });

  return (
    <div data-theme="warm" className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <nav className={`fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop bg-surface/80 backdrop-blur-md border-b border-outline-variant/10 transition-all duration-300 ${scrolled ? 'h-16 shadow-sm' : 'h-20'}`}>
        <div className="flex items-center gap-6">
          <span className="material-symbols-outlined text-primary cursor-pointer active:scale-95 transition-transform" data-icon="menu">menu</span>
          <div className="hidden md:flex gap-8">
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-md text-label-md" href="/products">Anéis</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-md text-label-md" href="/products">Personalizados</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-md text-label-md" href="/products">Brincos</Link>
          </div>
        </div>
        <Link href="/" className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary tracking-tighter absolute left-1/2 -translate-x-1/2 hover:opacity-85 transition-opacity flex items-center gap-2 md:gap-3 whitespace-nowrap">
          <img src="/logo_rosa_may.png" alt="MAY'S Logo" className={`rounded-full object-cover border border-secondary/20 transition-all duration-300 ${scrolled ? 'h-11 w-11' : 'h-14 w-14 md:h-16 md:w-16'}`} />
          <span className="hidden sm:block">MAY'S Joias & Acessórios</span>
          <span className="sm:hidden">MAY'S</span>
        </Link>
        <div className="flex items-center gap-3 md:gap-6">
          <a href="https://www.instagram.com/mays_folheados/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary transition-colors active:scale-95 transition-transform duration-300 flex items-center justify-center" title="Instagram">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a href="https://wa.me/5575982227063" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary transition-colors active:scale-95 transition-transform duration-300 flex items-center justify-center" title="WhatsApp">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.01-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132(3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
            </svg>
          </a>
          <span className="material-symbols-outlined text-primary cursor-pointer active:scale-95 transition-transform hidden md:block" data-icon="search">search</span>
          <div onClick={openCart} className="flex items-center gap-4 cursor-pointer active:scale-95 transition-transform text-primary relative">
            <span className="material-symbols-outlined">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold font-sans">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-section-gap flex-grow">
        {/* Hero Title Section */}
        <header className="px-margin-mobile md:px-margin-desktop mb-16 fade-in">
          <div className="max-w-container-max mx-auto border-b border-primary/10 pb-12">
            <span className="text-secondary font-label-md text-label-md uppercase tracking-widest block mb-4">Coleção Exclusiva</span>
            <h2 className="font-display-lg text-display-lg md:text-display-lg text-on-surface mb-6">Folheados de Luxo</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Peças banhadas a ouro com acabamento artesanal, pensadas para mulheres que buscam elegância nos detalhes mais sutis.</p>
          </div>
        </header>

        {/* Catalog Controls */}
        <section className="px-margin-mobile md:px-margin-desktop mb-12 flex flex-col md:flex-row justify-between items-center gap-6 max-w-container-max mx-auto">
          <div className="flex gap-4 overflow-x-auto w-full md:w-auto no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-all ${selectedCategory === category ? 'bg-primary text-on-primary shadow-sm' : 'border border-outline text-on-surface-variant hover:border-primary hover:text-primary'}`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-8 self-end md:self-auto">
            <div className="flex items-center gap-2 cursor-pointer group">
              <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-primary">Filtrar</span>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary" data-icon="tune">tune</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer group">
              <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-primary">Ordenar</span>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary" data-icon="expand_more">expand_more</span>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          {loading ? (
            <p className="text-center py-12 text-on-surface-variant">Carregando boutique...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center py-12 text-on-surface-variant">Nenhum produto encontrado nesta categoria.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
              {filteredProducts.map((product, index) => (
                <div key={product.id} className="product-card group cursor-pointer fade-in flex flex-col justify-between" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                  <div>
                    <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-low rounded-xl mb-6 luxury-shadow">
                      <img 
                        alt={product.name} 
                        className="product-image w-full h-full object-cover transition-transform duration-700" 
                        src={product.image} 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop';
                        }}
                      />
                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="p-2 bg-surface-bright rounded-full shadow-md hover:bg-primary-fixed transition-colors">
                          <span className="material-symbols-outlined text-primary text-[20px]" data-icon="favorite">favorite</span>
                        </button>
                      </div>
                    </div>
                    <div className="text-center px-2">
                      <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{product.name}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-3 tracking-wide">
                        {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                      <div className="flex justify-center gap-2 mb-1">
                        {product.isNew && (
                          <span className="inline-block px-3 py-1 bg-tertiary-container text-on-tertiary-container text-[10px] font-semibold uppercase tracking-widest rounded-full">New In</span>
                        )}
                        {product.isBestSeller && (
                          <span className="inline-block px-3 py-1 bg-primary-fixed text-on-primary-fixed text-[10px] font-semibold uppercase tracking-widest rounded-full">Best Seller</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="px-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="mt-4 w-full py-3 bg-primary text-white hover:bg-secondary rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-sm"
                    >
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        <section className="mt-20 flex justify-center items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline text-on-surface-variant hover:bg-primary hover:text-white transition-all">1</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline text-on-surface-variant hover:bg-primary hover:text-white transition-all">2</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline text-on-surface-variant hover:bg-primary hover:text-white transition-all">3</button>
          <span className="material-symbols-outlined text-primary cursor-pointer" data-icon="chevron_right">chevron_right</span>
        </section>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center py-3 px-4 md:hidden bg-surface/90 backdrop-blur-lg border-t border-outline-variant/30 shadow-[0_-4px_20px_rgba(112,88,91,0.05)] rounded-t-2xl">
        <div className="flex flex-col items-center justify-center text-on-surface-variant active:scale-95 transition-all">
          <span className="material-symbols-outlined" data-icon="grid_view">grid_view</span>
          <span className="font-label-md text-[10px] uppercase">Boutique</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant active:scale-95 transition-all">
          <span className="material-symbols-outlined" data-icon="search">search</span>
          <span className="font-label-md text-[10px] uppercase">Search</span>
        </div>
        <div onClick={openCart} className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-full px-5 py-2 active:scale-95 transition-all cursor-pointer relative">
          <span className="material-symbols-outlined" data-icon="favorite">shopping_bag</span>
          <span className="font-label-md text-[10px] uppercase">Carrinho</span>
          {cartCount > 0 && (
            <span className="absolute top-1 right-2 bg-secondary text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold font-sans">
              {cartCount}
            </span>
          )}
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant active:scale-95 transition-all">
          <span className="material-symbols-outlined" data-icon="person">person</span>
          <span className="font-label-md text-[10px] uppercase">Profile</span>
        </div>
      </nav>

      {/* Footer */}
      <footer className="w-full py-section-gap px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter bg-surface-container-high border-t border-primary/5">
        <div>
          <h4 className="font-headline-lg text-headline-lg text-primary mb-6">MAY'S Joias & Acessórios</h4>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">Transformando momentos em eternidade através de joias folheadas com alma e design exclusivo.</p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/mays_folheados/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary luxury-shadow hover:scale-110 transition-transform" title="Instagram">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://wa.me/5575982227063" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary luxury-shadow hover:scale-110 transition-transform" title="WhatsApp">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.01-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132(3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
              </svg>
            </a>
          </div>
        </div>
        <div>
          <h5 className="font-label-md text-label-md text-on-surface font-semibold mb-6 uppercase tracking-widest">Collections</h5>
          <ul className="flex flex-col gap-4">
            <li><a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#">Essential Rings</a></li>
            <li><a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#">Classic Hoops</a></li>
            <li><a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#">Statement Necklaces</a></li>
            <li><a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#">Bridal Edit</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-label-md text-label-md text-on-surface font-semibold mb-6 uppercase tracking-widest">Experience</h5>
          <ul className="flex flex-col gap-4">
            <li><Link className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="/products">Novidades</Link></li>
            <li><a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#">Sustainability</a></li>
            <li><a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#">Care Guide</a></li>
            <li><a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#">Personal Shopping</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-label-md text-label-md text-on-surface font-semibold mb-6 uppercase tracking-widest">Newsletter</h5>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">Join our circle for exclusive updates and styling tips.</p>
          <div className="relative">
            <input className="w-full bg-transparent border-b border-primary py-2 focus:border-secondary transition-colors outline-none font-body-md text-body-md text-on-surface" placeholder="Sua joia favorita merece um par..." type="email"/>
            <button className="absolute right-0 bottom-2 text-primary hover:text-secondary transition-colors">
              <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
            </button>
          </div>
        </div>
        <div className="lg:col-span-4 pt-12 mt-12 border-t border-primary/10 text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">© 2024 MAY'S Joias & Acessórios. Handcrafted with intention.</p>
        </div>
      </footer>
    </div>
  );
}
