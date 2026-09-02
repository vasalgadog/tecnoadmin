import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) throw authError;

      if (data.session) {
        navigate('/');
      }
    } catch (err: any) {
      console.error('Error al iniciar sesión:', err);
      setError(err.message || 'Credenciales incorrectas o error en el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="bg-surface-container-low w-full max-w-md rounded-2xl shadow-[0_24px_48px_rgba(115,53,18,0.12)] p-8 border border-outline-variant/20">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-primary-fixed text-primary mb-3 shadow-sm">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>bakery_dining</span>
          </div>
          <h1 className="text-3xl font-headline font-extrabold text-[#703210]">Tecnopan</h1>
          <p className="text-xs font-label uppercase tracking-widest text-stone-500 font-bold mt-1">Gestión Artesanal</p>
        </div>

        {error && (
          <div className="mb-6 bg-error-container text-on-error-container text-xs font-bold p-3 rounded-lg flex items-center">
            <span className="material-symbols-outlined mr-2 text-base">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1 font-bold">
              Correo Electrónico *
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-3 px-3 transition-colors font-medium text-on-surface"
              placeholder="admin@tecnopan.cl"
              autoComplete="email"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1 font-bold">
              Contraseña *
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-3 px-3 transition-colors font-medium text-on-surface"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 text-sm font-bold bg-primary text-white rounded-lg shadow-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">autorenew</span>
                Iniciando sesión...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">login</span>
                Iniciar Sesión
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
