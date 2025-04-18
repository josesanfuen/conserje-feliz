import { NextResponse } from 'next/server';
import { getCorredoras } from '@/lib/users';

export async function GET() {
  const corredoras = getCorredoras();
  const info = corredoras.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
  }));
  return NextResponse.json({ corredoras: info });
}
