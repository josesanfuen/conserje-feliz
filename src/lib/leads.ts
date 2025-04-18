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
  }
  
  const leads: Lead[] = [];
  
  export function addLead(lead: Lead) {
    leads.push(lead);
  }
  
  export function getLeadsByConserje(conserjeId: string) {
    return leads.filter((lead) => lead.conserjeId === conserjeId);
  }
  
  export function getAllLeads() {
    return leads;
  }
  