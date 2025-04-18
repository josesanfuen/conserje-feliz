'use client';

import { useEffect, useState } from 'react';

interface Lead {
  id: string;
  tipoInmueble: string;
  tipoAcuerdo: string;
  region: string;
  comuna: string;
  calleNumero: string;
  fonoDueno: string;
  emailDueno: string;
  conserjeId: string;
  asignadoA?: string[];
}

interface Corredora {
  id: string;
  name: string;
}

interface Usuario {
  id: string;
  name: string;
}

export default function AdminPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [corredoras, setCorredoras] = useState<Corredora[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  const getLeads = async () => {
    const res = await fetch('/api/todos-leads');
    const data = await res.json();
    setLeads(data.leads);
  };

  const getCorredoras = async () => {
    const res = await fetch('/api/corredoras');
    const data = await res.json();
    setCorredoras(data.corredoras);
  };

  const getUsuarios = async () => {
    const res = await fetch('/api/usuarios');
    const data = await res.json();
    setUsuarios(data.usuarios);
  };

  useEffect(() => {
    getLeads();
    getCorredoras();
    getUsuarios();
  }, []);

  const toggleAsignacion = async (leadId: string, corredora: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const yaAsignada = lead.asignadoA?.includes(corredora);
    const nuevasAsignadas = yaAsignada
      ? lead.asignadoA?.filter((c) => c !== corredora)
      : [...(lead.asignadoA || []), corredora];

    const actualizado = { ...lead, asignadoA: nuevasAsignadas };

    const res = await fetch('/api/leads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actualizado),
    });

    if (res.ok) {
      setSuccessMessage('Asignación actualizada ✅');
      getLeads();
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      alert('❌ Error al actualizar asignación');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Panel del Administrador</h1>

      {successMessage && (
        <p className="text-green-600 font-medium mb-4">{successMessage}</p>
      )}

      <ul className="space-y-4">
        {leads.map((lead) => {
          const conserje = usuarios.find((u) => u.id === lead.conserjeId);
          return (
            <li key={lead.id} className="border p-4 rounded bg-gray-50">
              <div>
                <strong>{lead.tipoInmueble.toUpperCase()} - {lead.tipoAcuerdo}</strong> en {lead.comuna}, {lead.region}
                <br />
                {lead.calleNumero}
                <br />
                Tel: {lead.fonoDueno} · Email: {lead.emailDueno}
                <br />
                <span className="text-sm text-gray-600 italic">
                  Publicado por: {conserje?.name || 'Conserje desconocido'}
                </span>
              </div>

              <div className="mt-3">
                <span className="font-semibold">Asignado a:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {corredoras.map((corredora) => (
                    <button
                      key={corredora.id}
                      onClick={() => toggleAsignacion(lead.id, corredora.id)}
                      className={`px-2 py-1 text-sm rounded ${
                        lead.asignadoA?.includes(corredora.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      {corredora.name}
                    </button>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
