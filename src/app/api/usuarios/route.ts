import { NextResponse } from 'next/server';
import { users } from '@/lib/users'; // donde guardas los usuarios

export async function GET() {
  const usuarios = users.map(({ id, name }) => ({ id, name }));
  return NextResponse.json({ usuarios });
}
