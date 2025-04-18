import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Esta variable se mantiene interna y no se exporta
const leads: Lead[] = [
  {
    id: uuidv4(),
    conserjeId: 'conserje1',
    tipoInmueble: 'casa',
    tipoAcuerdo: 'venta',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Ñuñoa',
    calleNumero: 'Av. Grecia 1234',
    numeroDepto: '5B',
    habitaciones: 3,
    banos: 2,
    precio: 120000000,
    anio: 2010,
    comentarios: 'Casa muy bien ubicada.',
    fonoDueno: '912345678',
    emailDueno: 'dueno1@mail.com',
    estado: 'por contactar',
    asignadoA: ['corredora1@gmail.com'],
  },
  {
    id: uuidv4(),
    conserjeId: 'conserje1',
    tipoInmueble: 'depto',
    tipoAcuerdo: 'arriendo',
    region: 'Región de Valparaíso',
    comuna: 'Viña del Mar',
    calleNumero: 'Calle 8 Norte 123',
    numeroDepto: '302',
    habitaciones: 2,
    banos: 1,
    precio: 550000,
    anio: 2015,
    comentarios: '',
    fonoDueno: '987654321',
    emailDueno: 'dueno2@mail.com',
    estado: 'por contactar',
    asignadoA: [],
  }
];

interface Lead {
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
  estado: 'por contactar' | 'en contacto' | 'cerrado';
  asignadoA?: string[];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const conserjeId = searchParams.get('user');

  if (!conserjeId) {
    return NextResponse.json({ error: 'Falta el ID del conserje' }, { status: 400 });
  }

  const conserjeLeads = leads.filter((l) => l.conserjeId === conserjeId);
  return NextResponse.json({ leads: conserjeLeads });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    conserjeId,
    tipoInmueble,
    tipoAcuerdo,
    region,
    comuna,
    calleNumero,
    numeroDepto,
    habitaciones,
    banos,
    precio,
    anio,
    comentarios,
    fonoDueno,
    emailDueno,
  } = body;

  if (!conserjeId || !tipoInmueble || !tipoAcuerdo || !region || !comuna || !calleNumero || !fonoDueno || !emailDueno) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
  }

  const newLead: Lead = {
    id: uuidv4(),
    conserjeId,
    tipoInmueble,
    tipoAcuerdo,
    region,
    comuna,
    calleNumero,
    numeroDepto,
    habitaciones: habitaciones ? Number(habitaciones) : undefined,
    banos: banos ? Number(banos) : undefined,
    precio: precio ? Number(precio) : undefined,
    anio: anio ? Number(anio) : undefined,
    comentarios,
    fonoDueno,
    emailDueno,
    estado: 'por contactar',
    asignadoA: []
  };

  leads.push(newLead);
  return NextResponse.json({ success: true, lead: newLead });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const {
    id,
    conserjeId,
    tipoInmueble,
    tipoAcuerdo,
    region,
    comuna,
    calleNumero,
    numeroDepto,
    habitaciones,
    banos,
    precio,
    anio,
    comentarios,
    fonoDueno,
    emailDueno,
    estado,
    asignadoA
  } = body;

  if (!id) {
    return NextResponse.json({ error: 'Falta el ID del lead' }, { status: 400 });
  }

  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
  }

  leads[index] = {
    id,
    conserjeId,
    tipoInmueble,
    tipoAcuerdo,
    region,
    comuna,
    calleNumero,
    numeroDepto,
    habitaciones: habitaciones ? Number(habitaciones) : undefined,
    banos: banos ? Number(banos) : undefined,
    precio: precio ? Number(precio) : undefined,
    anio: anio ? Number(anio) : undefined,
    comentarios,
    fonoDueno,
    emailDueno,
    estado,
    asignadoA: asignadoA ?? leads[index].asignadoA,
  };

  return NextResponse.json({ success: true, updated: leads[index] });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Falta el ID del lead' }, { status: 400 });
  }

  const index = leads.findIndex((lead) => lead.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
  }

  leads.splice(index, 1);
  return NextResponse.json({ success: true });
}

export { leads };
