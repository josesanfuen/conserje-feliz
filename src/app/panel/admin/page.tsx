'use client';

import { useEffect, useState } from 'react';
import { regionesYComunas } from '@/data/regiones-comunas';

interface Lead {
  id: string;
  tipoInmueble: string;
  tipoAcuerdo: string;
  region: string;
  comuna: string;
  calleNumero: string;
  numeroDepto?: string;
  habitaciones?: number;
  banos?: number;
  precio?: number;
  anio?: number;
  comentarios?: string;
  fonoDueno: string;
  emailDueno: string;
}

export default function ConserjePanel() {
  const conserjeId = 'conserje1';

  const [leads, setLeads] = useState<Lead[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [comunasDisponibles, setComunasDisponibles] = useState<string[]>([]);
  const [form, setForm] = useState({
    tipoInmueble: 'casa',
    tipoAcuerdo: 'venta',
    region: '',
    comuna: '',
    calleNumero: '',
    numeroDepto: '',
    habitaciones: '',
    banos: '',
    precio: '',
    anio: '',
    comentarios: '',
    fonoDueno: '',
    emailDueno: '',
  });

  const getLeads = async () => {
    const res = await fetch(`/api/leads?user=${conserjeId}`);
    const data = await res.json();
    setLeads(data.leads);
  };

  useEffect(() => {
    getLeads();
  }, []);

  useEffect(() => {
    const seleccionada = regionesYComunas.find(r => r.region === form.region);
    if (seleccionada) {
      setComunasDisponibles(seleccionada.comunas);
    } else {
      setComunasDisponibles([]);
    }
  }, [form.region]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionSeleccionada = e.target.value;
    const encontrada = regionesYComunas.find((r) => r.region === regionSeleccionada);
    setComunasDisponibles(encontrada?.comunas || []);
    setForm({ ...form, region: regionSeleccionada, comuna: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = '/api/leads';
    const method = editingLeadId ? 'PUT' : 'POST';
    const payload = { ...form, conserjeId, id: editingLeadId };

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setSuccessMessage(editingLeadId ? 'Lead actualizado ✅' : 'Lead creado ✅');
      setForm({
        tipoInmueble: 'casa', tipoAcuerdo: 'venta', region: '', comuna: '', calleNumero: '', numeroDepto: '', habitaciones: '', banos: '', precio: '', anio: '', comentarios: '', fonoDueno: '', emailDueno: ''
      });
      setComunasDisponibles([]);
      setEditingLeadId(null);
      getLeads();
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      const err = await res.json();
      alert('❌ Error: ' + err.error);
    }
  };

  const handleEdit = (lead: Lead) => {
    setForm({
      tipoInmueble: lead.tipoInmueble,
      tipoAcuerdo: lead.tipoAcuerdo,
      region: lead.region,
      comuna: lead.comuna,
      calleNumero: lead.calleNumero,
      numeroDepto: lead.numeroDepto || '',
      habitaciones: lead.habitaciones?.toString() || '',
      banos: lead.banos?.toString() || '',
      precio: lead.precio?.toString() || '',
      anio: lead.anio?.toString() || '',
      comentarios: lead.comentarios || '',
      fonoDueno: lead.fonoDueno,
      emailDueno: lead.emailDueno,
    });
    const encontrada = regionesYComunas.find((r) => r.region === lead.region);
    setComunasDisponibles(encontrada?.comunas || []);
    setEditingLeadId(lead.id);
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm('¿Estás seguro de eliminar este lead?');
    if (!confirmed) return;
    const res = await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });

    if (res.ok) {
      setSuccessMessage('Lead eliminado 🗑️');
      getLeads();
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      alert('❌ Error al eliminar lead');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Panel del Conserje</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow mb-6">
        <select name="tipoInmueble" value={form.tipoInmueble} onChange={handleChange} className="border p-2 rounded">
          <option value="casa">Casa</option>
          <option value="depto">Departamento</option>
        </select>

        <select name="tipoAcuerdo" value={form.tipoAcuerdo} onChange={handleChange} className="border p-2 rounded">
          <option value="venta">Venta</option>
          <option value="arriendo">Arriendo</option>
        </select>

        <select name="region" value={form.region} onChange={handleRegionChange} className="border p-2 rounded">
          <option value="">Selecciona una región</option>
          {regionesYComunas.map((r) => (
            <option key={r.region} value={r.region}>{r.region}</option>
          ))}
        </select>

        <select
          name="comuna"
          value={form.comuna}
          onChange={handleChange}
          disabled={!comunasDisponibles.length}
          className={`border p-2 rounded ${!comunasDisponibles.length ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
        >
          <option value="">Selecciona una comuna</option>
          {comunasDisponibles.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {!form.region && (
          <p className="text-sm text-gray-500 col-span-full -mt-2">
            Primero selecciona una región para elegir la comuna.
          </p>
        )}

        <input name="calleNumero" placeholder="Calle y número" value={form.calleNumero} onChange={handleChange} className="border p-2 rounded" />
        <input name="numeroDepto" placeholder="N° depto/vivienda (opcional)" value={form.numeroDepto} onChange={handleChange} className="border p-2 rounded" />
        <input name="habitaciones" type="number" placeholder="Habitaciones" value={form.habitaciones} onChange={handleChange} className="border p-2 rounded" />
        <input name="banos" type="number" placeholder="Baños" value={form.banos} onChange={handleChange} className="border p-2 rounded" />
        <input name="precio" type="number" placeholder="Precio estimado" value={form.precio} onChange={handleChange} className="border p-2 rounded" />
        <input name="anio" type="number" placeholder="Año de construcción" value={form.anio} onChange={handleChange} className="border p-2 rounded" />
        <input name="fonoDueno" placeholder="Teléfono dueño" value={form.fonoDueno} onChange={handleChange} className="border p-2 rounded" />
        <input name="emailDueno" placeholder="Email dueño" value={form.emailDueno} onChange={handleChange} className="border p-2 rounded" />
        <textarea name="comentarios" placeholder="Comentarios" value={form.comentarios} onChange={handleChange} className="col-span-full border p-2 rounded" />

        {editingLeadId ? (
          <button type="submit" className="col-span-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">Actualizar Lead</button>
        ) : (
          <button type="submit" className="col-span-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Crear Lead</button>
        )}

        {editingLeadId && (
          <button type="button" onClick={() => {
            setForm({
              tipoInmueble: 'casa', tipoAcuerdo: 'venta', region: '', comuna: '', calleNumero: '', numeroDepto: '', habitaciones: '', banos: '', precio: '', anio: '', comentarios: '', fonoDueno: '', emailDueno: ''
            });
            setComunasDisponibles([]);
            setEditingLeadId(null);
          }} className="col-span-full bg-gray-300 text-black p-2 rounded hover:bg-gray-400">Cancelar edición</button>
        )}

        {successMessage && (
          <p className="col-span-full text-green-600 font-medium">{successMessage}</p>
        )}
      </form>

      <h2 className="text-xl font-semibold mb-2">Mis Leads</h2>
      <ul className="space-y-2">
        {leads.map((lead) => (
          <li key={lead.id} className="border p-3 rounded bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <strong>{lead.tipoInmueble.toUpperCase()} - {lead.tipoAcuerdo}</strong> en {lead.comuna}<br />
                {lead.calleNumero}, {lead.region}<br />
                Tel: {lead.fonoDueno} · Email: {lead.emailDueno}
              </div>
              <div className="flex flex-col items-end space-y-1 ml-4">
                <button onClick={() => handleEdit(lead)} className="text-blue-600 underline text-sm">Editar</button>
                <button onClick={() => handleDelete(lead.id)} className="text-red-600 underline text-sm">Eliminar</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}