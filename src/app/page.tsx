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

const DEFAULT_FEATURED: Product[] = [
  {
    id: 'h1',
    name: 'Colar Gota de Luz',
    price: 189.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMqQVbX2eG2YwwUYZBxcMFwcx0gYknzEayB034ly1uPddy_Kk0XStaKewdm4h6MKRfZDBmUuRtiv2i8CAQHbPEeUjhbb8tVxd0Js9pCTjegselm5N62blgL98rwYbR5nurodDzssI40kSuNqaKybfsq6O3LgGb7z6aIqscM5PleEbZ4A19pXdvcRJnKbVqOI4MhZ-w49D6by1oZegJhB0gzdxD9UfjlXGkvou6ZR7TVquuHAyhJtZ76agaX60rWesM3MdY5HIr5q4',
    category: 'Colares'
  },
  {
    id: 'h2',
    name: 'Anel Elo Infinito',
    price: 124.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBgAYszmUe15O62AfYTszLAtjxxAvW4QuijIN3HZD05vm-6orKm6gA4VZxtnwfBLxro7X1pCrriYhV-wOd4EcrtWElvLxXdhejImmBPGY416MKL9RFFW0xjah5rg0Yyuok7AQ3s9Mqv3yF4imhyfHi3KDD0RJj6s0XamGLyGnUOOeUv4Y-yufs0YRWaYVM-XbYtsvKyEkCppndqcS7ewabptG52UsBaGRIb6aaofe3-aKiK6FkXWP3EmlWx9rC4oFNKW9WKl-GMn4',
    category: 'Anéis'
  },
  {
    id: 'h3',
    name: 'Brincos Aurora',
    price: 156.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWW_3MYqeHFVNXK1Bvytv68tv1pfsPc7EDeVgDn_YfYGmTe6q0M8ScYbeErDi7FQ6uUD3MkfN_MN3Tj-Hi71BC1oA8isPcTrteXO8Kco3vPZB4pq4HN-39Vaz3YrDXURmNHpISatPW5Eb0piXTojFS7w4KePLu3Ve1JslMNh1--QxexFo0qg7EfYMkq1WlwWnwELdD2oI_gCj-c9GRDf31ehpSJoj95WT0sS13CBt5CKDk8CzpoQflxjbuIb1KMcduy9XXaS9yJeY',
    category: 'Brincos'
  }
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(DEFAULT_FEATURED);
  const { addToCart, openCart, cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data: Product[] = await res.json();
          // Filter products that are best sellers (Destaques)
          let filtered = data.filter(p => p.isBestSeller);
          
          // If less than 3 best sellers, fill with other products from database
          if (filtered.length < 3) {
            const others = data.filter(p => !p.isBestSeller);
            filtered = [...filtered, ...others].slice(0, 3);
          }
          
          // If we got products, update the state, otherwise fallback to defaults
          if (filtered.length > 0) {
            const padded = [...filtered];
            while (padded.length < 3) {
              const fallbackItem = DEFAULT_FEATURED[padded.length];
              padded.push(fallbackItem);
            }
            setFeaturedProducts(padded);
          }
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
      }
    };

    window.addEventListener('scroll', handleScroll);
    fetchFeaturedProducts();

    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
      observer.observe(section);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className={`fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 transition-all duration-300 border-b border-surface-variant/30 ${scrolled ? 'shadow-sm bg-surface/90 backdrop-blur-md' : 'bg-surface/70 backdrop-blur-md'}`}>
        <div className="flex items-center gap-4 cursor-pointer active:scale-95 transition-transform text-primary">
          <span className="material-symbols-outlined">menu</span>
        </div>
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img src="/logo_rosa_may.png" alt="MAY'S Logo" className="h-14 w-14 md:h-16 md:w-16 rounded-full object-cover border border-secondary/20 transition-all duration-300" />
            <span className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tighter hidden sm:block">
              MAY'S Joias & Acessórios
            </span>
            <span className="font-display-lg text-display-lg-mobile text-primary tracking-tighter sm:hidden">
              MAY'S
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-8 items-center">
            <Link className="font-label-md text-label-md text-primary font-medium hover:text-secondary transition-colors duration-300" href="/products">
              Boutique
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-300" href="/products">
              Coleções
            </Link>
          </div>
          <div className="flex items-center gap-4">
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
            <div onClick={openCart} className="flex items-center gap-4 cursor-pointer active:scale-95 transition-transform text-primary relative">
              <span className="material-symbols-outlined">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold font-sans">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 px-margin-mobile md:px-margin-desktop overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter w-full max-w-container-max mx-auto">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-8 z-10 py-12">
              <div className="space-y-4">
                <span className="font-label-md text-label-md tracking-widest text-secondary uppercase block mb-4">Coleção Primavera 2024</span>
                <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary leading-tight">
                  A Elegância em <br /> Cada Detalhe.
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
                  Joias banhadas a ouro com acabamento artesanal, desenhadas para elevar a sua essência com um brilho atemporal e delicado.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/products" className="px-10 py-4 bg-secondary text-white rounded-full font-label-md text-label-md hover:bg-primary transition-all luxury-shadow active:scale-95 inline-block text-center">
                  Explorar Coleção
                </Link>
              </div>
            </div>
            <div className="lg:col-span-6 relative h-[500px] lg:h-auto">
              <div className="absolute inset-0 bg-surface-container rounded-[40px] rotate-3 -z-10 opacity-60"></div>
              <img alt="Luxury Jewelry Showcase" className="w-full h-full object-cover rounded-[40px] luxury-shadow border-4 border-white/40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBMK6nefhd7M3nYpmysSlwd-DA4OO4tl1xvuAmIn_eJJrZRrm6mpsBImKFBZgK14SujDk8Y54lx7swyKXVidZJL1T1JEmfGv7qEyoRki3-0lOY0vcx2naKf7qTO3HK9AKO7xceSk0SrtSBgD2QGNMtMr4yUcWZGUqdndtS3ikbr6xgcy8BBI1BRa-MBWFeuDpRCia7W3O9fZWC3CkCaymJpfo8u-A20f1op4Mcn_55-W6gA9aDHGIVxPAJ-SXNoPZfSXHwn5TeUSc" />
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-low">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-display-lg text-display-lg-mobile md:text-headline-lg text-primary">Categorias</h2>
              <div className="h-px w-24 bg-secondary mx-auto opacity-40"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Category Item */}
              <Link href="/products" className="group cursor-pointer">
                <div className="aspect-[4/5] bg-surface rounded-2xl overflow-hidden mb-4 relative flex items-center justify-center transition-transform duration-500 group-hover:scale-105 border border-white/50">
                  <img alt="Anéis" className="w-full h-full object-cover mix-blend-multiply opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6DZfUWhB9O4o14xHuyYiZYjZKMjqfcdRsEc_g7_zmaXEmc2_VqiQ7IOr6AZVnvYXYvAT_f9OBJKSUACoKPq3t-CYWtcK_SqT-qLQ7fNEOM4oWZ8a4QOGV-RZctpBI7PpCP7E2ns-KN3M8DorYyAzvQJO0Sb9OM_yYPLa6Rgb1LpkmpZWGJd6kSMbAL7Pf0SShCP2HTZEHx1bWhWFPULNHAhFSeRB5TNqHXD4L-94e47uv2liFRJUogwUfm-6UsxIqiXO3rXuk2ww" />
                  <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors"></div>
                </div>
                <h3 className="font-headline-md text-headline-md text-center text-primary">Anéis</h3>
              </Link>
              {/* Category Item */}
              <Link href="/products" className="group cursor-pointer">
                <div className="aspect-[4/5] bg-surface rounded-2xl overflow-hidden mb-4 relative flex items-center justify-center transition-transform duration-500 group-hover:scale-105 border border-white/50">
                  <img alt="Colares" className="w-full h-full object-cover mix-blend-multiply opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1QMZMShl9YFlP4QZ_6wEQKTqTXfLRo5YaON2jSXTH-rS5Uz8FsXQhmQXkzJaesH5di1eloMuddQZ3HNsqm2o8x6qv-qL9FzmtCrCT-LYO6F69_7lt27Gc5Vmp_8e2frNVUx9iJqoSq8hA_B62IzycCIYna1gn0nUr4ok-KbrTnemYEuvbgh_-3jNhCVK9q5FPHdX1GdVeB8LeKIKvSfA-Buyu2JDg1qXCxoDjGmDXVdKUY7aS979jbZvNE9X1wyQGKikr4ikh8iw" />
                </div>
                <h3 className="font-headline-md text-headline-md text-center text-primary">Colares</h3>
              </Link>
              {/* Category Item */}
              <Link href="/products" className="group cursor-pointer">
                <div className="aspect-[4/5] bg-surface rounded-2xl overflow-hidden mb-4 relative flex items-center justify-center transition-transform duration-500 group-hover:scale-105 border border-white/50">
                  <img alt="Brincos" className="w-full h-full object-cover mix-blend-multiply opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9Px9tAH0SZ07yH_KONoxoR6ikeguEurYtG_UMwWxTZw4EDyZBkN2BJfKAb5WvuNtd6TEZuIK-ug1a8hE9wmrPbBnAmh9W7OH0AAaD1yDwm3skutgU9YtuZUnfGZbOvTMu0EhZEXSETQEqP128X2rBp-9NIJS6L7HOZtP9U9wGeAe1e8lGZIsESyLwhHgz5YJeqjihnsEnK2e8iYzBo0t_LQSznVBU1_rqg_WR_iz75Lj_1UcG1P5zqKqS82amVAaMemqekqFUoiE" />
                </div>
                <h3 className="font-headline-md text-headline-md text-center text-primary">Brincos</h3>
              </Link>
              {/* Category Item */}
              <Link href="/products" className="group cursor-pointer">
                <div className="aspect-[4/5] bg-surface rounded-2xl overflow-hidden mb-4 relative flex items-center justify-center transition-transform duration-500 group-hover:scale-105 border border-white/50">
                  <img alt="Pulseiras" className="w-full h-full object-cover mix-blend-multiply opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVFECkn6IqIoLANOhMJWew7lydTq36oj1YvI45dHQRKjHgjsYaBhUqL0A5UlfFzUbjyZr7j88vo83f51DEcAF2PxUCAc272iXjVW1Rx-cLkgyRSa4tbnR92LqrbPuPbC2HrJpfdTi89xUVOcCKTAAMsD6niJR4fUZzxwI51_2rZuw0KUNKnzt4UyH8UrynEZwTYA6gpQB6NnYJp9V_M3IISCcrRmC4rbTNzSdTYQhP-aT9KOyDDTUik752tCPdmMJ_PVdzmjo1dTk" />
                </div>
                <h3 className="font-headline-md text-headline-md text-center text-primary">Pulseiras</h3>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
              <div className="space-y-2">
                <span className="font-label-md text-label-md text-secondary tracking-[0.2em] uppercase">Seleção Especial</span>
                <h2 className="font-display-lg text-display-lg-mobile md:text-headline-lg text-primary">Destaques da Estação</h2>
              </div>
              <Link className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2 group hover:text-primary transition-colors" href="/products">
                Ver Todos os Produtos
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              {/* Main Product Card */}
              <div className="md:col-span-7 space-y-6 group">
                <div className="aspect-[16/10] bg-surface-container rounded-3xl overflow-hidden relative border border-white/40">
                  <img alt={featuredProducts[0].name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" src={featuredProducts[0].image} />
                  <div className="absolute top-6 left-6 px-4 py-1 bg-white/80 backdrop-blur-md rounded-full text-primary font-label-sm text-label-sm">Novo</div>
                  
                  {/* Add to Cart Hover Button */}
                  <button 
                    onClick={() => addToCart(featuredProducts[0])}
                    className="absolute bottom-6 right-6 px-6 py-3 bg-[#775a19]/90 text-white rounded-full font-semibold uppercase tracking-wider text-xs hover:bg-[#70585b] active:scale-95 transition-all opacity-0 group-hover:opacity-100 shadow-md backdrop-blur-md"
                  >
                    Adicionar ao Carrinho
                  </button>
                </div>
                <div className="flex justify-between items-start pt-2">
                  <div className="space-y-1">
                    <h3 className="font-headline-md text-headline-md text-primary">{featuredProducts[0].name}</h3>
                    <p className="font-body-md text-on-surface-variant italic">Banhado a Ouro 18k com Zircônia Premium</p>
                  </div>
                  <span className="font-headline-md text-headline-md text-secondary">
                    {featuredProducts[0].price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>

              {/* Secondary Product Stack */}
              <div className="md:col-span-5 flex flex-col gap-12">
                {featuredProducts.slice(1).map((prod) => (
                  <div key={prod.id} className="group space-y-4 relative">
                    <div className="aspect-square bg-surface-container rounded-3xl overflow-hidden border border-white/40 relative">
                      <img alt={prod.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" src={prod.image} />
                      
                      {/* Add to Cart Hover Button */}
                      <button 
                        onClick={() => addToCart(prod)}
                        className="absolute bottom-6 right-6 px-6 py-3 bg-[#775a19]/90 text-white rounded-full font-semibold uppercase tracking-wider text-xs hover:bg-[#70585b] active:scale-95 transition-all opacity-0 group-hover:opacity-100 shadow-md backdrop-blur-md"
                      >
                        Adicionar ao Carrinho
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-headline-md text-headline-md text-primary">{prod.name}</h3>
                      <span className="font-label-md text-label-md text-secondary">
                        {prod.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>



        {/* Newsletter Section */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <span className="material-symbols-outlined text-4xl text-secondary">auto_awesome</span>
            <h2 className="font-headline-lg text-headline-lg text-primary">Junte-se à Nossa Curadoria</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Receba em primeira mão nossas coleções limitadas e dicas de como cuidar e estilizar suas joias artesanais.
            </p>
            <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto pt-4" onSubmit={(e) => e.preventDefault()}>
              <input className="flex-1 bg-white border-none border-b border-surface-variant focus:ring-0 focus:border-secondary px-6 py-4 rounded-full font-body-md placeholder-on-surface-variant/50 text-on-surface" placeholder="Seu e-mail favorito" type="email" />
              <button className="bg-primary text-white px-10 py-4 rounded-full font-label-md text-label-md hover:bg-secondary transition-all active:scale-95 luxury-shadow">Inscrever</button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-section-gap px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter bg-surface-container-low border-t border-white/50">
        <div className="flex flex-col gap-6">
          <div className="font-headline-lg text-headline-lg text-primary">MAY'S Joias & Acessórios</div>
          <p className="font-body-md text-body-md text-on-surface-variant">Elevando o cotidiano através de joias artesanais de luxo. Design consciente e brilho atemporal.</p>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">Explorar</h4>
          <ul className="flex flex-col gap-2">
            <li className=""><Link className="text-on-surface-variant hover:text-secondary transition-colors underline-offset-4 hover:underline" href="/products">Coleções</Link></li>
            <li className=""><Link className="text-on-surface-variant hover:text-secondary transition-colors underline-offset-4 hover:underline" href="/products">Best Sellers</Link></li>
            <li className=""><Link className="text-on-surface-variant hover:text-secondary transition-colors underline-offset-4 hover:underline" href="/products">Novidades</Link></li>
            <li className=""><Link className="text-on-surface-variant hover:text-secondary transition-colors underline-offset-4 hover:underline" href="/products">Presentes</Link></li>
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">Suporte</h4>
          <ul className="flex flex-col gap-2">
            <li className=""><a className="text-on-surface-variant hover:text-secondary transition-colors underline-offset-4 hover:underline" href="#">Care Guide</a></li>
            <li className=""><a className="text-on-surface-variant hover:text-secondary transition-colors underline-offset-4 hover:underline" href="#">Shipping &amp; Returns</a></li>
            <li className=""><a className="text-on-surface-variant hover:text-secondary transition-colors underline-offset-4 hover:underline" href="#">FAQ</a></li>
            <li className=""><a className="text-on-surface-variant hover:text-secondary transition-colors underline-offset-4 hover:underline" href="#">Privacy Policy</a></li>
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">Conectar</h4>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary luxury-shadow hover:scale-110 transition-transform" href="https://www.instagram.com/mays_folheados/" target="_blank" rel="noopener noreferrer" title="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.008 3.81.056 1 .046 1.683.21 2.222.418a4.568 4.568 0 011.66 1.079c.497.496.883 1.07 1.08 1.662.208.539.372 1.223.418 2.223.048 1.026.056 1.38.056 3.81s-.008 2.784-.056 3.81c-.046 1-.21 1.683-.418 2.222a4.568 4.568 0 01-1.08 1.66 4.568 4.568 0 01-1.662 1.08c-.539.208-1.223.372-2.223.418-1.026.048-1.38.056-3.81.056s-2.784-.008-3.81-.056c-1-.046-1.683-.21-2.222-.418a4.568 4.568 0 01-1.66-1.079 4.568 4.568 0 01-1.08-1.662c-.208-.539-.372-1.223-.418-2.223C2.008 14.784 2 14.43 2 12s.008-2.784.056-3.81c.046-1 .21-1.683.418-2.222a4.568 4.568 0 011.08-1.66c.496-.497 1.07-.883 1.662-1.08C5.783 2.53 6.467 2.366 7.467 2.32 8.493 2.27 8.847 2.26 11.28 2.26h1.035zM12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 7.5a3 3 0 110-6 3 3 0 010 6zm5.27-8.13a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z" clipRule="evenodd" />
              </svg>
            </a>
            <a className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary luxury-shadow hover:scale-110 transition-transform" href="https://wa.me/5575982227063" target="_blank" rel="noopener noreferrer" title="WhatsApp">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 1.887.513 3.655 1.408 5.178L2.06 22.062l5.022-1.32C8.528 21.571 10.22 22 12.002 22c5.522 0 10-4.484 10-10.017C22.002 6.484 17.524 2 12 2zm5.72 13.916c-.244-.122-1.442-.712-1.664-.794-.223-.081-.385-.122-.547.122-.162.244-.627.794-.769.956-.142.162-.284.183-.528.061-1.018-.51-1.745-.94-2.433-1.636-.52-.527-.852-1.155-.953-1.336-.102-.181-.01-.28.081-.371.082-.08.183-.213.274-.32.091-.106.122-.182.183-.305.061-.122.03-.228-.015-.32-.045-.09-.385-.93-.527-1.272-.14-.336-.282-.29-.385-.295-.1-.005-.213-.005-.325-.005s-.294.04-.447.203c-.152.162-.578.568-.578 1.385s.599 1.61.68 1.723c.082.112 1.178 1.8 2.854 2.525.4.172.711.275.954.353.402.128.769.11 1.06.066.323-.048.995-.407 1.137-.8.142-.394.142-.732.1-.8-.04-.069-.152-.11-.395-.232z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-4">© 2024 MAY'S Joias & Acessórios. Handcrafted with intention.</p>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center py-3 px-4 md:hidden bg-white/90 backdrop-blur-lg border-t border-surface-variant/30 shadow-[0_-4px_20px_rgba(166,113,132,0.08)] rounded-t-xl">
        <Link href="/products" className="flex flex-col items-center justify-center bg-primary text-white rounded-full px-4 py-1 active:scale-90 transition-all">
          <span className="material-symbols-outlined" data-icon="grid_view">grid_view</span>
          <span className="font-label-sm text-label-sm">Boutique</span>
        </Link>
        <div className="flex flex-col items-center justify-center text-primary active:scale-90 transition-all">
          <span className="material-symbols-outlined" data-icon="search">search</span>
          <span className="font-label-sm text-label-sm">Search</span>
        </div>
        <div onClick={openCart} className="flex flex-col items-center justify-center text-primary active:scale-90 transition-all relative cursor-pointer">
          <span className="material-symbols-outlined" data-icon="favorite">shopping_bag</span>
          <span className="font-label-sm text-label-sm">Carrinho</span>
          {cartCount > 0 && (
            <span className="absolute top-1 right-2 bg-secondary text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold font-sans">
              {cartCount}
            </span>
          )}
        </div>
        <div className="flex flex-col items-center justify-center text-primary active:scale-90 transition-all">
          <span className="material-symbols-outlined" data-icon="person">person</span>
          <span className="font-label-sm text-label-sm">Profile</span>
        </div>
      </nav>

      {/* Contextual FAB */}
      <button onClick={openCart} className="fixed right-6 bottom-24 md:bottom-10 z-40 w-16 h-16 bg-primary text-on-primary rounded-full luxury-shadow flex items-center justify-center group hover:scale-105 active:scale-90 transition-all relative">
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
        {cartCount > 0 && (
          <span className="absolute top-1 right-1 bg-secondary text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold font-sans">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
}
