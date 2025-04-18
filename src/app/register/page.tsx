'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    type: 'conserje',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Usuario registrado con éxito ✅');
    } else {
      alert(`❌ Error: ${data.error}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Registro</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-80 flex flex-col gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Nombre completo"
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="conserje">Conserje</option>
          <option value="corredora">Corredora</option>
          <option value="administrador">Administrador</option>
        </select>
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
