'use client';

import { useEffect, useState } from 'react';

interface Lead {
  id: string;
  conserjeId: string;
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
  estado: 'por contactar' | 'en contacto' | 'cerrado';
  asignadoA?: string[];
}

interface Corredora {
  id: string;
  name: string;
}

export default function CorredoraPanel() {
  const corredoraId = 'corredora1@gmail.com';

  const [leads, setLeads] = useState<Lead[]>([]);
  const [corredoraNombre, setCorredoraNombre] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      const res = await fetch(`/api/leads-asignados?corredora=${corredoraId}`);
      const data = await res.json();
      setLeads(data.leads);
    };

    const fetchNombre = async () => {
      try {
        const res = await fetch('/api/corredoras');
        const data = await res.json();
        console.log('Corredoras:', data); // DEBUG
    
        const encontrada = data.corredoras.find((c: Corredora) => c.id === corredoraId);
        if (encontrada) {
          setCorredoraNombre(encontrada.name);
        } else {
          setCorredoraNombre('(Corredora no encontrada)');
        }
      } catch (error) {
        console.error('Error al cargar corredoras:', error);
        setCorredoraNombre('(Error al cargar nombre)');
      }
    };

    fetchLeads();
    fetchNombre();
  }, []);

  const handleEstadoChange = async (id: string, estado: Lead['estado']) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;

    const updated = { ...lead, estado };

    const res = await fetch('/api/leads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      setSuccessMessage('Estado actualizado ✅');
      setTimeout(() => setSuccessMessage(''), 3000);
      const refreshed = await fetch(`/api/leads-asignados?corredora=${corredoraId}`);
      const data = await refreshed.json();
      setLeads(data.leads);
    } else {
      alert('❌ Error al actualizar estado');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Panel de Corredora: {corredoraNombre || 'Cargando...'}
      </h1>

      {successMessage && (
        <p className="text-green-600 font-medium mb-4">{successMessage}</p>
      )}

      {leads.length === 0 ? (
        <p className="text-gray-500 italic">No tienes leads asignados aún.</p>
      ) : (
        <ul className="space-y-4">
          {leads.map((lead) => (
            <li key={lead.id} className="border p-4 rounded bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <strong>{lead.tipoInmueble.toUpperCase()} - {lead.tipoAcuerdo}</strong> en {lead.comuna}<br />
                  {lead.calleNumero}, {lead.region}<br />
                  Tel: {lead.fonoDueno} · Email: {lead.emailDueno}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estado:</label>
                  <select
                    value={lead.estado}
                    onChange={(e) =>
                      handleEstadoChange(lead.id, e.target.value as Lead['estado'])
                    }
                    className="border p-1 rounded text-sm"
                  >
                    <option value="por contactar">Por contactar</option>
                    <option value="en contacto">En contacto</option>
                    <option value="cerrado">Cerrado</option>
                  </select>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
