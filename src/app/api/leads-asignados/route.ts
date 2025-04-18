import { NextRequest, NextResponse } from 'next/server';

// 👇 Importamos directamente los leads creados en la API principal
import { leads } from '../leads/route';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const corredoraId = searchParams.get('corredora');

  if (!corredoraId) {
    return NextResponse.json({ error: 'Falta el ID de la corredora' }, { status: 400 });
  }

  // Devolvemos solo los leads que tengan asignado a esa corredora
  const asignados = leads.filter((lead) =>
    lead.asignadoA?.includes(corredoraId)
  );

  return NextResponse.json({ leads: asignados });
}

