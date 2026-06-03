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

  const categories = ['Todos', 'Anéis', 'Colares', 'Brincos', 'Pulseiras', 'Braceletes', 'Correntes', 'Novidades'];

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
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-md text-label-md" href="/products">Colares</Link>
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
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.008 3.81.056 1 .046 1.683.21 2.222.418a4.568 4.568 0 011.66 1.079c.497.496.883 1.07 1.08 1.662.208.539.372 1.223.418 2.223.048 1.026.056 1.38.056 3.81s-.008 2.784-.056 3.81c-.046 1-.21 1.683-.418 2.222a4.568 4.568 0 01-1.08 1.66 4.568 4.568 0 01-1.662 1.08c-.539.208-1.223.372-2.223.418-1.026.048-1.38.056-3.81.056s-2.784-.008-3.81-.056c-1-.046-1.683-.21-2.222-.418a4.568 4.568 0 01-1.66-1.079 4.568 4.568 0 01-1.08-1.662c-.208-.539-.372-1.223-.418-2.223C2.008 14.784 2 14.43 2 12s.008-2.784.056-3.81c.046-1 .21-1.683.418-2.222a4.568 4.568 0 011.08-1.66c.496-.497 1.07-.883 1.662-1.08C5.783 2.53 6.467 2.366 7.467 2.32 8.493 2.27 8.847 2.26 11.28 2.26h1.035zM12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 7.5a3 3 0 110-6 3 3 0 010 6zm5.27-8.13a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="https://wa.me/5575982227063" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary transition-colors active:scale-95 transition-transform duration-300 flex items-center justify-center" title="WhatsApp">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 1.887.513 3.655 1.408 5.178L2.06 22.062l5.022-1.32C8.528 21.571 10.22 22 12.002 22c5.522 0 10-4.484 10-10.017C22.002 6.484 17.524 2 12 2zm5.72 13.916c-.244-.122-1.442-.712-1.664-.794-.223-.081-.385-.122-.547.122-.162.244-.627.794-.769.956-.142.162-.284.183-.528.061-1.018-.51-1.745-.94-2.433-1.636-.52-.527-.852-1.155-.953-1.336-.102-.181-.01-.28.081-.371.082-.08.183-.213.274-.32.091-.106.122-.182.183-.305.061-.122.03-.228-.015-.32-.045-.09-.385-.93-.527-1.272-.14-.336-.282-.29-.385-.295-.1-.005-.213-.005-.325-.005s-.294.04-.447.203c-.152.162-.578.568-.578 1.385s.599 1.61.68 1.723c.082.112 1.178 1.8 2.854 2.525.4.172.711.275.954.353.402.128.769.11 1.06.066.323-.048.995-.407 1.137-.8.142-.394.142-.732.1-.8-.04-.069-.152-.11-.395-.232z" clipRule="evenodd" />
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
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.008 3.81.056 1 .046 1.683.21 2.222.418a4.568 4.568 0 011.66 1.079c.497.496.883 1.07 1.08 1.662.208.539.372 1.223.418 2.223.048 1.026.056 1.38.056 3.81s-.008 2.784-.056 3.81c-.046 1-.21 1.683-.418 2.222a4.568 4.568 0 01-1.08 1.66 4.568 4.568 0 01-1.662 1.08c-.539.208-1.223.372-2.223.418-1.026.048-1.38.056-3.81.056s-2.784-.008-3.81-.056c-1-.046-1.683-.21-2.222-.418a4.568 4.568 0 01-1.66-1.079 4.568 4.568 0 01-1.08-1.662c-.208-.539-.372-1.223-.418-2.223C2.008 14.784 2 14.43 2 12s.008-2.784.056-3.81c.046-1 .21-1.683.418-2.222a4.568 4.568 0 011.08-1.66c.496-.497 1.07-.883 1.662-1.08C5.783 2.53 6.467 2.366 7.467 2.32 8.493 2.27 8.847 2.26 11.28 2.26h1.035zM12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 7.5a3 3 0 110-6 3 3 0 010 6zm5.27-8.13a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://wa.me/5575982227063" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary luxury-shadow hover:scale-110 transition-transform" title="WhatsApp">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 1.887.513 3.655 1.408 5.178L2.06 22.062l5.022-1.32C8.528 21.571 10.22 22 12.002 22c5.522 0 10-4.484 10-10.017C22.002 6.484 17.524 2 12 2zm5.72 13.916c-.244-.122-1.442-.712-1.664-.794-.223-.081-.385-.122-.547.122-.162.244-.627.794-.769.956-.142.162-.284.183-.528.061-1.018-.51-1.745-.94-2.433-1.636-.52-.527-.852-1.155-.953-1.336-.102-.181-.01-.28.081-.371.082-.08.183-.213.274-.32.091-.106.122-.182.183-.305.061-.122.03-.228-.015-.32-.045-.09-.385-.93-.527-1.272-.14-.336-.282-.29-.385-.295-.1-.005-.213-.005-.325-.005s-.294.04-.447.203c-.152.162-.578.568-.578 1.385s.599 1.61.68 1.723c.082.112 1.178 1.8 2.854 2.525.4.172.711.275.954.353.402.128.769.11 1.06.066.323-.048.995-.407 1.137-.8.142-.394.142-.732.1-.8-.04-.069-.152-.11-.395-.232z" clipRule="evenodd" />
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
