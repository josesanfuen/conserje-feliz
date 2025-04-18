import { NextRequest, NextResponse } from 'next/server';
import { leads } from '@/lib/leads';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const corredoraEmail = searchParams.get('corredora');

  if (!corredoraEmail) {
    return NextResponse.json({ error: 'Falta el correo de la corredora' }, { status: 400 });
  }

  const asignados = leads.filter((lead) => lead.asignadoA?.includes(corredoraEmail));
  return NextResponse.json({ leads: asignados });
}
