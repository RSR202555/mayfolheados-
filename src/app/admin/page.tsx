'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Anéis');
  const [isNew, setIsNew] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [imageType, setImageType] = useState<'file' | 'url'>('file');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleEditStart = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(String(product.price));
    setCategory(product.category);
    setIsNew(!!product.isNew);
    setIsBestSeller(!!product.isBestSeller);
    setImageType('url');
    setImageUrl(product.image);
    setImageFile(null);
    setMessage(null);
  };

  const handleEditCancel = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setCategory('Anéis');
    setIsNew(false);
    setIsBestSeller(false);
    setImageType('file');
    setImageUrl('');
    setImageFile(null);
    setMessage(null);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      setMessage({ type: 'error', text: 'Preencha o nome e o preço do produto.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('isNew', String(isNew));
      formData.append('isBestSeller', String(isBestSeller));

      if (editingProduct) {
        formData.append('id', editingProduct.id);
      }

      if (imageType === 'file' && imageFile) {
        formData.append('imageFile', imageFile);
      } else if (imageType === 'url' && imageUrl) {
        formData.append('imageUrl', imageUrl);
      }

      const res = await fetch('/api/products', {
        method: editingProduct ? 'PUT' : 'POST',
        body: formData,
      });

      if (res.ok) {
        setMessage({ type: 'success', text: editingProduct ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!' });
        // Reset form
        setEditingProduct(null);
        setName('');
        setPrice('');
        setImageUrl('');
        setImageFile(null);
        setIsNew(false);
        setIsBestSeller(false);
        // Refresh products list
        fetchProducts();
      } else {
        const errData = await res.json();
        setMessage({ type: 'error', text: errData.error || 'Erro ao cadastrar produto.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão com o servidor.' });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este produto?')) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Produto excluído com sucesso!' });
        fetchProducts();
      } else {
        setMessage({ type: 'error', text: 'Erro ao excluir produto.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao conectar ao servidor.' });
      console.error(error);
    }
  };

  return (
    <div className="bg-[#fff8f3] text-[#211b10] min-h-screen flex flex-col font-sans">
      {/* Admin Navbar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 h-20 bg-white/80 backdrop-blur-md border-b border-[#d2c3c4]/20">
        <Link href="/" className="font-display-lg text-2xl text-[#70585b] tracking-tighter hover:opacity-85 transition-opacity">
          May's Folheados <span className="text-xs uppercase tracking-widest text-[#775a19] ml-2">Painel Admin</span>
        </Link>
        <Link href="/products" className="font-label-md text-sm text-[#70585b] hover:text-[#775a19] transition-colors border border-[#70585b]/20 px-4 py-2 rounded-full">
          Ver Catálogo
        </Link>
      </nav>

      <main className="pt-28 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <section className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl border border-[#d2c3c4]/30 shadow-sm self-start">
          <h2 className="font-display-lg text-2xl text-[#70585b] mb-6">
            {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
          </h2>
          
          {message && (
            <div className={`p-4 rounded-xl mb-6 text-sm ${message.type === 'success' ? 'bg-[#e2f0d9] text-[#385723]' : 'bg-[#fce4d6] text-[#c65911]'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4f4445] mb-2">Nome do Produto</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Brinco Aurora Ouro" 
                className="w-full bg-[#fff8f3] border border-[#d2c3c4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#775a19] transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4f4445] mb-2">Preço (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00" 
                  className="w-full bg-[#fff8f3] border border-[#d2c3c4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#775a19] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4f4445] mb-2">Categoria</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#fff8f3] border border-[#d2c3c4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#775a19] transition-colors"
                >
                  <option value="Anéis">Anéis</option>
                  <option value="Colares">Colares</option>
                  <option value="Brincos">Brincos</option>
                  <option value="Pulseiras">Pulseiras</option>
                  <option value="Braceletes">Braceletes</option>
                  <option value="Correntes">Correntes</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3 py-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input 
                  type="checkbox" 
                  checked={isNew} 
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="rounded text-[#775a19] focus:ring-[#775a19]"
                />
                Marcar como Lançamento
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input 
                  type="checkbox" 
                  checked={isBestSeller} 
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                  className="rounded text-[#775a19] focus:ring-[#775a19]"
                />
                Marcar como Destaque/Mais Vendido
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4f4445] mb-2">Imagem do Produto</label>
              <div className="flex gap-4 mb-3">
                <button 
                  type="button"
                  onClick={() => setImageType('file')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${imageType === 'file' ? 'bg-[#70585b] text-white border-transparent' : 'border-[#d2c3c4] hover:bg-[#fff8f3]'}`}
                >
                  Fazer Upload Local
                </button>
                <button 
                  type="button"
                  onClick={() => setImageType('url')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${imageType === 'url' ? 'bg-[#70585b] text-white border-transparent' : 'border-[#d2c3c4] hover:bg-[#fff8f3]'}`}
                >
                  Inserir Link Externo
                </button>
              </div>

              {imageType === 'file' ? (
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#fbdbde] file:text-[#281719] hover:file:bg-[#debfc2] file:cursor-pointer"
                  required={!editingProduct}
                />
              ) : (
                <input 
                  type="url" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://exemplo.com/foto-do-produto.jpg" 
                  className="w-full bg-[#fff8f3] border border-[#d2c3c4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#775a19] transition-colors"
                  required={!editingProduct}
                />
              )}
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-[#775a19] text-white py-4 rounded-full font-semibold uppercase tracking-wider text-xs hover:bg-[#70585b] active:scale-95 transition-all shadow-md disabled:opacity-50"
            >
              {submitting ? 'Salvando...' : editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
            </button>

            {editingProduct && (
              <button 
                type="button"
                onClick={handleEditCancel}
                className="w-full bg-transparent text-[#70585b] border border-[#70585b]/30 py-4 rounded-full font-semibold uppercase tracking-wider text-xs hover:bg-[#70585b]/5 active:scale-95 transition-all mt-2"
              >
                Cancelar Edição
              </button>
            )}
          </form>
        </section>

        {/* List Column */}
        <section className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-[#d2c3c4]/30 shadow-sm flex flex-col">
          <h2 className="font-display-lg text-2xl text-[#70585b] mb-6">Produtos Cadastrados ({products.length})</h2>
          
          {loading ? (
            <p className="text-sm text-center py-12 text-[#4f4445]">Carregando catálogo...</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-center py-12 text-[#4f4445]">Nenhum produto cadastrado ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#d2c3c4]/30 text-xs uppercase tracking-wider text-[#4f4445]">
                    <th className="pb-3 font-semibold">Foto</th>
                    <th className="pb-3 font-semibold">Produto</th>
                    <th className="pb-3 font-semibold">Preço</th>
                    <th className="pb-3 font-semibold">Categoria</th>
                    <th className="pb-3 font-semibold text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d2c3c4]/20">
                  {products.map((product) => (
                    <tr key={product.id} className="group">
                      <td className="py-4">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-12 h-12 object-cover rounded-lg border border-[#d2c3c4]/40"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=100&auto=format&fit=crop';
                          }}
                        />
                      </td>
                      <td className="py-4 font-semibold">
                        <div>
                          {product.name}
                          <div className="flex gap-2 mt-1">
                            {product.isNew && (
                              <span className="text-[10px] bg-[#fadadd] text-[#70585b] px-2 py-0.5 rounded-full font-medium">
                                Novo
                              </span>
                            )}
                            {product.isBestSeller && (
                              <span className="text-[10px] bg-[#ffdea5] text-[#261900] px-2 py-0.5 rounded-full font-medium">
                                Destaque
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-[#775a19] font-medium">
                        {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="py-4 text-[#4f4445]">
                        {product.category}
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => handleEditStart(product)}
                            className="p-2 text-[#775a19] hover:bg-[#ffdea5]/30 rounded-full transition-colors active:scale-95 inline-flex items-center justify-center"
                            title="Editar produto"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-full transition-colors active:scale-95 inline-flex items-center justify-center"
                            title="Excluir produto"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
