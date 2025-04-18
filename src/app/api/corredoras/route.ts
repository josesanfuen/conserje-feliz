import { NextResponse } from 'next/server';
import { getCorredoras } from '@/lib/users';

export async function GET() {
  const corredoras = getCorredoras(); // ya devuelve { id, name }
  return NextResponse.json({ corredoras });
}
