import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { Lead, leads, addLead, getLeadsByConserje } from '@/lib/leads';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const conserjeId = searchParams.get('user');

  if (!conserjeId) {
    return NextResponse.json({ error: 'Falta el ID del conserje' }, { status: 400 });
  }

  const conserjeLeads = getLeadsByConserje(conserjeId);
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

  addLead(newLead);
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
