'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      switch (data.user.type) {
        case 'conserje':
          router.push('/panel/conserje');
          break;
        case 'corredora':
          router.push('/panel/corredora');
          break;
        case 'administrador':
          router.push('/panel/admin');
          break;
        default:
          setError('Tipo de usuario no reconocido');
      }
    } else {
      const err = await res.json();
      setError(err.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ✅ Header */}
      <header className="bg-white shadow-md w-full py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/images/conserje1.png"
            alt="Logo"
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
          <span className="text-xl font-semibold text-blue-700">ConserjeFeliz.cl</span>
        </div>
      </header>

      {/* ✅ Main */}
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-md overflow-hidden">
          {/* Imagen */}
          <div className="md:w-1/2 w-full relative h-80 md:h-auto">
            <Image
              src="/images/conserje1.png"
              alt="Conserje feliz"
              fill
              className="object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
              priority
            />
          </div>

          {/* Login */}
          <div className="md:w-1/2 w-full p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-1 text-blue-700">
              Bienvenido a ConserjeFeliz.cl
            </h1>
            <p className="text-lg font-medium text-green-700 mb-2">
              Gánate la comisión por pasar el dato 💰
            </p>
            <p className="text-gray-600 mb-6">
              Una plataforma pensada para facilitar la conexión entre conserjes y corredoras.
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Iniciar sesión
              </button>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </form>

            <p className="mt-4 text-sm text-center">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
