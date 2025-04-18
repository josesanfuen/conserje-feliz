import { NextResponse } from 'next/server';
import { leads } from '../leads/route'; // importa directamente del módulo donde los leads están en memoria

export async function GET() {
  return NextResponse.json({ leads });
}
