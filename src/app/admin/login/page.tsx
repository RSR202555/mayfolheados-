'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        // Redirect to admin dashboard
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Credenciais incorretas.');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fff8f3] text-[#211b10] min-h-screen flex flex-col justify-between font-sans">
      {/* Navbar Simple */}
      <header className="w-full flex justify-between items-center px-6 md:px-12 h-20 bg-white/40 backdrop-blur-md border-b border-[#d2c3c4]/10">
        <Link href="/" className="font-display-lg text-xl text-[#70585b] tracking-tighter hover:opacity-85 transition-opacity">
          MAY'S Joias & Acessórios
        </Link>
        <Link href="/" className="text-xs uppercase tracking-widest text-[#775a19] font-semibold hover:opacity-85 transition-opacity">
          Voltar à Loja
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white border border-[#d2c3c4]/30 rounded-3xl p-8 md:p-10 shadow-lg relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#70585b] via-[#775a19] to-[#70585b]"></div>

          <div className="text-center mb-8">
            <span className="material-symbols-outlined text-[#775a19] text-3xl mb-3">lock_open</span>
            <h1 className="font-display-lg text-2xl md:text-3xl text-[#70585b] tracking-tight">Painel Admin</h1>
            <p className="text-xs text-[#4f4445] uppercase tracking-wider mt-2">Área Restrita da Administradora</p>
          </div>

          {error && (
            <div className="bg-[#fce4d6] text-[#c65911] text-sm p-4 rounded-xl mb-6 text-center border border-[#c65911]/10 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4f4445] mb-2">Usuário</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Seu usuário admin"
                  className="w-full bg-[#fff8f3] border border-[#d2c3c4] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#775a19] transition-colors"
                  required
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#70585b]/60">person</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4f4445] mb-2">Senha</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#fff8f3] border border-[#d2c3c4] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#775a19] transition-colors"
                  required
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#70585b]/60">lock</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#775a19] text-white py-4 rounded-full font-semibold uppercase tracking-wider text-xs hover:bg-[#70585b] active:scale-98 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Autenticando...
                </>
              ) : (
                'Entrar no Painel'
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer Simple */}
      <footer className="w-full py-6 text-center text-xs text-[#4f4445]/60 border-t border-[#d2c3c4]/10 bg-white/20">
        © 2024 MAY'S Joias & Acessórios. Área de acesso exclusiva.
      </footer>
    </div>
  );
}
