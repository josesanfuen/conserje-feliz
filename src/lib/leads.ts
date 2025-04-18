export interface Lead {
  id: string;
  conserjeId: string;
  tipoInmueble: 'casa' | 'depto';
  tipoAcuerdo: 'arriendo' | 'venta';
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
  estado?: 'por contactar' | 'en contacto' | 'cerrado';
  asignadoA?: string[];
}

export const leads: Lead[] = [];

export function addLead(lead: Lead) {
  leads.push(lead);
}

export function getLeadsByConserje(conserjeId: string) {
  return leads.filter((lead) => lead.conserjeId === conserjeId);
}

export function getAllLeads() {
  return leads;
}

export function updateLead(updated: Lead) {
  const index = leads.findIndex((l) => l.id === updated.id);
  if (index !== -1) {
    leads[index] = updated;
  }
}

export function deleteLead(id: string) {
  const index = leads.findIndex((l) => l.id === id);
  if (index !== -1) {
    leads.splice(index, 1);
  }
}
